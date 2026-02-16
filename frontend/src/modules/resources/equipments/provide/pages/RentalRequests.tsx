import { useEffect, useRef, useState } from "react";
import { MapPin, User, CheckCircle2, XCircle, MessageSquare, Clock } from "lucide-react";
import { applicationService } from "@/services/applicationService";

const RentalRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const data = await applicationService.getReceivedResourceApplications("equipments");
        setRequests(data || []);
      } catch (error) {
        setRequests([]);
      }
    };

    load();
  }, []);

  const tabToStatus: Record<string, string> = {
    Pending: "Pending",
    Reviewing: "Pending",
    Accepted: "Accepted",
    Rejected: "Rejected",
  };

  const filteredRequests = requests.filter(
    (req: any) => req.status === tabToStatus[activeTab]
  );

  const handleStatus = async (requestId: string, status: "Accepted" | "Rejected") => {
    try {
      await applicationService.updateApplicationStatus(requestId, status, "resource");
      setRequests((prev) =>
        prev.map((req: any) =>
          (req.id === requestId || req._id === requestId) ? { ...req, status } : req
        )
      );
    } catch (error) {
      // keep current UI unchanged
    }
  };

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight leading-none">Rent Requests</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
          Manage incoming rental applications
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {["Pending", "Reviewing", "Accepted", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
              activeTab === tab
                ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20"
                : "bg-white text-slate-500 border-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-6 pb-20">
        {filteredRequests.map((req: any) => (
          <div
            key={req.id || req._id}
            className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm relative group"
          >
            {/* Status Ribbon */}
            <div className="absolute top-0 right-10 px-4 py-1 rounded-b-xl bg-amber-100 text-amber-600 text-[8px] font-black uppercase tracking-widest border border-t-0 border-amber-200">
              {req.status || "Pending"}
            </div>

            <div className="p-6 space-y-6">
              {/* Tenant Info */}
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                  <User className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-black tracking-tight leading-none mb-1 truncate">
                    {req.applicantId?.name || "Unknown Applicant"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                      Reliability: {req.applicantId?.rating || "N/A"}
                    </div>
                    <div className="size-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {req.id || req._id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 opacity-40">
                    <Clock className="size-3" />
                    <p className="text-[8px] font-black uppercase tracking-widest">Duration</p>
                  </div>
                  <p className="text-xs font-black italic">
                    {req.resourceId?.duration || "N/A"} ({req.appliedAt ? new Date(req.appliedAt).toLocaleDateString() : "N/A"})
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600/60 leading-none">
                    Net Revenue
                  </p>
                  <p className="text-sm font-black text-emerald-700 leading-none">
                    {req.bidAmount ? `INR ${req.bidAmount}` : "N/A"}
                  </p>
                </div>
              </div>

              {/* Project Link */}
              <div className="flex items-center justify-between px-2 text-slate-400 italic">
                <div className="flex items-center gap-2">
                  <MapPin className="size-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {req.applicantId?.profile?.location || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 font-black uppercase tracking-widest text-[9px]">
                  {req.resourceId?.title || "Equipment"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatus(req.id || req._id, "Accepted")}
                  className="flex-1 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="size-3.5" /> Approve Rent
                </button>
                <button className="size-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center active:scale-95 transition-all shadow-xl">
                  <MessageSquare className="size-5" />
                </button>
                <button
                  onClick={() => handleStatus(req.id || req._id, "Rejected")}
                  className="size-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center active:scale-90 transition-transform"
                >
                  <XCircle className="size-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredRequests.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
              No rental requests found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalRequests;
