import { useState } from "react";
import { Bell, Shield, CreditCard, LifeBuoy, LogOut, ChevronRight, Moon, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

interface SettingItemProps {
    icon: any;
    label: string;
    description: string;
    action?: React.ReactNode;
}

const SettingItem = ({ icon: Icon, label, description, action }: SettingItemProps) => (
    <div className="flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm group">
        <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/30 transition-colors">
            <Icon className="size-6 text-slate-600 dark:text-slate-400 group-hover:text-emerald-600" />
        </div>
        <div className="flex-1 space-y-0.5">
            <h3 className="text-sm font-black tracking-tight leading-none">{label}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{description}</p>
        </div>
        <div>
            {action || <ChevronRight className="size-5 text-slate-300 group-hover:text-emerald-600 transition-colors" />}
        </div>
    </div>
);

const RentSettings = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight leading-none">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    Manage your rental preferences and account
                </p>
            </div>

            {/* Notification Section */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Preferences</h2>
                <div className="space-y-3">
                    <SettingItem
                        icon={Bell}
                        label="Equipment Alerts"
                        description="New gear available near you"
                        action={
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? "bg-emerald-600" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${notifications ? "left-7" : "left-1"}`} />
                            </button>
                        }
                    />
                    <SettingItem
                        icon={Moon}
                        label="Dark Appearance"
                        description="Adjust the interface vibe"
                        action={
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? "bg-emerald-600" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${darkMode ? "left-7" : "left-1"}`} />
                            </button>
                        }
                    />
                </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Security</h2>
                <div className="space-y-3">
                    <SettingItem icon={Shield} label="Account Security" description="Password and 2FA settings" />
                    <SettingItem icon={AlertTriangle} label="Privacy Controls" description="Manage data visibility" />
                </div>
            </div>

            {/* Billing & Support */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Support</h2>
                <div className="space-y-3">
                    <SettingItem icon={CreditCard} label="Payment Methods" description="Manage your cards and transfers" />
                    <SettingItem icon={LifeBuoy} label="Help Center" description="FAQs and support tickets" />
                </div>
            </div>

            {/* Sign Out */}
            <div className="pt-4 pb-8">
                <button
                    onClick={() => {
                        logout();
                        navigate("/");
                    }}
                    className="w-full p-5 rounded-[2.5rem] bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all border border-rose-100 dark:border-rose-900/30 shadow-lg shadow-rose-500/5"
                >
                    <LogOut className="size-5" /> Deactivate Rental Mode
                </button>
                <div className="flex items-center justify-center gap-2 mt-6 opacity-30 cursor-default">
                    <div className="size-1 rounded-full bg-slate-400" />
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Hire XO Gear v1.0.2</p>
                    <div className="size-1 rounded-full bg-slate-400" />
                </div>
            </div>
        </div>
    );
};

export default RentSettings;
