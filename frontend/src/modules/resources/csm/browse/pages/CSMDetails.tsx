import { ArrowLeft, Star, Building2, Shield, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CSMDetails = () => {
    const navigate = useNavigate();

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="flex items-center justify-between px-1">
                <button
                    onClick={() => navigate(-1)}
                    className="size-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center active:scale-90 transition-transform"
                >
                    <ArrowLeft className="size-6" />
                </button>
                <div className="flex gap-2">
                    <button className="px-6 h-12 rounded-2xl bg-rose-600 text-white font-black text-sm uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-rose-600/20">
                        Hire Now
                    </button>
                </div>
            </div>

            {/* Profile Section */}
            <div className="space-y-6">
                <div className="flex flex-col items-center text-center space-y-4 px-4 py-8 bg-rose-600/5 rounded-[3rem] border border-rose-600/10">
                    <div className="size-24 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-4xl font-black shadow-xl">
                        S
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter mb-1">SiteGuard Professionals</h1>
                        <p className="text-rose-600 font-black uppercase tracking-widest text-[10px]">Tier 1 Supervision Firm</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                            <Star className="size-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-black text-amber-700">5.0 (156 reviews)</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                            <Building2 className="size-4 text-rose-600" />
                            <span className="text-sm font-black text-rose-700">Structural</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-white/10 text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Exp.</p>
                        <p className="text-base font-black">15y+</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-white/10 text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Sites</p>
                        <p className="text-base font-black">200+</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-white/10 text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Safety</p>
                        <p className="text-base font-black">100%</p>
                    </div>
                </div>

                {/* About */}
                <div className="space-y-3 px-1">
                    <h2 className="text-xl font-black tracking-tight">About Firm</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        SiteGuard Professionals is a leading construction supervision firm dedicated to structural integrity and site safety. We provide comprehensive oversight for residential, commercial, and industrial projects, ensuring every brick and beam meets global standards.
                    </p>
                </div>

                {/* Expertise */}
                <div className="space-y-3 px-1">
                    <h2 className="text-xl font-black tracking-tight">Core Expertise</h2>
                    <div className="flex flex-wrap gap-2">
                        {["Concrete Testing", "Site Safety", "Audit & Compliance", "Surveying", "Material Inspection"].map((skill) => (
                            <div key={skill} className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                {skill}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-40">
                <div className="flex gap-3">
                    <button className="flex-1 h-16 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        <MessageCircle className="size-5" />
                        Discuss Project
                    </button>
                    <button className="size-16 rounded-[2rem] bg-rose-600 text-white flex items-center justify-center active:scale-95 transition-transform shadow-lg shadow-rose-600/20">
                        <Shield className="size-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CSMDetails;
