import { motion } from "framer-motion";
import { Bell, User, Menu, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

interface AdminHeaderProps {
    title: string;
    onMenuClick: () => void;
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="h-16 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40 px-6 lg:px-8 flex items-center justify-between w-full transition-all duration-300">
            <div className="flex items-center gap-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onMenuClick}
                    className="lg:hidden p-2.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white"
                >
                    <Menu className="w-5 h-5" />
                </motion.button>
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-white/50">
                        Admin Dashboard
                    </p>
                </div>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="p-2.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-all relative"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
                </motion.button>

                <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/10">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Admin</p>
                        <p className="text-xs text-slate-500 dark:text-white/50">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
