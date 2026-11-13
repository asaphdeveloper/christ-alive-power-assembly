import express from 'express';
import * as authController from '../controllers/auth.controller.js';

export const router = express.Router();

router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch('/update-password', authController.authenticate, authController.updatePassword);
