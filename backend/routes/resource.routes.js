import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as resourceController from '../controllers/resource.controller.js';
import { uploadLimiter } from '../middleware/rateLimiters.js';
import { subscribeToResourceEvents } from '../services/resourceEvents.js';

export const router = express.Router();

router.get('/events', subscribeToResourceEvents);
router.get('/', resourceController.listPublicDocuments);
router.get('/:id/file', resourceController.downloadDocument);

router.use(authController.authenticate);
router.use(authController.restrictTo('headquater-media-admin', 'developer'));
router.get('/manage/usage', resourceController.getResourceUsage);
router.get('/manage', resourceController.listAdminDocuments);
router.post('/manage', uploadLimiter, resourceController.parsePdfUpload, resourceController.uploadDocument);
router.delete('/manage/all', resourceController.deleteAllDocuments);
router.delete('/manage/:id', resourceController.deleteDocument);
