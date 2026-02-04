import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Info, CheckCircle, Clock, Trash2 } from "lucide-react";

interface Notification {
    id: number;
    title: string;
    description: string;
    time: string;
    type: 'success' | 'info' | 'warning' | 'error';
    unread: boolean;
}

const initialNotifications: Notification[] = [
    {
        id: 1,
        title: "Application Viewed",
        description: "Google viewed your application for Senior Frontend Developer.",
        time: "5m ago",
        type: "info",
        unread: true,
    },
    {
        id: 2,
        title: "New Job Match",
        description: "A new job matching your profile was posted by Microsoft.",
        time: "1h ago",
        type: "success",
        unread: true,
    },
    {
        id: 3,
        title: "Interview Reminder",
        description: "Upcoming interview with Amazon tomorrow at 10 AM.",
        time: "4h ago",
        type: "warning",
        unread: false,
    },
    {
        id: 4,
        title: "System Update",
        description: "WorkX profile completion is now at 85%. Add your certificates to reach 100%.",
        time: "1d ago",
        type: "info",
        unread: false,
    }
];

const Notifications = () => {
    const navigate = useNavigate();
    const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400';
            case 'warning': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400';
            case 'error': return 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400';
            default: return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="size-5" />;
            case 'warning': return <Clock className="size-5" />;
            case 'error': return <Info className="size-5" />;
            default: return <Bell className="size-5" />;
        }
    };

    const markAllRead = () => {
        setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const deleteNotif = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifs(prev => prev.filter(n => n.id !== id));
    };

    const toggleRead = (id: number) => {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
    };

    return (
        <div className="pb-32 min-h-screen select-none">
            {/* Header */}
            <div className="sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 transition-all">
                <div className="flex items-center justify-between px-5 py-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all shadow-sm"
                        >
                            <ChevronLeft className="size-6" />
                        </button>
                        <h1 className="text-xl font-black tracking-tight">Notifications</h1>
                    </div>
                    {notifs.some(n => n.unread) && (
                        <button
                            onClick={markAllRead}
                            className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            <div className="px-5 space-y-4">
                {notifs.length > 0 ? (
                    notifs.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => toggleRead(notif.id)}
                            className={`group relative p-5 rounded-[2rem] bg-white dark:bg-slate-900/50 border transition-all cursor-pointer ${notif.unread
                                    ? "border-primary/20 shadow-lg shadow-primary/5 ring-1 ring-primary/10"
                                    : "border-slate-100 dark:border-white/5 opacity-80"
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className={`size-12 shrink-0 rounded-2xl flex items-center justify-center ${getTypeStyles(notif.type)}`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0 pr-8">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`text-sm leading-tight truncate ${notif.unread ? "font-black" : "font-bold text-slate-700 dark:text-slate-300"}`}>
                                            {notif.title}
                                        </h3>
                                        {notif.unread && (
                                            <span className="size-2 rounded-full bg-primary animate-pulse" />
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2 line-clamp-2">
                                        {notif.description}
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {notif.time}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={(e) => deleteNotif(notif.id, e)}
                                className="absolute top-5 right-5 size-8 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all active:scale-90 flex items-center justify-center"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="size-20 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                            <Bell className="size-10 text-slate-300" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black tracking-tight leading-tight">All caught up!</h3>
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                                No new notifications for you
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
