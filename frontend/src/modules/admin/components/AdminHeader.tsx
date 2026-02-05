import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Menu, Sun, Moon, Search, CheckCircle, Clock, Star, Info } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuthStore } from "../../../store/useAuthStore";

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

const NOTIFICATIONS_DATA = [
  {
    id: 1,
    title: "New Employer Registered",
    description: "TechCorp India has joined the platform.",
    time: "5m ago",
    type: "success",
    icon: CheckCircle,
    unread: true,
  },
  {
    id: 2,
    title: "Payment Received",
    description: "Payment for Business Plan received from InnovateTech.",
    time: "1h ago",
    type: "info",
    icon: Star,
    unread: true,
  },
  {
    id: 3,
    title: "System Update",
    description: "System maintenance scheduled for tonight at 2 AM.",
    time: "4h ago",
    type: "warning",
    icon: Info,
    unread: false,
  },
  {
    id: 4,
    title: "Job Posted",
    description: "StartupHub posted a new Senior Developer role.",
    time: "Yesterday",
    type: "success",
    icon: Clock,
    unread: false,
  },
];

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleMarkRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40 px-6 lg:px-8 flex items-center justify-between w-full transition-all duration-300">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-xs text-slate-500 dark:text-white/50">Admin Dashboard</p>
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-lg border transition-all relative ${
              showNotifications
                ? "bg-primary/10 border-primary text-primary"
                : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white"
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
                  className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleMarkRead(notif.id)}
                        className={`p-4 flex gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-slate-100 dark:border-white/5 last:border-0 ${notif.unread ? "bg-primary/5 dark:bg-primary/5" : ""}`}
                      >
                        <div
                          className={`p-2 rounded-lg h-fit ${
                            notif.type === "success"
                              ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                              : notif.type === "info"
                                ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                          }`}
                        >
                          <notif.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm leading-tight mb-1 ${notif.unread ? "font-bold text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-white/80"}`}
                          >
                            {notif.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-white/50 mb-1 line-clamp-2">
                            {notif.description}
                          </p>
                          <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-white/30 tracking-wider">
                            {notif.time}
                          </p>
                        </div>
                        {notif.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="w-full p-3 text-center text-sm font-medium text-slate-500 dark:text-white/40 border-t border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    See all notifications
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <Link
          to="/admin/settings"
          className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 py-1 px-2 rounded-lg transition-colors group"
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
            <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-slate-500 dark:text-white/50">
              {user?.role || "Administrator"}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
