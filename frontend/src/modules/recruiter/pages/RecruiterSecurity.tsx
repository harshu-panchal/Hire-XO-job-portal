import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronLeft,
    ShieldCheck,
    Lock,
    Eye,
    EyeOff,
    Smartphone,
    ChevronRight
} from "lucide-react";

const RecruiterSecurity = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);

    const devices = [
        { id: 1, name: "iPhone 15 Pro", location: "Bengaluru, IN", status: "Current Device", active: true },
        { id: 2, name: "MacBook Pro M3", location: "Bengaluru, IN", status: "Active 2h ago", active: false },
    ];

    return (
        <div className="pb-32 select-none">
            {/* Header */}
            <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 -mx-5 px-5">
                <button
                    onClick={() => navigate(-1)}
                    className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all"
                >
                    <ChevronLeft className="size-6" />
                </button>
                <h2 className="text-sm font-black uppercase tracking-widest">Security</h2>
                <div className="size-11" />
            </div>

            <div className="mt-6 space-y-8">
                {/* Password Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                        <div className="size-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Lock className="size-4 text-blue-500" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password & Authentication</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Current Password"
                                    className="w-full h-16 pl-14 pr-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-5 flex items-center text-slate-400 hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>

                            <button className="text-[10px] font-black uppercase tracking-widest text-primary px-1 active:opacity-60 transition-opacity">
                                Change Password?
                            </button>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-white/5" />

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-black tracking-tight">Two-factor Authentication</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Add an extra layer of security to your account</p>
                            </div>
                            <button
                                onClick={() => setTwoFactor(!twoFactor)}
                                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${twoFactor ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'}`}
                            >
                                <div className={`size-4 bg-white rounded-full transition-all duration-300 ${twoFactor ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Login Activity */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                        <div className="size-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Smartphone className="size-4 text-green-500" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Login Activity</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden">
                        {devices.map((device, i, arr) => (
                            <div
                                key={device.id}
                                className={`p-5 flex items-center justify-between ${i !== arr.length - 1 ? "border-b border-slate-100 dark:border-white/5" : ""}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                        <Smartphone className="size-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black tracking-tight">{device.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{device.location} • {device.status}</p>
                                    </div>
                                </div>
                                {device.active ? (
                                    <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                                ) : (
                                    <button className="text-[10px] font-black uppercase tracking-widest text-red-500 active:opacity-60">Log out</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Privacy */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                        <div className="size-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <ShieldCheck className="size-4 text-amber-500" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Privacy Settings</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden">
                        <button className="w-full p-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-white/5 transition-all">
                            <span className="text-sm font-black tracking-tight">Privacy Policy</span>
                            <ChevronRight className="size-4 text-slate-300" />
                        </button>
                        <div className="h-px bg-slate-100 dark:bg-white/5" />
                        <button className="w-full p-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-white/5 transition-all text-red-500">
                            <span className="text-sm font-black tracking-tight">Delete Account</span>
                            <ChevronRight className="size-4 text-slate-300" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterSecurity;
