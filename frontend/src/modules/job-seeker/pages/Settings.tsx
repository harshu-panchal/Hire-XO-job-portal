import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, User, Mail, Link as LinkIcon, Bell, Shield, HelpCircle } from "lucide-react";

const Settings = () => {
    const navigate = useNavigate();

    return (
        <div className="pb-32 min-h-screen">
            {/* Header */}
            <div className="sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 px-5 py-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all shadow-sm"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    <h1 className="text-xl font-black tracking-tight">Account Settings</h1>
                </div>
            </div>

            <div className="px-5 space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="size-28 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB52noQXoXSZycc1KYch8EW4T9oo08uRX0jjaTWO-ZXI9KH7kXiFp4C4EIVcj7XRZQHfQxQRXN3JXPFfWFxIY_KWVxuw01aSLxW4yQGuQfCxOuK4enRMwXeN3bLH8YYD4yENN8V4V6fLbEskfALN7RDpj9jPejjrnJZr14jNii9GzuFR-A-QqVsM66zFIdR06lslE0evUGvO5VmUZuUTf1XarrZhHh9g0sz-3JpEzYztx0mei_n26BzLtKcxjPhJ9qlEHJyiujQYuzP"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 size-9 bg-primary text-white rounded-xl flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg active:scale-90 transition-all">
                            <Camera className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Profile Info Form */}
                <section className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">
                        Personal Information
                    </h2>
                    <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-white/10 p-5 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Full Name
                            </label>
                            <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus-within:border-primary/50 transition-all">
                                <User className="size-5 text-slate-400" />
                                <input
                                    type="text"
                                    defaultValue="Alex Rivera"
                                    className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Email Address
                            </label>
                            <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus-within:border-primary/50 transition-all">
                                <Mail className="size-5 text-slate-400" />
                                <input
                                    type="email"
                                    defaultValue="alex.rivera@example.com"
                                    className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Portfolio URL
                            </label>
                            <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 focus-within:border-primary/50 transition-all">
                                <LinkIcon className="size-5 text-slate-400" />
                                <input
                                    type="url"
                                    defaultValue="https://alexrivera.design"
                                    className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Preferences */}
                <section className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">
                        Preferences
                    </h2>
                    <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden">
                        <button className="w-full p-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-white/5 transition-all border-b border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <Bell className="size-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black">Notifications</p>
                                    <p className="text-[10px] font-bold text-slate-400">Manage alerts</p>
                                </div>
                            </div>
                            <div className="w-10 h-6 rounded-full bg-slate-200 dark:bg-white/10 relative">
                                <div className="absolute top-1 left-1 size-4 rounded-full bg-white shadow-sm" />
                            </div>
                        </button>
                        <button className="w-full p-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-white/5 transition-all border-b border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                    <Shield className="size-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black">Security</p>
                                    <p className="text-[10px] font-bold text-slate-400">Password & Auth</p>
                                </div>
                            </div>
                        </button>
                        <button className="w-full p-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-white/5 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                    <HelpCircle className="size-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black">Help & Support</p>
                                    <p className="text-[10px] font-bold text-slate-400">FAQ & Contact</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

                <button className="w-full h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings;
