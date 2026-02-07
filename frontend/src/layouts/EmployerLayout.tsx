import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { PlusSquare, Bell, Home, Video, CreditCard, HelpCircle } from "lucide-react";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/useAuthStore";
import logo from "@/assets/logo.png";

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
            className="active:scale-95 transition-transform"
          >
            <img src={logo} alt="HireXO" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex gap-2.5 relative items-center">
            <button
              onClick={() => isAuthenticated ? setShowNotifications(!showNotifications) : navigate("/login/employer")}
              className={`relative size-11 rounded-2xl border flex items-center justify-center active:scale-90 transition-all ${showNotifications
                ? "bg-primary/10 border-primary text-primary"
                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                }`}
            >
              <Bell className="size-5" />
              {isAuthenticated && unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full ring-4 ring-slate-50 animate-pulse"></span>
              )}
            </button>

            <ProfileDropdown loginPath="/login/employer" />

            <NotificationDropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifs}
              onMarkAllRead={handleMarkAllRead}
              onNotificationClick={handleNotifClick}
              viewAllPath="/employer/notifications"
            />
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
              <Home
                className={`h-6 w-6 ${isActive("/employer") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/employer") ? "opacity-100" : "opacity-40"
                }`}
            >
              Home
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
            to={isAuthenticated ? "/employer/interviews" : "/login/employer"}
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/employer/interviews") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/employer/interviews")
                ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5"
                : "bg-transparent"
                }`}
            >
              <Video
                className={`h-6 w-6 ${isActive("/employer/interviews") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/employer/interviews") ? "opacity-100" : "opacity-40"
                }`}
            >
              Interview
            </span>
          </Link>

          <Link
            to={isAuthenticated ? "/employer/subscription" : "/login/employer"}
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/employer/subscription") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/employer/subscription")
                ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5"
                : "bg-transparent"
                }`}
            >
              <CreditCard
                className={`h-6 w-6 ${isActive("/employer/subscription") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/employer/subscription") ? "opacity-100" : "opacity-40"
                }`}
            >
              Payment
            </span>
          </Link>

          <Link
            to={isAuthenticated ? "/employer/faq" : "/login/employer"}
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/employer/faq") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/employer/faq")
                ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5"
                : "bg-transparent"
                }`}
            >
              <HelpCircle
                className={`h-6 w-6 ${isActive("/employer/faq") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/employer/faq") ? "opacity-100" : "opacity-40"
                }`}
            >
              FAQ
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default EmployerLayout;
