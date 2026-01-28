import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, List, MessageSquare, Settings } from "lucide-react";
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
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 dark:bg-background/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/5 z-50 px-6 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)] select-none">
                <div className="flex justify-between items-center h-20">
                    <Link
                        to="/csm/provide/dashboard"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/csm/provide/dashboard") ? "text-rose-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/csm/provide/dashboard") ? "bg-rose-600/10 scale-110 shadow-lg shadow-rose-600/5" : "bg-transparent"
                                }`}
                        >
                            <LayoutDashboard className={`h-6 w-6 ${isActive("/csm/provide/dashboard") ? "fill-rose-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[9px] font-black uppercase tracking-widest ${isActive("/csm/provide/dashboard") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Dash
                        </span>
                    </Link>
                    <Link
                        to="/csm/provide/post"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/csm/provide/post") ? "text-rose-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/csm/provide/post") ? "bg-rose-600/10 scale-110 shadow-lg shadow-rose-600/5" : "bg-transparent"
                                }`}
                        >
                            <PlusCircle className={`h-6 w-6 ${isActive("/csm/provide/post") ? "fill-rose-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[9px] font-black uppercase tracking-widest ${isActive("/csm/provide/post") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Post
                        </span>
                    </Link>
                    <Link
                        to="/csm/provide/my-services"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/csm/provide/my-services") ? "text-rose-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/csm/provide/my-services") ? "bg-rose-600/10 scale-110 shadow-lg shadow-rose-600/5" : "bg-transparent"
                                }`}
                        >
                            <List className={`h-6 w-6 ${isActive("/csm/provide/my-services") ? "fill-rose-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[9px] font-black uppercase tracking-widest ${isActive("/csm/provide/my-services") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            List
                        </span>
                    </Link>
                    <Link
                        to="/csm/provide/inquiries"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/csm/provide/inquiries") ? "text-rose-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/csm/provide/inquiries") ? "bg-rose-600/10 scale-110 shadow-lg shadow-rose-600/5" : "bg-transparent"
                                }`}
                        >
                            <MessageSquare className={`h-6 w-6 ${isActive("/csm/provide/inquiries") ? "fill-rose-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[9px] font-black uppercase tracking-widest ${isActive("/csm/provide/inquiries") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Chat
                        </span>
                    </Link>
                    <Link
                        to="/csm/provide/settings"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/csm/provide/settings") || isActive("/csm/provide/profile") ? "text-rose-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/csm/provide/settings") || isActive("/csm/provide/profile") ? "bg-rose-600/10 scale-110 shadow-lg shadow-rose-600/5" : "bg-transparent"
                                }`}
                        >
                            <Settings className={`h-6 w-6 ${isActive("/csm/provide/settings") || isActive("/csm/provide/profile") ? "fill-rose-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[9px] font-black uppercase tracking-widest ${isActive("/csm/provide/settings") || isActive("/csm/provide/profile") ? "opacity-100" : "opacity-40"
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
