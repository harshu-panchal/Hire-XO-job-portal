import { useState } from "react";
import { Search, Filter, Building2, Clock, ChevronRight, MessageSquare, Download, Users } from "lucide-react";

const ReceivedBids = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");

    const bids = [
        {
            id: 1,
            vendorName: "EcoBuild Infrastructure Ltd.",
            tenderTitle: "Smart City Infrastructure Phase 2",
            amount: "₹23.5 Cr",
            submittedDate: "12 Sep 2024",
            status: "New",
            statusColor: "text-blue-600",
            statusBg: "bg-blue-100 dark:bg-blue-950/30",
            location: "Mumbai",
            rating: 4.8
        },
        {
            id: 2,
            vendorName: "SolarTech Solutions",
            tenderTitle: "Solar Power Plant Installation",
            amount: "₹11.2 Cr",
            submittedDate: "05 Sep 2024",
            status: "Under Review",
            statusColor: "text-amber-600",
            statusBg: "bg-amber-100 dark:bg-amber-950/30",
            location: "Pune",
            rating: 4.5
        },
        {
            id: 3,
            vendorName: "Global IT Systems",
            tenderTitle: "E-Governance Software Solution",
            amount: "₹4.8 Cr",
            submittedDate: "01 Sep 2024",
            status: "Shortlisted",
            statusColor: "text-emerald-600",
            statusBg: "bg-emerald-100 dark:bg-emerald-950/30",
            location: "Bangalore",
            rating: 4.9
        },
        {
            id: 4,
            vendorName: "Constructo Group",
            tenderTitle: "Smart City Infrastructure Phase 2",
            amount: "₹24.1 Cr",
            submittedDate: "10 Sep 2024",
            status: "Rejected",
            statusColor: "text-rose-600",
            statusBg: "bg-rose-100 dark:bg-rose-950/30",
            location: "Hyderabad",
            rating: 4.2
        }
    ];

    const statuses = ["All", "New", "Under Review", "Shortlisted", "Rejected"];

    const filteredBids = bids.filter(bid =>
        (selectedStatus === "All" || bid.status === selectedStatus) &&
        (bid.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bid.tenderTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight">Received Bids</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    Manage incoming proposals from vendors
                </p>
            </div>

            {/* Search & Filters */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search bids, vendors or tenders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-sm font-bold focus:outline-none shadow-sm"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white active:scale-95 transition-transform shadow-lg shadow-indigo-500/20">
                        <Filter className="size-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {statuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedStatus === status
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/10"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bids List */}
            <div className="space-y-5">
                {filteredBids.map((bid) => (
                    <div key={bid.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        {/* Status Badge */}
                        <div className="absolute top-0 right-0 pt-6 pr-6">
                            <div className={`px-4 py-1.5 rounded-full ${bid.statusBg} ${bid.statusColor} text-[8px] font-black uppercase tracking-widest border border-current opacity-80 shrink-0`}>
                                {bid.status}
                            </div>
                        </div>

                        {/* Top Section */}
                        <div className="flex items-start gap-4 mb-4 pr-32">
                            <div className="size-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center shrink-0">
                                <Building2 className="size-7 text-indigo-600" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-black tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{bid.vendorName}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-500 font-black text-xs">★ {bid.rating}</span>
                                    <span className="size-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">{bid.tenderTitle}</p>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Proposed Amount</p>
                                <p className="text-xl font-black text-indigo-600 tracking-tight">{bid.amount}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Submission Date</p>
                                <div className="flex items-center justify-end gap-1">
                                    <Clock className="size-3 text-slate-400" />
                                    <p className="text-[11px] font-black">{bid.submittedDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                            <button className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2">
                                View Proposal <ChevronRight className="size-4" />
                            </button>
                            <button className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center active:scale-95 transition-all">
                                <MessageSquare className="size-5" />
                            </button>
                            <button className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center active:scale-95 transition-all">
                                <Download className="size-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredBids.length === 0 && (
                    <div className="text-center py-20 opacity-50 space-y-4">
                        <Users className="size-16 mx-auto text-slate-300" />
                        <p className="text-xs font-black uppercase tracking-widest">No matching bids found</p>
                    </div>
                )}
            </div>

            {/* Float Footer placeholder for mobile action */}
            <div className="h-4" />
        </div>
    );
};

export default ReceivedBids;
