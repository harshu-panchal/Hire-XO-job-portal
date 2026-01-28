import { useState } from "react";
import { Shield, CreditCard, LogOut, ChevronRight, UserRoundPen, History, Settings2, BarChart3, Globe } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

interface SettingItemProps {
    icon: any;
    label: string;
    description: string;
    action?: React.ReactNode;
}

const SettingItem = ({ icon: Icon, label, description, action }: SettingItemProps) => (
    <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-white border border-slate-200 group active:bg-slate-50 transition-colors shadow-sm">
        <div className="size-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-slate-100 group-hover:border-indigo-200 transition-all">
            <Icon className="size-6 text-slate-400 group-hover:text-indigo-600" />
        </div>
        <div className="flex-1 space-y-0.5 min-w-0">
            <h3 className="text-xs font-black tracking-tight leading-none uppercase italic text-slate-700">{label}</h3>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1 truncate">{description}</p>
        </div>
        <div>
            {action || <ChevronRight className="size-4 text-slate-300 group-hover:text-indigo-600" />}
        </div>
    </div>
);

const SellSettings = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [presence, setPresence] = useState(true);
    const [analytics, setAnalytics] = useState(true);

    return (
        <div className="py-6 space-y-8 select-none bg-slate-50 min-h-screen text-slate-900">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Console Settings</h1>
                <p className="text-indigo-600 font-black text-[9px] uppercase tracking-[0.4em] leading-none">
                    Operational Controls & Preferences
                </p>
            </div>

            {/* Merchant Control */}
            <div className="space-y-4">
                <h2 className="px-2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 italic">Merchant Status</h2>
                <div className="space-y-3">
                    <SettingItem
                        icon={Globe}
                        label="Market Presence"
                        description="Show your listings to global buyers"
                        action={
                            <button
                                onClick={() => setPresence(!presence)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${presence ? "bg-indigo-600" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${presence ? "left-7" : "left-1"}`} />
                            </button>
                        }
                    />
                    <SettingItem
                        icon={BarChart3}
                        label="Public Analytics"
                        description="Display sales performance on profile"
                        action={
                            <button
                                onClick={() => setAnalytics(!analytics)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${analytics ? "bg-indigo-600" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${analytics ? "left-7" : "left-1"}`} />
                            </button>
                        }
                    />
                </div>
            </div>

            {/* Governance */}
            <div className="space-y-4">
                <h2 className="px-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Governance</h2>
                <div className="space-y-3">
                    <SettingItem icon={UserRoundPen} label="KYC Documents" description="Manage merchant credentials" />
                    <SettingItem icon={Shield} label="Security Core" description="Protected 2FA & Login Vault" />
                    <SettingItem icon={History} label="Audit Logs" description="Listing & Inquiry history" />
                </div>
            </div>

            {/* Finance */}
            <div className="space-y-4">
                <h2 className="px-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Finance</h2>
                <div className="space-y-3">
                    <SettingItem icon={CreditCard} label="Settlement Account" description="Bank details for asset sales" />
                    <SettingItem icon={Settings2} label="Listing Fees" description="Subscription and per-listing costs" />
                </div>
            </div>

            {/* Power Controls */}
            <div className="pt-4 pb-8 space-y-6">
                <button
                    onClick={() => {
                        logout();
                        navigate("/");
                    }}
                    className="w-full p-5 rounded-[2rem] bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-all border border-rose-100 shadow-sm"
                >
                    <LogOut className="size-5" /> Deactivate Seller ID
                </button>
                <div className="text-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-300">CONS.VER 4.81.0-PRO</p>
                </div>
            </div>
        </div>
    );
};

export default SellSettings;
