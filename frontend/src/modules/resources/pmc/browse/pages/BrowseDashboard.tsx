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
                        <span className="text-indigo-600">Consultants</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">
                        Project Management Consultancy
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 py-2">
                    <div className="bg-indigo-600/5 border border-indigo-600/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center">
                                <Target className="size-7 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 mb-0.5">
                                    Verified PMC Firms
                                </p>
                                <p className="text-2xl font-black tracking-tight">85+</p>
                            </div>
                        </div>
                        <div className="text-[10px] font-black bg-indigo-600/10 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest">
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
                            <p className="text-xl font-black tracking-tight">98%</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">
                                For Clients
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                <Award className="size-6 text-amber-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Exp. Experts
                            </p>
                            <p className="text-xl font-black tracking-tight">1.2k+</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 mt-2">
                                Certified
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Consultants */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight">Top Rated Firms</h2>
                    <Link
                        to="/pmc/browse/consultants"
                        className="text-xs font-black text-indigo-600 uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        View All
                    </Link>
                </div>

                <div className="space-y-4">
                    {/* Consultant Card 1 */}
                    <Link
                        to="/pmc/browse/consultants/1"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-lg">
                                    P
                                </div>
                                <div>
                                    <p className="text-indigo-600 font-black uppercase tracking-widest text-[9px]">
                                        Prime Project Group
                                    </p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/10 mt-0.5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600">
                                            Infrastructure
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
                            Global Infrastructure & Planning
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            Leading PMC specialized in large-scale bridge and highway projects with over 20 years of experience.
                        </p>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1">
                                <Eye className="size-3" />
                                <span>1.2k views</span>
                            </div>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>50+ Projects</span>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>ISO Certified</span>
                        </div>
                    </Link>

                    {/* Consultant Card 2 */}
                    <Link
                        to="/pmc/browse/consultants/2"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-lg">
                                    E
                                </div>
                                <div>
                                    <p className="text-indigo-600 font-black uppercase tracking-widest text-[9px]">
                                        EcoBuild Solutions
                                    </p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/10 mt-0.5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">
                                            Green Building
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Rating</p>
                                <p className="text-lg font-black text-amber-500">4.8/5</p>
                            </div>
                        </div>
                        <h3 className="font-black text-lg tracking-tight mb-2">
                            Sustainable Commercial Projects
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            Expert PMC services for LEED certified commercial buildings and renewable energy integrations.
                        </p>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1">
                                <Eye className="size-3" />
                                <span>856 views</span>
                            </div>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>30+ Projects</span>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>Eco Certified</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
                <h2 className="text-xl font-black tracking-tight px-1">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/pmc/browse/consultants"
                        className="bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                            <Search className="size-5" />
                        </div>
                        <p className="font-black text-sm">Find PMC</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Browse Firms</p>
                    </Link>
                    <Link
                        to="/pmc/browse/my-hires"
                        className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 rounded-[2rem] p-5 text-white dark:text-slate-900 active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-white/20 dark:bg-slate-900/20 flex items-center justify-center mb-3">
                            <Briefcase className="size-5" />
                        </div>
                        <p className="font-black text-sm">My Hires</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Manage PMC</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BrowseDashboard;
