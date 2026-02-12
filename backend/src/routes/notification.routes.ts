import express from 'express';
import * as notificationController from '../controllers/notificationController';
import { NotificationController } from '../controllers/notification.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = express.Router();
const crudController = new NotificationController();

// CRUD Operations (authenticated users only)
router.get(
    '/',
    authenticateToken,
    crudController.getNotifications
);

router.put(
    '/:notificationId/read',
    authenticateToken,
    crudController.markAsRead
);

router.put(
    '/mark-all-read',
    authenticateToken,
    crudController.markAllAsRead
);

router.delete(
    '/:notificationId',
    authenticateToken,
    crudController.deleteNotification
);

router.get(
    '/stream',
    authenticateToken,
    crudController.streamNotifications
);

// FCM token Management (authenticated users only)
router.post(
    '/save-token',
    authenticateToken,
    notificationController.saveToken
);

router.post(
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
