import { Bell, Lock, Moon, Globe, HelpCircle, LogOut, ChevronRight, Shield, CreditCard } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const BrowseSettings = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="px-1">
                <h1 className="text-3xl font-black tracking-tight">
                    Settings <span className="text-primary">&</span> Preferences
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest mt-1">
                    Manage your account settings
                </p>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-black tracking-tight mb-4">Notifications</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Bell className="size-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-black">New Opportunities</p>
                                <p className="text-xs text-slate-500">Get notified about new investment opportunities</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <Bell className="size-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-black">Investment Updates</p>
                                <p className="text-xs text-slate-500">Updates from your active investments</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <Bell className="size-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-black">Email Notifications</p>
                                <p className="text-xs text-slate-500">Receive email updates</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-black tracking-tight mb-4">Appearance</h2>
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 active:scale-95 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <Moon className="size-5 text-slate-600 dark:text-slate-300" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-black">Dark Mode</p>
                            <p className="text-xs text-slate-500">Toggle dark/light theme</p>
                        </div>
                    </div>
                    <ChevronRight className="size-5 text-slate-400" />
                </button>
            </div>

            {/* Account & Security */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-black tracking-tight mb-4">Account & Security</h2>
                <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 active:scale-95 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Lock className="size-5 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black">Change Password</p>
                                <p className="text-xs text-slate-500">Update your password</p>
                            </div>
                        </div>
                        <ChevronRight className="size-5 text-slate-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 active:scale-95 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <Shield className="size-5 text-emerald-600" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black">Two-Factor Authentication</p>
                                <p className="text-xs text-slate-500">Add extra security</p>
                            </div>
                        </div>
                        <ChevronRight className="size-5 text-slate-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 active:scale-95 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <CreditCard className="size-5 text-purple-600" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-black">Payment Methods</p>
                                <p className="text-xs text-slate-500">Manage payment options</p>
                            </div>
                        </div>
                        <ChevronRight className="size-5 text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-black tracking-tight mb-4">Preferences</h2>
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 active:scale-95 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Globe className="size-5 text-amber-600" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-black">Language & Region</p>
                            <p className="text-xs text-slate-500">English (India)</p>
                        </div>
                    </div>
                    <ChevronRight className="size-5 text-slate-400" />
                </button>
            </div>

            {/* Support */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-black tracking-tight mb-4">Support</h2>
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 active:scale-95 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            <HelpCircle className="size-5 text-cyan-600" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-black">Help & Support</p>
                            <p className="text-xs text-slate-500">Get help or contact us</p>
                        </div>
                    </div>
                    <ChevronRight className="size-5 text-slate-400" />
                </button>
            </div>

            {/* Logout */}
            <button
                onClick={() => {
                    logout();
                    navigate("/");
                }}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-[1.5rem] bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-600 font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
            >
                <LogOut className="size-5" />
                <span>Logout</span>
            </button>

            {/* Version */}
            <div className="text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Version 1.0.0</p>
            </div>
        </div>
    );
};

export default BrowseSettings;
