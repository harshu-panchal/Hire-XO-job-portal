import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Search, Briefcase, User, Settings } from "lucide-react";
import { BrowseNavbar } from "../components/BrowseNavbar";

const BrowseLayout = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto overflow-x-hidden border-x border-gray-100 dark:border-white/5 shadow-2xl bg-slate-50 dark:bg-background transition-colors duration-300">
            {/* Header */}
            <BrowseNavbar />

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
                        to="/vehicles/browse/dashboard"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/vehicles/browse/dashboard") ? "text-cyan-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/vehicles/browse/dashboard") ? "bg-cyan-600/10 scale-110 shadow-lg shadow-cyan-600/5" : "bg-transparent"
                                }`}
                        >
                            <LayoutDashboard className={`h-6 w-6 ${isActive("/vehicles/browse/dashboard") ? "fill-cyan-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/vehicles/browse/dashboard") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Dash
                        </span>
                    </Link>
                    <Link
                        to="/vehicles/browse/list"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/vehicles/browse/list") ? "text-cyan-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/vehicles/browse/list") ? "bg-cyan-600/10 scale-110 shadow-lg shadow-cyan-600/5" : "bg-transparent"
                                }`}
                        >
                            <Search className={`h-6 w-6 ${isActive("/vehicles/browse/list") ? "fill-cyan-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/vehicles/browse/list") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Rent
                        </span>
                    </Link>
                    <Link
                        to="/vehicles/browse/my-rentals"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/vehicles/browse/my-rentals") ? "text-cyan-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/vehicles/browse/my-rentals") ? "bg-cyan-600/10 scale-110 shadow-lg shadow-cyan-600/5" : "bg-transparent"
                                }`}
                        >
                            <Briefcase className={`h-6 w-6 ${isActive("/vehicles/browse/my-rentals") ? "fill-cyan-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/vehicles/browse/my-rentals") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Booked
                        </span>
                    </Link>
                    <Link
                        to="/vehicles/browse/profile"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/vehicles/browse/profile") ? "text-cyan-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/vehicles/browse/profile") ? "bg-cyan-600/10 scale-110 shadow-lg shadow-cyan-600/5" : "bg-transparent"
                                }`}
                        >
                            <User className={`h-6 w-6 ${isActive("/vehicles/browse/profile") ? "fill-cyan-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/vehicles/browse/profile") ? "opacity-100" : "opacity-40"
                                }`}
                        >
                            Me
                        </span>
                    </Link>
                    <Link
                        to="/vehicles/browse/settings"
                        className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/vehicles/browse/settings") ? "text-cyan-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/vehicles/browse/settings") ? "bg-cyan-600/10 scale-110 shadow-lg shadow-cyan-600/5" : "bg-transparent"
                                }`}
                        >
                            <Settings className={`h-6 w-6 ${isActive("/vehicles/browse/settings") ? "fill-cyan-600/20" : ""}`} />
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/vehicles/browse/settings") ? "opacity-100" : "opacity-40"
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

export default BrowseLayout;
