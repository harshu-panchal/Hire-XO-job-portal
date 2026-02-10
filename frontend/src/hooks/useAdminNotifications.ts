import { useState, useEffect, useCallback } from 'react';
import { notificationService, type Notification } from '../services/notificationService';
import { toast } from 'sonner';

export const useAdminNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const data = await notificationService.getNotifications(1, 10);
            if (data && data.data) {
                setNotifications(data.data);
                // Assuming backend doesn't return unreadCount separately, we count locally on the page
                // But better if backend returns it. Alternatively, we can filter locally for the first page.
                // A better approach is to rely on what's fetched or fetch count separately if needed.
                // For now, let's count from the list (which might be inaccurate if >10 unread, but acceptable for MVP)
                // Actually, let's update unreadCount based on the fetched list for now.
                setUnreadCount(data.data.filter((n: Notification) => !n.read).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    };
};
