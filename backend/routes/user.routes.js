import express from 'express';
import * as userController from '../controllers/user.controller.js';

export const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
