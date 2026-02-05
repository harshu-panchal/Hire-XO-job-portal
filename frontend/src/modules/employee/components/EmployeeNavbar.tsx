import { useState } from "react";
import { Bell, CheckCircle, Clock, Info, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationDropdown, type Notification } from "@/components/NotificationDropdown";

const notifications: Notification[] = [
  {
    id: 1,
    title: "Application Viewed",
    description: "Google viewed your application for Senior Frontend Developer.",
    time: "5m ago",
    type: "info",
    icon: Info,
    unread: true,
  },
  {
    id: 2,
    title: "New Job Match",
    description: "A new job matching your profile was posted by Microsoft.",
    time: "1h ago",
    type: "success",
    icon: CheckCircle,
    unread: true,
  },
  {
    id: 3,
    title: "Interview Reminder",
    description: "Upcoming interview with Amazon tomorrow at 10 AM.",
    time: "4h ago",
    type: "warning",
    icon: Clock,
    unread: false,
  },
];

export const EmployeeNavbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifs, setNotifs] = useState(notifications);

  const unreadCount = notifs.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleMarkRead = (id: number) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 px-5 py-4 flex items-center justify-between transition-all duration-300 select-none">
      <Link to="/jobs" className="flex items-center gap-2 active:scale-95 transition-transform">
        <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-black text-xl tracking-tighter italic">H</span>
        </div>
        <span className="text-xl font-black tracking-tighter">
          Hire <span className="text-primary">XO</span>
        </span>
      </Link>
      <div className="flex gap-2.5 relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className={`relative size-12 flex items-center justify-center rounded-2xl border transition-all duration-200 active:scale-90 ${
            showNotifications
              ? "bg-primary/10 border-primary text-primary"
              : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
          }`}
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-3.5 right-3.5 size-2.5 bg-primary rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
          )}
        </button>

        <NotificationDropdown
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifs}
          onMarkAllRead={handleMarkAllRead}
          onNotificationClick={handleMarkRead}
          viewAllPath="/notifications"
        />
      </div>
    </header>
  );
};
