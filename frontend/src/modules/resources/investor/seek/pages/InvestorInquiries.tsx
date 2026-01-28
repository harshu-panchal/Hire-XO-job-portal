import { Search, MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

const InvestorInquiries = () => {
    const [filter, setFilter] = useState("all");

    const inquiries = [
        {
            id: 1,
            investorName: "Rajesh Kumar",
            investorInitials: "RK",
            investorGradient: "from-blue-500 to-cyan-600",
            fundingRequest: "AI-Powered SaaS Platform",
            message: "Interested in your AI SaaS platform. Would like to discuss investment terms and growth projections. Can we schedule a call this week?",
            timestamp: "2 hours ago",
            status: "unread",
            requestAmount: "₹5 Cr",
        },
        {
            id: 2,
            investorName: "Anita Sharma",
            investorInitials: "AS",
            investorGradient: "from-purple-500 to-pink-600",
            fundingRequest: "Solar Panel Manufacturing",
            message: "Looking for more details on your manufacturing expansion plans. What are the projected returns and timeline for break-even?",
            timestamp: "5 hours ago",
            status: "unread",
            requestAmount: "₹12 Cr",
        },
        {
            id: 3,
            investorName: "Vikram Patel",
            investorInitials: "VP",
            investorGradient: "from-green-500 to-emerald-600",
            fundingRequest: "Telemedicine Platform",
            message: "Your telemedicine platform looks promising. I have experience in healthcare tech. Let's connect to discuss partnership opportunities.",
            timestamp: "1 day ago",
            status: "read",
            requestAmount: "₹8 Cr",
        },
        {
            id: 4,
            investorName: "Priya Mehta",
            investorInitials: "PM",
            investorGradient: "from-orange-500 to-red-600",
            fundingRequest: "AI-Powered SaaS Platform",
            message: "I'm interested in the technology sector. Can you share your pitch deck and financial projections?",
            timestamp: "2 days ago",
            status: "replied",
            requestAmount: "₹5 Cr",
        },
        {
            id: 5,
            investorName: "Amit Singh",
            investorInitials: "AS",
            investorGradient: "from-cyan-500 to-blue-600",
            fundingRequest: "Solar Panel Manufacturing",
            message: "Have you secured any government subsidies or partnerships? Would like to know more about the regulatory approvals.",
            timestamp: "3 days ago",
            status: "read",
            requestAmount: "₹12 Cr",
        },
    ];

    const stats = {
        total: inquiries.length,
        unread: inquiries.filter((i) => i.status === "unread").length,
        replied: inquiries.filter((i) => i.status === "replied").length,
    };

    const filteredInquiries = inquiries.filter((inquiry) => {
        if (filter === "all") return true;
        return inquiry.status === filter;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "unread":
                return { color: "blue", icon: MessageSquare, label: "New" };
            case "read":
                return { color: "amber", icon: Clock, label: "Read" };
            case "replied":
                return { color: "emerald", icon: CheckCircle2, label: "Replied" };
            default:
                return { color: "slate", icon: XCircle, label: "Unknown" };
        }
    };

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="px-1">
                <h1 className="text-3xl font-black tracking-tight">
                    Investor <span className="text-primary">Inquiries</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest mt-1">
                    Manage investor messages and inquiries
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-[2rem] p-4 border border-primary/20 text-center">
                    <p className="text-2xl font-black">{stats.total}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-0.5">Total</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-[2rem] p-4 border border-blue-200 dark:border-blue-900 text-center">
                    <p className="text-2xl font-black text-blue-600">{stats.unread}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-blue-600 mt-0.5">Unread</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-[2rem] p-4 border border-emerald-200 dark:border-emerald-900 text-center">
                    <p className="text-2xl font-black text-emerald-600">{stats.replied}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600 mt-0.5">Replied</p>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search inquiries..."
                        className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {[
                        { id: "all", label: "All Inquiries" },
                        { id: "unread", label: "Unread" },
                        { id: "read", label: "Read" },
                        { id: "replied", label: "Replied" },
                    ].map((filterOption) => (
                        <button
                            key={filterOption.id}
                            onClick={() => setFilter(filterOption.id)}
                            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === filterOption.id
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                }`}
                        >
                            {filterOption.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inquiries List */}
            <div className="space-y-3">
                {filteredInquiries.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="size-8 text-slate-400" />
                        </div>
                        <p className="text-lg font-black text-slate-400">No inquiries found</p>
                        <p className="text-xs text-slate-500 mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    filteredInquiries.map((inquiry) => {
                        const statusBadge = getStatusBadge(inquiry.status);
                        const StatusIcon = statusBadge.icon;

                        return (
                            <div
                                key={inquiry.id}
                                className={`bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border transition-all active:scale-[0.98] cursor-pointer ${inquiry.status === "unread"
                                    ? "border-primary/30 shadow-lg shadow-primary/5"
                                    : "border-slate-200 dark:border-white/10"
                                    }`}
                            >
                                {/* Header */}
                                <div className="flex items-start gap-3 mb-3">
                                    <div
                                        className={`size-12 rounded-xl bg-gradient-to-br ${inquiry.investorGradient} flex items-center justify-center text-white font-black text-sm shrink-0`}
                                    >
                                        {inquiry.investorInitials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div>
                                                <p className="font-black text-base">{inquiry.investorName}</p>
                                                <p className="text-xs text-slate-500">Regarding: {inquiry.fundingRequest}</p>
                                            </div>
                                            <div
                                                className={`flex items-center gap-1 px-2 py-1 rounded-full bg-${statusBadge.color}-500/10 border border-${statusBadge.color}-500/20 shrink-0`}
                                            >
                                                <StatusIcon className={`size-3 text-${statusBadge.color}-600`} />
                                                <span className={`text-[8px] font-black uppercase tracking-widest text-${statusBadge.color}-600`}>
                                                    {statusBadge.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message */}
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{inquiry.message}</p>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10">
                                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                        <Clock className="size-3" />
                                        <span>{inquiry.timestamp}</span>
                                        <div className="size-1 rounded-full bg-slate-200" />
                                        <span className="text-emerald-600">{inquiry.requestAmount}</span>
                                    </div>
                                    <button className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                                        Reply
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default InvestorInquiries;
