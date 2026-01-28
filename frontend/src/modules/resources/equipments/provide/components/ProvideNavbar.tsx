import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Package, User, Settings } from "lucide-react";

const ProvideNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/equipments/provide/dashboard" },
        { icon: PlusCircle, label: "Post", path: "/equipments/provide/post" },
        { icon: Package, label: "Inventory", path: "/equipments/provide/my-equipments" },
        { icon: User, label: "Profile", path: "/equipments/provide/profile" },
        { icon: Settings, label: "Settings", path: "/equipments/provide/settings" },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/5 px-6 py-3 z-50 flex justify-center">
            <div className="w-full max-w-[430px] flex justify-between items-center">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center gap-1 transition-all ${isActive(item.path)
                                ? "text-blue-600 scale-110"
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            }`}
                    >
                        <item.icon className="size-5" strokeWidth={isActive(item.path) ? 2.5 : 2} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default ProvideNavbar;
