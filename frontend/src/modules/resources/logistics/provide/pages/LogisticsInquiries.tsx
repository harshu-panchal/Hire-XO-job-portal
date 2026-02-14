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
import { useEffect, useMemo, useRef, useState } from "react";
import { applicationService } from "@/services/applicationService";

const LogisticsInquiries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "New" | "Replied" | "Closed">("All");
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const data = await applicationService.getReceivedResourceApplications("logistics");
        const mapped = (data || []).map((inq: any, idx: number) => {
          const name = inq.applicantId?.name || "Unknown";
          return {
            ...inq,
            id: inq.id,
            name,
            role: inq.applicantId?.profile?.jobTitle || "Resource Applicant",
            company: inq.applicantId?.profile?.company || "",
            message: inq.message || inq.coverLetter || "Inquiry received",
            time: inq.appliedAt ? new Date(inq.appliedAt).toLocaleDateString() : "Recently",
            status:
              inq.status === "Pending"
                ? "New"
                : inq.status === "Accepted"
                  ? "Replied"
                  : "Closed",
            initial:
              name
                .split(" ")
                .slice(0, 2)
                .map((p: string) => p[0])
                .join("")
                .toUpperCase() || "NA",
            color:
              idx % 3 === 0
                ? "from-orange-500 to-red-600"
                : idx % 3 === 1
                  ? "from-red-500 to-orange-600"
                  : "from-blue-500 to-cyan-600",
            phone: inq.applicantId?.phoneNumber,
            email: inq.applicantId?.email,
            route: inq.resourceId?.location || "N/A",
            cargo: inq.resourceId?.title || "Logistics",
            weight: inq.resourceId?.compensation || "N/A",
            date: inq.resourceId?.duration || "N/A",
            budget: inq.bidAmount ? `INR ${inq.bidAmount}` : "N/A",
          };
        });
        setInquiries(mapped);
      } catch (error) {
        setInquiries([]);
      }
    };

    load();
  }, []);

  const filteredInquiries = useMemo(
    () =>
      inquiries.filter((inquiry) => {
        const matchesSearch =
          inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inquiry.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || inquiry.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [inquiries, searchQuery, statusFilter]
  );

  const handleCall = (inquiry: any) => {
    if (inquiry.phone) {
      window.location.href = `tel:${inquiry.phone}`;
    }
  };

  const handleEmail = (inquiry: any) => {
    if (inquiry.email) {
      window.location.href = `mailto:${inquiry.email}`;
    }
  };

  const handleMarkAsReplied = async (id: string) => {
    try {
      await applicationService.updateApplicationStatus(id, "Accepted", "resource");
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status: "Replied" } : inq)));
    } catch (error) {
      // keep state unchanged
    }
  };

  const handleMarkAsClosed = async (id: string) => {
    try {
      await applicationService.updateApplicationStatus(id, "Rejected", "resource");
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status: "Closed" } : inq)));
    } catch (error) {
      // keep state unchanged
    }
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(inquiry);
                        }}
                        className="size-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-all border border-slate-100 active:scale-90"
                        title="Call"
                      >
                        <Phone className="size-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmail(inquiry);
                        }}
                        className="size-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-all border border-slate-100 active:scale-90"
                        title="Email"
                      >
                        <Mail className="size-4" />
                      </button>
                      {inquiry.status === "New" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsReplied(inquiry.id);
                          }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsClosed(inquiry.id);
                          }}
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
                <div className="bg-slate-50 rounded-2xl p-5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    Inquiry Message
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    "{selectedInquiry.message}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="size-4 text-orange-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Route
                      </span>
                    </div>
                    <p className="text-sm font-bold">{selectedInquiry.route}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="size-4 text-orange-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Cargo Type
                      </span>
                    </div>
                    <p className="text-sm font-bold">{selectedInquiry.cargo}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="size-4 text-orange-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Required Date
                      </span>
                    </div>
                    <p className="text-sm font-bold">{selectedInquiry.date}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="size-4 text-orange-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-orange-600">
                        Budget Range
                      </span>
                    </div>
                    <p className="text-sm font-bold text-orange-600">{selectedInquiry.budget}</p>
                  </div>
                </div>

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
