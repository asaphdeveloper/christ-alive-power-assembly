import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Admin from '../models/admin.model.js';
import AppError from '../utils/appError.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

const getTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000,
});

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new AppError('Please provide username and password', 400));
    }

    const admin = await Admin.findOne({ username: username.trim().toLowerCase() }).select('+password');
    if (!admin || !(await admin.comparePasswords(password, admin.password))) {
      return next(new AppError('The login details do not match an admin account. Check your username and password, then try again.', 401));
    }

    const token = signToken(admin._id);
    await admin.populate('branch', 'name');
    const safeAdmin = {
      id: admin._id,
      name: admin.name,
      username: admin.username,
      role: admin.role,
      branch: admin.branch,
    };

    res.cookie('access_token', token, getTokenCookieOptions());
    res.status(200).json({ status: 'success', data: { admin: safeAdmin } });
  } catch (err) {
    next(err);
  }
};

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.access_token || (authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null);
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

export const logout = (req, res) => {
  res.clearCookie('access_token', getTokenCookieOptions());
  res.status(200).json({ status: 'success' });
};

export const getCurrentAdmin = async (req, res) => {
  await req.admin.populate('branch', 'name');
  const { _id, name, username, role, branch } = req.admin;
  res.status(200).json({
    status: 'success',
    data: { admin: { id: _id, name, username, role, branch } },
  });
};

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role)) {
    return next(new AppError('You do not have permission to access this admin page', 403));
  }
  if (req.admin.role === 'branch-media-admin' && !req.admin.branch) {
    return next(new AppError('This Branch Media Admin account is not assigned to a branch', 403));
  }
  next();
};

