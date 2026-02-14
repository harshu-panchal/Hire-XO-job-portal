import { useEffect } from "react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { CheckCircle, Info, Clock, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { tokenManager } from "@/lib/tokenManager";

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

      // Setup SSE using Fetch stream with Authorization header
      const controller = new AbortController();
      const token = tokenManager.getToken();
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

      const connectStream = async () => {
        try {
          const response = await fetch(`${baseUrl}/notifications/stream`, {
            method: "GET",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controller.signal,
          });

          if (!response.ok || !response.body) {
            console.error("Notification stream connection failed with status", response.status);
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let buffer = "";

          const read = async (): Promise<void> => {
            const { done, value } = await reader.read();
            if (done) return;

            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split("\n\n");
            buffer = events.pop() || "";

            for (const rawEvent of events) {
              const lines = rawEvent.split("\n");
              const dataLine = lines.find((line) => line.startsWith("data:"));
              if (dataLine) {
                const data = dataLine.replace(/^data:\s*/, "");
                try {
                  // We ignore the payload here and simply refetch to ensure consistency
                  JSON.parse(data);
                  fetchNotifications();
                } catch (e) {
                  console.error("Failed to parse notification event data", e);
                }
              }
            }

            await read();
          };

          await read();
        } catch (error) {
          if ((error as any).name !== "AbortError") {
            console.error("Notification stream error:", error);
          }
        }
      };

      void connectStream();

      return () => {
        controller.abort();
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
