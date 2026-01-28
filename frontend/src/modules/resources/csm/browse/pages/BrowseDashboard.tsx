import { TrendingUp, Award, Target, Eye, Search, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const BrowseDashboard = () => {
    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-4">
                <div className="space-y-1 px-1">
                    <h1 className="text-4xl font-black tracking-tighter leading-tight">
                        Hire Best <br />
                        <span className="text-rose-600">CSM Experts</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">
                        Construction Supervision Management
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 py-2">
                    <div className="bg-rose-600/5 border border-rose-600/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-rose-600/10 flex items-center justify-center">
                                <Target className="size-7 text-rose-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-600/60 mb-0.5">
                                    Verified CSM Firms
                                </p>
                                <p className="text-2xl font-black tracking-tight">120+</p>
                            </div>
                        </div>
                        <div className="text-[10px] font-black bg-rose-600/10 text-rose-600 px-3 py-1 rounded-full uppercase tracking-widest">
                            Available Now
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                <TrendingUp className="size-6 text-emerald-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Success Rate
                            </p>
                            <p className="text-xl font-black tracking-tight">99%</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">
                                Project Quality
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                <Award className="size-6 text-amber-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Site Experts
                            </p>
                            <p className="text-xl font-black tracking-tight">2.5k+</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 mt-2">
                                On-site Staff
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Consultants */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight">Top Rated Supervisors</h2>
                    <Link
                        to="/csm/browse/consultants"
                        className="text-xs font-black text-rose-600 uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        View All
                    </Link>
                </div>

                <div className="space-y-4">
                    {/* CSM Card 1 */}
                    <Link
                        to="/csm/browse/consultants/1"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-black text-lg">
                                    S
                                </div>
                                <div>
                                    <p className="text-rose-600 font-black uppercase tracking-widest text-[9px]">
                                        SiteGuard Professionals
                                    </p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/10 mt-0.5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-rose-600">
                                            Structural
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Rating</p>
                                <p className="text-lg font-black text-amber-500">5.0/5</p>
                            </div>
                        </div>
                        <h3 className="font-black text-lg tracking-tight mb-2">
                            Advanced Structural Supervision
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            Specialized in high-rise residential and commercial structural integrity and safety supervision.
                        </p>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1">
                                <Eye className="size-3" />
                                <span>2.1k views</span>
                            </div>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>15+ Years</span>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>Safety Awarded</span>
                        </div>
                    </Link>

                    {/* CSM Card 2 */}
                    <Link
                        to="/csm/browse/consultants/2"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center text-white font-black text-lg">
                                    Q
                                </div>
                                <div>
                                    <p className="text-rose-600 font-black uppercase tracking-widest text-[9px]">
                                        QualiCheck Masters
                                    </p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-pink-500/10 border border-pink-500/10 mt-0.5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-pink-600">
                                            Quality Control
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Rating</p>
                                <p className="text-lg font-black text-amber-500">4.9/5</p>
                            </div>
                        </div>
                        <h3 className="font-black text-lg tracking-tight mb-2">
                            Total Quality Management
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            Leading experts in material testing, construction quality audits, and compliance management.
                        </p>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1">
                                <Eye className="size-3" />
                                <span>1.5k views</span>
                            </div>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>40+ Projects</span>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>ISO 9001</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
                <h2 className="text-xl font-black tracking-tight px-1">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/csm/browse/consultants"
                        className="bg-gradient-to-br from-rose-600 to-rose-500 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                            <Search className="size-5" />
                        </div>
                        <p className="font-black text-sm">Find CSM</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Browse Experts</p>
                    </Link>
                    <Link
                        to="/csm/browse/my-hires"
                        className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 rounded-[2rem] p-5 text-white dark:text-slate-900 active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-white/20 dark:bg-slate-900/20 flex items-center justify-center mb-3">
                            <Briefcase className="size-5" />
                        </div>
                        <p className="font-black text-sm">My Hires</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Manage CSM</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BrowseDashboard;
