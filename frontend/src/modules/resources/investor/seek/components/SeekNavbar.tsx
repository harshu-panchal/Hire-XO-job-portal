import { Bell, X, MessageSquare, Clock, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const SeekNavbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      investorName: "Rajesh Kumar",
      investorInitials: "RK",
      investorGradient: "from-blue-500 to-cyan-600",
      fundingRequest: "AI-Powered SaaS Platform",
      message: "Interested in your AI SaaS platform. Would like to discuss investment terms...",
      timestamp: "2 hours ago",
      isRead: false,
    },
    {
      id: 2,
      investorName: "Anita Sharma",
      investorInitials: "AS",
      investorGradient: "from-purple-500 to-pink-600",
      fundingRequest: "Solar Panel Manufacturing",
      message: "Looking for more details on your manufacturing expansion plans...",
      timestamp: "5 hours ago",
      isRead: false,
    },
    {
      id: 3,
      investorName: "Vikram Patel",
      investorInitials: "VP",
      investorGradient: "from-green-500 to-emerald-600",
      fundingRequest: "Telemedicine Platform",
      message:
        "Your telemedicine platform looks promising. I have experience in healthcare tech...",
      timestamp: "1 day ago",
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setShowNotifications(false);
    navigate("/investor/seek/inquiries");
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        showNotifications &&
        !target.closest(".notification-panel") &&
        !target.closest(".notification-button")
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 px-5 py-4 flex items-center justify-between transition-all duration-300 select-none">
      <Link
        to="/investor/seek/dashboard"
        className="flex items-center gap-2 active:scale-95 transition-transform"
      >
        <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-black text-xl tracking-tighter italic">H</span>
        </div>
        <span className="text-xl font-black tracking-tighter">
          Hire <span className="text-primary">XO</span>
        </span>
      </Link>
      <div className="flex gap-2.5 relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="notification-button relative size-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 active:scale-90 transition-all duration-200"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 size-5 bg-primary rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <span className="text-[10px] font-black text-white">{unreadCount}</span>
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {showNotifications && (
          <div className="notification-panel absolute top-16 right-0 w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black">Notifications</h3>
                <p className="text-xs text-slate-500">{unreadCount} unread inquiries</p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-black text-primary hover:text-primary/80 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                    <Bell className="size-8 text-slate-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-slate-200 dark:border-white/10 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      !notification.isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`size-10 rounded-lg bg-gradient-to-br ${notification.investorGradient} flex items-center justify-center text-white font-black text-xs shrink-0`}
                      >
                        {notification.investorInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <p className="text-sm font-black">{notification.investorName}</p>
                            <p className="text-xs text-slate-500">{notification.fundingRequest}</p>
                          </div>
                          {!notification.isRead && (
                            <div className="size-2 rounded-full bg-primary shrink-0 mt-1.5"></div>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <Clock className="size-3" />
                            <span>{notification.timestamp}</span>
                          </div>
                          <ChevronRight className="size-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate("/investor/seek/inquiries");
                  }}
                  className="w-full py-2 rounded-lg bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-all"
                >
                  View All Inquiries
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
