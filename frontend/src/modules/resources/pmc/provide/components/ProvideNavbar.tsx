import { Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { useNotifications } from "@/hooks/useNotifications";

export const ProvideNavbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAllRead, handleNotificationClick } = useNotifications();

  const handleNotifClick = (id: string | number) => {
    handleNotificationClick(id);
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 px-5 py-4 flex items-center justify-between transition-all duration-300 select-none">
      <Link
        to="/pmc/provide/dashboard"
        className="flex items-center gap-2 active:scale-95 transition-transform"
      >
        <div className="size-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
          <span className="text-white font-black text-xl tracking-tighter italic">H</span>
        </div>
        <span className="text-xl font-black tracking-tighter">
          PMC <span className="text-indigo-600">Admin</span>
        </span>
      </Link>
      <div className="flex gap-2.5 relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative size-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 active:bg-slate-100 dark:active:bg-white/10 active:scale-90 transition-all duration-200">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-3.5 right-3.5 size-2.5 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
          )}
        </button>

        <NotificationDropdown
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          onMarkAllRead={markAllRead}
          onNotificationClick={handleNotifClick}
          viewAllPath="/pmc/provide/notifications"
        />
      </div>
    </header>
  );
};
