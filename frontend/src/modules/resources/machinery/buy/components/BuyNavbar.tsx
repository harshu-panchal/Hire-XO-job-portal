import { Home, Search, Package, User, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BuyNavbar = () => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: "Home", path: "/machinery/buy/dashboard" },
        { icon: Search, label: "Market", path: "/machinery/buy/list" },
        { icon: Package, label: "My Orders", path: "/machinery/buy/my-orders" },
        { icon: User, label: "Profile", path: "/machinery/buy/profile" },
        { icon: Settings, label: "Settings", path: "/machinery/buy/settings" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 px-6 py-3 z-50">
            <div className="max-w-[430px] mx-auto flex justify-between items-center">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? "text-amber-600 scale-110" : "text-slate-400"
                                }`}
                        >
                            <item.icon className={`size-5 ${isActive ? "fill-amber-600/10" : ""}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                            {isActive && (
                                <div className="absolute -top-3 size-1 rounded-full bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BuyNavbar;
