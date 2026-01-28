import { useState } from "react";
import { Bell, Shield, Palette, CreditCard, LifeBuoy, LogOut, ChevronRight, Moon, Key, Users, Clock } from "lucide-react";

interface SettingItemProps {
    icon: any;
    label: string;
    description: string;
    action?: React.ReactNode;
}

const SettingItem = ({ icon: Icon, label, description, action }: SettingItemProps) => (
    <div className="flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm group">
        <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/30 transition-colors">
            <Icon className="size-6 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600" />
        </div>
        <div className="flex-1 space-y-0.5">
            <h3 className="text-sm font-black tracking-tight">{label}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{description}</p>
        </div>
        <div>
            {action || <ChevronRight className="size-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />}
        </div>
    </div>
);

const ProvideSettings = () => {
    const [bidAlerts, setBidAlerts] = useState(true);
    const [extensionEnabled, setExtensionEnabled] = useState(false);

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight">Management Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    Configure your provider experience and security
                </p>
            </div>

            {/* Notification & Operations */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Operational Preferences</h2>
                <div className="space-y-3">
                    <SettingItem
                        icon={Bell}
                        label="Bid Alerts"
                        description="Instant notified on new bid submissions"
                        action={
                            <button
                                onClick={() => setBidAlerts(!bidAlerts)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${bidAlerts ? "bg-indigo-600" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${bidAlerts ? "left-7" : "left-1"}`} />
                            </button>
                        }
                    />
                    <SettingItem
                        icon={Clock}
                        label="Auto-Extension"
                        description="Extend deadline on last-minute bids"
                        action={
                            <button
                                onClick={() => setExtensionEnabled(!extensionEnabled)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${extensionEnabled ? "bg-indigo-600" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${extensionEnabled ? "left-7" : "left-1"}`} />
                            </button>
                        }
                    />
                </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Security & Access</h2>
                <div className="space-y-3">
                    <SettingItem icon={Key} label="API Keys" description="Access credentials for integration" />
                    <SettingItem icon={Users} label="Authorized Personnel" description="Manage sub-accounts and permissions" />
                    <SettingItem icon={Shield} label="Account Security" description="Authentication and 2FA settings" />
                </div>
            </div>

            {/* Appearance Section */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Personalization</h2>
                <div className="space-y-3">
                    <SettingItem icon={Palette} label="Theme Settings" description="Customize dashboard appearance" />
                    <SettingItem icon={Moon} label="Dark Mode" description="Switch between light and dark" />
                </div>
            </div>

            {/* Support & Billing */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Support</h2>
                <div className="space-y-3">
                    <SettingItem icon={CreditCard} label="Billing & Plan" description="Manage your organization subscription" />
                    <SettingItem icon={LifeBuoy} label="Help & Resources" description="Documentation and support tickets" />
                </div>
            </div>

            {/* Sign Out */}
            <div className="pt-4 pb-8">
                <button className="w-full p-5 rounded-[2rem] bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all border border-rose-100 dark:border-rose-900/30 shadow-lg shadow-rose-500/5">
                    <LogOut className="size-5" /> Sign Out from Authority Account
                </button>
                <div className="flex items-center justify-center gap-2 mt-6 opacity-30">
                    <div className="size-1 rounded-full bg-slate-400" />
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Authority Panel v2.4.0</p>
                    <div className="size-1 rounded-full bg-slate-400" />
                </div>
            </div>
        </div>
    );
};

export default ProvideSettings;
