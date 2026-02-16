import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Notification from '../models/notification.model';
import { notificationEmitter } from '../utils/notificationEmitter';

export class NotificationController {
    public getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const skip = (page - 1) * limit;

            const notifications = await Notification.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await Notification.countDocuments({ userId });

            res.status(200).json({
                data: notifications,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            });
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
                console.log(`SSE: Sending notification to user ${userId}`);
                res.write(`data: ${JSON.stringify(data.notification)}\n\n`);
            }
        };

        notificationEmitter.on('new_notification', onNewNotification);

        // Send a comment to keep the connection alive immediately and log it
        console.log(`SSE: Stream established for user ${userId}`);
        res.write(': ok\n\n');

        req.on('close', () => {
            notificationEmitter.off('new_notification', onNewNotification);
        });
    };
}
