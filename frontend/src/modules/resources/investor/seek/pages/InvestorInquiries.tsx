import { Search, MessageSquare, Clock, CheckCircle2, XCircle, X, Send, Eye, Mail, Phone, User } from "lucide-react";
import { useState, useEffect } from "react";
import { applicationService, type Application } from "@/services/applicationService";
import { useAuthStore } from "@/store/useAuthStore";

const InvestorInquiries = () => {
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                // Fetch inquiries for 'investors' category (Funding Requests)
                const data = await applicationService.getReceivedResourceApplications('investors');

                // Map to component format
                const formatted = data.map((app: any) => ({
                    id: app._id,
                    investorName: app.applicantId?.name || "Unknown Investor",
                    investorInitials: (app.applicantId?.name || "U").substring(0, 2).toUpperCase(),
                    investorGradient: "from-blue-500 to-cyan-600", // Static for now
                    investorEmail: app.applicantId?.email || "N/A",
                    investorPhone: app.applicantId?.phoneNumber || "N/A",
                    fundingRequest: app.resourceId?.title || "Funding Request", // Assuming we populate resourceId or have title
                    message: app.message?.substring(0, 100) + (app.message?.length > 100 ? "..." : "") || "No message",
                    fullMessage: app.message || "No message provided.",
                    timestamp: new Date(app.appliedAt).toLocaleDateString(),
                    status: app.status.toLowerCase(), // 'pending', 'accepted', 'rejected'
                    requestAmount: app.resourceId?.amount || "N/A", // If populated
                    date: new Date(app.appliedAt).toLocaleDateString(),
                    rawStatus: app.status // Keep original for logic if needed
                }));

                setInquiries(formatted);
            } catch (error) {
                console.error("Failed to fetch inquiries", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, []);

    const stats = {
        total: inquiries.length,
        unread: inquiries.filter((i) => i.status === "pending").length, // Mapping Pending to Unread for UI
        replied: inquiries.filter((i) => i.status === "accepted").length, // Mapping Accepted to Replied/Done
    };

    // Filter inquiries based on filter and search
    const filteredInquiries = inquiries.filter((inquiry) => {
        // Map UI filters to Backend status
        // UI: unread, read, replied
        // Backend: Pending, Rejected, Accepted
        let statusMatch = true;
        if (filter === 'unread') statusMatch = inquiry.status === 'pending';
        if (filter === 'read') statusMatch = inquiry.status !== 'pending'; // roughly
        if (filter === 'replied') statusMatch = inquiry.status === 'accepted';

        const matchesFilter = filter === "all" || statusMatch;
        const matchesSearch =
            inquiry.investorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inquiry.fundingRequest.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleReply = (inquiry: any) => {
        setSelectedInquiry(inquiry);
        setShowReplyModal(true);
    };

    const handleViewDetails = (inquiry: any) => {
        setSelectedInquiry(inquiry);
        setShowViewModal(true);
    };

    const sendReply = () => {
        if (replyMessage.trim() && selectedInquiry) {
            // In a real app, this would send an email or internal message API call
            alert(`Reply sent to ${selectedInquiry.investorEmail}`);
            // Optimistically update status to 'replied' (Accepted in our mapping?)
            // Or just close modal
            setShowReplyModal(false);
            setReplyMessage("");
            setSelectedInquiry(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return { color: "blue", icon: MessageSquare, label: "New" };
            case "read":
            case "rejected":
                return { color: "amber", icon: Clock, label: "Read" };
            case "replied":
            case "accepted":
                return { color: "emerald", icon: CheckCircle2, label: "Replied" };
            default:
                return { color: "slate", icon: XCircle, label: "Unknown" };
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Inquiries...</div>;

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
                    <p className="text-[8px] font-black uppercase tracking-widest text-blue-600 mt-0.5">Pending</p>
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 rounded-[1.5rem] bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 size-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            <X className="size-4 text-slate-600 dark:text-slate-400" />
                        </button>
                    )}
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {[
                        { id: "all", label: "All Inquiries" },
                        { id: "unread", label: "Pending" },
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
                                onClick={() => handleViewDetails(inquiry)}
                                className={`bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border transition-all active:scale-[0.98] cursor-pointer hover:shadow-lg ${inquiry.status === "pending"
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
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReply(inquiry);
                                        }}
                                        className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/20 active:scale-95 transition-all"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Reply Modal */}
            {showReplyModal && selectedInquiry && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`size-12 rounded-xl bg-gradient-to-br ${selectedInquiry.investorGradient} flex items-center justify-center text-white font-black text-sm`}>
                                    {selectedInquiry.investorInitials}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black">Reply to {selectedInquiry.investorName}</h3>
                                    <p className="text-xs text-slate-500">Regarding: {selectedInquiry.fundingRequest}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowReplyModal(false);
                                    setReplyMessage("");
                                }}
                                className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 transition-all"
                            >
                                <X className="size-5 text-slate-600 dark:text-slate-400" />
                            </button>
                        </div>

                        {/* Original Message */}
                        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Original Message</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{selectedInquiry.fullMessage}</p>
                            <div className="flex items-center gap-2 mt-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                <Clock className="size-3" />
                                <span>{selectedInquiry.timestamp}</span>
                            </div>
                        </div>

                        {/* Reply Input */}
                        <div className="mb-6">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Your Reply</label>
                            <textarea
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Type your message here..."
                                rows={6}
                                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            />
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900">
                            <div className="flex items-center gap-2">
                                <Mail className="size-4 text-blue-600" />
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-blue-600">Email</p>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedInquiry.investorEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="size-4 text-blue-600" />
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-blue-600">Phone</p>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedInquiry.investorPhone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowReplyModal(false);
                                    setReplyMessage("");
                                }}
                                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={sendReply}
                                disabled={!replyMessage.trim()}
                                className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Send className="size-4" />
                                Send Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {showViewModal && selectedInquiry && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl my-8">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3 flex-1">
                                <div className={`size-14 rounded-xl bg-gradient-to-br ${selectedInquiry.investorGradient} flex items-center justify-center text-white font-black text-lg`}>
                                    {selectedInquiry.investorInitials}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black">{selectedInquiry.investorName}</h2>
                                    <p className="text-sm text-slate-500">Regarding: {selectedInquiry.fundingRequest}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 transition-all shrink-0 ml-4"
                            >
                                <X className="size-5 text-slate-600 dark:text-slate-400" />
                            </button>
                        </div>

                        {/* Status Badge */}
                        <div className="mb-6">
                            {(() => {
                                const statusBadge = getStatusBadge(selectedInquiry.status);
                                const StatusIcon = statusBadge.icon;
                                return (
                                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full bg-${statusBadge.color}-500/10 border border-${statusBadge.color}-500/20`}>
                                        <StatusIcon className={`size-4 text-${statusBadge.color}-600`} />
                                        <span className={`text-xs font-black uppercase tracking-widest text-${statusBadge.color}-600`}>
                                            {statusBadge.label}
                                        </span>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Full Message */}
                        <div className="mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">Message</h3>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                {selectedInquiry.fullMessage}
                            </p>
                        </div>

                        {/* Inquiry Details */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-900">
                                <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-1">Request Amount</p>
                                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-500">{selectedInquiry.requestAmount}</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-900">
                                <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-1">Received</p>
                                <p className="text-lg font-black text-blue-700 dark:text-blue-500">{selectedInquiry.timestamp}</p>
                                <p className="text-xs text-slate-500 mt-1">{selectedInquiry.date}</p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-6 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">Contact Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center">
                                        <Mail className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Email Address</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedInquiry.investorEmail}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center">
                                        <Phone className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Phone Number</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedInquiry.investorPhone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    handleReply(selectedInquiry);
                                }}
                                className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                            >
                                <Send className="size-4" />
                                Reply to Inquiry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestorInquiries;
