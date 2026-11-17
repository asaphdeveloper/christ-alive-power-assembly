import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { loginLimiter } from '../middleware/rateLimiters.js';

export const router = express.Router();

router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.authenticate, authController.getCurrentAdmin);
