import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    unread: boolean;
    type: "info" | "success" | "warning";
}

const onNotificationClick = (id: string) => {
    console.log("Notification clicked:", id);
};

export const ProvideNavbar = () => {
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const notifications: Notification[] = [
        {
            id: "1",
            title: "New Service Inquiry",
            message: "ABC Logistics requested a quote for your Heavy Haulage service",
            time: "5 min ago",
            unread: true,
            type: "info",
        },
        {
            id: "2",
            title: "Booking Confirmed",
            message: "Your fleet has been booked for Mumbai-Delhi route on Feb 5",
            time: "2 hours ago",
            unread: true,
            type: "success",
        },
        {
            id: "3",
            title: "Payment Received",
            message: "₹45,000 payment received for booking #LG-2401",
            time: "1 day ago",
            unread: false,
            type: "success",
        },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 px-5 py-4 flex items-center justify-between transition-all duration-300 select-none">
            <Link
                to="/logistics/provide/dashboard"
                className="flex items-center gap-2 active:scale-95 transition-transform"
            >
                <div className="size-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
                    <span className="text-white font-black text-xl tracking-tighter italic">H</span>
                </div>
                <span className="text-xl font-black tracking-tighter">
                    Logistics <span className="text-orange-600">Admin</span>
                </span>
            </Link>
            <div className="flex gap-2.5">
                <div className="relative">
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="relative size-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 active:bg-slate-100 dark:active:bg-white/10 active:scale-90 transition-all duration-200"
                    >
                        <Bell className="h-6 w-6" />
                        {notifications.filter(n => n.unread).length > 0 && (
                            <span className="absolute top-3.5 right-3.5 size-2.5 bg-orange-600 rounded-full border-2 border-white dark:border-slate-900"></span>
                        )}
                    </button>

                    {isNotifOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsNotifOpen(false)}
                            />
                            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[320px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                                <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                                    {notifications.filter(n => n.unread).length > 0 && (
                                        <span className="text-xs font-bold text-slate-500">
                                            {notifications.filter(n => n.unread).length} new
                                        </span>
                                    )}
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <Bell className="size-12 mx-auto mb-3 text-slate-300" />
                                            <p className="text-sm font-medium text-slate-500">No notifications yet</p>
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <button
                                                key={notification.id}
                                                onClick={() => {
                                                    onNotificationClick?.(notification.id);
                                                    setIsNotifOpen(false);
                                                }}
                                                className={`w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0 ${notification.unread ? 'bg-primary/5' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${notification.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-950' :
                                                        notification.type === 'warning' ? 'bg-amber-100 dark:bg-amber-950' :
                                                            'bg-blue-100 dark:bg-blue-950'
                                                        }`}>
                                                        <Bell className={`size-4 ${notification.type === 'success' ? 'text-emerald-600' :
                                                            notification.type === 'warning' ? 'text-amber-600' :
                                                                'text-blue-600'
                                                            }`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <p className="font-bold text-sm text-slate-900 dark:text-white">
                                                                {notification.title}
                                                            </p>
                                                            {notification.unread && (
                                                                <span className="size-2 rounded-full bg-orange-600 shrink-0 mt-1.5"></span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-[10px] font-medium text-slate-400 mt-1">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};
