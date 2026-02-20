import { Request, Response } from 'express';
import admin from '../config/firebaseAdmin';
import User from '../models/user.model';

/**
 * Save FCM token for authenticated user
 */
export const saveToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, platform } = req.body;
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        if (!token) {
            res.status(400).json({ success: false, message: 'FCM token is required' });
            return;
        }

        // Determine which field to use
        const tokenField = platform === 'mobile' ? 'mobileFcmTokens' : 'fcmTokens';

        // Add token to the appropriate array if not already present
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { [tokenField]: token } },
            { new: true }
        );

        console.log(`FCM: Saved ${platform || 'web'} token for user ${userId}`);
        res.json({ success: true, message: `FCM ${platform || 'web'} token saved successfully` });
    } catch (error: any) {
        console.error('Error saving FCM token:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save FCM token',
            error: error.message
        });
    }
};

/**
 * Remove FCM token for authenticated user
 */
export const removeToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, platform } = req.body;
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        if (!token) {
            res.status(400).json({ success: false, message: 'FCM token is required' });
            return;
        }

        // Determine which field to use
        const tokenField = platform === 'mobile' ? 'mobileFcmTokens' : 'fcmTokens';

        // Remove token from the appropriate array
        await User.findByIdAndUpdate(
            userId,
            { $pull: { [tokenField]: token } },
            { new: true }
        );

        console.log(`FCM: Removed ${platform || 'web'} token for user ${userId}`);
        res.json({ success: true, message: `FCM ${platform || 'web'} token removed successfully` });
    } catch (error: any) {
        console.error('Error removing FCM token:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove FCM token',
            error: error.message
        });
    }
};

/**
 * Send push notification to specific user (Admin only)
 */
export const sendNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, title, body, data } = req.body;

        if (!userId || !title || !body) {
            res.status(400).json({
                success: false,
                message: 'userId, title, and body are required'
            });
            return;
        }

        // Find user and get FCM tokens
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        if (!user.fcmTokens || user.fcmTokens.length === 0) {
            res.status(400).json({
                success: false,
                message: 'User has no registered devices for push notifications'
            });
            return;
        }

        // Prepare notification message
        const message = {
            notification: {
                title,
                body,
            },
            data: data || {},
        };

        // Send to all user's registered devices
        const invalidTokens: string[] = [];
        const results = await Promise.allSettled(
            user.fcmTokens.map(async (token) => {
                try {
                    await admin.messaging().send({ ...message, token });
                    return { success: true, token };
                } catch (error: any) {
                    // Mark invalid tokens for removal
                    if (
                        error.code === 'messaging/invalid-registration-token' ||
                        error.code === 'messaging/registration-token-not-registered'
                    ) {
                        invalidTokens.push(token);
                    }
                    throw error;
                }
            })
        );

        // Remove invalid tokens from database
        if (invalidTokens.length > 0) {
            await User.findByIdAndUpdate(userId, {
                $pull: { fcmTokens: { $in: invalidTokens } },
            });
        }

        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failureCount = results.filter(r => r.status === 'rejected').length;

        console.log(`FCM: Manual send to user ${userId} results: Total=${user.fcmTokens.length}, Success=${successCount}, Failed=${failureCount}`);

        res.json({
            success: true,
            message: 'Notification sent',
            details: {
                total: user.fcmTokens.length,
                success: successCount,
                failed: failureCount,
                invalidTokensRemoved: invalidTokens.length,
            },
        });
    } catch (error: any) {
        console.error('Error sending notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send notification',
            error: error.message
        });
    }
};

/**
 * Send bulk notifications to multiple users (Admin only)
 */
export const sendBulkNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userIds, title, body, data } = req.body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            res.status(400).json({
                success: false,
                message: 'userIds array is required'
            });
            return;
        }

        if (!title || !body) {
            res.status(400).json({
                success: false,
                message: 'title and body are required'
            });
            return;
        }

        // Find all users and collect FCM tokens
        const users = await User.find({ _id: { $in: userIds } });
        const allTokens: string[] = [];

        users.forEach(user => {
            if (user.fcmTokens && user.fcmTokens.length > 0) {
                allTokens.push(...user.fcmTokens);
            }
        });

        if (allTokens.length === 0) {
            res.status(400).json({
                success: false,
                message: 'No users have registered devices for push notifications'
            });
            return;
        }

        // Prepare multicast message
        const message = {
            notification: {
                title,
                body,
            },
            data: data || {},
            tokens: allTokens,
        };

        // Send multicast notification
        const response = await admin.messaging().sendEachForMulticast(message);

        // Clean up invalid tokens
        if (response.failureCount > 0) {
            const invalidTokens: string[] = [];
            response.responses.forEach((resp, idx) => {
                if (
                    !resp.success &&
                    (resp.error?.code === 'messaging/invalid-registration-token' ||
                        resp.error?.code === 'messaging/registration-token-not-registered')
                ) {
                    invalidTokens.push(allTokens[idx]);
                }
            });

            if (invalidTokens.length > 0) {
                await User.updateMany(
                    {},
                    { $pull: { fcmTokens: { $in: invalidTokens } } }
                );
            }
        }

        res.json({
            success: true,
            message: 'Bulk notification sent',
            details: {
                totalUsers: users.length,
                totalTokens: allTokens.length,
                successCount: response.successCount,
                failureCount: response.failureCount,
            },
        });
    } catch (error: any) {
        console.error('Error sending bulk notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send bulk notification',
            error: error.message
        });
    }
};
/**
 * Send test push notification to the currently authenticated user
 */
export const sendTestNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, platform } = req.body;
        const userId = (req as any).user?.id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        // Import the centralized utility here to avoid circular dependencies if any
        const { sendNotification: sendUtil } = require('../utils/notification.util');

        const notificationData = {
            userId: user._id.toString(),
            title: `Test Notification (${platform || 'Web'}) 🔔`,
            message: 'Congratulations! Your push notification system is working perfectly.',
            type: 'success' as const,
            data: {
                action: 'test_push',
                platform: platform || 'unknown',
                timestamp: new Date().toISOString()
            }
        };

        if (token) {
            // Test specifically to the provided token
            console.log(`FCM: Sending direct test to token: ${token.substring(0, 10)}... (Platform: ${platform})`);

            const { firebaseAdmin: app } = require('../config/firebaseAdmin');
            if (!app) throw new Error('Firebase Admin app not initialized');

            await app.messaging().send({
                notification: {
                    title: notificationData.title,
                    body: notificationData.message,
                },
                data: notificationData.data,
                token: token,
                android: { priority: 'high' as const },
                apns: { headers: { 'apns-priority': '10' } }
            });

            res.json({ success: true, message: `Test notification sent directly to provided ${platform || ''} token` });
        } else {
            // Existing behavior: send to all user tokens
            await sendUtil(notificationData);
            res.json({ success: true, message: 'Test notification triggered for all your registered devices' });
        }
    } catch (error: any) {
        console.error('Error sending test notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to trigger test notification',
            error: error.message
        });
    }
};
