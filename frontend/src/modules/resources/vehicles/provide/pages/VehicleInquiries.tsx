import { useState } from "react";
import { Search, Phone, Mail, X, Car, Calendar, MapPin, MessageSquare, CheckCircle2, Clock, Filter } from "lucide-react";

interface Inquiry {
    id: number;
    name: string;
    role: string;
    message: string;
    time: string;
    status: "New" | "Replied" | "Closed";
    initial: string;
    color: string;
    phone?: string;
    email?: string;
    vehicle?: string;
    location?: string;
    rentalDates?: string;
    budget?: string;
}

const VehicleInquiries = () => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([
        {
            id: 1,
            name: "Rahul Mehta",
            role: "Logistics Manager",
            message: "Interested in renting the Tata Ace for 3 days for local shifting. Need quote for insurance as well.",
            time: "2h ago",
            status: "New",
            initial: "RM",
            color: "from-blue-500 to-cyan-600",
            phone: "+91 98765 43210",
            email: "rahul.mehta@example.com",
            vehicle: "Tata Ace Delivery Van",
            location: "Mumbai, Maharashtra",
            rentalDates: "Feb 5-8, 2026",
            budget: "₹5,000 - ₹6,000"
        },
        {
            id: 2,
            name: "Anjali Sharma",
            role: "Event Planner",
            message: "Need a luxury sedan for a wedding ceremony in South Delhi next week. Please confirm availability.",
            time: "5h ago",
            status: "Replied",
            initial: "AS",
            color: "from-cyan-500 to-blue-600",
            phone: "+91 87654 32109",
            email: "anjali.sharma@events.com",
            vehicle: "Tesla Model 3 Long Range",
            location: "Delhi NCR",
            rentalDates: "Feb 10-12, 2026",
            budget: "₹12,000 - ₹15,000"
        },
        {
            id: 3,
            name: "Vikram Singh",
            role: "Business Owner",
            message: "Looking for a commercial vehicle for daily deliveries. Interested in long-term rental options.",
            time: "1 day ago",
            status: "New",
            initial: "VS",
            color: "from-purple-500 to-pink-600",
            phone: "+91 76543 21098",
            email: "vikram@business.com",
            vehicle: "Tata Ace Delivery Van",
            location: "Pune, Maharashtra",
            rentalDates: "Feb 3 - Mar 3, 2026",
            budget: "₹40,000 - ₹50,000"
        },
        {
            id: 4,
            name: "Priya Patel",
            role: "Corporate Executive",
            message: "Need an electric car for airport transfers and business meetings. Prefer Tesla.",
            time: "2 days ago",
            status: "Closed",
            initial: "PP",
            color: "from-emerald-500 to-teal-600",
            phone: "+91 65432 10987",
            email: "priya.patel@corp.com",
            vehicle: "Tesla Model 3 Long Range",
            location: "Bangalore, Karnataka",
            rentalDates: "Jan 28-30, 2026",
            budget: "₹10,000 - ₹12,000"
        }
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "New" | "Replied" | "Closed">("All");
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const handleCall = (phone: string, name: string) => {
        alert(`Calling ${name} at ${phone}...`);
        // In production, this would initiate a call
    };

    const handleEmail = (email: string, name: string) => {
        alert(`Opening email to ${name} (${email})...`);
        // In production, this would open email client
        window.location.href = `mailto:${email}`;
    };

    const handleStatusChange = (id: number, newStatus: "New" | "Replied" | "Closed") => {
        setInquiries(inquiries.map(inq =>
            inq.id === id ? { ...inq, status: newStatus } : inq
        ));
        setShowDetailModal(false);
        alert(`Inquiry marked as ${newStatus}!`);
    };

    const handleViewDetails = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        setShowDetailModal(true);
    };

    // Filter inquiries based on search and status
    const filteredInquiries = inquiries.filter(inquiry => {
        const matchesSearch = inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inquiry.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || inquiry.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        All: inquiries.length,
        New: inquiries.filter(i => i.status === "New").length,
        Replied: inquiries.filter(i => i.status === "Replied").length,
        Closed: inquiries.filter(i => i.status === "Closed").length
    };

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="space-y-4 px-1">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-black tracking-tighter italic">Inquiries</h1>
                    <button
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
                    >
                        <Filter className="size-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
                        <Search className="size-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-blue-600 transition-all font-sans"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                {/* Filter Menu */}
                {showFilterMenu && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-white/10 space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Filter by Status</p>
                        <div className="grid grid-cols-2 gap-2">
                            {(["All", "New", "Replied", "Closed"] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setShowFilterMenu(false);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === status
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                            : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    {status} ({statusCounts[status]})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Filter Badge */}
                {statusFilter !== "All" && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Filtered:</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                            <span className="text-xs font-bold text-blue-600">{statusFilter}</span>
                            <button
                                onClick={() => setStatusFilter("All")}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                <X className="size-3" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-2xl border border-blue-200 dark:border-blue-900">
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">New</p>
                    <p className="text-2xl font-black text-blue-600">{statusCounts.New}</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">Replied</p>
                    <p className="text-2xl font-black text-emerald-600">{statusCounts.Replied}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-1">Closed</p>
                    <p className="text-2xl font-black text-slate-600 dark:text-slate-400">{statusCounts.Closed}</p>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {filteredInquiries.length > 0 ? (
                    filteredInquiries.map((inquiry) => (
                        <div
                            key={inquiry.id}
                            onClick={() => handleViewDetails(inquiry)}
                            className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-5 border border-slate-200 dark:border-white/10 group active:scale-[0.98] transition-all cursor-pointer hover:shadow-lg"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`size-14 rounded-2xl bg-gradient-to-br ${inquiry.color} flex items-center justify-center text-white text-xl font-black shadow-lg shrink-0`}>
                                    {inquiry.initial}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                        <div>
                                            <h3 className="font-black text-base tracking-tight">{inquiry.name}</h3>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">{inquiry.role}</p>
                                        </div>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{inquiry.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 font-medium leading-relaxed">
                                        "{inquiry.message}"
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCall(inquiry.phone || "", inquiry.name);
                                                }}
                                                className="size-9 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all border border-slate-100 dark:border-white/5"
                                            >
                                                <Phone className="size-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEmail(inquiry.email || "", inquiry.name);
                                                }}
                                                className="size-9 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all border border-slate-100 dark:border-white/5"
                                            >
                                                <Mail className="size-4" />
                                            </button>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${inquiry.status === "New"
                                                ? "bg-blue-600 text-white"
                                                : inquiry.status === "Replied"
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-slate-100 text-slate-400 dark:bg-white/5"
                                            }`}>
                                            {inquiry.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <MessageSquare className="size-12 text-slate-200 dark:text-white/10 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-400">No inquiries found</p>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedInquiry && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`size-16 rounded-2xl bg-gradient-to-br ${selectedInquiry.color} flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
                                    {selectedInquiry.initial}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black">{selectedInquiry.name}</h3>
                                    <p className="text-sm text-slate-500">{selectedInquiry.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Status Badge */}
                            <div className={`inline-flex px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${selectedInquiry.status === "New"
                                    ? "bg-blue-600 text-white"
                                    : selectedInquiry.status === "Replied"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-slate-100 text-slate-400 dark:bg-white/5"
                                }`}>
                                {selectedInquiry.status}
                            </div>

                            {/* Message */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Message</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">"{selectedInquiry.message}"</p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Car className="size-4 text-blue-600" />
                                        <p className="text-xs font-black uppercase tracking-widest text-blue-600">Vehicle</p>
                                    </div>
                                    <p className="text-sm font-bold text-blue-600">{selectedInquiry.vehicle}</p>
                                </div>

                                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-2xl border border-purple-200 dark:border-purple-900">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="size-4 text-purple-600" />
                                        <p className="text-xs font-black uppercase tracking-widest text-purple-600">Dates</p>
                                    </div>
                                    <p className="text-sm font-bold text-purple-600">{selectedInquiry.rentalDates}</p>
                                </div>

                                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="size-4 text-emerald-600" />
                                        <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Location</p>
                                    </div>
                                    <p className="text-sm font-bold text-emerald-600">{selectedInquiry.location}</p>
                                </div>

                                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-200 dark:border-orange-900">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="size-4 text-orange-600" />
                                        <p className="text-xs font-black uppercase tracking-widest text-orange-600">Budget</p>
                                    </div>
                                    <p className="text-sm font-bold text-orange-600">{selectedInquiry.budget}</p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <Phone className="size-5 text-slate-400" />
                                    <div className="flex-1">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Phone</p>
                                        <p className="text-sm font-bold">{selectedInquiry.phone}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCall(selectedInquiry.phone || "", selectedInquiry.name)}
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all"
                                    >
                                        Call
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <Mail className="size-5 text-slate-400" />
                                    <div className="flex-1">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Email</p>
                                        <p className="text-sm font-bold">{selectedInquiry.email}</p>
                                    </div>
                                    <button
                                        onClick={() => handleEmail(selectedInquiry.email || "", selectedInquiry.name)}
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all"
                                    >
                                        Email
                                    </button>
                                </div>
                            </div>

                            {/* Status Actions */}
                            <div className="pt-6 border-t border-slate-200 dark:border-white/10">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Update Status</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => handleStatusChange(selectedInquiry.id, "New")}
                                        className="px-4 py-3 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Clock className="size-4" />
                                        New
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(selectedInquiry.id, "Replied")}
                                        className="px-4 py-3 rounded-xl bg-emerald-500 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare className="size-4" />
                                        Replied
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(selectedInquiry.id, "Closed")}
                                        className="px-4 py-3 rounded-xl bg-slate-600 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="size-4" />
                                        Closed
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleInquiries;
