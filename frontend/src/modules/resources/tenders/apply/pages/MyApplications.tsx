import { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Timer,
  Building2,
  MapPin,
  ChevronRight,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { applicationService } from "@/services/applicationService";
import { useNavigate } from "react-router-dom";

const MyApplications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data: any = await applicationService.getMyApplications();
        // Response is { jobs: [], resources: [] }
        // Filter for Tenders
        const tenderApps = (data.resources || []).filter(
          (app: any) => app.resourceType === "Tender"
        );
        setApplications(tenderApps);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Calculate stats
  const totalBids = applications.length;
  const activeBids = applications.filter((app) => app.status === "Pending").length;
  const wonBids = applications.filter((app) => app.status === "Accepted").length;
  const rejectedBids = applications.filter((app) => app.status === "Rejected").length;

  const stats = [
    {
      label: "Total Bids",
      value: totalBids,
      icon: FileText,
      color: "text-violet-600",
      bgColor: "bg-violet-100 dark:bg-violet-950/30",
    },
    {
      label: "Active",
      value: activeBids,
      icon: Timer,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950/30",
    },
    {
      label: "Won",
      value: wonBids,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
    },
    {
      label: "Rejected",
      value: rejectedBids,
      icon: XCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-100 dark:bg-rose-950/30",
    },
  ];

  const tabs = ["All", "Pending", "Accepted", "Rejected"];

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "All") return true;
    return app.status === activeTab;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Accepted":
        return { bg: "bg-emerald-100 dark:bg-emerald-950/30", color: "text-emerald-600" };
      case "Rejected":
        return { bg: "bg-rose-100 dark:bg-rose-950/30", color: "text-rose-600" };
      case "Pending":
        return { bg: "bg-amber-100 dark:bg-amber-950/30", color: "text-amber-600" };
      default:
        return { bg: "bg-slate-100 dark:bg-slate-800", color: "text-slate-600" };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-sm font-black uppercase tracking-widest text-slate-400">
          Loading Bids...
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight">My Bid Portfolio</h1>
        <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
          Manage and track your submitted tender applications
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-5 flex flex-col items-center text-center space-y-2 hover:scale-105 transition-transform cursor-pointer shadow-sm"
          >
            <div className={`size-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`size-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight">{stat.value}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
              activeTab === tab
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl shadow-slate-900/20 dark:shadow-white/20"
                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bids List */}
      <div className="space-y-5">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => {
            const style = getStatusStyle(app.status);
            const tender = app.resourceId || {};
            return (
              <div
                key={app._id}
                onClick={() => navigate(`/tenders/apply/tenders/${tender._id}`)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1.5 flex-1 pr-8">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-3.5 text-violet-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {tender.company || "Unknown Organization"}
                      </span>
                    </div>
                    <h3 className="text-base font-black tracking-tight group-hover:text-violet-600 transition-colors leading-tight">
                      {tender.title || "Untitled Tender"}
                    </h3>
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-full ${style.bg} ${style.color} text-[8px] font-black uppercase tracking-widest border border-current opacity-80 shrink-0`}
                  >
                    {app.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                      Bid / Tender Value
                    </p>
                    <p className="text-base font-black tracking-tight">
                      {tender.tenderValue || tender.compensation || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                      Submission Date
                    </p>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3 text-slate-400" />
                      <p className="text-[11px] font-black">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar - Mocking progress based on status for visual flair since we don't have real progress % */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                      Application Status
                    </p>
                    <p className="text-[9px] font-black text-violet-600">
                      {app.status === "Accepted"
                        ? "100%"
                        : app.status === "Rejected"
                          ? "100%"
                          : "50%"}
                    </p>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        app.status === "Accepted"
                          ? "bg-emerald-500"
                          : app.status === "Rejected"
                            ? "bg-rose-500"
                            : "bg-amber-400"
                      }`}
                      style={{ width: app.status === "Pending" ? "50%" : "100%" }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3 text-slate-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {tender.location || "Location N/A"}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-violet-600 hover:gap-2 transition-all">
                    View Details <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 space-y-3">
            <AlertCircle className="size-10 text-slate-300 mx-auto" />
            <p className="text-sm font-black text-slate-400">No bids found in this category.</p>
          </div>
        )}
      </div>

      {/* Performance Snapshot */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-6 text-white shadow-2xl shadow-violet-500/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black tracking-tight uppercase tracking-widest opacity-90">
            Bid Success Insights
          </h2>
          <BarChart3 className="size-6 opacity-60" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest opacity-70">
              Win Rate
            </span>
            <span className="text-xl font-black">
              {totalBids > 0 ? Math.round((wonBids / totalBids) * 100) : 0}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white"
              style={{ width: `${totalBids > 0 ? (wonBids / totalBids) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
