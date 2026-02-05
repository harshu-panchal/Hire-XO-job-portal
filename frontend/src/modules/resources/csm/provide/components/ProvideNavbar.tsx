import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationDropdown } from "@/components/NotificationDropdown";

export const ProvideNavbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAllRead, handleNotificationClick } = useNotifications();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 px-5 py-4 flex items-center justify-between transition-all duration-300 select-none">
      <Link
        to="/csm/provide/dashboard"
        className="flex items-center gap-2 active:scale-95 transition-transform"
      >
        <div className="size-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-600/20">
          <span className="text-white font-black text-xl tracking-tighter italic">H</span>
        </div>
        <span className="text-xl font-black tracking-tighter">
          CSM <span className="text-rose-600">Admin</span>
        </span>
      </Link>
      <div className="flex gap-2.5 relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative size-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 active:bg-slate-100 dark:active:bg-white/10 active:scale-90 transition-all duration-200"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-3 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white border-2 border-white dark:border-slate-900">
              {unreadCount}
            </span>
          )}
        </button>

        <NotificationDropdown
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          onMarkAllRead={markAllRead}
          onNotificationClick={handleNotificationClick}
          viewAllPath="/csm/provide/notifications"
        />
      </div>
    </header>
  );
};

