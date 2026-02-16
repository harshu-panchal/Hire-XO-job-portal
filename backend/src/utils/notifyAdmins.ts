import User from '../models/user.model';
import { sendNotification } from './notification.util';

export const notifyAdmins = async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    relatedId?: string,
    relatedType?: 'job_application' | 'resource_application' | 'new_job' | 'new_resource' | 'new_user' | 'certificate_request'
) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('_id');

        if (!admins.length) return;

        // Send notifications to all admins
        await Promise.all(admins.map(admin =>
            sendNotification({
                userId: admin._id.toString(),
                title,
                message,
                type,
                relatedId,
                relatedType: relatedType as any,
            })
        ));

    } catch (error) {
        console.error('Failed to notify admins:', error);
    }
};
