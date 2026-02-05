import { useState } from "react";
import { Bell, CheckCircle, MessageSquare, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { NotificationDropdown, type Notification } from "@/components/NotificationDropdown";

export const ProvideNavbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Inquiry Received",
      description: "Someone is interested in your Tesla Model 3",
      time: "5 mins ago",
      type: "info",
      icon: MessageSquare,
      unread: true,
    },
    {
      id: 2,
      title: "Booking Confirmed",
      description: "Your Tata Ace has been booked for 3 days",
      time: "1 hour ago",
      type: "success",
      icon: CheckCircle,
      unread: true,
    },
    {
      id: 3,
      title: "Vehicle Listing Approved",
      description: "Your new vehicle listing is now live",
      time: "2 hours ago",
      type: "success",
      icon: CheckCircle,
      unread: false,
    },
    {
      id: 4,
      title: "Payment Received",
      description: "₹4,500 payment received for Tesla Model 3 rental",
      time: "3 hours ago",
      type: "success",
      icon: CheckCircle,
      unread: false,
    },
    {
      id: 5,
      title: "Maintenance Reminder",
      description: "Tesla Model 3 is due for service next week",
      time: "1 day ago",
      type: "warning",
      icon: AlertCircle,
      unread: false,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 px-5 py-4 flex items-center justify-between transition-all duration-300 select-none">
        <Link
          to="/vehicles/provide/dashboard"
          className="flex items-center gap-2 active:scale-95 transition-transform"
        >
          <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <span className="text-white font-black text-xl tracking-tighter italic">H</span>
          </div>
          <span className="text-xl font-black tracking-tighter">
            Vehicle <span className="text-blue-600">Admin</span>
          </span>
        </Link>
        <div className="flex gap-2.5">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative size-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 active:bg-slate-100 dark:active:bg-white/10 active:scale-90 transition-all duration-200"
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-3.5 right-3.5 size-2.5 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900"></span>
            )}
          </button>
        </div>
      </header>

      <NotificationDropdown
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        viewAllPath="/vehicles/provide/notifications"
        onMarkAllRead={handleMarkAllRead}
        onNotificationClick={handleNotificationClick}
      />
    </>
  );
};
