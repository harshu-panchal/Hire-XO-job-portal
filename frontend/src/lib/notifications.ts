import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase';
import axios from 'axios';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * Request notification permission and get FCM token
 * @returns FCM token or null
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
    try {
        if (!messaging) {
            console.warn('Firebase messaging not supported in this browser');
            return null;
        }

        // Request permission
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log('Notification permission granted.');

            // Get FCM token
            const token = await getToken(messaging, {
                vapidKey: VAPID_KEY,
            });

            if (token) {
                console.log('FCM Token:', token);
                return token;
            } else {
                console.log('No registration token available.');
                return null;
            }
        } else if (permission === 'denied') {
            console.warn('Notification permission denied.');
            return null;
        } else {
            console.log('Notification permission dismissed.');
            return null;
        }
    } catch (error) {
        console.error('An error occurred while retrieving token:', error);
        return null;
    }
};

/**
 * Save FCM token to backend
 * @param token FCM token
 */
export const saveFCMToken = async (token: string): Promise<void> => {
    try {
        const response = await axios.post(
            '/api/notifications/save-token',
            { token },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.data.success) {
            console.log('FCM token saved successfully');
        }
    } catch (error) {
        console.error('Error saving FCM token:', error);
    }
};

/**
 * Setup foreground message listener
 * @param callback Function to call when message received
 */
export const setupForegroundMessageListener = (
    callback?: (payload: any) => void
): void => {
    if (!messaging) {
        console.warn('Firebase messaging not supported');
        return;
    }

    onMessage(messaging, (payload) => {
        console.log('Message received in foreground:', payload);

        // Show notification or custom UI
        if (payload.notification) {
            const { title, body } = payload.notification;

            // Call custom callback if provided
            if (callback) {
                callback(payload);
            } else {
                // Default: show browser notification
                if (Notification.permission === 'granted') {
                    new Notification(title || 'New Message', {
                        body: body || '',
                        icon: '/logo pngg.png',
                    });
                }
            }
        }
    });
};

/**
 * Initialize notifications for authenticated user
 */
export const initializeNotifications = async (): Promise<void> => {
    try {
        // Request permission and get token
        const token = await requestNotificationPermission();

        if (token) {
            // Save token to backend
            await saveFCMToken(token);

            // Setup foreground listener
            setupForegroundMessageListener();
        }
    } catch (error) {
        console.error('Error initializing notifications:', error);
    }
};
