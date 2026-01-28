import { TrendingUp, Eye, MessageSquare, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const SeekDashboard = () => {
    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-4">
                <div className="space-y-1 px-1">
                    <h1 className="text-4xl font-black tracking-tighter leading-tight">
                        Funding <br />
                        <span className="text-primary">Dashboard</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">
                        Manage your funding requests
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 py-2">
                    <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <FileText className="size-7 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-0.5">
                                    Active Requests
                                </p>
                                <p className="text-2xl font-black tracking-tight">3</p>
                            </div>
                        </div>
                        <div className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">
                            Live
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                                <Eye className="size-6 text-blue-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Total Views
                            </p>
                            <p className="text-xl font-black tracking-tight">1,247</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-blue-500/60 mt-2">
                                This Month
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                <MessageSquare className="size-6 text-emerald-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Inquiries
                            </p>
                            <p className="text-xl font-black tracking-tight">18</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">
                                New This Week
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Inquiries */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight">Recent Inquiries</h2>
                    <Link
                        to="/investor/seek/inquiries"
                        className="text-xs font-black text-primary uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        View All
                    </Link>
                </div>

                <div className="space-y-3">
                    {/* Inquiry 1 */}
                    <Link
                        to="/investor/seek/inquiries"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-4 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start gap-3">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                                RK
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="font-black text-sm">Rajesh Kumar</p>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0">2h ago</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                    Interested in your AI SaaS platform. Would like to discuss investment terms.
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">
                                        Technology
                                    </span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">
                                        ₹5Cr Request
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Inquiry 2 */}
                    <Link
                        to="/investor/seek/inquiries"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-4 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start gap-3">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                                AS
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="font-black text-sm">Anita Sharma</p>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0">5h ago</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                    Looking for more details on your manufacturing expansion plans.
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">
                                        Manufacturing
                                    </span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">
                                        ₹12Cr Request
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* My Active Requests */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight">My Active Requests</h2>
                    <Link
                        to="/investor/seek/my-requests"
                        className="text-xs font-black text-primary uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        View All
                    </Link>
                </div>

                <div className="space-y-4">
                    {/* Request Card */}
                    <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/10 mb-2">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">
                                        Technology
                                    </span>
                                </div>
                                <h3 className="font-black text-lg tracking-tight">AI-Powered SaaS Platform</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Seeking</p>
                                <p className="text-lg font-black text-emerald-600">₹5Cr</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1">
                                <Eye className="size-3" />
                                <span>245 views</span>
                            </div>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <div className="flex items-center gap-1">
                                <MessageSquare className="size-3" />
                                <span>8 inquiries</span>
                            </div>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span className="text-emerald-600">Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
                <h2 className="text-xl font-black tracking-tight px-1">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/investor/seek/post"
                        className="bg-gradient-to-br from-primary to-primary/80 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                            <TrendingUp className="size-5" />
                        </div>
                        <p className="font-black text-sm">Post Request</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">New Funding Need</p>
                    </Link>
                    <Link
                        to="/investor/seek/inquiries"
                        className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 rounded-[2rem] p-5 text-white dark:text-slate-900 active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-white/20 dark:bg-slate-900/20 flex items-center justify-center mb-3">
                            <MessageSquare className="size-5" />
                        </div>
                        <p className="font-black text-sm">View Inbox</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Investor Messages</p>
                    </Link>
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-900 rounded-[2rem] p-5">
                <h3 className="font-black text-sm mb-2 flex items-center gap-2">
                    <TrendingUp className="size-4 text-blue-600" />
                    Tips for Attracting Investors
                </h3>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-black">•</span>
                        <span>Provide detailed business plan and financial projections</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-black">•</span>
                        <span>Highlight your unique value proposition and market opportunity</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-black">•</span>
                        <span>Respond promptly to investor inquiries</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SeekDashboard;
