import { Bell, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { useNotifications } from "@/hooks/useNotifications";

export const BrowseNavbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAllRead, handleNotificationClick } = useNotifications();

  const handleNotifClick = (id: string | number) => {
    handleNotificationClick(id);
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-5 py-4 flex items-center justify-between transition-all duration-300 select-none">
      <Link
        to="/vehicles/browse/dashboard"
        className="flex items-center gap-2 active:scale-95 transition-transform"
      >
        <div className="size-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-600/20">
          <span className="text-white font-black text-xl tracking-tighter italic">H</span>
        </div>
        <span className="text-xl font-black tracking-tighter">
          Vehicle <span className="text-cyan-600">Rentals</span>
        </span>
      </Link>
      <div className="flex gap-2.5 relative">
        <button className="size-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 active:bg-slate-100 active:scale-90 transition-all duration-200">
          <MapPin className="h-6 w-6" />
        </button>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative size-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 active:bg-slate-100 active:scale-90 transition-all duration-200"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-3.5 right-3.5 size-2.5 bg-cyan-600 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>

        <NotificationDropdown
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          onMarkAllRead={markAllRead}
          onNotificationClick={handleNotifClick}
          viewAllPath="/vehicles/browse/notifications"
        />
      </div>
    </header>
  );
};
