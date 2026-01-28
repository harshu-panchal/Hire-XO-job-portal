import { Outlet, NavLink } from "react-router-dom";
import ApplyNavbar from "../components/ApplyNavbar";
import { LayoutDashboard, Search, FileText, User, Settings } from "lucide-react";

const ApplyLayout = () => {
    const navItems = [
        { icon: LayoutDashboard, label: "Dash", path: "/tenders/apply/dashboard" },
        { icon: Search, label: "Browse", path: "/tenders/apply/tenders" },
        { icon: FileText, label: "My Bids", path: "/tenders/apply/my-bids" },
        { icon: User, label: "Me", path: "/tenders/apply/profile" },
        { icon: Settings, label: "Setup", path: "/tenders/apply/settings" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
            {/* Mobile Container */}
            <div className="w-full max-w-[430px] flex flex-col min-h-screen bg-white dark:bg-slate-900 shadow-2xl relative">
                <ApplyNavbar />

                <main className="flex-1 overflow-y-auto pb-24 px-4">
                    <Outlet />
                </main>

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 w-full max-w-[430px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? "text-violet-600 scale-110" : "text-slate-400 hover:text-slate-600"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={`size-6 ${isActive ? "fill-violet-600/10" : ""}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                    {isActive && <span className="absolute -bottom-1 size-1 bg-violet-600 rounded-full" />}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default ApplyLayout;
