import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusSquare, FileText, MessageSquare, Settings } from "lucide-react";
import { SeekNavbar } from "../components/SeekNavbar";

const SeekLayout = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto overflow-x-hidden border-x border-gray-100 dark:border-white/5 shadow-2xl bg-slate-50 dark:bg-background transition-colors duration-300">
            {/* Header */}
            <SeekNavbar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
                <div className="px-5">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 dark:bg-background/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/5 z-50 px-8 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)] select-none">
                <div className="flex justify-between items-center h-20">
                    <Link
                        to="/investor/seek/dashboard"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/investor/seek/dashboard") ? "text-primary" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/investor/seek/dashboard") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"
                                }`}
                        >
                            <LayoutDashboard className={`h-6 w-6 ${isActive("/investor/seek/dashboard") ? "fill-primary/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/investor/seek/dashboard") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Dash
                        </span>
                    </Link>
                    <Link
                        to="/investor/seek/post"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/investor/seek/post") ? "text-primary" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/investor/seek/post") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"
                                }`}
                        >
                            <PlusSquare className={`h-6 w-6 ${isActive("/investor/seek/post") ? "fill-primary/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/investor/seek/post") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Post
                        </span>
                    </Link>
                    <Link
                        to="/investor/seek/my-requests"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/investor/seek/my-requests") ? "text-primary" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/investor/seek/my-requests") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"
                                }`}
                        >
                            <FileText className={`h-6 w-6 ${isActive("/investor/seek/my-requests") ? "fill-primary/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/investor/seek/my-requests") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Requests
                        </span>
                    </Link>
                    <Link
                        to="/investor/seek/inquiries"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/investor/seek/inquiries") ? "text-primary" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/investor/seek/inquiries") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"
                                }`}
                        >
                            <MessageSquare className={`h-6 w-6 ${isActive("/investor/seek/inquiries") ? "fill-primary/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/investor/seek/inquiries") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Inbox
                        </span>
                    </Link>
                    <Link
                        to="/investor/seek/settings"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/investor/seek/settings") ? "text-primary" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/investor/seek/settings") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"
                                }`}
                        >
                            <Settings className={`h-6 w-6 ${isActive("/investor/seek/settings") ? "fill-primary/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/investor/seek/settings") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Setup
                        </span>
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default SeekLayout;
