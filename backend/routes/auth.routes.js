import express from 'express';
import * as authController from '../controllers/auth.controller.js';

export const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

router.post(
  '/update-password',
  authController.authenticate,
  authController.updatePassword,
);
