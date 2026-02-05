import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Info, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { notificationService, type Notification } from "@/services/notificationService";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifs(data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400";
      case "warning":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400";
      case "error":
        return "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400";
      default:
        return "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="size-5" />;
      case "warning":
        return <Clock className="size-5" />;
      case "error":
        return <Info className="size-5" />;
      default:
        return <Bell className="size-5" />;
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleRead = async (id: string, currentStatus: boolean) => {
    if (currentStatus) return; // Already read
    try {
      await notificationService.markAsRead(id);
      setNotifs((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <div className="pb-32 min-h-screen select-none">
      {/* Header */}
      <div className="sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 transition-all">
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all shadow-sm"
            >
              <ChevronLeft className="size-6" />
            </button>
            <h1 className="text-xl font-black tracking-tight">Notifications</h1>
          </div>
          {notifs.some((n) => !n.read) && (
            <button
              onClick={markAllRead}
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="px-5 space-y-4">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold">Loading...</div>
        ) : notifs.length > 0 ? (
          notifs.map((notif) => (
            <div
              key={notif._id}
              onClick={() => toggleRead(notif._id, notif.read)}
              className={`group relative p-5 rounded-[2rem] bg-white dark:bg-slate-900/50 border transition-all cursor-pointer ${
                !notif.read
                  ? "border-primary/20 shadow-lg shadow-primary/5 ring-1 ring-primary/10"
                  : "border-slate-100 dark:border-white/5 opacity-80"
              }`}
            >
              <div className="flex gap-4">
                <div
                  className={`size-12 shrink-0 rounded-2xl flex items-center justify-center ${getTypeStyles(notif.type)}`}
                >
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`text-sm leading-tight truncate ${!notif.read ? "font-black" : "font-bold text-slate-700 dark:text-slate-300"}`}
                    >
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="size-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                    {notif.message}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {formatTime(notif.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="size-20 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center">
              <Bell className="size-10 text-slate-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tight leading-tight">All caught up!</h3>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                No new notifications for you
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
