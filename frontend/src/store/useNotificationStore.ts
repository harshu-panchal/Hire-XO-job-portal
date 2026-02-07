import { create } from "zustand";
import { notificationService, type Notification } from "@/services/notificationService";
import { toast } from "sonner";

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    lastFetched: number;

    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    addNotificationLocal: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    lastFetched: 0,

    fetchNotifications: async () => {
        const { notifications: oldNotifications } = get();
        set({ loading: true, error: null });
        try {
            const data = await notificationService.getNotifications();

            // Check for new notifications to show toast
            const oldIds = new Set(oldNotifications.map(n => n._id));
            const newUnread = data.filter(n => !n.read && !oldIds.has(n._id));

            const { lastFetched } = get();
            if (lastFetched > 0) {
                newUnread.forEach(n => {
                    toast(n.title, {
                        description: n.message,
                        duration: 5000,
                    });
                });
            }

            set({
                notifications: data,
                unreadCount: data.filter(n => !n.read).length,
                loading: false,
                lastFetched: Date.now()
            });
        } catch (error: any) {
            set({ error: error.message || "Failed to fetch notifications", loading: false });
        }
    },

    markAsRead: async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            set(state => {
                const updated = state.notifications.map(n =>
                    n._id === id ? { ...n, read: true } : n
                );
                return {
                    notifications: updated,
                    unreadCount: updated.filter(n => !n.read).length
                };
            });
        } catch (error: any) {
            set({ error: error.message || "Failed to mark as read" });
        }
    },

    markAllAsRead: async () => {
        try {
            await notificationService.markAllAsRead();
            set(state => ({
                notifications: state.notifications.map(n => ({ ...n, read: true })),
                unreadCount: 0
            }));
        } catch (error: any) {
            set({ error: error.message || "Failed to mark all as read" });
        }
    },

    deleteNotification: async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            set(state => {
                const updated = state.notifications.filter(n => n._id !== id);
                return {
                    notifications: updated,
                    unreadCount: updated.filter(n => !n.read).length
                };
            });
        } catch (error: any) {
            set({ error: error.message || "Failed to delete notification" });
        }
    },

    addNotificationLocal: (notification: Notification) => {
        set(state => {
            const updated = [notification, ...state.notifications];
            return {
                notifications: updated,
                unreadCount: updated.filter(n => !n.read).length
            };
        });

        if (!notification.read) {
            toast(notification.title, {
                description: notification.message,
                duration: 5000,
            });
        }
    }
}));
