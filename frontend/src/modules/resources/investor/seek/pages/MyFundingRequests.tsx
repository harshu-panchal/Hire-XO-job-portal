import { Eye, Edit2, Trash2, MoreVertical, TrendingUp, MessageSquare, Calendar } from "lucide-react";

const MyFundingRequests = () => {
    const requests = [
        {
            id: 1,
            title: "AI-Powered SaaS Platform Expansion",
            sector: "Technology",
            sectorColor: "blue",
            amount: "₹5 Cr",
            equity: "15%",
            duration: "24 months",
            status: "Active",
            statusColor: "emerald",
            postedDate: "Jan 15, 2024",
            views: 245,
            inquiries: 8,
            description: "Looking for strategic investment to scale our AI-driven customer analytics platform...",
        },
        {
            id: 2,
            title: "Solar Panel Manufacturing Unit",
            sector: "Renewable Energy",
            sectorColor: "green",
            amount: "₹12 Cr",
            equity: "20%",
            duration: "36 months",
            status: "Active",
            statusColor: "emerald",
            postedDate: "Dec 10, 2023",
            views: 189,
            inquiries: 12,
            description: "Establishing state-of-the-art solar panel manufacturing facility...",
        },
        {
            id: 3,
            title: "Telemedicine Platform Development",
            sector: "Healthcare",
            sectorColor: "purple",
            amount: "₹8 Cr",
            equity: "18%",
            duration: "30 months",
            status: "Under Review",
            statusColor: "amber",
            postedDate: "Nov 5, 2023",
            views: 312,
            inquiries: 15,
            description: "Building comprehensive telemedicine platform connecting patients with specialists...",
        },
        {
            id: 4,
            title: "E-commerce Platform Scaling",
            sector: "Technology",
            sectorColor: "blue",
            amount: "₹3 Cr",
            equity: "12%",
            duration: "18 months",
            status: "Closed",
            statusColor: "slate",
            postedDate: "Sep 20, 2023",
            views: 156,
            inquiries: 6,
            description: "Expanding our e-commerce platform to tier-2 and tier-3 cities...",
        },
    ];

    const stats = {
        total: requests.length,
        active: requests.filter((r) => r.status === "Active").length,
        totalViews: requests.reduce((sum, r) => sum + r.views, 0),
        totalInquiries: requests.reduce((sum, r) => sum + r.inquiries, 0),
    };

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="px-1">
                <h1 className="text-3xl font-black tracking-tight">
                    My Funding <span className="text-primary">Requests</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest mt-1">
                    Manage your posted funding needs
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-[2rem] p-5 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Total Requests</p>
                        <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <TrendingUp className="size-5 text-primary" />
                        </div>
                    </div>
                    <p className="text-3xl font-black">{stats.total}</p>
                    <p className="text-[8px] font-bold text-emerald-600 mt-1">{stats.active} Active</p>
                </div>
                <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Total Views</p>
                        <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Eye className="size-5 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-black">{stats.totalViews}</p>
                </div>
                <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 col-span-2">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Investor Inquiries</p>
                        <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <MessageSquare className="size-5 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-emerald-600">{stats.totalInquiries}</p>
                    <p className="text-[8px] font-bold text-slate-500 mt-1">Across all requests</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {["All", "Active", "Under Review", "Closed"].map((filter) => (
                    <button
                        key={filter}
                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === "All"
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {requests.map((request) => (
                    <div
                        key={request.id}
                        className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className={`inline-flex items-center px-2 py-0.5 rounded-md bg-${request.sectorColor}-500/10 border border-${request.sectorColor}-500/10`}
                                    >
                                        <span className={`text-[8px] font-black uppercase tracking-widest text-${request.sectorColor}-600`}>
                                            {request.sector}
                                        </span>
                                    </div>
                                    <div
                                        className={`px-2 py-0.5 rounded-full bg-${request.statusColor}-500/10 border border-${request.statusColor}-500/20`}
                                    >
                                        <span className={`text-[8px] font-black uppercase tracking-widest text-${request.statusColor}-600`}>
                                            {request.status}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="font-black text-lg tracking-tight mb-1">{request.title}</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{request.description}</p>
                            </div>
                            <button className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-all shrink-0 ml-3">
                                <MoreVertical className="size-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Funding Details */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3 border border-emerald-200 dark:border-emerald-900">
                                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-0.5">Seeking</p>
                                <p className="text-base font-black text-emerald-700 dark:text-emerald-500">{request.amount}</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-3 border border-blue-200 dark:border-blue-900">
                                <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-0.5">Equity</p>
                                <p className="text-base font-black text-blue-700 dark:text-blue-500">{request.equity}</p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-3 border border-purple-200 dark:border-purple-900">
                                <p className="text-[9px] font-black uppercase tracking-widest text-purple-600 mb-0.5">Duration</p>
                                <p className="text-xs font-black text-purple-700 dark:text-purple-500">{request.duration}</p>
                            </div>
                        </div>

                        {/* Meta & Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10">
                            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                <div className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    <span>{request.postedDate}</span>
                                </div>
                                <div className="size-1 rounded-full bg-slate-200" />
                                <div className="flex items-center gap-1">
                                    <Eye className="size-3" />
                                    <span>{request.views}</span>
                                </div>
                                <div className="size-1 rounded-full bg-slate-200" />
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="size-3" />
                                    <span>{request.inquiries}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="size-9 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center active:scale-90 transition-all">
                                    <Edit2 className="size-4 text-blue-600" />
                                </button>
                                <button className="size-9 rounded-xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center active:scale-90 transition-all">
                                    <Trash2 className="size-4 text-red-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State (if no requests) */}
            {/* Uncomment when needed
      <div className="text-center py-12">
        <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <FileText className="size-8 text-slate-400" />
        </div>
        <p className="text-lg font-black text-slate-400">No funding requests yet</p>
        <p className="text-xs text-slate-500 mt-1 mb-4">Start by posting your first funding need</p>
        <button className="px-6 py-3 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
          Post Funding Need
        </button>
      </div>
      */}
        </div>
    );
};

export default MyFundingRequests;
