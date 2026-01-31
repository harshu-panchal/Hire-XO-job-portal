import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar } from "../modules/admin/components/AdminSidebar";
import { AdminHeader } from "../modules/admin/components/AdminHeader";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const getTitle = (path: string) => {
        const segments = path.split("/");
        const segment = segments.pop();
        if (!segment || segment === "admin") return "Dashboard";

        if (segments.includes("resources")) {
            return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        }

        return segment
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300 font-sans">
            {/* Desktop Sidebar (Persistent) */}
            <aside className="hidden lg:flex w-[280px] flex-shrink-0">
                <AdminSidebar />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-[280px] z-[110] lg:hidden shadow-xl"
                        >
                            <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative h-full">
                {/* Mobile/Desktop Header */}
                <AdminHeader
                    title={getTitle(location.pathname)}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="p-6 lg:p-8"
                        >
                            <div className="max-w-7xl mx-auto">
                                <Outlet />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Mobile Bottom Nav */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 px-4 py-3 flex items-center justify-center z-40">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium text-sm"
                    >
                        <Menu className="w-5 h-5" />
                        Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
