import { useState } from "react";
import { FileText, Users, Clock, CheckCircle2, MoreVertical, Edit2, Archive, Eye, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const MyTenders = () => {
    const [activeTab, setActiveTab] = useState("All");

    const stats = [
        { label: "Active", value: "8", icon: FileText, color: "text-indigo-600", bgColor: "bg-indigo-100 dark:bg-indigo-950/30" },
        { label: "Bids Recv.", value: "142", icon: Users, color: "text-violet-600", bgColor: "bg-violet-100 dark:bg-violet-950/30" },
        { label: "Awarded", value: "24", icon: CheckCircle2, color: "text-emerald-600", bgColor: "bg-emerald-100 dark:bg-emerald-950/30" },
    ];

    const tenders = [
        {
            id: 1,
            title: "Smart City Infrastructure Phase 2",
            refNo: "MMC/INFRA/2024/082",
            bids: 42,
            closingDate: "15 Oct 2024",
            status: "Evaluation",
            statusColor: "text-amber-600",
            statusBg: "bg-amber-100 dark:bg-amber-950/30"
        },
        {
            id: 2,
            title: "Solar Power Plant Installation",
            refNo: "SEB/SLR/2024/015",
            bids: 28,
            closingDate: "20 Oct 2024",
            status: "Active",
            statusColor: "text-emerald-600",
            statusBg: "bg-emerald-100 dark:bg-emerald-950/30"
        },
        {
            id: 3,
            title: "E-Governance Software Solution",
            refNo: "ITD/SFT/2024/042",
            bids: 15,
            closingDate: "10 Oct 2024",
            status: "Published",
            statusColor: "text-blue-600",
            statusBg: "bg-blue-100 dark:bg-blue-950/30"
        },
        {
            id: 4,
            title: "Metro Extension Phase 3",
            refNo: "MRC/MET/2024/003",
            bids: 0,
            closingDate: "30 Nov 2024",
            status: "Draft",
            statusColor: "text-slate-600",
            statusBg: "bg-slate-100 dark:bg-slate-800"
        }
    ];

    const tabs = ["All", "Active", "Evaluation", "Drafts"];

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="flex items-center justify-between px-1">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight">Tender Portfolio</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                        Manage your published opportunities
                    </p>
                </div>
                <Link to="/tenders/provide/post" className="size-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform">
                    <Plus className="size-6" />
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-4 flex flex-col items-center text-center space-y-2 group shadow-sm">
                        <div className={`size-10 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                            <stat.icon className={`size-5 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xl font-black tracking-tight">{stat.value}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
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
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/20"
                            : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/10 hover:border-indigo-400"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tenders List */}
            <div className="space-y-5">
                {tenders.map((tender) => (
                    <div key={tender.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="flex items-start justify-between mb-4">
                            <div className="space-y-1.5 flex-1 pr-12">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{tender.refNo}</p>
                                <h3 className="text-base font-black tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">{tender.title}</h3>
                            </div>
                            <button className="size-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400">
                                <MoreVertical className="size-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <Link to="/tenders/provide/bids" className="bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl p-3 flex items-center justify-between group/bid">
                                <div className="space-y-0.5">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Total Bids</p>
                                    <p className="text-base font-black tracking-tight text-indigo-600">{tender.bids}</p>
                                </div>
                                <div className="size-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center group-hover/bid:scale-110 transition-transform">
                                    <Users className="size-4 text-indigo-600" />
                                </div>
                            </Link>
                            <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-3 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Ends On</p>
                                    <p className="text-sm font-black tracking-tight">{tender.closingDate}</p>
                                </div>
                                <Clock className="size-4 text-slate-400" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                            <div className={`px-4 py-1.5 rounded-full ${tender.statusBg} ${tender.statusColor} text-[8px] font-black uppercase tracking-widest border border-current opacity-80`}>
                                {tender.status}
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                                    <Edit2 className="size-4" />
                                </button>
                                <button className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                                    <Eye className="size-4" />
                                </button>
                                <button className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-rose-600 transition-colors">
                                    <Archive className="size-4" />
                                </button>
                            </div>
                        </div>

                        {/* Background Highlight */}
                        <div className="absolute top-0 right-0 size-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
                    </div>
                ))}
            </div>

            {/* Spacer */}
            <div className="h-4" />
        </div>
    );
};

export default MyTenders;
