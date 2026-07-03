import mongoose from 'mongoose';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';

export const updateMe = async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError('Use /update-password route for password update', 400),
      );
    }

    const filterBody = (object, ...allowedFields) => {
      const newObject = {};

      Object.keys(object).forEach((key) => {
        if (allowedFields.includes(key)) newObject[key] = object[key];
      });

      return newObject;
    };

    const filteredBody = filterBody(req.body, 'name', 'email');

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      updatedUser,
      message: 'Password update successful',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteMe = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'delete successful',
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return next(new AppError('Users not found', 404));
    }

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError('Invalid ID', 400));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    res.status(201).json({
      status: 'success',
      data: { newUser },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError('Invalid ID', 400));
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAllUsers = async (req, res, next) => {
  try {
    const user = await User.deleteMany({ role: { $ne: 'admin' } });

    res.status(200).json({
      status: 'success',
      message: 'All users deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
