import Notification from '../models/notification.model';
import User from '../models/user.model';
import { notificationEmitter } from './notificationEmitter';
import admin, { firebaseAdmin } from '../config/firebaseAdmin';

export interface NotificationPayload {
    userId: string;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    relatedId?: string;
    relatedType?: 'job_application' | 'resource_application' | 'new_job' | 'new_resource' | 'new_user' | 'certificate_request' | 'certificate_issued';
    data?: Record<string, string>;
}

/**
 * Centralized function to send notifications via DB, SSE, and FCM
 */
export const sendNotification = async (payload: NotificationPayload) => {
    try {
        const { userId, title, message, type = 'info', relatedId, relatedType, data = {} } = payload;

        // 1. Save to Database
        const notification = await Notification.create({
            userId,
            title,
            message,
            type,
            relatedId,
            relatedType,
            read: false,
            createdAt: new Date()
        });

        // 2. Emit SSE (Real-time in-app)
        notificationEmitter.emit('new_notification', {
            userId,
            notification
        });

        // 3. Send FCM Push Notification
        const user = await User.findById(userId).select('fcmTokens mobileFcmTokens profile.preferences');

        // Skip FCM if user disabled notifications in preferences
        if (user?.profile?.preferences?.notifications === false) {
            return notification;
        }

        const webTokens = user?.fcmTokens || [];
        const mobileTokens = user?.mobileFcmTokens || [];
        const allTokens = [...webTokens, ...mobileTokens];

        if (allTokens.length > 0) {
            const fcmMessage = {
                notification: {
                    title,
                    body: message,
                },
                android: {
                    priority: 'high' as const,
                },
                apns: {
                    payload: {
                        aps: {
                            contentAvailable: true,
                        },
                    },
                    headers: {
                        'apns-priority': '10',
                    },
                },
                data: {
                    ...data,
                    notificationId: notification._id.toString(),
                    type,
                    relatedId: relatedId || '',
                    relatedType: relatedType || '',
                },
            };

            const invalidWebTokens: string[] = [];
            const invalidMobileTokens: string[] = [];

            // Send to all registered tokens
            const results = await Promise.allSettled(
                allTokens.map(async (token) => {
                    try {
                        const app = firebaseAdmin || admin;
                        await app.messaging().send({ ...fcmMessage, token });
                    } catch (error: any) {
                        // Mark invalid tokens for removal
                        if (
                            error.code === 'messaging/invalid-registration-token' ||
                            error.code === 'messaging/registration-token-not-registered'
                        ) {
                            if (webTokens.includes(token)) invalidWebTokens.push(token);
                            else if (mobileTokens.includes(token)) invalidMobileTokens.push(token);
                        }
                        throw error;
                    }
                })
            );

            // Cleanup invalid tokens
            if (invalidWebTokens.length > 0) {
                await User.findByIdAndUpdate(userId, {
                    $pull: { fcmTokens: { $in: invalidWebTokens } },
                });
            }
            if (invalidMobileTokens.length > 0) {
                await User.findByIdAndUpdate(userId, {
                    $pull: { mobileFcmTokens: { $in: invalidMobileTokens } },
                });
            }

            const successCount = results.filter(r => r.status === 'fulfilled').length;
            console.log(`FCM: Sent ${successCount} notifications to user ${userId}. Invalid removed: ${invalidWebTokens.length + invalidMobileTokens.length}`);
        }

        console.log(`Notification sent and saved: ${notification._id} for user ${userId}`);
        return notification;
    } catch (error) {
        console.error('Error in sendNotification utility:', error);
        throw error;
    }
};
