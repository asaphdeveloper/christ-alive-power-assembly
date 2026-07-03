import express from 'express';
import * as userController from '../controllers/user.controller.js';
import * as authController from '../controllers/auth.controller.js';

export const router = express.Router();

router.get('/', userController.getAllUsers);
router.delete(
  '/',
  authController.authenticate,
  authController.restrictTo('admin'),
  userController.deleteAllUsers,
);
router.get('/:id',
  userController.getUser
);
router.delete(
  '/:id',
  authController.authenticate,
  userController.deleteUser
);

router.patch(
  '/update-me',
  authController.authenticate,
  userController.updateMe,
);
router.delete(
  '/delete-me',
  authController.authenticate,
  userController.updateMe,
);
