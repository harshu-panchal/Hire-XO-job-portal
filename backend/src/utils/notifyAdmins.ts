import User from '../models/user.model';
import Notification from '../models/notification.model';
import { notificationEmitter } from './notificationEmitter';

export const notifyAdmins = async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    relatedId?: string,
    relatedType?: 'job_application' | 'resource_application' | 'new_job' | 'new_resource' | 'new_user'
) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('_id');

        if (!admins.length) return;

        const notifications = admins.map(admin => ({
            userId: admin._id,
            title,
            message,
            type,
            relatedId,
            relatedType,
            read: false,
            createdAt: new Date()
        }));

        const createdNotifications = await Notification.insertMany(notifications);

        createdNotifications.forEach(notification => {
            notificationEmitter.emit('new_notification', {
                userId: notification.userId,
                notification
            });
        });

    } catch (error) {
        console.error('Failed to notify admins:', error);
    }
};
