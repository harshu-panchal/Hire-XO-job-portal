import { Building2, Globe, ChevronRight, Camera, ShieldCheck, FileText } from "lucide-react";

const ProvideProfile = () => {
    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-1 px-1">
                <h1 className="text-3xl font-black tracking-tighter">Consultancy</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                    Service Provider Profile
                </p>
            </div>

            {/* Profile Card */}
            <div className="relative pt-12">
                <div className="bg-white dark:bg-slate-900/50 rounded-[3rem] p-8 pt-16 border border-slate-200 dark:border-white/10 text-center shadow-sm">
                    {/* Avatar */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0">
                        <div className="relative">
                            <div className="size-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl border-4 border-slate-50 dark:border-background italic">
                                P
                            </div>
                            <button className="absolute -bottom-1 -right-1 size-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                                <Camera className="size-4" />
                            </button>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black tracking-tight leading-tight">Prime Project Group</h2>
                    <p className="text-indigo-600 font-black uppercase tracking-widest text-[9px] mb-6 italic">Verified PMC Firm • ISO 9001</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl text-center border border-slate-100 dark:border-white/5">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Rating</p>
                            <p className="text-base font-black italic">4.9/5</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl text-center border border-slate-100 dark:border-white/5">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Success</p>
                            <p className="text-base font-black italic">98%</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-slate-400">
                                <Globe className="size-5" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Main Office</p>
                                <p className="text-[11px] font-black capitalize">Mumbai, Maharashtra</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-slate-400">
                                <FileText className="size-5" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">License ID</p>
                                <p className="text-[11px] font-black uppercase tracking-tighter">PMC-MAH-2024-8842</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Management */}
            <div className="space-y-4">
                <h3 className="text-lg font-black tracking-tight px-1 italic">Administration</h3>
                <div className="grid gap-3">
                    <button className="flex items-center justify-between p-6 bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all group shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                <ShieldCheck className="size-6" />
                            </div>
                            <span className="font-black text-xs uppercase tracking-widest">Business Verified</span>
                        </div>
                        <ChevronRight className="size-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </button>

                    <button className="flex items-center justify-between p-6 bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all group shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                                <Building2 className="size-6" />
                            </div>
                            <span className="font-black text-xs uppercase tracking-widest">Company Documents</span>
                        </div>
                        <ChevronRight className="size-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProvideProfile;
