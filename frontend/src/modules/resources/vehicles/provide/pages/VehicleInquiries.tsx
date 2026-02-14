import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Phone,
  Mail,
  X,
  Car,
  Calendar,
  MapPin,
  MessageSquare,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { applicationService } from "@/services/applicationService";

const VehicleInquiries = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "New" | "Replied" | "Closed">("All");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const data = await applicationService.getReceivedResourceApplications("vehicles");
        const mapped = (data || []).map((inq: any, idx: number) => {
          const name = inq.applicantId?.name || "Unknown";
          return {
            ...inq,
            id: inq.id,
            name,
            role: inq.applicantId?.profile?.jobTitle || "Resource Applicant",
            message: inq.message || inq.coverLetter || "Interested in vehicle rental.",
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
                .map((x: string) => x[0])
                .join("")
                .toUpperCase() || "NA",
            color:
              idx % 4 === 0
                ? "from-blue-500 to-cyan-600"
                : idx % 4 === 1
                  ? "from-cyan-500 to-blue-600"
                  : idx % 4 === 2
                    ? "from-purple-500 to-pink-600"
                    : "from-emerald-500 to-teal-600",
            phone: inq.applicantId?.phoneNumber,
            email: inq.applicantId?.email,
            vehicle: inq.resourceId?.title || "Vehicle",
            location: inq.applicantId?.profile?.location || "N/A",
            rentalDates: inq.resourceId?.duration || "N/A",
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

  const handleCall = (phone: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleEmail = (email: string) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const handleStatusChange = async (id: string, newStatus: "New" | "Replied" | "Closed") => {
    const apiStatus =
      newStatus === "New" ? "Pending" : newStatus === "Replied" ? "Accepted" : "Rejected";
    try {
      await applicationService.updateApplicationStatus(id, apiStatus, "resource");
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq)));
      setShowDetailModal(false);
    } catch (error) {
      // keep current state unchanged
    }
  };

  const filteredInquiries = useMemo(
    () =>
      inquiries.filter((inquiry) => {
        const matchesSearch =
          inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inquiry.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || inquiry.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [inquiries, searchQuery, statusFilter]
  );

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
            className="w-full bg-white border border-slate-200 rounded-[2rem] py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-blue-600 transition-all font-sans"
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
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              Filter by Status
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["All", "New", "Replied", "Closed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowFilterMenu(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    statusFilter === status
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
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
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Filtered:
            </span>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
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
        <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">New</p>
          <p className="text-2xl font-black text-blue-600">{statusCounts.New}</p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">
            Replied
          </p>
          <p className="text-2xl font-black text-emerald-600">{statusCounts.Replied}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">
            Closed
          </p>
          <p className="text-2xl font-black text-slate-600">
            {statusCounts.Closed}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredInquiries.length > 0 ? (
          filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              onClick={() => {
                setSelectedInquiry(inquiry);
                setShowDetailModal(true);
              }}
              className="bg-white rounded-[2.5rem] p-5 border border-slate-200 group active:scale-[0.98] transition-all cursor-pointer hover:shadow-lg"
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
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 font-medium leading-relaxed">
                    "{inquiry.message}"
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(inquiry.phone || "");
                        }}
                        className="size-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-100"
                      >
                        <Phone className="size-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmail(inquiry.email || "");
                        }}
                        className="size-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-100"
                      >
                        <Mail className="size-4" />
                      </button>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        inquiry.status === "New"
                          ? "bg-blue-600 text-white"
                          : inquiry.status === "Replied"
                            ? "bg-emerald-500 text-white"
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
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="size-12 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">No inquiries found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedInquiry && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`size-16 rounded-2xl bg-gradient-to-br ${selectedInquiry.color} flex items-center justify-center text-white text-2xl font-black shadow-lg`}
                >
                  {selectedInquiry.initial}
                </div>
                <div>
                  <h3 className="text-2xl font-black">{selectedInquiry.name}</h3>
                  <p className="text-sm text-slate-500">{selectedInquiry.role}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="size-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div
                className={`inline-flex px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                  selectedInquiry.status === "New"
                    ? "bg-blue-600 text-white"
                    : selectedInquiry.status === "Replied"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {selectedInquiry.status}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Message
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  "{selectedInquiry.message}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="size-4 text-blue-600" />
                    <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                      Vehicle
                    </p>
                  </div>
                  <p className="text-sm font-bold text-blue-600">{selectedInquiry.vehicle}</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="size-4 text-purple-600" />
                    <p className="text-xs font-black uppercase tracking-widest text-purple-600">
                      Dates
                    </p>
                  </div>
                  <p className="text-sm font-bold text-purple-600">{selectedInquiry.rentalDates}</p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="size-4 text-emerald-600" />
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                      Location
                    </p>
                  </div>
                  <p className="text-sm font-bold text-emerald-600">{selectedInquiry.location}</p>
                </div>

                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="size-4 text-orange-600" />
                    <p className="text-xs font-black uppercase tracking-widest text-orange-600">
                      Budget
                    </p>
                  </div>
                  <p className="text-sm font-bold text-orange-600">{selectedInquiry.budget}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  Update Status
                </p>
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
