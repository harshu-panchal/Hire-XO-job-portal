import { Bell, CheckCircle, TrendingUp, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { useNotifications } from "@/hooks/useNotifications";

export const BrowseNavbar = () => {
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { notifications, unreadCount, markAllRead, handleNotificationClick } = useNotifications();

  const handleMarkAllRead = () => {
    markAllRead();
  };

  const handleNotifClick = (id: string | number) => {
    handleNotificationClick(id);
    setIsNotifOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-5 py-4 flex items-center justify-between transition-all duration-300 select-none">
      <Link
        to="/investor/browse/dashboard"
        className="flex items-center gap-2 active:scale-95 transition-transform"
      >
        <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-black text-xl tracking-tighter italic">H</span>
        </div>
        <span className="text-xl font-black tracking-normal font-branding">
          Hire<span className="text-primary">XO</span>
        </span>
      </Link>
      <div className="flex gap-2.5 relative">
        <button
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className="relative size-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 active:bg-slate-100 active:scale-90 transition-all duration-200"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-3.5 right-3.5 size-2.5 bg-primary rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>

        <NotificationDropdown
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onNotificationClick={handleNotifClick}
          viewAllPath="/investor/browse/notifications"
        />
      </div>
    </header>
  );
};
