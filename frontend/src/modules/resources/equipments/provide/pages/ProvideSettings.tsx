import { useState } from "react";
import { Bell, Shield, Palette, CreditCard, LifeBuoy, LogOut, ChevronRight, Key, Zap, History } from "lucide-react";
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
        <div className="size-12 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-950/30 transition-colors shrink-0">
            <Icon className="size-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600" />
        </div>
        <div className="flex-1 space-y-0.5 min-w-0">
            <h3 className="text-sm font-black tracking-tight truncate leading-none">{label}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate mt-1">{description}</p>
        </div>
        <div>
            {action || <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-600 transition-colors" />}
        </div>
    </div>
);

const ProvideSettings = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [alerts, setAlerts] = useState(true);
    const [autoResponse, setAutoResponse] = useState(false);

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight uppercase italic italic underline decoration-blue-500 underline-offset-8">Authority Console</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest mt-4">
                    Operation controls and business configuration
                </p>
            </div>

            {/* Operational Section */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-blue-600">Operations</h2>
                <div className="space-y-3">
                    <SettingItem
                        icon={Bell}
                        label="Inquiry Notifications"
                        description="Real-time alerts for rent requests"
                        action={
                            <button
                                onClick={() => setAlerts(!alerts)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${alerts ? "bg-blue-600" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${alerts ? "left-7" : "left-1"}`} />
                            </button>
                        }
                    />
                    <SettingItem
                        icon={Zap}
                        label="Quick Reply"
                        description="Auto-acknowledge new inquiries"
                        action={
                            <button
                                onClick={() => setAutoResponse(!autoResponse)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${autoResponse ? "bg-blue-600" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${autoResponse ? "left-7" : "left-1"}`} />
                            </button>
                        }
                    />
                </div>
            </div>

            {/* Security & Data */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Security & Organization</h2>
                <div className="space-y-3">
                    <SettingItem icon={Key} label="Access Permissions" description="Manage sub-users and staff" />
                    <SettingItem icon={History} label="Audit Logs" description="Track all listing changes" />
                    <SettingItem icon={Shield} label="Business Security" description="Authentication and recovery" />
                </div>
            </div>

            {/* Platform Settings */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Platform Experience</h2>
                <div className="space-y-3">
                    <SettingItem icon={CreditCard} label="Bank Accounts" description="Payout and deposit configuration" />
                    <SettingItem icon={Palette} label="Branding" description="Control how your profile looks" />
                    <SettingItem icon={LifeBuoy} label="Concierge Support" description="Dedicated manager assistance" />
                </div>
            </div>

            {/* Sign Out */}
            <div className="pt-4 pb-8 text-center space-y-6">
                <button
                    onClick={() => {
                        logout();
                        navigate("/");
                    }}
                    className="w-full p-5 rounded-[2.5rem] bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all border border-rose-100 dark:border-rose-900/30 shadow-lg shadow-rose-500/5"
                >
                    <LogOut className="size-5" /> Sign Out Authority
                </button>
                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-300 dark:text-slate-700">Enterprise Edition v4.0.0</p>
            </div>
        </div>
    );
};

export default ProvideSettings;
