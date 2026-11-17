import Admin from '../models/admin.model.js';
import mongoose from 'mongoose';
import AppError from '../utils/appError.js';
import Branch from '../models/branch.model.js';

const validateAdminId = (id, next) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new AppError('Invalid admin ID', 400));
    return false;
  }
  return true;
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().populate('branch', 'name');
    res.status(200).json({
      status: 'success',
      results: admins.length,
      data: { admins },
    });
  } catch (err) {
    next(err);
  }
};

export const getAdmin = async (req, res, next) => {
  try {
    if (!validateAdminId(req.params.id, next)) return;
    const admin = await Admin.findById(req.params.id);
    if (!admin) return next(new AppError('Admin not found', 404));
    res.status(200).json({ status: 'success', data: { admin } });
  } catch (err) {
    next(err);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { name, username, role, password, branch, phone, alternatePhone } = req.body;
    if (role !== 'branch-media-admin') {
      return next(new AppError('Only Branch Media Admin accounts can be created here', 400));
    }
    if (!branch) return next(new AppError('Please assign this account to a branch', 400));
    if (!password) return next(new AppError('Please provide a password', 400));
    if (!mongoose.Types.ObjectId.isValid(branch)) return next(new AppError('Invalid branch ID', 400));
    const branchExists = await Branch.exists({ _id: branch });
    if (!branchExists) return next(new AppError('Branch not found', 404));
    const existingBranchAdmin = await Admin.exists({ role: 'branch-media-admin', branch });
    if (existingBranchAdmin) return next(new AppError('This branch already has a Branch Media Admin account', 409));
    const admin = await Admin.create({
      name,
      username,
      role,
      branch,
      password,
      phone,
      alternatePhone,
    });
    const safeAdmin = await Admin.findById(admin._id).populate('branch', 'name');

    res.status(201).json({
      status: 'success',
      data: { admin: safeAdmin },
    });
  } catch (err) {
    next(err);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    if (!validateAdminId(req.params.id, next)) return;
    const allowedFields = ['name', 'username', 'phone', 'alternatePhone'];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([field]) => allowedFields.includes(field)),
    );
    const admin = await Admin.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('branch', 'name');
    if (!admin) return next(new AppError('Admin not found', 404));
    res.status(200).json({ status: 'success', data: { admin } });
  } catch (err) {
    next(err);
  }
};

export const updateAdminPassword = async (req, res, next) => {
  try {
    if (!validateAdminId(req.params.id, next)) return;
    const { password } = req.body;
    if (!password || password.length < 8) {
      return next(new AppError('Please provide a new password', 400));
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) return next(new AppError('Admin not found', 404));

    admin.password = password;
    admin.passwordChangedAt = new Date(Date.now() - 1000);
    await admin.save();
    await admin.populate('branch', 'name');

    res.status(200).json({
      status: 'success',
      message: 'Admin password updated. Existing tokens for this admin are invalidated.',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    if (!validateAdminId(req.params.id, next)) return;
    if (req.params.id === req.admin.id) {
      return next(new AppError('You cannot delete your own admin account', 400));
    }
    const protectedRoles = ['developer', 'general-overseer', 'headquater-media-admin'];
    const targetAdmin = await Admin.findById(req.params.id);
    if (!targetAdmin) return next(new AppError('Admin not found', 404));
    if (protectedRoles.includes(targetAdmin.role)) {
      return next(new AppError('Default administrator accounts cannot be deleted', 403));
    }
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (admin.branch) await Admin.updateMany({ _id: { $ne: admin._id }, branch: admin.branch }, { $set: { branch: null } });
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};

export const getAdminWorkspace = (role) => async (req, res) => {
  if (req.admin.role === 'branch-media-admin') await req.admin.populate('branch', 'name');
  res.status(200).json({
    status: 'success',
    data: {
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        username: req.admin.username,
        role: req.admin.role,
        branch: req.admin.branch,
      },
      workspace: role,
    },
  });
};
