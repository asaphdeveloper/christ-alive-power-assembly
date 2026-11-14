import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Admin from '../models/admin.model.js';
import AppError from '../utils/appError.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new AppError('Please provide username and password', 400));
    }

    const admin = await Admin.findOne({ username: username.trim().toLowerCase() }).select('+password');
    if (!admin || !(await admin.comparePasswords(password, admin.password))) {
      return next(new AppError('Incorrect username or password', 401));
    }

    const token = signToken(admin._id);
    admin.password = undefined;
    res.status(200).json({ status: 'success', token, data: { admin } });
  } catch (err) {
    next(err);
  }
};

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;
    if (!token) return next(new AppError('You are not logged in', 401));

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return next(new AppError('The admin belonging to this token no longer exists', 401));
    }
    if (admin.passwordChangedAfter(decoded.iat)) {
      return next(new AppError('Password recently changed. Please login again', 401));
    }

    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
};

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role)) {
    return next(new AppError('You do not have permission to access this admin page', 403));
  }
  next();
};

