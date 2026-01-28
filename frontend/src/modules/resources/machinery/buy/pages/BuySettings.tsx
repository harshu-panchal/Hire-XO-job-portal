import { useState } from "react";
import { Bell, Shield, CreditCard, LifeBuoy, LogOut, ChevronRight, UserRoundPen, History, Zap } from "lucide-react";
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
        <div className="size-12 rounded-2xl bg-amber-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-950/30 transition-colors">
            <Icon className="size-6 text-slate-600 dark:text-slate-400 group-hover:text-amber-600" />
        </div>
        <div className="flex-1 space-y-0.5">
            <h3 className="text-sm font-black tracking-tight leading-none uppercase">{label}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{description}</p>
        </div>
        <div>
            {action || <ChevronRight className="size-5 text-slate-300 group-hover:text-amber-600 transition-colors" />}
        </div>
    </div>
);

const BuySettings = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [alerts, setAlerts] = useState(true);
    const [highPriority, setHighPriority] = useState(false);

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tighter uppercase italic">Buyer Console</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest leading-none">
                    Configure your procurement dashboard
                </p>
            </div>

            {/* Notification Section */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-amber-600">Preferences</h2>
                <div className="space-y-3">
                    <SettingItem
                        icon={Bell}
                        label="Market Alerts"
                        description="New machinery listings near you"
                        action={
                            <button
                                onClick={() => setAlerts(!alerts)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${alerts ? "bg-amber-600" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${alerts ? "left-7" : "left-1"}`} />
                            </button>
                        }
                    />
                    <SettingItem
                        icon={Zap}
                        label="Priority Deals"
                        description="Flash sales and deep discounts"
                        action={
                            <button
                                onClick={() => setHighPriority(!highPriority)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${highPriority ? "bg-amber-600" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${highPriority ? "left-7" : "left-1"}`} />
                            </button>
                        }
                    />
                </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Account</h2>
                <div className="space-y-3">
                    <SettingItem icon={UserRoundPen} label="Buyer Verification" description="Manage enterprise credentials" />
                    <SettingItem icon={Shield} label="Security" description="Passwords and 2FA" />
                    <SettingItem icon={History} label="Audit History" description="Recent marketplace activity" />
                </div>
            </div>

            {/* Billing & Support */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Billing</h2>
                <div className="space-y-3">
                    <SettingItem icon={CreditCard} label="Payment Methods" description="Bank accounts and cards" />
                    <SettingItem icon={LifeBuoy} label="Pro Help Desk" description="Dedicated manager assistance" />
                </div>
            </div>

            {/* Power Controls */}
            <div className="pt-4 pb-8 space-y-6">
                <button
                    onClick={() => {
                        logout();
                        navigate("/");
                    }}
                    className="w-full p-5 rounded-[2.5rem] bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all border border-rose-100 dark:border-rose-900/30 shadow-lg shadow-rose-500/5"
                >
                    <LogOut className="size-5" /> Deactivate Buyer Mode
                </button>
                <div className="text-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700">Market Version 2.4.0 (Enterprise)</p>
                </div>
            </div>
        </div>
    );
};

export default BuySettings;
