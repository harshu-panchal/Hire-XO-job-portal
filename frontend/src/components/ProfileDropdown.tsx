import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, ChevronRight, Award } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

interface ProfileDropdownProps {
    loginPath?: string;
}

export const ProfileDropdown = ({ loginPath = "/login/employee" }: ProfileDropdownProps) => {
    const { user, logout, isAuthenticated } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "G";

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
        navigate("/");
    };

    const isEmployer = user?.role === "employer";
    const settingsPath = isEmployer ? "/employer/settings" : "/settings";
    const promotionsPath = user?.role === "employee" ? "/payments" : "/employer/promotions";

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`size-12 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 active:scale-90 border ${isOpen
                    ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
            >
                {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="size-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <User className={`size-5 ${isAuthenticated ? "text-primary" : "text-slate-400"}`} />
                    </div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute right-0 mt-4 w-72 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[100] p-2"
                    >
                        {isAuthenticated ? (
                            <>
                                {/* Header / Profile Info */}
                                <div className="p-4 flex items-center gap-3 bg-slate-50/50 rounded-2xl mb-2">
                                    <div className="size-12 rounded-xl bg-primary flex items-center justify-center overflow-hidden shadow-lg shadow-primary/20">
                                        {user?.profilePhoto ? (
                                            <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sm font-black text-white">{initials}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="font-black text-slate-900 truncate leading-tight">{user?.name}</h3>
                                        <p className="text-[10px] text-slate-500 truncate font-black uppercase tracking-wider mt-0.5">{user?.role}</p>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="space-y-1">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all group"
                                    >
                                        <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <User className="size-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900 leading-none">My Profile</p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-1">Manage your details</p>
                                        </div>
                                        <ChevronRight className="size-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    {/* Promotions Link - Only for Employer/Recruiter if needed, but here simple link */}
                                    <Link
                                        to={promotionsPath}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all group"
                                    >
                                        <div className="size-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-megaphone"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900 leading-none">Promotions</p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-1">Boost your visibility</p>
                                        </div>
                                        <ChevronRight className="size-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    {isEmployer && (
                                        <Link
                                            to="/employer/certificates"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all group"
                                        >
                                            <div className="size-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                                <Award className="size-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-900 leading-none">Certificates</p>
                                                <p className="text-[10px] text-slate-400 font-medium mt-1">View and download issued certificates</p>
                                            </div>
                                            <ChevronRight className="size-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    )}

                                    <Link
                                        to={settingsPath}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all group"
                                    >
                                        <div className="size-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                                            <Settings className="size-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900 leading-none">Settings</p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-1">Privacy & security</p>
                                        </div>
                                        <ChevronRight className="size-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    <div className="h-px bg-slate-100 mx-2 my-2" />

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 transition-all group w-full text-left"
                                    >
                                        <div className="size-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                            <LogOut className="size-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-red-600 leading-none">Logout</p>
                                            <p className="text-[10px] text-red-400 font-medium mt-1">Sign out of session</p>
                                        </div>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="p-4 space-y-4">
                                <div className="text-center space-y-1 py-2">
                                    <h3 className="font-black text-slate-900">Welcome Guest</h3>
                                    <p className="text-xs text-slate-500 font-medium">Please login to access your account</p>
                                </div>
                                <Link
                                    to={loginPath}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full h-12 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                                >
                                    <LogOut className="size-4 rotate-180" />
                                    <span>Login Now</span>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
