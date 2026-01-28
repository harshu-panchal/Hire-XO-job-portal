import { useState } from "react";
import { FileText, Clock, CheckCircle2, XCircle, Timer, Building2, MapPin, ChevronRight, BarChart3 } from "lucide-react";

const MyApplications = () => {
    const [activeTab, setActiveTab] = useState("All");

    const stats = [
        { label: "Total Bids", value: "24", icon: FileText, color: "text-violet-600", bgColor: "bg-violet-100 dark:bg-violet-950/30" },
        { label: "Active", value: "8", icon: Timer, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-950/30" },
        { label: "Won", value: "3", icon: CheckCircle2, color: "text-emerald-600", bgColor: "bg-emerald-100 dark:bg-emerald-950/30" },
        { label: "Rejected", value: "13", icon: XCircle, color: "text-rose-600", bgColor: "bg-rose-100 dark:bg-rose-950/30" },
    ];

    const bids = [
        {
            id: 1,
            tenderTitle: "Smart City Infrastructure Project Phase 2",
            organization: "Mumbai Municipal Corporation",
            bidAmount: "₹23.5 Cr",
            submittedDate: "12 Sep 2024",
            status: "Under Evaluation",
            statusColor: "text-amber-600",
            statusBg: "bg-amber-100 dark:bg-amber-950/30",
            progress: 65,
            location: "Mumbai"
        },
        {
            id: 2,
            tenderTitle: "Solar Power Plant Installation",
            organization: "State Energy Board",
            bidAmount: "₹11.2 Cr",
            submittedDate: "05 Sep 2024",
            status: "Won",
            statusColor: "text-emerald-600",
            statusBg: "bg-emerald-100 dark:bg-emerald-950/30",
            progress: 100,
            location: "Pune"
        },
        {
            id: 3,
            tenderTitle: "Urban Planning Consultancy",
            organization: "Urban Housing Board",
            bidAmount: "₹2.8 Cr",
            submittedDate: "28 Aug 2024",
            status: "Rejected",
            statusColor: "text-rose-600",
            statusBg: "bg-rose-100 dark:bg-rose-950/30",
            progress: 100,
            location: "Bangalore"
        },
        {
            id: 4,
            tenderTitle: "Metro Extension Phase 3",
            organization: "Metro Rail Corp",
            bidAmount: "₹145 Cr",
            submittedDate: "20 Aug 2024",
            status: "Active",
            statusColor: "text-blue-600",
            statusBg: "bg-blue-100 dark:bg-blue-950/30",
            progress: 30,
            location: "Hyderabad"
        }
    ];

    const tabs = ["All", "Active", "Under Evaluation", "Result Out"];

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight">My Bid Portfolio</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    Manage and track your submitted tender applications
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-5 flex flex-col items-center text-center space-y-2 group hover:scale-105 transition-transform cursor-pointer">
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

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeTab === tab
                                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl shadow-slate-900/20 dark:shadow-white/20"
                                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-slate-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Bids List */}
            <div className="space-y-5">
                {bids.map((bid) => (
                    <div key={bid.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="space-y-1.5 flex-1 pr-8">
                                <div className="flex items-center gap-2">
                                    <Building2 className="size-3.5 text-violet-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{bid.organization}</span>
                                </div>
                                <h3 className="text-base font-black tracking-tight group-hover:text-violet-600 transition-colors leading-tight">{bid.tenderTitle}</h3>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full ${bid.statusBg} ${bid.statusColor} text-[8px] font-black uppercase tracking-widest border border-current opacity-80 shrink-0`}>
                                {bid.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Your Bid Amount</p>
                                <p className="text-base font-black tracking-tight">{bid.bidAmount}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Submission Date</p>
                                <div className="flex items-center gap-1">
                                    <Clock className="size-3 text-slate-400" />
                                    <p className="text-[11px] font-black">{bid.submittedDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center justify-between">
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Evaluation Progress</p>
                                <p className="text-[9px] font-black text-violet-600">{bid.progress}%</p>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-1000"
                                    style={{ width: `${bid.progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="size-3 text-slate-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{bid.location}</span>
                            </div>
                            <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-violet-600 hover:gap-2 transition-all">
                                View Full Status <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Snapshot */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-6 text-white shadow-2xl shadow-violet-500/30">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black tracking-tight uppercase tracking-widest opacity-90">Bid Success Insights</h2>
                    <BarChart3 className="size-6 opacity-60" />
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest opacity-70">Win Rate</span>
                        <span className="text-xl font-black">12.5%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-1/8" />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Higher than 60% of vendors in Civil Works</p>
                </div>
            </div>
        </div>
    );
};

export default MyApplications;
