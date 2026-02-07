import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, Clock, Info, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export interface Notification {
  id: string | number;
  title: string;
  description: string;
  time: string;
  type: "success" | "info" | "warning" | "error";
  icon: any;
  unread: boolean;
  relatedId?: string;
  relatedType?: string;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  viewAllPath?: string;
  onMarkAllRead?: () => void;
  onNotificationClick?: (id: string | number) => void;
}

export const NotificationDropdown = ({
  isOpen,
  onClose,
  notifications,
  viewAllPath = "/notifications",
  onMarkAllRead,
  onNotificationClick,
}: NotificationDropdownProps) => {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed right-4 top-20 w-[300px] sm:w-[350px] bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-50 overflow-hidden ring-1 ring-black/5"
          >
            <div className="px-6 py-5 border-b border-slate-100/50 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="size-8 flex items-center justify-center rounded-xl bg-slate-100/50 hover:bg-slate-200/50 transition-all text-slate-500 active:scale-90"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <h3 className="font-black text-slate-900 tracking-tight">Activity</h3>
              </div>
              {unreadCount > 0 && onMarkAllRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAllRead();
                  }}
                  className="text-[9px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
                >
                  Mark all
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar py-2">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => onNotificationClick?.(notif.id)}
                    className={`px-6 py-4 flex gap-4 hover:bg-slate-50/50 transition-all cursor-pointer relative group ${notif.unread ? "bg-primary/[0.03]" : ""}`}
                  >
                    <div
                      className={`size-10 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${notif.type === "success"
                          ? "bg-green-100 text-green-600 shadow-sm shadow-green-100"
                          : notif.type === "info"
                            ? "bg-blue-100 text-blue-600 shadow-sm shadow-blue-100"
                            : "bg-yellow-100 text-yellow-600 shadow-sm shadow-yellow-100"
                        }`}
                    >
                      <notif.icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs leading-snug mb-0.5 truncate ${notif.unread ? "font-black text-slate-900" : "font-bold text-slate-700"}`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-[10px] leading-relaxed text-slate-500 mb-1.5 line-clamp-2">
                        {notif.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[8px] uppercase font-black tracking-widest text-slate-400">
                          {notif.time}
                        </p>
                        {notif.unread && (
                          <span className="size-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(234,88,12,0.5)]" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center space-y-4">
                  <div className="size-16 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto opacity-50">
                    <Bell className="size-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-900">All caught up!</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">No new notifications</p>
                  </div>
                </div>
              )}
            </div>

            <Link
              to={viewAllPath}
              onClick={onClose}
              className="flex items-center justify-center w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary hover:bg-primary/5 transition-all bg-slate-50/30 border-t border-slate-100/50"
            >
              See all activity
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
