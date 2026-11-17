import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as resourceController from '../controllers/resource.controller.js';
import { uploadLimiter } from '../middleware/rateLimiters.js';
import { subscribeToResourceEvents } from '../services/resourceEvents.js';

export const router = express.Router();

router.get('/events', subscribeToResourceEvents);
router.get('/hymn', resourceController.getPublicHymn);
router.get('/', resourceController.listPublicDocuments);
router.get('/:id/file', resourceController.downloadDocument);

router.use(authController.authenticate);
router.get(
  '/manage/usage',
  authController.restrictTo('headquater-media-admin', 'developer'),
  resourceController.getResourceUsage,
);
router.use(authController.restrictTo('headquater-media-admin'));
router.get('/manage/hymn', resourceController.getManageHymn);
router.put('/manage/hymn', resourceController.saveHymn);
router.get('/manage', resourceController.listAdminDocuments);
router.post('/manage', uploadLimiter, resourceController.parsePdfUpload, resourceController.uploadDocument);
router.delete('/manage/all', resourceController.deleteAllDocuments);
router.delete('/manage/:id', resourceController.deleteDocument);
