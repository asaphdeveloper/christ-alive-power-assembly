import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import { promisify } from 'util';

const signToken = async (id) => {
  return await jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signUp = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    if (!newUser) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }

    const token = await signToken(newUser._id);

    if (!token) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }

    res.status(201).json({
      status: 'success',
      token,
      data: { newUser },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePasswords(password, user.password))) {
      res.status(400).json({
        status: 'fail',
        message: 'invalid email or password',
      });
    }

    const token = await signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export const authenticate = async (req, res) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(400).json({
        status: 'fail',
        message: 'You are not logged in',
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
