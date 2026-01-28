import { Mail, Phone, ShieldCheck, CreditCard, ChevronRight, Camera } from "lucide-react";

const BrowseProfile = () => {
    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-1 px-1">
                <h1 className="text-3xl font-black tracking-tighter">My Profile</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                    CSM Client Overview
                </p>
            </div>

            {/* Profile Card */}
            <div className="relative pt-12">
                <div className="bg-white dark:bg-slate-900/50 rounded-[3rem] p-8 pt-16 border border-slate-200 dark:border-white/10 text-center shadow-sm">
                    {/* Avatar */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0">
                        <div className="relative">
                            <div className="size-24 rounded-[2rem] bg-rose-600 flex items-center justify-center text-white text-3xl font-black shadow-xl border-4 border-slate-50 dark:border-background">
                                JD
                            </div>
                            <button className="absolute -bottom-1 -right-1 size-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                                <Camera className="size-4" />
                            </button>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black tracking-tight">John Doe</h2>
                    <p className="text-rose-600 font-black uppercase tracking-widest text-[10px] mb-6">CSM Premium Client</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl text-center">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Projects</p>
                            <p className="text-base font-black italic">08</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl text-center">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Spent</p>
                            <p className="text-base font-black italic">₹22L</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-slate-400">
                                <Mail className="size-5" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Email Address</p>
                                <p className="text-[11px] font-black">john.doe@example.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-slate-400">
                                <Phone className="size-5" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Registered Phone</p>
                                <p className="text-[11px] font-black">+91 98765 43210</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-black tracking-tight px-1">Quick Management</h3>
                <div className="grid gap-3">
                    <button className="flex items-center justify-between p-5 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                <ShieldCheck className="size-6" />
                            </div>
                            <span className="font-black text-sm uppercase tracking-widest">Verification Status</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                            <ChevronRight className="size-5 text-slate-300 group-hover:text-rose-600 transition-colors" />
                        </div>
                    </button>

                    <button className="flex items-center justify-between p-5 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                                <CreditCard className="size-6" />
                            </div>
                            <span className="font-black text-sm uppercase tracking-widest">Billing & Wallet</span>
                        </div>
                        <ChevronRight className="size-5 text-slate-300 group-hover:text-rose-600 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrowseProfile;
