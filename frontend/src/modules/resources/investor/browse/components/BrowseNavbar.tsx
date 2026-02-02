import { Bell, CheckCircle, TrendingUp, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import type { Notification } from "@/components/NotificationDropdown";

export const BrowseNavbar = () => {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            title: "ROI Update: TechVenture",
            description: "TechVenture Solutions reported a 5% increase in quarterly revenue.",
            time: "2 HOURS AGO",
            type: 'success',
            icon: TrendingUp,
            unread: true,
        },
        {
            id: 2,
            title: "New Opportunity Alert",
            description: "A new High-Tech Manufacturing project just went live in Pune.",
            time: "5 HOURS AGO",
            type: 'info',
            icon: Info,
            unread: true,
        },
        {
            id: 3,
            title: "Funding Milestone Reached",
            description: "GreenEnergy Innovations has secured 80% of their target funding.",
            time: "1 DAY AGO",
            type: 'success',
            icon: CheckCircle,
            unread: false,
        }
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const handleNotificationClick = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 px-5 py-4 flex items-center justify-between transition-all duration-300 select-none">
            <Link
                to="/investor/browse/dashboard"
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
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative size-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 active:bg-slate-100 dark:active:bg-white/10 active:scale-90 transition-all duration-200"
                >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-3.5 right-3.5 size-2.5 bg-primary rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                    )}
                </button>

                <NotificationDropdown
                    isOpen={isNotifOpen}
                    onClose={() => setIsNotifOpen(false)}
                    notifications={notifications}
                    onMarkAllRead={handleMarkAllRead}
                    onNotificationClick={handleNotificationClick}
                    viewAllPath="/investor/browse/settings" // Change to actual notifications page if created
                />
            </div>
        </header>
    );
};
