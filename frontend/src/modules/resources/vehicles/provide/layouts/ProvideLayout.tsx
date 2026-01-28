import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusSquare, FileText, MessageSquare, Settings } from "lucide-react";
import { ProvideNavbar } from "../components/ProvideNavbar";

const ProvideLayout = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto overflow-x-hidden border-x border-gray-100 dark:border-white/5 shadow-2xl bg-slate-50 dark:bg-background transition-colors duration-300">
            {/* Header */}
            <ProvideNavbar />

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
                        to="/vehicles/provide/dashboard"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/vehicles/provide/dashboard") ? "text-blue-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/vehicles/provide/dashboard") ? "bg-blue-600/10 scale-110 shadow-lg shadow-blue-600/5" : "bg-transparent"
                                }`}
                        >
                            <LayoutDashboard className={`h-6 w-6 ${isActive("/vehicles/provide/dashboard") ? "fill-blue-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/vehicles/provide/dashboard") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Dash
                        </span>
                    </Link>
                    <Link
                        to="/vehicles/provide/post"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/vehicles/provide/post") ? "text-blue-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/vehicles/provide/post") ? "bg-blue-600/10 scale-110 shadow-lg shadow-blue-600/5" : "bg-transparent"
                                }`}
                        >
                            <PlusSquare className={`h-6 w-6 ${isActive("/vehicles/provide/post") ? "fill-blue-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/vehicles/provide/post") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Post
                        </span>
                    </Link>
                    <Link
                        to="/vehicles/provide/my-vehicles"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/vehicles/provide/my-vehicles") ? "text-blue-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/vehicles/provide/my-vehicles") ? "bg-blue-600/10 scale-110 shadow-lg shadow-blue-600/5" : "bg-transparent"
                                }`}
                        >
                            <FileText className={`h-6 w-6 ${isActive("/vehicles/provide/my-vehicles") ? "fill-blue-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/vehicles/provide/my-vehicles") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Fleet
                        </span>
                    </Link>
                    <Link
                        to="/vehicles/provide/inquiries"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/vehicles/provide/inquiries") ? "text-blue-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/vehicles/provide/inquiries") ? "bg-blue-600/10 scale-110 shadow-lg shadow-blue-600/5" : "bg-transparent"
                                }`}
                        >
                            <MessageSquare className={`h-6 w-6 ${isActive("/vehicles/provide/inquiries") ? "fill-blue-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/vehicles/provide/inquiries") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Inbox
                        </span>
                    </Link>
                    <Link
                        to="/vehicles/provide/settings"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/vehicles/provide/settings") ? "text-blue-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/vehicles/provide/settings") ? "bg-blue-600/10 scale-110 shadow-lg shadow-blue-600/5" : "bg-transparent"
                                }`}
                        >
                            <Settings className={`h-6 w-6 ${isActive("/vehicles/provide/settings") ? "fill-blue-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/vehicles/provide/settings") ? "opacity-100" : "opacity-40"
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

export default ProvideLayout;
