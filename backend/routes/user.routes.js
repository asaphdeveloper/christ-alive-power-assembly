import express from 'express';
import * as userController from '../controllers/user.controller.js';
import * as authController from '../controllers/auth.controller.js';

export const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.delete('/', userController.deleteAllUsers);

router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', authController.authenticate, userController.deleteUser);
