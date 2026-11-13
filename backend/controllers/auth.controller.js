import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Admin from '../models/admin.model.js';
import AppError from '../utils/appError.js';
import { sendResetPasswordEmail } from '../utils/appEmail.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePasswords(password, admin.password))) {
      return next(new AppError('Incorrect email or password', 401));
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

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError('Please enter email', 400));

    const admin = await Admin.findOne({ email });
    if (!admin) return next(new AppError('Admin does not exist', 404));

    const resetToken = crypto.randomBytes(32).toString('hex');
    admin.hashPasswordResetToken(resetToken);
    await admin.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    try {
      await sendResetPasswordEmail({
        from: process.env.MAIL_USERNAME,
        to: admin.email,
        subject: 'Password Reset',
        text: `Reset your password using this link: ${resetUrl}. The link expires in 10 minutes.`,
      });
      res.status(200).json({ status: 'success', message: 'Password reset link sent to email' });
    } catch (err) {
      admin.passwordResetToken = undefined;
      admin.passwordResetExpires = undefined;
      await admin.save({ validateBeforeSave: false });
      next(new AppError('Failed to send email. Please try again', 500));
    }
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const admin = await Admin.findOne({
      passwordResetToken: hashedResetToken,
      passwordResetExpires: { $gte: Date.now() },
    });
    if (!admin) return next(new AppError('Invalid token or token has expired', 400));

    admin.password = req.body.password;
    admin.passwordConfirm = req.body.passwordConfirm;
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save();

    res.status(200).json({ status: 'success', token: signToken(admin._id), message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};
