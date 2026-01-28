import { LayoutDashboard, PlusCircle, Box, MessageSquare, User, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const SellNavbar = () => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: "Console", path: "/machinery/sell/dashboard" },
        { icon: PlusCircle, label: "List", path: "/machinery/sell/post" },
        { icon: Box, label: "Inventory", path: "/machinery/sell/inventory" },
        { icon: MessageSquare, label: "Inquiries", path: "/machinery/sell/inquiries" },
        { icon: User, label: "Profile", path: "/machinery/sell/profile" },
        { icon: Settings, label: "Settings", path: "/machinery/sell/settings" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="max-w-[430px] mx-auto flex justify-between items-center">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? "text-indigo-600 scale-110" : "text-slate-400"
                                }`}
                        >
                            <item.icon className={`size-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                            {isActive && (
                                <div className="absolute -top-3 size-1.5 rounded-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default SellNavbar;
