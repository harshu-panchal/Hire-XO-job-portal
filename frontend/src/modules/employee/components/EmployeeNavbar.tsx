import { useState } from "react";
import { Bell, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/useAuthStore";
import logo from "@/assets/logo.png";
import apiClient from "@/lib/apiConfig";
import { toast } from "sonner";

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

  const handleTestPush = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("Please login first");
        return;
      }
      const response = await apiClient.post("/notifications/test-push");
      if (response.data.success) {
        toast.success("Test notification triggered!");
      }
    } catch (error: any) {
      console.error("Test push failed", error);
      toast.error("Failed to trigger test notification");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-5 py-4 flex items-center justify-between transition-all duration-300 select-none">
      <Link to="/jobs" className="active:scale-95 transition-transform">
        <img src={logo} alt="HireXO" className="h-10 w-auto object-contain" />
      </Link>
      <div className="flex gap-2.5 relative items-center">
        {isAuthenticated && (
          <button
            onClick={handleTestPush}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors active:scale-95"
          >
            Test Push
          </button>
        )}
        <button
          onClick={() => isAuthenticated ? setShowNotifications(!showNotifications) : navigate("/login/employee")}
          className={`relative size-12 flex items-center justify-center rounded-2xl border transition-all duration-200 active:scale-90 ${showNotifications
            ? "bg-primary/10 border-primary text-primary"
            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
        >
          <Bell className="h-6 w-6" />
          {isAuthenticated && unreadCount > 0 && (
            <span className="absolute top-3.5 right-3.5 size-2.5 bg-primary rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>

        <ProfileDropdown />

        <NotificationDropdown
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifs}
          onMarkAllRead={handleMarkAllRead}
          onNotificationClick={handleNotifClick}
          viewAllPath="/notifications"
        />
      </div>
    </header>
  );
};
