import Admin from '../models/admin.model.js';
import mongoose from 'mongoose';
import AppError from '../utils/appError.js';

const validateAdminId = (id, next) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new AppError('Invalid admin ID', 400));
    return false;
  }
  return true;
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find();
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
    const { name, username, role, password, passwordConfirm } = req.body;
    const admin = await Admin.create({
      name,
      username,
      role,
      password,
      passwordConfirm,
    });

    res.status(201).json({
      status: 'success',
      data: { admin },
    });
  } catch (err) {
    next(err);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    if (!validateAdminId(req.params.id, next)) return;
    const allowedFields = ['name', 'username', 'role'];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([field]) => allowedFields.includes(field)),
    );
    const admin = await Admin.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!admin) return next(new AppError('Admin not found', 404));
    res.status(200).json({ status: 'success', data: { admin } });
  } catch (err) {
    next(err);
  }
};

export const updateAdminPassword = async (req, res, next) => {
  try {
    if (!validateAdminId(req.params.id, next)) return;
    const { password, passwordConfirm } = req.body;
    if (!password || !passwordConfirm) {
      return next(new AppError('Please provide a new password and confirmation', 400));
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) return next(new AppError('Admin not found', 404));

    admin.password = password;
    admin.passwordConfirm = passwordConfirm;
    admin.passwordChangedAt = new Date(Date.now() - 1000);
    await admin.save();

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
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return next(new AppError('Admin not found', 404));
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};

export const getAdminWorkspace = (role) => (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        username: req.admin.username,
        role: req.admin.role,
      },
      workspace: role,
    },
  });
};
