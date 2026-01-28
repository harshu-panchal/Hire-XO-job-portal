import { Bell, Lock, Smartphone, Globe, LogOut, ChevronRight } from "lucide-react";

const ProvideSettings = () => {
    return (
        <div className="py-6 space-y-10 select-none">
            {/* Header */}
            <div className="space-y-1 px-1">
                <h1 className="text-3xl font-black tracking-tighter skew-x-[-4deg]">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] px-1">
                    Vehicle Provider Console
                </p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-8">
                {/* Communication Section */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-2 italic">Engagement</h3>
                    <div className="bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            <button className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/10">
                                        <Bell className="size-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-[11px] uppercase tracking-widest">Booking Alerts</p>
                                        <p className="text-[9px] font-medium text-slate-400 mt-0.5">Push & Email</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest italic">Always</span>
                                    <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </button>

                            <button className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/10">
                                        <Globe className="size-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-[11px] uppercase tracking-widest">Marketplace</p>
                                        <p className="text-[9px] font-medium text-slate-400 mt-0.5">Visibility Status</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">Online</span>
                                    <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Privacy & Access */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-2 italic">Access</h3>
                    <div className="bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            <button className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/10">
                                        <Lock className="size-5" />
                                    </div>
                                    <p className="font-black text-[11px] uppercase tracking-widest text-left">Security Pin</p>
                                </div>
                                <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                            </button>

                            <button className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-2xl bg-slate-500/10 text-slate-600 flex items-center justify-center border border-slate-500/10">
                                        <Smartphone className="size-5" />
                                    </div>
                                    <p className="font-black text-[11px] uppercase tracking-widest text-left">Linked Devices</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">03 Active</span>
                                    <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-4">
                    <button className="w-full h-20 rounded-[3rem] bg-blue-600/5 text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all border border-slate-200 dark:border-white/10 hover:bg-red-500 hover:text-white hover:border-red-500 group">
                        <LogOut className="size-5 group-hover:-translate-x-1 transition-transform" />
                        Exit Admin Console
                    </button>
                </div>
            </div>

            <div className="text-center pb-8 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-widest">App ID: VEH_PRO_V1</p>
            </div>
        </div>
    );
};

export default ProvideSettings;
