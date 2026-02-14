import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Filter,
  Clock,
  Phone,
  Mail,
  Building2,
  Package,
  Star,
  CheckCircle2,
} from "lucide-react";
import { applicationService } from "@/services/applicationService";

const MachineryInquiries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "New" | "Replied" | "Closed">("All");
  const [inquiries, setInquiries] = useState<any[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const data = await applicationService.getReceivedResourceApplications("machinery");
        const mapped = (data || []).map((inq: any) => {
          return {
            ...inq,
            id: inq.id,
            buyer: inq.applicantId?.name || "Unknown",
            asset: inq.resourceId?.title || "Machinery",
            location: inq.applicantId?.profile?.location || "N/A",
            status:
              inq.status === "Pending"
                ? "New"
                : inq.status === "Accepted"
                  ? "Replied"
                  : "Closed",
            time: inq.appliedAt ? new Date(inq.appliedAt).toLocaleDateString() : "Recently",
            price: inq.resourceId?.compensation || "N/A",
            buyerRating: 4.5,
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
      inquiries.filter((lead) => {
        const matchesSearch =
          lead.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.asset.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [inquiries, searchQuery, statusFilter]
  );

  const handleCall = (lead: any) => {
    if (lead.phone) {
      window.location.href = `tel:${lead.phone}`;
    }
  };

  const handleEmail = (lead: any) => {
    if (lead.email) {
      window.location.href = `mailto:${lead.email}`;
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

  const statusCounts = {
    All: inquiries.length,
    New: inquiries.filter((i) => i.status === "New").length,
    Replied: inquiries.filter((i) => i.status === "Replied").length,
    Closed: inquiries.filter((i) => i.status === "Closed").length,
  };

  return (
    <div className="py-6 space-y-8 select-none bg-slate-50 min-h-screen text-slate-900">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">
          Lead Inbox
        </h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] leading-none">
          Marketplace inquiries and negotiations
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/10 shadow-sm"
          />
        </div>
        <button className="size-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform">
          <Filter className="size-5" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {(["All", "New", "Replied", "Closed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
              statusFilter === status
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "bg-white border border-slate-200 text-slate-500"
            }`}
          >
            {status} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4 pb-20">
        {filteredInquiries.map((lead) => (
          <div
            key={lead.id}
            className="bg-white border border-slate-200 rounded-[2.5rem] p-6 active:scale-[0.98] transition-all relative group shadow-sm"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex gap-4">
                <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center p-3 relative">
                  <Building2 className="size-full text-indigo-600" />
                  {lead.status === "New" && (
                    <div className="absolute -top-1 -right-1 size-3 bg-amber-500 rounded-full border-2 border-white animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black tracking-tighter uppercase italic leading-none">
                      {lead.buyer}
                    </h3>
                    <div className="flex items-center gap-1 text-[8px] font-black text-amber-600">
                      <Star className="size-2.5 fill-current" /> {lead.buyerRating}
                    </div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {lead.location}
                  </p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                  lead.status === "New"
                    ? "bg-amber-50 text-amber-600 border-amber-100"
                    : lead.status === "Replied"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                }`}
              >
                {lead.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                  Interested In
                </p>
                <div className="flex items-center gap-2">
                  <Package className="size-3 text-indigo-600" />
                  <p className="text-[10px] font-black truncate">{lead.asset}</p>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                  Listing Price
                </p>
                <p className="text-[11px] font-black italic text-indigo-600">{lead.price}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="size-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">{lead.time}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCall(lead)}
                  className="size-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors border border-slate-100"
                >
                  <Phone className="size-4" />
                </button>
                <button
                  onClick={() => handleEmail(lead)}
                  className="size-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors border border-slate-100"
                >
                  <Mail className="size-4" />
                </button>
                {lead.status === "New" ? (
                  <button
                    onClick={() => handleMarkAsReplied(lead.id)}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="size-4" />
                    Reply
                  </button>
                ) : (
                  <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                    Review Deal
                  </button>
                )}
              </div>
            </div>

            <div className="absolute top-0 right-0 h-full w-1 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}

        {filteredInquiries.length === 0 && (
          <div className="w-full py-8 rounded-[2rem] border border-dashed border-slate-300 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
            No leads found
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineryInquiries;
