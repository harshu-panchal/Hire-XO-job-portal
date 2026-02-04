import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, Clock, Info, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export interface Notification {
    id: number;
    title: string;
    description: string;
    time: string;
    type: 'success' | 'info' | 'warning' | 'error';
    icon: any;
    unread: boolean;
}

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    viewAllPath?: string;
    onMarkAllRead?: () => void;
    onNotificationClick?: (id: number) => void;
}

export const NotificationDropdown = ({
    isOpen,
    onClose,
    notifications,
    viewAllPath = "/notifications",
    onMarkAllRead,
    onNotificationClick
}: NotificationDropdownProps) => {
    const unreadCount = notifications.filter(n => n.unread).length;

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
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        onClick={(e) => e.stopPropagation()}
                        className="fixed right-4 top-20 w-[280px] sm:w-[320px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                    className="p-1 -ml-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400"
                                >
                                    <ArrowLeft className="size-4" />
                                </button>
                                <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                            </div>
                            {unreadCount > 0 && onMarkAllRead && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMarkAllRead();
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => onNotificationClick?.(notif.id)}
                                        className={`p-4 flex gap-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-slate-100 dark:border-white/5 last:border-0 ${notif.unread ? "bg-primary/[0.02]" : ""}`}
                                    >
                                        <div className={`size-8 shrink-0 rounded-xl flex items-center justify-center ${notif.type === 'success' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' :
                                            notif.type === 'info' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                                                'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                                            }`}>
                                            <notif.icon className="size-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs leading-tight mb-1 ${notif.unread ? "font-bold text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-white/80"}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-[10px] leading-relaxed text-slate-500 dark:text-white/50 mb-1 line-clamp-2">{notif.description}</p>
                                            <p className="text-[8px] uppercase font-black tracking-widest text-slate-400 dark:text-white/20">
                                                {notif.time}
                                            </p>
                                        </div>
                                        {notif.unread && (
                                            <div className="size-1.5 bg-primary rounded-full mt-1.5"></div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center">
                                    <Bell className="size-10 text-slate-200 dark:text-white/10 mx-auto mb-2" />
                                    <p className="text-xs text-slate-500 dark:text-white/40">No notifications yet</p>
                                </div>
                            )}
                        </div>
                        <Link to={viewAllPath} onClick={onClose} className="block w-full p-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/20 border-t border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            View All
                        </Link>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
