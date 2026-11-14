import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import * as authController from '../controllers/auth.controller.js';

export const router = express.Router();

router.use(authController.authenticate);

router.patch(
  '/:id/password',
  authController.restrictTo('developer'),
  adminController.updateAdminPassword,
);

router.get(
  '/headquater-media-admin',
  authController.restrictTo('headquater-media-admin'),
  adminController.getAdminWorkspace('headquater-media-admin'),
);
router.get(
  '/jos-media-admin',
  authController.restrictTo('jos-media-admin'),
  adminController.getAdminWorkspace('jos-media-admin'),
);
router.get(
  '/general-overseer',
  authController.restrictTo('general-overseer'),
  adminController.getAdminWorkspace('general-overseer'),
);
router.get(
  '/developer',
  authController.restrictTo('developer'),
  adminController.getAdminWorkspace('developer'),
);

router
  .route('/')
  .all(authController.restrictTo('developer'))
  .get(adminController.getAllAdmins)
  .post(adminController.createAdmin);

router
  .route('/:id')
  .all(authController.restrictTo('developer'))
  .get(adminController.getAdmin)
  .patch(adminController.updateAdmin)
  .delete(adminController.deleteAdmin);
