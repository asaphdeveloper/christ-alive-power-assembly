import mongoose from 'mongoose';
import Branch from '../models/branch.model.js';
import AppError from '../utils/appError.js';

export const getAllBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find();
    res.status(200).json({
      status: 'success',
      results: branches.length,
      data: { branches },
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

    res.status(200).json({ status: 'success', data: { branch } });
  } catch (err) {
    next(err);
  }
};

export const createBranch = async (req, res, next) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ status: 'success', data: { branch } });
  } catch (err) {
    next(err);
  }
};

export const updateBranch = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError('Invalid branch ID', 400));
    }

    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      strict: 'throw',
    });
    if (!branch) return next(new AppError('Branch not found', 404));

    res.status(200).json({ status: 'success', data: { branch } });
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

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};
