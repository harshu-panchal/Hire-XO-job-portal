import { useState } from "react";
import { Search, Filter, Building2, Clock, ChevronRight, MessageSquare, Download, Users, X, Send, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Bid {
    id: number;
    vendorName: string;
    tenderTitle: string;
    amount: string;
    submittedDate: string;
    status: string;
    statusColor: string;
    statusBg: string;
    location: string;
    rating: number;
    email?: string;
    phone?: string;
    experience?: string;
    proposal?: string;
}

const ReceivedBids = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
    const [message, setMessage] = useState("");
    const [bids, setBids] = useState<Bid[]>([
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
            rating: 4.8,
            email: "contact@ecobuild.com",
            phone: "+91 98765 43210",
            experience: "15+ years in infrastructure development",
            proposal: "We propose a comprehensive smart city infrastructure solution with IoT integration, sustainable materials, and advanced traffic management systems. Our team has successfully delivered 50+ similar projects across India."
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
            rating: 4.5,
            email: "info@solartech.com",
            phone: "+91 98765 43211",
            experience: "10+ years in renewable energy",
            proposal: "Our proposal includes high-efficiency solar panels, battery storage systems, and smart grid integration. We guarantee 25-year performance warranty and 24/7 monitoring."
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
            rating: 4.9,
            email: "sales@globalit.com",
            phone: "+91 98765 43212",
            experience: "12+ years in government IT solutions",
            proposal: "Cloud-based e-governance platform with citizen portal, document management, and analytics dashboard. Compliant with all government security standards."
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
            rating: 4.2,
            email: "contact@constructo.com",
            phone: "+91 98765 43213",
            experience: "8+ years in construction",
            proposal: "Traditional infrastructure approach with proven methodologies and experienced workforce."
        }
    ]);

    const statuses = ["All", "New", "Under Review", "Shortlisted", "Rejected"];

    const filteredBids = bids.filter(bid =>
        (selectedStatus === "All" || bid.status === selectedStatus) &&
        (bid.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bid.tenderTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleViewProposal = (bid: Bid) => {
        setSelectedBid(bid);
        setShowProposalModal(true);
    };

    const handleMessage = (bid: Bid) => {
        setSelectedBid(bid);
        setShowMessageModal(true);
    };

    const handleDownload = (bid: Bid) => {
        alert(`Downloading proposal from ${bid.vendorName}...`);
        // Simulate download
        console.log("Downloading proposal for bid:", bid.id);
    };

    const sendMessage = () => {
        if (message.trim() && selectedBid) {
            alert(`Message sent to ${selectedBid.vendorName}!`);
            setMessage("");
            setShowMessageModal(false);
        }
    };

    const updateBidStatus = (bidId: number, newStatus: string) => {
        setBids(bids.map(bid => {
            if (bid.id === bidId) {
                let statusColor = "";
                let statusBg = "";

                switch (newStatus) {
                    case "New":
                        statusColor = "text-blue-600";
                        statusBg = "bg-blue-100 dark:bg-blue-950/30";
                        break;
                    case "Under Review":
                        statusColor = "text-amber-600";
                        statusBg = "bg-amber-100 dark:bg-amber-950/30";
                        break;
                    case "Shortlisted":
                        statusColor = "text-emerald-600";
                        statusBg = "bg-emerald-100 dark:bg-emerald-950/30";
                        break;
                    case "Rejected":
                        statusColor = "text-rose-600";
                        statusBg = "bg-rose-100 dark:bg-rose-950/30";
                        break;
                }

                return { ...bid, status: newStatus, statusColor, statusBg };
            }
            return bid;
        }));
        setShowProposalModal(false);
    };

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
                    <button
                        onClick={() => setShowFilterModal(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
                    >
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
                                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/10 hover:border-indigo-300"
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
                            <button
                                onClick={() => handleViewProposal(bid)}
                                className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                View Proposal <ChevronRight className="size-4" />
                            </button>
                            <button
                                onClick={() => handleMessage(bid)}
                                className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-950/40 active:scale-95 transition-all"
                            >
                                <MessageSquare className="size-5" />
                            </button>
                            <button
                                onClick={() => handleDownload(bid)}
                                className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
                            >
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

            {/* Proposal Modal */}
            {showProposalModal && selectedBid && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black">Bid Proposal</h3>
                                <p className="text-xs text-slate-500 mt-1">{selectedBid.vendorName}</p>
                            </div>
                            <button
                                onClick={() => setShowProposalModal(false)}
                                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Vendor Info */}
                        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="size-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center">
                                    <Building2 className="size-8 text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-black mb-1">{selectedBid.vendorName}</h4>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-amber-500 font-black text-sm">★ {selectedBid.rating}</span>
                                        <span className="size-1 rounded-full bg-slate-300" />
                                        <span className="text-xs text-slate-500">{selectedBid.location}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">{selectedBid.experience}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Email</p>
                                    <p className="text-xs font-bold">{selectedBid.email}</p>
                                </div>
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Phone</p>
                                    <p className="text-xs font-bold">{selectedBid.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tender Details */}
                        <div className="mb-6">
                            <h5 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">Tender Details</h5>
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                                <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-1">Project</p>
                                <p className="text-base font-black mb-3">{selectedBid.tenderTitle}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Bid Amount</p>
                                        <p className="text-xl font-black text-indigo-600">{selectedBid.amount}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Submitted</p>
                                        <p className="text-sm font-bold">{selectedBid.submittedDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Proposal Content */}
                        <div className="mb-6">
                            <h5 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">Proposal Summary</h5>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{selectedBid.proposal}</p>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="mb-6">
                            <h5 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">Attached Documents</h5>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <FileText className="size-5 text-indigo-600" />
                                    <div className="flex-1">
                                        <p className="text-xs font-black">Technical Proposal.pdf</p>
                                        <p className="text-[10px] text-slate-500">2.4 MB</p>
                                    </div>
                                    <button className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-950/30 transition-all">
                                        <Download className="size-4 text-indigo-600" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <FileText className="size-5 text-indigo-600" />
                                    <div className="flex-1">
                                        <p className="text-xs font-black">Financial Proposal.pdf</p>
                                        <p className="text-[10px] text-slate-500">1.8 MB</p>
                                    </div>
                                    <button className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-950/30 transition-all">
                                        <Download className="size-4 text-indigo-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => updateBidStatus(selectedBid.id, "Shortlisted")}
                                className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="size-4" />
                                Shortlist
                            </button>
                            <button
                                onClick={() => updateBidStatus(selectedBid.id, "Rejected")}
                                className="flex-1 px-4 py-3 rounded-xl bg-rose-600 text-white font-black text-sm uppercase tracking-widest hover:bg-rose-700 active:scale-95 transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
                            >
                                <XCircle className="size-4" />
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message Modal */}
            {showMessageModal && selectedBid && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black">Send Message</h3>
                                <p className="text-xs text-slate-500 mt-1">To: {selectedBid.vendorName}</p>
                            </div>
                            <button
                                onClick={() => setShowMessageModal(false)}
                                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={6}
                                placeholder="Type your message here..."
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all resize-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowMessageModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={sendMessage}
                                className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                            >
                                <Send className="size-4" />
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black">Advanced Filters</h3>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900">
                                <AlertCircle className="size-5 text-blue-600 mb-2" />
                                <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Filter Options Coming Soon</p>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Advanced filtering by amount range, rating, location, and submission date will be available soon.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowFilterModal(false)}
                            className="w-full mt-4 px-4 py-3 rounded-xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20"
                        >
                            Got It
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceivedBids;
