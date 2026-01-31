import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    ReceiptText,
    BarChart3,
    Settings,
    LogOut,
    X,
    DollarSign,
    Briefcase,
    ArrowUpRight,
    Car,
    HardHat,
    ChevronDown,
    Layers,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Recruiters", path: "/admin/recruiters" },
    { icon: CreditCard, label: "Job Seeker Plans", path: "/admin/job-seeker-plans" },
    { icon: CreditCard, label: "Recruiter Plans", path: "/admin/recruiter-plans" },
    { icon: BarChart3, label: "Reports", path: "/admin/reports" },
    { icon: Shield, label: "Certificates", path: "/admin/certificates" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const resourceItems = [
    { icon: DollarSign, label: "Investment", path: "/admin/resources/investors" },
    { icon: ReceiptText, label: "Tenders", path: "/admin/resources/tenders" },
    { icon: Briefcase, label: "PMC", path: "/admin/resources/pmc" },
    { icon: Settings, label: "Machinery", path: "/admin/resources/machinery" },
    { icon: Users, label: "CSM", path: "/admin/resources/csm" },
    { icon: ArrowUpRight, label: "Logistics", path: "/admin/resources/logistics" },
    { icon: Car, label: "Vehicles", path: "/admin/resources/vehicles" },
    { icon: HardHat, label: "Equipments", path: "/admin/resources/equipments" },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
        },
    },
} as const;

const itemVariants: Variants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 400, damping: 30 }
    },
} as const;

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-full border-r border-slate-200 dark:border-white/10 transition-all duration-300">
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Hire-XO</h1>
                        <span className="text-xs text-primary font-medium">Admin Panel</span>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <div className="space-y-1">
                        <p className="px-3 text-xs font-medium text-slate-400 dark:text-white/40 mb-3">Main Menu</p>
                        {menuItems.map((item) => (
                            <motion.div key={item.path} variants={itemVariants}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === "/admin"}
                                    onClick={onClose}
                                    className={({ isActive }: { isActive: boolean }) =>
                                        cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                                            isActive
                                                ? "bg-primary text-white"
                                                : "text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                                        )
                                    }
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </NavLink>
                            </motion.div>
                        ))}
                    </div>

                    <div className="space-y-1">
                        <p className="px-3 text-xs font-medium text-slate-400 dark:text-white/40 mb-3">Resources</p>
                        <motion.div variants={itemVariants}>
                            <button
                                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                                className={cn(
                                    "flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200",
                                    isResourcesOpen
                                        ? "bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white"
                                        : "text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Layers className="w-5 h-5" />
                                    <span className="text-sm font-medium">All Resources</span>
                                </div>
                                <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isResourcesOpen && "rotate-180")} />
                            </button>
                        </motion.div>

                        <AnimatePresence>
                            {isResourcesOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pl-4 space-y-0.5 pt-1">
                                        {resourceItems.map((item) => (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                onClick={onClose}
                                                className={({ isActive }: { isActive: boolean }) =>
                                                    cn(
                                                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                                                        isActive
                                                            ? "text-primary bg-primary/5 font-medium"
                                                            : "text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                                                    )
                                                }
                                            >
                                                <item.icon className="w-4 h-4" />
                                                <span className="text-sm">{item.label}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-600 dark:text-white/60 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
