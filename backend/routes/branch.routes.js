import express from 'express';
import * as branchController from '../controllers/branch.controller.js';
import * as authController from '../controllers/auth.controller.js';

export const router = express.Router();

router.use(authController.authenticate);

router
  .route('/')
  .get(branchController.getAllBranches)
  .post(authController.restrictTo('developer'), branchController.createBranch);

router
  .route('/:id')
  .get(branchController.getBranch)
  .patch(authController.restrictTo('developer'), branchController.updateBranch)
  .delete(authController.restrictTo('developer'), branchController.deleteBranch);
