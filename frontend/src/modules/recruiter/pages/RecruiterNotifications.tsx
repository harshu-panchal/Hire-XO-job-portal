import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Mail, Smartphone, MessageSquare } from "lucide-react";

const RecruiterNotifications = () => {
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        push: {
            newApplications: true,
            jobMatches: false,
            messages: true,
            statusUpdates: true
        },
        email: {
            weeklyDigest: true,
            marketing: false,
            security: true
        }
    });

    const toggleSetting = (category: 'push' | 'email', setting: string) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                //@ts-ignore
                ...prev[category],
                //@ts-ignore
                [setting]: !prev[category][setting]
            }
        }));
    };

    return (
        <div className="pb-40 select-none">
            {/* Header */}
            <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 -mx-5 px-5">
                <button
                    onClick={() => navigate(-1)}
                    className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all"
                >
                    <ChevronLeft className="size-6" />
                </button>
                <h2 className="text-sm font-black uppercase tracking-widest">Notifications</h2>
                <div className="size-11" />
            </div>

            <div className="mt-6 space-y-8">
                {/* Push Notifications Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                        <div className="size-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Smartphone className="size-4 text-purple-500" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Push Notifications</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden">
                        {[
                            { key: 'newApplications', label: 'New Applications', icon: MessageSquare },
                            { key: 'jobMatches', label: 'Job Suggestions', icon: Bell },
                            { key: 'messages', label: 'Direct Messages', icon: Mail },
                            { key: 'statusUpdates', label: 'Account Updates', icon: Bell },
                        ].map((item, i, arr) => (
                            <div
                                key={item.key}
                                className={`p-5 flex items-center justify-between ${i !== arr.length - 1 ? "border-b border-slate-100 dark:border-white/5" : ""}`}
                            >
                                <span className="text-sm font-black tracking-tight">{item.label}</span>
                                <button
                                    onClick={() => toggleSetting('push', item.key)}
                                    className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${settings.push[item.key as keyof typeof settings.push] ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'}`}
                                >
                                    <div className={`size-4 bg-white rounded-full transition-all duration-300 ${settings.push[item.key as keyof typeof settings.push] ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Email Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                        <div className="size-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Mail className="size-4 text-blue-500" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Preferences</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden">
                        {[
                            { key: 'weeklyDigest', label: 'Weekly Summary', desc: 'A weekly report of your hiring activity' },
                            { key: 'marketing', label: 'News & Updates', desc: 'Get latest feature updates and tips' },
                            { key: 'security', label: 'Security Alerts', desc: 'Important notifications about account security' },
                        ].map((item, i, arr) => (
                            <div
                                key={item.key}
                                className={`p-5 flex items-center justify-between ${i !== arr.length - 1 ? "border-b border-slate-100 dark:border-white/5" : ""}`}
                            >
                                <div className="space-y-1">
                                    <p className="text-sm font-black tracking-tight">{item.label}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
                                </div>
                                <button
                                    onClick={() => toggleSetting('email', item.key)}
                                    className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${settings.email[item.key as keyof typeof settings.email] ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'}`}
                                >
                                    <div className={`size-4 bg-white rounded-full transition-all duration-300 ${settings.email[item.key as keyof typeof settings.email] ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 z-50">
                <button
                    onClick={() => navigate(-1)}
                    className="h-16 w-full rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
                >
                    Back to Settings
                </button>
            </div>
        </div>
    );
};

export default RecruiterNotifications;
