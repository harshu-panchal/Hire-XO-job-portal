import { TrendingUp, Eye, FileText, Star, PlusSquare } from "lucide-react";
import { Link } from "react-router-dom";

const ProvideDashboard = () => {
    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-4">
                <div className="space-y-1 px-1">
                    <h1 className="text-4xl font-black tracking-tighter leading-tight">
                        PMC <br />
                        <span className="text-indigo-600">Console</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">
                        Manage your consultancy profile
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 py-2">
                    <div className="bg-indigo-600/5 border border-indigo-600/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center">
                                <FileText className="size-7 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 mb-0.5">
                                    Active Proposals
                                </p>
                                <p className="text-2xl font-black tracking-tight">5</p>
                            </div>
                        </div>
                        <div className="text-[10px] font-black bg-indigo-600/10 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest">
                            Live Profiles
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                                <Eye className="size-6 text-blue-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Profile Views
                            </p>
                            <p className="text-xl font-black tracking-tight">2.5k+</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-blue-500/60 mt-2">
                                Total Reach
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                <Star className="size-6 text-amber-500 fill-amber-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Avg. Rating
                            </p>
                            <p className="text-xl font-black tracking-tight">4.9</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 mt-2">
                                48 Reviews
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Inquiries */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight">New Client Inquiries</h2>
                    <Link
                        to="/pmc/provide/inquiries"
                        className="text-xs font-black text-indigo-600 uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        View All
                    </Link>
                </div>

                <div className="space-y-3">
                    {/* Inquiry 1 */}
                    <Link
                        to="/pmc/provide/inquiries"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-4 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start gap-3">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                                JD
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="font-black text-sm">John Doe</p>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0">1h ago</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                    Need PMC for a 50-storey residential tower project in Mumbai.
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-600/10 px-2 py-1 rounded-md">
                                        Residential
                                    </span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">
                                        Verified Lead
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Inquiry 2 */}
                    <Link
                        to="/pmc/provide/inquiries"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-4 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start gap-3">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                                SM
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="font-black text-sm">Sunita Mehta</p>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0">4h ago</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                    Requesting quotation for project planning and risk audit for highway project.
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-600/10 px-2 py-1 rounded-md">
                                        Infrastructure
                                    </span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-600">
                                        New Request
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-600/20">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Listing Performance</p>
                        <h3 className="text-xl font-black tracking-tight">High Engagement</h3>
                    </div>
                    <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <TrendingUp className="size-6" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span>Profile Visibility</span>
                            <span>85%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[85%] bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span>Response Rate</span>
                            <span>98%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[98%] bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
                <h2 className="text-xl font-black tracking-tight px-1">Manage Business</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/pmc/provide/post"
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] p-5 active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                            <PlusSquare className="size-5" />
                        </div>
                        <p className="font-black text-sm">Post Service</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Offer New PMC</p>
                    </Link>
                    <Link
                        to="/pmc/provide/my-services"
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] p-5 active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-3">
                            <FileText className="size-5" />
                        </div>
                        <p className="font-black text-sm">My Proposals</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">View Active Listings</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProvideDashboard;
