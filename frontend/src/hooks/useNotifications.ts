import { useEffect } from "react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { CheckCircle, Info, Clock, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export interface UINotification {
  id: string; // Changed to string to match _id
  title: string;
  description: string;
  time: string;
  type: "success" | "info" | "warning" | "error";
  icon: any;
  unread: boolean;
  relatedId?: string;
  relatedType?: "job_application" | "resource_application";
}

export const useNotifications = () => {
  const { isAuthenticated } = useAuthStore();
  const {
    notifications: apiNotifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead: storeMarkAsRead,
    markAllAsRead: storeMarkAllAsRead,
    deleteNotification: storeDeleteNotification
  } = useNotificationStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Initial fetch
      fetchNotifications();

      // Setup SSE
      const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/notifications/stream`, {
        withCredentials: true
      });

      eventSource.onmessage = (event) => {
        const newNotification = JSON.parse(event.data);
        // We could just refetch or append. Refetching ensures consistency for now.
        // Or append to store if store supports it.
        // Let's refetch to be safe and simple
        fetchNotifications();
      };

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [isAuthenticated, fetchNotifications]);

  const mapped: UINotification[] = apiNotifications.map((n) => ({
    id: n._id,
    title: n.title,
    description: n.message,
    time: formatTime(n.createdAt),
    type: n.type,
    icon: getIcon(n.type),
    unread: !n.read,
    relatedId: n.relatedId,
    relatedType: n.relatedType,
  }));

  const markRead = (id: string | number) => storeMarkAsRead(id.toString());
  const deleteNotification = (id: string | number) => storeDeleteNotification(id.toString());

  const handleNotificationClick = (id: string | number) => {
    const idStr = id.toString();
    markRead(idStr);

    const notification = mapped.find((n) => n.id === idStr);
    if (notification?.relatedId) {
      if (notification.relatedType === "job_application") {
        navigate(`/employer/applications?id=${notification.relatedId}`);
      } else if (notification.relatedType === "resource_application") {
        navigate(`/employer/applications?id=${notification.relatedId}`);
      }
    }
  };

  return {
    notifications: mapped,
    unreadCount,
    loading,
    markAllRead: storeMarkAllAsRead,
    markRead,
    deleteNotification,
    handleNotificationClick,
    refresh: fetchNotifications,
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
    case "success":
      return CheckCircle;
    case "warning":
      return Clock;
    case "error":
      return XCircle;
    default:
      return Info;
  }
};
