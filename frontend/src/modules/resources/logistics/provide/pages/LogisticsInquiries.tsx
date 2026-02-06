import {
  Search,
  Phone,
  Mail,
  Filter,
  CheckCircle2,
  Clock,
  X,
  MapPin,
  Package,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useState } from "react";

interface Inquiry {
  id: number;
  name: string;
  role: string;
  company?: string;
  message: string;
  time: string;
  status: "New" | "Replied" | "Closed";
  initial: string;
  color: string;
  phone?: string;
  email?: string;
  route?: string;
  cargo?: string;
  weight?: string;
  date?: string;
  budget?: string;
}

const LogisticsInquiries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "New" | "Replied" | "Closed">("All");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([
    {
      id: 1,
      name: "Priya Verma",
      role: "Supply Chain Manager",
      company: "MetalWorks Industries",
      message:
        "Looking for 20-ton open truck for metal bars from Pune to Surat. Immediate requirement.",
      time: "1h ago",
      status: "New",
      initial: "PV",
      color: "from-orange-500 to-red-600",
      phone: "+91 98765 43210",
      email: "priya.verma@company.com",
      route: "Pune → Surat",
      cargo: "Metal Bars (Steel)",
      weight: "20 Tons",
      date: "Feb 5-7, 2026",
      budget: "₹45,000 - ₹55,000",
    },
    {
      id: 2,
      name: "Sanjay Kumar",
      role: "Wholesale Trader",
      company: "BuildMart Supplies",
      message:
        "Need quote for 10 shipments of cement bags within Maharashtra. Recurring monthly load.",
      time: "4h ago",
      status: "Replied",
      initial: "SK",
      color: "from-red-500 to-orange-600",
      phone: "+91 87654 32109",
      email: "sanjay.k@business.com",
      route: "Multiple locations in Maharashtra",
      cargo: "Cement Bags (50kg each)",
      weight: "15 Tons per shipment",
      date: "Monthly recurring",
      budget: "₹35,000 per shipment",
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "Logistics Coordinator",
      company: "MediCare Pharmaceuticals",
      message:
        "Require temperature-controlled transport for pharmaceutical products. Delhi to Mumbai route.",
      time: "1 day ago",
      status: "New",
      initial: "AP",
      color: "from-blue-500 to-cyan-600",
      phone: "+91 76543 21098",
      email: "amit.patel@pharma.com",
      route: "Delhi → Mumbai",
      cargo: "Pharmaceutical Products (Temperature Sensitive)",
      weight: "5 Tons",
      date: "Feb 10, 2026",
      budget: "₹80,000 - ₹1,00,000",
    },
  ]);

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCall = (inquiry: Inquiry) => {
    if (inquiry.phone) {
      alert(
        `Calling ${inquiry.name} at ${inquiry.phone}\n\nIn a real app, this would initiate a call or copy the number to clipboard.`
      );
    } else {
      alert("Phone number not available");
    }
  };

  const handleEmail = (inquiry: Inquiry) => {
    if (inquiry.email) {
      alert(
        `Opening email to ${inquiry.name} (${inquiry.email})\n\nIn a real app, this would open your email client with a pre-filled message.`
      );
    } else {
      alert("Email address not available");
    }
  };

  const handleMarkAsReplied = (id: number) => {
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status: "Replied" as const } : inq))
    );
  };

  const handleMarkAsClosed = (id: number) => {
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status: "Closed" as const } : inq))
    );
  };

  const statusCounts = {
    All: inquiries.length,
    New: inquiries.filter((i) => i.status === "New").length,
    Replied: inquiries.filter((i) => i.status === "Replied").length,
    Closed: inquiries.filter((i) => i.status === "Closed").length,
  };

  return (
    <div className="py-6 space-y-6 select-none">
      {/* Header */}
      <div className="space-y-4 px-1">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-tighter italic">Inquiries</h1>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
            <Filter className="size-4" />
            <span>{filteredInquiries.length} Results</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
            <Search className="size-5" />
          </div>
          <input
            type="text"
            placeholder="Search leads by name, role, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[2rem] py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-orange-600 transition-all font-sans"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {(["All", "New", "Replied", "Closed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                statusFilter === status
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                  : "bg-white border border-slate-200 text-slate-400"
              }`}
            >
              {status} ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <Search className="size-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
              No inquiries found
            </p>
          </div>
        ) : (
          filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              onClick={() => setSelectedInquiry(inquiry)}
              className="bg-white rounded-[2.5rem] p-5 border border-slate-200 hover:border-orange-600/20 transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`size-14 rounded-2xl bg-gradient-to-br ${inquiry.color} flex items-center justify-center text-white text-xl font-black shadow-lg shrink-0`}
                >
                  {inquiry.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-black text-base tracking-tight">{inquiry.name}</h3>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">
                        {inquiry.role}
                      </p>
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      {inquiry.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 font-medium leading-relaxed">
                    "{inquiry.message}"
                  </p>

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCall(inquiry)}
                        className="size-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-all border border-slate-100 active:scale-90"
                        title="Call"
                      >
                        <Phone className="size-4" />
                      </button>
                      <button
                        onClick={() => handleEmail(inquiry)}
                        className="size-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-all border border-slate-100 active:scale-90"
                        title="Email"
                      >
                        <Mail className="size-4" />
                      </button>
                      {inquiry.status === "New" && (
                        <button
                          onClick={() => handleMarkAsReplied(inquiry.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 flex items-center gap-1.5 text-emerald-600 hover:bg-emerald-100 transition-all border border-emerald-100 active:scale-95"
                          title="Mark as Replied"
                        >
                          <CheckCircle2 className="size-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Mark Replied
                          </span>
                        </button>
                      )}
                      {inquiry.status === "Replied" && (
                        <button
                          onClick={() => handleMarkAsClosed(inquiry.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 flex items-center gap-1.5 text-slate-600 hover:bg-slate-100 transition-all border border-slate-100 active:scale-95"
                          title="Mark as Closed"
                        >
                          <Clock className="size-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Close
                          </span>
                        </button>
                      )}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        inquiry.status === "New"
                          ? "bg-orange-600 text-white"
                          : inquiry.status === "Replied"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {inquiry.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detailed Inquiry Modal */}
      {selectedInquiry && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setSelectedInquiry(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between z-10">
                <div className="flex items-start gap-4">
                  <div
                    className={`size-16 rounded-2xl bg-gradient-to-br ${selectedInquiry.color} flex items-center justify-center text-white text-2xl font-black shadow-lg shrink-0`}
                  >
                    {selectedInquiry.initial}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight mb-1">
                      {selectedInquiry.name}
                    </h2>
                    <p className="text-sm font-bold text-slate-500">
                      {selectedInquiry.role}
                    </p>
                    {selectedInquiry.company && (
                      <p className="text-xs font-black uppercase tracking-widest text-orange-600 mt-1">
                        {selectedInquiry.company}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="size-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors active:scale-90"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Status & Time */}
                <div className="flex items-center justify-between">
                  <div
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                      selectedInquiry.status === "New"
                        ? "bg-orange-600 text-white"
                        : selectedInquiry.status === "Replied"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {selectedInquiry.status}
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {selectedInquiry.time}
                  </span>
                </div>

                {/* Message */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    Inquiry Message
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    "{selectedInquiry.message}"
                  </p>
                </div>

                {/* Shipment Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedInquiry.route && (
                    <div className="bg-white rounded-2xl p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="size-4 text-orange-600" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Route
                        </span>
                      </div>
                      <p className="text-sm font-bold">{selectedInquiry.route}</p>
                    </div>
                  )}
                  {selectedInquiry.cargo && (
                    <div className="bg-white rounded-2xl p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="size-4 text-orange-600" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Cargo Type
                        </span>
                      </div>
                      <p className="text-sm font-bold">{selectedInquiry.cargo}</p>
                    </div>
                  )}
                  {selectedInquiry.weight && (
                    <div className="bg-white rounded-2xl p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="size-4 text-orange-600" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Weight
                        </span>
                      </div>
                      <p className="text-sm font-bold">{selectedInquiry.weight}</p>
                    </div>
                  )}
                  {selectedInquiry.date && (
                    <div className="bg-white rounded-2xl p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="size-4 text-orange-600" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Required Date
                        </span>
                      </div>
                      <p className="text-sm font-bold">{selectedInquiry.date}</p>
                    </div>
                  )}
                </div>

                {/* Budget */}
                {selectedInquiry.budget && (
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="size-5 text-orange-600" />
                      <span className="text-xs font-black uppercase tracking-widest text-orange-600">
                        Budget Range
                      </span>
                    </div>
                    <p className="text-2xl font-black text-orange-600">{selectedInquiry.budget}</p>
                  </div>
                )}

                {/* Contact Information */}
                <div className="bg-slate-50 rounded-2xl p-5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {selectedInquiry.phone && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-white flex items-center justify-center">
                            <Phone className="size-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                              Phone
                            </p>
                            <p className="text-sm font-bold">{selectedInquiry.phone}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCall(selectedInquiry);
                          }}
                          className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-black uppercase tracking-widest hover:bg-orange-700 transition-colors active:scale-95"
                        >
                          Call
                        </button>
                      </div>
                    )}
                    {selectedInquiry.email && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-white flex items-center justify-center">
                            <Mail className="size-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                              Email
                            </p>
                            <p className="text-sm font-bold">{selectedInquiry.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEmail(selectedInquiry);
                          }}
                          className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-black uppercase tracking-widest hover:bg-orange-700 transition-colors active:scale-95"
                        >
                          Email
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {selectedInquiry.status === "New" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsReplied(selectedInquiry.id);
                        setSelectedInquiry(null);
                      }}
                      className="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-colors active:scale-95 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="size-5" />
                      Mark as Replied
                    </button>
                  )}
                  {selectedInquiry.status === "Replied" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsClosed(selectedInquiry.id);
                        setSelectedInquiry(null);
                      }}
                      className="flex-1 py-4 rounded-2xl bg-slate-600 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-700 transition-colors active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Clock className="size-5" />
                      Close Inquiry
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="px-6 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-colors active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LogisticsInquiries;
