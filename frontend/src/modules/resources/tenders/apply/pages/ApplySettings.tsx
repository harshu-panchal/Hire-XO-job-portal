import { useState } from "react";
import { Bell, Shield, Eye, CreditCard, HelpCircle, LogOut, ChevronRight, Moon, Sun, Smartphone, Mail } from "lucide-react";
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
        <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-violet-50 dark:group-hover:bg-violet-950/30 transition-colors">
            <Icon className="size-6 text-slate-600 dark:text-slate-400 group-hover:text-violet-600" />
        </div>
        <div className="flex-1 space-y-0.5">
            <h3 className="text-sm font-black tracking-tight">{label}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{description}</p>
        </div>
        <div>
            {action || <ChevronRight className="size-5 text-slate-300 group-hover:text-violet-600 transition-colors" />}
        </div>
    </div>
);

const ApplySettings = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [darkMode, setDarkMode] = useState(false);
    const [tenderAlerts, setTenderAlerts] = useState(true);

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight">App Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    Manage your preferences and security
                </p>
            </div>

            {/* Notification Sections */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-violet-600">Preferences</h2>
                <div className="space-y-3">
                    <SettingItem
                        icon={Bell}
                        label="Tender Alerts"
                        description="New tenders matching your profile"
                        action={
                            <button
                                onClick={() => setTenderAlerts(!tenderAlerts)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${tenderAlerts ? "bg-violet-600" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${tenderAlerts ? "left-7" : "left-1"}`} />
                            </button>
                        }
                    />
                    <SettingItem
                        icon={darkMode ? Moon : Sun}
                        label="Dark Mode"
                        description="Switch app appearance"
                        action={
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? "bg-violet-600" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${darkMode ? "left-7" : "left-1"}`} />
                            </button>
                        }
                    />
                </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Security & Privacy</h2>
                <div className="space-y-3">
                    <SettingItem icon={Shield} label="Account Security" description="Password and 2FA settings" />
                    <SettingItem icon={Eye} label="Visibility" description="Manage profile discoverability" />
                </div>
            </div>

            {/* Account Management */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Account</h2>
                <div className="space-y-3">
                    <SettingItem icon={CreditCard} label="Subscription" description="View and manage your plan" />
                    <SettingItem icon={Smartphone} label="Connected Devices" description="Manage your active sessions" />
                </div>
            </div>

            {/* Support Section */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Help & Support</h2>
                <div className="space-y-3">
                    <SettingItem icon={HelpCircle} label="Help Center" description="FAQs and documentation" />
                    <SettingItem icon={Mail} label="Contact Support" description="Get in touch with our team" />
                </div>
            </div>

            {/* Logout Footer */}
            <div className="pt-4 pb-8">
                <button
                    onClick={() => {
                        logout();
                        navigate("/");
                    }}
                    className="w-full p-5 rounded-[2rem] bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all border border-rose-100 dark:border-rose-900/30 shadow-lg shadow-rose-500/5"
                >
                    <LogOut className="size-5" /> Sign Out from Account
                </button>
                <p className="text-center mt-6 text-[8px] font-black uppercase tracking-widest text-slate-400">Version 2.4.0 (Stable Build)</p>
            </div>
        </div>
    );
};

export default ApplySettings;
