import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Menu, Search, CheckCircle, Star, Info, AlertTriangle, XCircle } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useAdminNotifications } from "../../../hooks/useAdminNotifications";

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useAdminNotifications();

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }

    if (notification.relatedType === "certificate_request") {
      const target = notification.relatedId
        ? `/admin/certificates?tab=pending&requestId=${notification.relatedId}`
        : "/admin/certificates?tab=pending";
      navigate(target);
      setShowNotifications(false);
      return;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      case 'info':
      default: return Info;
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white backdrop-blur-xl sticky top-0 z-40 px-6 lg:px-8 flex items-center justify-between w-full transition-all duration-300">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500">Admin Dashboard</p>
        </div>
      </div>

      {/* <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div> */}

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all"
        >
          {/* Placeholder for future action button */}
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-lg border transition-all relative ${showNotifications
                ? "bg-primary/10 border-primary text-primary"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowNotifications(false)}
                  className="fixed inset-0 z-40"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-3 w-80 md:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto">
                    {notifications && notifications.length > 0 ? (
                      notifications.map((notif) => {
                        const Icon = getIcon(notif.type);
                        return (
                          <div
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0 ${!notif.read ? "bg-primary/5" : ""}`}
                          >
                            <div
                              className={`p-2 rounded-lg h-fit ${notif.type === "success"
                                  ? "bg-green-100 text-green-600"
                                  : notif.type === "warning"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : notif.type === "error"
                                      ? "bg-red-100 text-red-600"
                                      : "bg-blue-100 text-blue-600"
                                }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm leading-tight mb-1 ${!notif.read ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}
                              >
                                {notif.title}
                              </p>
                              <p className="text-xs text-slate-500 mb-1 line-clamp-2">
                                {notif.message}
                              </p>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                {getTimeAgo(notif.createdAt)}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2"></div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-sm">
                        No notifications
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/admin/certificates?tab=pending");
                    }}
                    className="w-full p-3 text-center text-sm font-medium text-slate-500 border-t border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    See all notifications
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <Link
          to="/admin/settings"
          className="flex items-center gap-3 pl-3 border-l border-slate-200 hover:bg-slate-50 py-1 px-2 rounded-lg transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden group-hover:ring-2 group-hover:ring-primary/50 transition-all">
            {user?.profile?.profilePhoto ? (
              <img
                src={user.profile.profilePhoto}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-slate-500">
              {user?.role || "Administrator"}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
