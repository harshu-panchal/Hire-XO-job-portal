import { PlusCircle, FileText, CheckCircle2, TrendingUp, Users, ArrowRight, MessageSquare, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const ProvideDashboard = () => {
    const stats = [
        { label: "Active Tenders", value: "15", icon: FileText, color: "text-indigo-600", bgColor: "bg-indigo-100 dark:bg-indigo-950/30" },
        { label: "Bids Received", value: "142", icon: Users, color: "text-violet-600", bgColor: "bg-violet-100 dark:bg-violet-950/30" },
        { label: "Awarded", value: "8", icon: CheckCircle2, color: "text-emerald-600", bgColor: "bg-emerald-100 dark:bg-emerald-950/30" },
        { label: "Engagement", value: "+24%", icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-950/30" },
    ];

    const activeTenders = [
        { id: 1, title: "Smart City Infrastructure Phase 2", bids: 42, closing: "15 Oct 2024", status: "Evaluation" },
        { id: 2, title: "Solar Power Plant Installation", bids: 28, closing: "20 Oct 2024", status: "Active" },
        { id: 3, title: "E-Governance Software Solution", bids: 15, closing: "10 Oct 2024", status: "Closing" },
    ];

    const recentBids = [
        { id: 1, vendor: "EcoBuild Infra", tender: "Smart City Project", time: "2h ago", amount: "₹23.5 Cr" },
        { id: 2, vendor: "SolarTech Solutions", tender: "Solar Power Installation", time: "5h ago", amount: "₹11.2 Cr" },
        { id: 3, vendor: "Global IT Systems", tender: "E-Governance Solution", time: "1d ago", amount: "₹4.8 Cr" },
    ];

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight leading-tight">
                        Tender <br />
                        <span className="text-indigo-600">Management</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                        Organize and award your business opportunities
                    </p>
                </div>
                <Link to="/tenders/provide/post" className="size-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 active:scale-90 transition-transform">
                    <PlusCircle className="size-8" />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-5 flex flex-col items-center text-center space-y-2 group hover:scale-[1.02] transition-transform">
                        <div className={`size-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                            <stat.icon className={`size-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Tenders Overview */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight">Active Tenders</h2>
                    <Link to="/tenders/provide/my-tenders" className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-transform">
                        Manage All <ArrowRight className="size-3" />
                    </Link>
                </div>

                <div className="space-y-3">
                    {activeTenders.map((tender) => (
                        <Link
                            key={tender.id}
                            to="/tenders/provide/my-tenders"
                            className="flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm group hover:border-indigo-200 transition-all"
                        >
                            <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0">
                                <FileText className="size-6 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0 pr-4">
                                <h3 className="text-sm font-black tracking-tight leading-tight truncate">{tender.title}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center gap-1 opacity-60">
                                        <Users className="size-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{tender.bids} Bids</span>
                                    </div>
                                    <div className="size-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                                    <div className="flex items-center gap-1 opacity-60">
                                        <Clock className="size-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Ends {tender.closing}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-current opacity-70 shrink-0 ${tender.status === "Active" ? "text-emerald-600" : tender.status === "Evaluation" ? "text-blue-600" : "text-rose-600"
                                }`}>
                                {tender.status}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Bids */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight">Recent Bids</h2>
                    <Link to="/tenders/provide/bids" className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-transform">
                        Inbox <MessageSquare className="size-3" />
                    </Link>
                </div>

                <div className="space-y-3">
                    {recentBids.map((bid) => (
                        <div key={bid.id} className="p-5 rounded-[2rem] bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20 relative overflow-hidden group">
                            <div className="flex items-start justify-between relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{bid.vendor}</p>
                                    <p className="text-sm font-black tracking-tight group-hover:text-indigo-600 transition-colors uppercase leading-tight">{bid.amount}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">on "{bid.tender}"</p>
                                </div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{bid.time}</span>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 size-16 bg-indigo-600/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Link Card */}
            <Link to="/tenders/provide/post" className="block p-6 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/40 active:scale-95 transition-transform relative overflow-hidden group">
                <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black tracking-tight uppercase tracking-widest">Post Tender</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Reach thousands of vendors</p>
                    </div>
                    <ArrowRight className="size-8 opacity-60 group-hover:translate-x-2 transition-transform" />
                </div>
                <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-24 -mt-24" />
            </Link>
        </div>
    );
};

export default ProvideDashboard;
