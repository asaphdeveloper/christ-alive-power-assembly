import mongoose from 'mongoose';
import Branch from '../models/branch.model.js';
import Admin from '../models/admin.model.js';
import AppError from '../utils/appError.js';

export const getAllBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find().lean();
    const admins = await Admin.find({ role: 'branch-media-admin' }).select('name username phone branch').lean();
    const byBranch = new Map(admins.filter((admin) => admin.branch).map((admin) => [String(admin.branch), admin]));
    const populatedBranches = branches.map((branch) => ({
      ...branch,
      admin: byBranch.get(String(branch._id)) || null,
      status: byBranch.has(String(branch._id)) ? 'active' : 'pending-admin',
    }));
    res.status(200).json({
      status: 'success',
      results: populatedBranches.length,
      data: { branches: populatedBranches },
    });
  } catch (err) {
    next(err);
  }
};

export const getBranch = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError('Invalid branch ID', 400));
    }

    const branch = await Branch.findById(req.params.id);
    if (!branch) return next(new AppError('Branch not found', 404));
    const admin = await Admin.findOne({ role: 'branch-media-admin', branch: branch._id }).select('name username phone');
    const branchData = branch.toObject();
    branchData.admin = admin;
    branchData.status = admin ? 'active' : 'pending-admin';

    res.status(200).json({ status: 'success', data: { branch: branchData } });
  } catch (err) {
    next(err);
  }
};

export const createBranch = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    delete payload.adminId;
    if (payload.lga && !payload.localGovernmentArea) payload.localGovernmentArea = payload.lga;
    delete payload.lga;
    const branch = await Branch.create(payload);
    let linkedAdmin = null;
    if (req.body.adminId) {
      if (!mongoose.Types.ObjectId.isValid(req.body.adminId)) {
        await Branch.findByIdAndDelete(branch._id);
        return next(new AppError('Invalid Branch Media Admin ID', 400));
      }
      try {
        linkedAdmin = await Admin.findOneAndUpdate(
          { _id: req.body.adminId, role: 'branch-media-admin', branch: null },
          { branch: branch._id },
          { new: true },
        );
      } catch (error) {
        await Branch.findByIdAndDelete(branch._id);
        throw error;
      }
      if (!linkedAdmin) {
        await Branch.findByIdAndDelete(branch._id);
        return next(new AppError('That account is unavailable or already assigned to a branch', 400));
      }
    }
    const branchData = branch.toObject();
    branchData.admin = linkedAdmin ? { _id: linkedAdmin._id, name: linkedAdmin.name, username: linkedAdmin.username, phone: linkedAdmin.phone } : null;
    branchData.status = linkedAdmin ? 'active' : 'pending-admin';
    res.status(201).json({ status: 'success', data: { branch: branchData } });
  } catch (err) {
    next(err);
  }
};

export const updateBranch = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError('Invalid branch ID', 400));
    }

    const payload = { ...req.body };
    const { adminId } = payload;
    delete payload.adminId;
    if (payload.lga && !payload.localGovernmentArea) payload.localGovernmentArea = payload.lga;
    delete payload.lga;
    const branch = await Branch.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
      strict: 'throw',
    });
    if (!branch) return next(new AppError('Branch not found', 404));

    if (adminId) {
      const existing = await Admin.findOne({ role: 'branch-media-admin', branch: branch._id });
      if (existing && String(existing._id) !== String(adminId)) {
        return next(new AppError('This branch already has a Branch Media Admin account', 409));
      }
      const linked = await Admin.findOneAndUpdate(
        { _id: adminId, role: 'branch-media-admin', $or: [{ branch: null }, { branch: { $exists: false } }, { branch: branch._id }] },
        { branch: branch._id },
        { new: true },
      );
      if (!linked) return next(new AppError('That account is unavailable or already assigned to another branch', 409));
    }

    const admin = await Admin.findOne({ role: 'branch-media-admin', branch: branch._id }).select('name username phone');
    const branchData = branch.toObject();
    branchData.admin = admin;
    branchData.status = admin ? 'active' : 'pending-admin';

    res.status(200).json({ status: 'success', data: { branch: branchData } });
  } catch (err) {
    next(err);
  }
};

export const deleteBranch = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError('Invalid branch ID', 400));
    }

    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return next(new AppError('Branch not found', 404));

    await Admin.updateMany({ branch: branch._id }, { $set: { branch: null } });

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};
