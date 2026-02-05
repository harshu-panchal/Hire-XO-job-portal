import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusSquare, Users, Settings, Bell, LogIn } from "lucide-react";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/useAuthStore";

const EmployerLayout = () => {
  const location = useLocation();
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
      // Navigate based on type
      if (notification.relatedType === "job_application") {
        // Ideally navigate to specific application, but for now lists
        navigate("/employer/applications");
      } else if (notification.relatedType === "resource_application") {
        // Navigate to resource applications (if page exists) or generic applications
        navigate("/employer/applications");
      }
    }
    setShowNotifications(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/30">
      {/* Mobile-optimized Header */}
      <header className="sticky top-0 z-50 w-full bg-slate-50/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-[430px] mx-auto px-5 h-20 flex items-center justify-between">
          <Link
            to="/employer"
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
            {!isAuthenticated ? (
              <Link
                to="/login/employer"
                className="h-11 px-5 rounded-2xl bg-slate-900 text-white flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
              >
                <LogIn className="size-4" />
                <span>Login</span>
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative size-11 rounded-2xl border flex items-center justify-center active:scale-90 transition-all ${showNotifications
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-white border-slate-200 text-slate-400"
                    }`}
                >
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full ring-4 ring-slate-50 animate-pulse"></span>
                  )}
                </button>

                <NotificationDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  notifications={notifs}
                  onMarkAllRead={handleMarkAllRead}
                  onNotificationClick={handleNotifClick}
                  viewAllPath="/employer/notifications"
                />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[430px] mx-auto px-5">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/80 backdrop-blur-xl border-t border-slate-200 px-8 py-4 z-50">
        <div className="flex items-center justify-between">
          <Link
            to="/employer"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/employer") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/employer")
                ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5"
                : "bg-transparent"
                }`}
            >
              <LayoutDashboard
                className={`h-6 w-6 ${isActive("/employer") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/employer") ? "opacity-100" : "opacity-40"
                }`}
            >
              Dash
            </span>
          </Link>

          <Link
            to={isAuthenticated ? "/employer/post-job" : "/login/employer"}
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/employer/post-job") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/employer/post-job")
                ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5"
                : "bg-transparent"
                }`}
            >
              <PlusSquare
                className={`h-6 w-6 ${isActive("/employer/post-job") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/employer/post-job") ? "opacity-100" : "opacity-40"
                }`}
            >
              Post
            </span>
          </Link>

          <Link
            to={isAuthenticated ? "/employer/applications" : "/login/employer"}
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/employer/applications") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/employer/applications")
                ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5"
                : "bg-transparent"
                }`}
            >
              <Users
                className={`h-6 w-6 ${isActive("/employer/applications") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/employer/applications") ? "opacity-100" : "opacity-40"
                }`}
            >
              Apps
            </span>
          </Link>

          <Link
            to={isAuthenticated ? "/employer/settings" : "/login/employer"}
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/employer/settings") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/employer/settings")
                ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5"
                : "bg-transparent"
                }`}
            >
              <Settings
                className={`h-6 w-6 ${isActive("/employer/settings") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/employer/settings") ? "opacity-100" : "opacity-40"
                }`}
            >
              Setup
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default EmployerLayout;
