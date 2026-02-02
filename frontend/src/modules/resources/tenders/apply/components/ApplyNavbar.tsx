import { useState } from "react";
import { Bell, Search, CheckCircle, Info } from "lucide-react";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import type { Notification } from "@/components/NotificationDropdown";

const mockNotifications: Notification[] = [
    {
        id: 1,
        title: "Tender Update",
        description: "The deadline for NHAI Road Project has been extended.",
        time: "1h ago",
        type: "info",
        icon: Info,
        unread: true,
    },
    {
        id: 2,
        title: "Application Received",
        description: "Your application for the Mumbai Bridge Project was received.",
        time: "5h ago",
        type: "success",
        icon: CheckCircle,
        unread: false,
    }
];

const ApplyNavbar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const handleMarkRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 py-3">
            <div className="max-w-[430px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <span className="text-white font-black text-xl tracking-tighter">H</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tighter leading-none">Hire <span className="text-primary">XO</span></h1>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-violet-600/60 leading-none mt-1">Tender Apply</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 relative">
                    <button className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center active:scale-95 transition-transform">
                        <Search className="size-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`size-10 rounded-xl flex items-center justify-center relative active:scale-95 transition-transform ${showNotifications ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                    >
                        <Bell className="size-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 size-2.5 bg-primary border-2 border-white dark:border-slate-800 rounded-full animate-pulse"></span>
                        )}
                    </button>

                    <NotificationDropdown
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                        notifications={notifications}
                        onMarkAllRead={handleMarkAllRead}
                        onNotificationClick={handleMarkRead}
                        viewAllPath="/resources/tenders/apply/notifications"
                    />
                </div>
            </div>
        </nav>
    );
};

export default ApplyNavbar;
