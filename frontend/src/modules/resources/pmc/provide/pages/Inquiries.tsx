import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Phone, Mail, Filter, CheckCircle2, Clock } from "lucide-react";
import { applicationService } from "@/services/applicationService";

const Inquiries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "New" | "Replied" | "Closed">("All");
  const [inquiries, setInquiries] = useState<any[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const data = await applicationService.getReceivedResourceApplications("pmc");
        const mapped = (data || []).map((inq: any, idx: number) => {
          const name = inq.applicantId?.name || "Unknown";
          return {
            ...inq,
            id: inq.id,
            name,
            role: inq.applicantId?.profile?.jobTitle || "Resource Applicant",
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
                .map((x: string) => x[0])
                .join("")
                .toUpperCase() || "NA",
            color:
              idx % 3 === 0
                ? "from-indigo-500 to-blue-600"
                : idx % 3 === 1
                  ? "from-purple-500 to-pink-600"
                  : "from-blue-500 to-cyan-600",
            phone: inq.applicantId?.phoneNumber,
            email: inq.applicantId?.email,
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
      // keep state unchanged on failure
    }
  };

  const handleMarkAsClosed = async (id: string) => {
    try {
      await applicationService.updateApplicationStatus(id, "Rejected", "resource");
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status: "Closed" } : inq)));
    } catch (error) {
      // keep state unchanged on failure
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
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[2rem] py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-indigo-600 transition-all font-sans"
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
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
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
            className="bg-white rounded-[2.5rem] p-5 border border-slate-200 group active:scale-[0.98] transition-all"
          >
            <div className="flex items-start gap-4">
              <div
                className={`size-14 rounded-2xl bg-gradient-to-br ${inquiry.color} flex items-center justify-center text-white text-xl font-black shadow-lg`}
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
                      onClick={() => handleCall(inquiry)}
                      className="size-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors border border-slate-100"
                    >
                      <Phone className="size-4" />
                    </button>
                    <button
                      onClick={() => handleEmail(inquiry)}
                      className="size-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors border border-slate-100"
                    >
                      <Mail className="size-4" />
                    </button>
                    {inquiry.status === "New" && (
                      <button
                        onClick={() => handleMarkAsReplied(inquiry.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 flex items-center gap-1.5 text-emerald-600 hover:bg-emerald-100 transition-all border border-emerald-100"
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
                        className="px-3 py-1.5 rounded-xl bg-slate-50 flex items-center gap-1.5 text-slate-600 hover:bg-slate-100 transition-all border border-slate-100"
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
                        ? "bg-indigo-600 text-white"
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
        )}
      </div>
    </div>
  );
};

export default Inquiries;
