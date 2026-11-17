import { randomUUID } from 'crypto';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import AppError from '../utils/appError.js';
import ResourceDocument from '../models/resourceDocument.model.js';
import ResourceUsage from '../models/resourceUsage.model.js';
import { getR2Client, getResourceCategories, isR2Configured } from '../services/resourceStorage.js';
import { broadcastResourceUpdate } from '../services/resourceEvents.js';

const MAX_RESOURCE_BYTES = 20 * 1024 * 1024;
const createUpload = () => multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RESOURCE_BYTES, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== 'application/pdf' || !file.originalname.toLowerCase().endsWith('.pdf')) {
      callback(new AppError('Only PDF files are allowed', 400));
      return;
    }
    callback(null, true);
  },
});

export const parsePdfUpload = (req, res, next) => {
  createUpload().single('file')(req, res, (error) => {
    if (error?.code === 'LIMIT_FILE_SIZE') {
      next(new AppError(`PDF must be no larger than ${Math.floor(MAX_RESOURCE_BYTES / 1024 / 1024)} MB.`, 413));
      return;
    }
    next(error);
  });
};

const monthKey = () => new Date().toISOString().slice(0, 7);
const readBudget = () => Number(process.env.R2_MONTHLY_READ_BUDGET || 9_000_000);
const writeBudget = () => Number(process.env.R2_MONTHLY_WRITE_BUDGET || 900_000);
const storageBudget = () => Number(process.env.R2_STORAGE_BUDGET_BYTES || 8 * 1024 ** 3);

async function reserveOperation(type) {
  const month = monthKey();
  const field = type === 'read' ? 'reads' : 'writes';
  const budget = type === 'read' ? readBudget() : writeBudget();
  let usage;
  try {
    usage = await ResourceUsage.findOneAndUpdate(
      { month, [field]: { $lt: budget } },
      { $inc: { [field]: 1 }, $setOnInsert: { month } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Resource storage is paused to stay below its monthly R2 request safety limit.', 429);
    }
    throw error;
  }
  if (!usage || usage[field] > budget) {
    throw new AppError('Resource storage is paused to stay below its monthly R2 request safety limit.', 429);
  }
  return usage;
}

function ensurePdfSignature(file) {
  if (!file || file.buffer.length < 5 || file.buffer.subarray(0, 5).toString() !== '%PDF-') {
    throw new AppError('The selected file is not a valid PDF.', 400);
  }
}

export const listAdminDocuments = async (_req, res, next) => {
  try {
    const [documents, usedBytes, usage] = await Promise.all([
      ResourceDocument.find().sort({ createdAt: -1 }).lean(),
      ResourceDocument.aggregate([{ $group: { _id: null, bytes: { $sum: '$size' } } }]),
      ResourceUsage.findOne({ month: monthKey() }).lean(),
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        documents,
        categories: getResourceCategories(),
        usage: {
          r2Configured: isR2Configured(),
          storageBytes: usedBytes[0]?.bytes || 0,
          storageBudgetBytes: storageBudget(),
          reads: usage?.reads || 0,
          writes: usage?.writes || 0,
          monthlyReadBudget: readBudget(),
          monthlyWriteBudget: writeBudget(),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getResourceUsage = async (_req, res, next) => {
  try {
    const [storage, usage] = await Promise.all([
      ResourceDocument.aggregate([{ $group: { _id: null, bytes: { $sum: '$size' } } }]),
      ResourceUsage.findOne({ month: monthKey() }).lean(),
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        usage: {
          r2Configured: isR2Configured(),
          storageBytes: storage[0]?.bytes || 0,
          storageBudgetBytes: storageBudget(),
          reads: usage?.reads || 0,
          writes: usage?.writes || 0,
          monthlyReadBudget: readBudget(),
          monthlyWriteBudget: writeBudget(),
          month: monthKey(),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadDocument = async (req, res, next) => {
  let objectKey;
  try {
    const { category } = req.body;
    const validCategories = getResourceCategories();
    if (!validCategories.some((item) => item.id === category)) {
      return next(new AppError('Choose a valid resource category.', 400));
    }
    ensurePdfSignature(req.file);

    const aggregate = await ResourceDocument.aggregate([
      { $group: { _id: null, bytes: { $sum: '$size' } } },
    ]);
    const storageUsed = aggregate[0]?.bytes || 0;
    const oldDocument = req.body.replaceId
      ? await ResourceDocument.findOne({ _id: req.body.replaceId, category })
      : null;
    if (req.body.replaceId && !oldDocument) {
      return next(new AppError('The document to replace was not found in this category.', 404));
    }
    if (!req.body.replaceId) {
      const existingDocument = await ResourceDocument.exists({ category });
      if (existingDocument) {
        const uploadedCategories = await ResourceDocument.distinct('category');
        const allCategoriesUploaded = validCategories.every((item) => uploadedCategories.includes(item.id));
        return next(new AppError(
          allCategoriesUploaded
            ? 'All five resource categories already have a PDF. Replace an existing document to upload an update.'
            : 'A PDF is already uploaded for this category. Use Replace to update it.',
          409,
        ));
      }
    }
    if (storageUsed - (oldDocument?.size || 0) + req.file.size > storageBudget()) {
      return next(new AppError('Upload paused to stay below the configured R2 storage safety limit.', 413));
    }

    await reserveOperation('write');
    objectKey = `resources/${category}/${randomUUID()}.pdf`;
    const client = getR2Client();
    await client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: objectKey,
      Body: req.file.buffer,
      ContentLength: req.file.size,
      ContentType: 'application/pdf',
      ContentDisposition: `inline; filename*=UTF-8''${encodeURIComponent(req.file.originalname)}`,
    }));

    const document = await ResourceDocument.create({
      category,
      name: req.file.originalname.replace(/[\\/\u0000-\u001f]/g, '_').slice(0, 180),
      objectKey,
      size: req.file.size,
      uploadedBy: req.admin._id,
    });
    if (oldDocument) {
      try {
        await reserveOperation('write');
        await client.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: oldDocument.objectKey }));
        await ResourceDocument.deleteOne({ _id: oldDocument._id });
      } catch {
        broadcastResourceUpdate();
        res.status(201).json({ status: 'success', message: 'New PDF uploaded. The previous copy could not be removed; delete it from the resource list when available.', data: { document } });
        return;
      }
    }
    broadcastResourceUpdate();
    res.status(201).json({ status: 'success', data: { document } });
  } catch (error) {
    if (objectKey) {
      try {
        await getR2Client().send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: objectKey }));
      } catch { /* Preserve the original upload error. */ }
    }
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) return next(new AppError('Invalid document ID.', 400));
    const document = await ResourceDocument.findById(req.params.id);
    if (!document) return next(new AppError('Document not found.', 404));
    await reserveOperation('write');
    await getR2Client().send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: document.objectKey }));
    await document.deleteOne();
    broadcastResourceUpdate();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const deleteAllDocuments = async (_req, res, next) => {
  let didDelete = false;
  try {
    const documents = await ResourceDocument.find();
    const client = getR2Client();
    for (const document of documents) {
      await reserveOperation('write');
      await client.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: document.objectKey }));
      await document.deleteOne();
      didDelete = true;
    }
    if (didDelete) broadcastResourceUpdate();
    res.status(204).end();
  } catch (error) {
    if (didDelete) broadcastResourceUpdate();
    next(error);
  }
};

export const listPublicDocuments = async (_req, res, next) => {
  try {
    const documents = await ResourceDocument.find().sort({ createdAt: -1 }).lean();
    res.set('Cache-Control', 'no-store');
    res.status(200).json({
      status: 'success',
      data: { documents: documents.map(({ _id, category, name, size, createdAt }) => ({ id: _id, category, name, size, uploadedAt: createdAt })) },
    });
  } catch (error) {
    next(error);
  }
};

export const downloadDocument = async (req, res, next) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) return next(new AppError('Invalid document ID.', 400));
    const document = await ResourceDocument.findById(req.params.id).lean();
    if (!document) return next(new AppError('Document not found.', 404));
    await reserveOperation('read');
    const range = req.headers.range;
    const result = await getR2Client().send(new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: document.objectKey,
      ...(range && { Range: range }),
    }));
    const contentRange = result.ContentRange;
    res.status(contentRange ? 206 : 200).set({
      'Content-Type': 'application/pdf',
      'Content-Length': String(result.ContentLength || document.size),
      'Content-Disposition': `${req.query.download === '1' ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(document.name)}`,
      'Cache-Control': 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Accept-Ranges': 'bytes',
      ...(contentRange && { 'Content-Range': contentRange }),
    });
    result.Body.pipe(res);
  } catch (error) {
    next(error);
  }
};
