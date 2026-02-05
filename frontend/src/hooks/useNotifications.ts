import { useState, useEffect, useCallback } from 'react';
import { notificationService, type Notification as ApiNotification } from '@/services/notificationService';
import { CheckCircle, Info, AlertTriangle, XCircle, Bell, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export interface UINotification {
    id: string; // Changed to string to match _id
    title: string;
    description: string;
    time: string;
    type: 'success' | 'info' | 'warning' | 'error';
    icon: any;
    unread: boolean;
    relatedId?: string;
    relatedType?: 'job_application' | 'resource_application';
}

export const useNotifications = () => {
    const { isAuthenticated } = useAuthStore();
    const [notifications, setNotifications] = useState<UINotification[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        try {
            const data = await notificationService.getNotifications();
            const mapped: UINotification[] = data.map(n => ({
                id: n._id,
                title: n.title,
                description: n.message,
                time: formatTime(n.createdAt),
                type: n.type,
                icon: getIcon(n.type),
                unread: !n.read,
                relatedId: n.relatedId,
                relatedType: n.relatedType
            }));
            setNotifications(mapped);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();

        // Poll every 10 seconds
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const markRead = async (id: string | number) => {
        // Handle both string and number IDs
        const idStr = id.toString();
        try {
            await notificationService.markAsRead(idStr);
            setNotifications(prev => prev.map(n => n.id === idStr ? { ...n, unread: false } : n));

            // Handle navigation or action if relatedId exists
            const notification = notifications.find(n => n.id === idStr);
            if (notification?.relatedId) {
                // Determine navigation path based on type
                if (notification.relatedType === 'job_application') {
                    // For employer: Go to applications? Or specific application?
                    // Currently, ManageApplications lists all. We might not have a detail view accessible by ID directly
                    // but we can go to applications page.
                    // For user: Go to notification details or applications?
                    // Since this hook is general, we might want to check the user role or just let the consumer handle distinct actions.
                    // But the user asked to "reject or hire from there", implying a modal or page.

                    // Ideally, we navigate to the application management page.
                    // navigate(`/employer/applications?appId=${notification.relatedId}`); // Hypothetical
                }
            }
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const handleNotificationClick = (id: string | number) => {
        markRead(id);
        const notification = notifications.find(n => n.id === id.toString());
        if (notification?.relatedId) {
            // Logic to handle navigation could be here or strictly in markRead
            // For now, let's just mark read. The "View" action can be separate if needed,
            // or we can try to navigate intelligently.

            // If relatedType is job_application, and we are an employer...
            // We don't know the role here easily without auth context. 
            // But valid paths:
            // Employer -> /employer/applications
            // Employee -> /applications (or wherever they track status)
        }
    };

    const deleteNotification = async (id: string | number) => {
        const idStr = id.toString();
        try {
            await notificationService.deleteNotification(idStr);
            setNotifications(prev => prev.filter(n => n.id !== idStr));
        } catch (error) {
            console.error('Failed to delete notification', error);
        }
    };

    return {
        notifications,
        unreadCount: notifications.filter(n => n.unread).length,
        loading,
        markAllRead,
        markRead,
        deleteNotification,
        handleNotificationClick,
        refresh: fetchNotifications
    };
};

// Helpers
const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return date.toLocaleDateString();
};

const getIcon = (type: string) => {
    switch (type) {
        case 'success': return CheckCircle;
        case 'warning': return Clock;
        case 'error': return XCircle;
        default: return Info; // Info or Bell
    }
};
