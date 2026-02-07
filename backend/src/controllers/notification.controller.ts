import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Notification from '../models/notification.model';

export class NotificationController {
    public getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const notifications = await Notification.find({ userId })
                .sort({ createdAt: -1 })
                .limit(50); // Limit to last 50 notifications

            res.status(200).json(notifications);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to fetch notifications' });
        }
    };

    public markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { notificationId } = req.params;

            await Notification.findOneAndUpdate(
                { _id: notificationId, userId },
                { read: true }
            );

            res.status(200).json({ message: 'Marked as read' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to update notification' });
        }
    };

    public markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            await Notification.updateMany(
                { userId, read: false },
                { read: true }
            );

            res.status(200).json({ message: 'All notifications marked as read' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to update notifications' });
        }
    };
    public deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { notificationId } = req.params;

            const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });

            if (!notification) {
                res.status(404).json({ message: 'Notification not found' });
                return;
            }

            res.status(200).json({ message: 'Notification deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to delete notification' });
        }
    };

    public streamNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const onNewNotification = (data: { userId: string, notification: any }) => {
            if (data.userId.toString() === userId.toString()) {
                res.write(`data: ${JSON.stringify(data.notification)}\n\n`);
            }
        };

        const { notificationEmitter } = require('../utils/notificationEmitter');
        notificationEmitter.on('new_notification', onNewNotification);

        req.on('close', () => {
            notificationEmitter.off('new_notification', onNewNotification);
        });
    };
}
