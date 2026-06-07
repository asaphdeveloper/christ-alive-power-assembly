import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import { promisify } from 'util';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../utils/appEmail.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: { user: newUser },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePasswords(password, user.password))) {
      return next(new AppError('invalid email or password', 400));
    }

    const token = signToken(user._id);

    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

export const authenticate = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new AppError('The user belonging to this token no longer exists', 401),
      );
    }

    if (user.passwordChangeddAfter(decoded.iat)) {
      return next(
        new AppError('Password recently changed. Please login again', 401),
      );
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Please enter email', 400));

  const user = await User.findOne({ email: email });
  if (!user) return next(new AppError('User does not exist', 404));

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.hashPasswordResetToken(resetToken);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
  const message = `
    Forgot your password?

    Click the link below to reset it:
    
    ${resetUrl}
    
    This link will expire in 10 minutes.
    `;

  try {
    await sendResetPasswordEmail({
      from: process.env.MAIL_USERNAME,
      to: user.email,
      subject: 'Password Reset',
      text: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    next(new AppError('Failed to send email. Please try again'));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const resetToken = req.params.token;

    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: { $eq: hashedResetToken },
      passwordResetExpires: { $gte: Date.now() },
    });

    if (!user) {
      return next(new AppError('Invalid token or token has expired'));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = User.findById(req.user.id);
    const { password } = req.body;

    const isCorrect = await user.comparePasswords(password, user.password);
    if (!isCorrect) return next(new AppError('Incorrect password'));

    console.log(user, password, isCorrect);

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};
