import { useState } from "react";
import { Bell, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/useAuthStore";

export const EmployeeNavbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const {
    notifications: notifs,
    unreadCount,
    markAllRead,
    handleNotificationClick,
  } = useNotifications();
  const { isAuthenticated } = useAuthStore();

  const handleMarkAllRead = () => {
    markAllRead();
  };

  const handleNotifClick = (id: string | number) => {
    handleNotificationClick(id);
    const notification = notifs.find((n) => n.id === id);
    if (notification) {
      if (
        notification.relatedType === "job_application" ||
        notification.relatedType === "resource_application"
      ) {
        navigate("/my-applications");
      }
    }
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-5 py-4 flex items-center justify-between transition-all duration-300 select-none">
      <Link to="/jobs" className="flex items-center gap-2 active:scale-95 transition-transform">
        <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-black text-xl tracking-tighter italic">H</span>
        </div>
        <span className="text-xl font-black tracking-normal font-branding">
          Hire<span className="text-primary">XO</span>
        </span>
      </Link>
      <div className="flex gap-2.5 relative">
        {!isAuthenticated ? (
          <Link
            to="/login/employee"
            className="h-12 px-6 rounded-2xl bg-slate-900 text-white flex items-center gap-2 font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
          >
            <LogIn className="size-4" />
            <span>Login</span>
          </Link>
        ) : (
          <>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative size-12 flex items-center justify-center rounded-2xl border transition-all duration-200 active:scale-90 ${showNotifications
                ? "bg-primary/10 border-primary text-primary"
                : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-3.5 right-3.5 size-2.5 bg-primary rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>

            <NotificationDropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifs}
              onMarkAllRead={handleMarkAllRead}
              onNotificationClick={handleNotifClick}
              viewAllPath="/notifications"
            />
          </>
        )}
      </div>
    </header>
  );
};
