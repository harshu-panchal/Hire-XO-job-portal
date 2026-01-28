import { TrendingUp, DollarSign, Target, Eye, Search, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const BrowseDashboard = () => {
    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-4">
                <div className="space-y-1 px-1">
                    <h1 className="text-4xl font-black tracking-tighter leading-tight">
                        Investment <br />
                        <span className="text-primary">Opportunities</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">
                        Discover your next big investment
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 py-2">
                    <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Target className="size-7 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-0.5">
                                    Active Opportunities
                                </p>
                                <p className="text-2xl font-black tracking-tight">156+</p>
                            </div>
                        </div>
                        <div className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">
                            Live Now
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                <TrendingUp className="size-6 text-emerald-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Avg. ROI
                            </p>
                            <p className="text-xl font-black tracking-tight">18.5%</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">
                                Last Quarter
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                <DollarSign className="size-6 text-amber-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Total Value
                            </p>
                            <p className="text-xl font-black tracking-tight">₹45Cr</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 mt-2">
                                Available
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Opportunities */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight">Featured Opportunities</h2>
                    <Link
                        to="/investor/browse/opportunities"
                        className="text-xs font-black text-primary uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        View All
                    </Link>
                </div>

                <div className="space-y-4">
                    {/* Opportunity Card 1 */}
                    <Link
                        to="/investor/browse/opportunities/1"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-black text-lg">
                                    T
                                </div>
                                <div>
                                    <p className="text-primary font-black uppercase tracking-widest text-[9px]">
                                        TechVenture Solutions
                                    </p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/10 mt-0.5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">
                                            Technology
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Seeking</p>
                                <p className="text-lg font-black text-emerald-600">₹5Cr</p>
                            </div>
                        </div>
                        <h3 className="font-black text-lg tracking-tight mb-2">
                            AI-Powered SaaS Platform Expansion
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            Looking for strategic investment to scale our AI-driven customer analytics platform across Asian markets.
                        </p>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1">
                                <Eye className="size-3" />
                                <span>245 views</span>
                            </div>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>15% Equity</span>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>24 months</span>
                        </div>
                    </Link>

                    {/* Opportunity Card 2 */}
                    <Link
                        to="/investor/browse/opportunities/2"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-lg">
                                    G
                                </div>
                                <div>
                                    <p className="text-primary font-black uppercase tracking-widest text-[9px]">
                                        GreenEnergy Innovations
                                    </p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/10 mt-0.5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-green-600">
                                            Renewable Energy
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Seeking</p>
                                <p className="text-lg font-black text-emerald-600">₹12Cr</p>
                            </div>
                        </div>
                        <h3 className="font-black text-lg tracking-tight mb-2">
                            Solar Panel Manufacturing Unit
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            Establishing state-of-the-art solar panel manufacturing facility with projected 30% ROI in 3 years.
                        </p>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1">
                                <Eye className="size-3" />
                                <span>189 views</span>
                            </div>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>20% Equity</span>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>36 months</span>
                        </div>
                    </Link>

                    {/* Opportunity Card 3 */}
                    <Link
                        to="/investor/browse/opportunities/3"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-black text-lg">
                                    H
                                </div>
                                <div>
                                    <p className="text-primary font-black uppercase tracking-widest text-[9px]">
                                        HealthTech Dynamics
                                    </p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/10 mt-0.5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-purple-600">
                                            Healthcare
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Seeking</p>
                                <p className="text-lg font-black text-emerald-600">₹8Cr</p>
                            </div>
                        </div>
                        <h3 className="font-black text-lg tracking-tight mb-2">
                            Telemedicine Platform Development
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            Building comprehensive telemedicine platform connecting patients with specialists across India.
                        </p>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1">
                                <Eye className="size-3" />
                                <span>312 views</span>
                            </div>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>18% Equity</span>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>30 months</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
                <h2 className="text-xl font-black tracking-tight px-1">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/investor/browse/opportunities"
                        className="bg-gradient-to-br from-primary to-primary/80 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                            <Search className="size-5" />
                        </div>
                        <p className="font-black text-sm">Browse All</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Opportunities</p>
                    </Link>
                    <Link
                        to="/investor/browse/my-investments"
                        className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 rounded-[2rem] p-5 text-white dark:text-slate-900 active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-white/20 dark:bg-slate-900/20 flex items-center justify-center mb-3">
                            <Briefcase className="size-5" />
                        </div>
                        <p className="font-black text-sm">My Portfolio</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Track Investments</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BrowseDashboard;
