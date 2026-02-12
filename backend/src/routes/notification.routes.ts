import express from 'express';
import * as notificationController from '../controllers/notificationController';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = express.Router();

// Save FCM token (authenticated users only)
router.post(
    '/save-token',
    authenticateToken,
    notificationController.saveToken
);

// Remove FCM token (authenticated users only)
router.delete(
    '/remove-token',
    authenticateToken,
    notificationController.removeToken
);

// Send notification to specific user (admin only)
router.post(
    '/send',
    authenticateToken,
    requireRole('admin'),
    notificationController.sendNotification
);

// Send bulk notifications (admin only)
router.post(
    '/send-bulk',
    authenticateToken,
    requireRole('admin'),
    notificationController.sendBulkNotification
);

export default router;
