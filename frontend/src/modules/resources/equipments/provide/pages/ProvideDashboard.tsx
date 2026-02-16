import { useEffect, useMemo, useRef, useState } from "react";
import {
  Package,
  ArrowRight,
  UserCheck,
  MessageSquare,
  PlusCircle,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";

const ProvideDashboard = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const [myListings, myRequests] = await Promise.all([
          resourceService.getMyListings("equipments"),
          applicationService.getReceivedResourceApplications("equipments"),
        ]);
        setListings(myListings || []);
        setRequests(myRequests || []);
      } catch (error) {
        setListings([]);
        setRequests([]);
      }
    };

    load();
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Fleet Size",
        value: `${listings.length}`,
        icon: Package,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        label: "Active Rentals",
        value: `${requests.filter((r: any) => r.status === "Accepted").length}`,
        icon: UserCheck,
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
      },
      {
        label: "Utilization",
        value: `${listings.length > 0 ? Math.round((requests.length / listings.length) * 100) : 0}%`,
        icon: BarChart3,
        color: "text-violet-600",
        bgColor: "bg-violet-100",
      },
    ],
    [listings, requests]
  );

  const alerts = useMemo(
    () =>
      requests.slice(0, 3).map((req: any) => ({
        id: req.id || req._id,
        type: req.resourceType || "Request",
        message:
          req.message ||
          req.coverLetter ||
          `New rental request for ${req.resourceId?.title || "equipment"}`,
        time: req.appliedAt ? new Date(req.appliedAt).toLocaleDateString() : "Recently",
        urgent: req.status === "Pending",
      })),
    [requests]
  );

  const activeInventory = useMemo(
    () =>
      listings.slice(0, 2).map((item: any) => {
        const listingId = item.id || item._id;
        const related = requests.filter(
          (r: any) => (r.resourceId?._id || r.resourceId?.id || r.resourceId) === listingId
        );
        const accepted = related.find((r: any) => r.status === "Accepted");
        return {
          id: listingId,
          name: item.title,
          status: accepted ? "On Rent" : "Available",
          tenant: accepted?.applicantId?.name || "-",
          returns: item.duration || "Available Soon",
          utilization: `${Math.min(100, related.length * 20)}%`,
        };
      }),
    [listings, requests]
  );

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight leading-none">Fleet Manager</h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
            Manage your rental operations
          </p>
        </div>
        <Link
          to="/equipments/provide/post"
          className="size-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-90 transition-transform"
        >
          <PlusCircle className="size-6" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col items-center text-center space-y-2 shadow-sm"
          >
            <div className={`size-10 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`size-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-black tracking-tight leading-none italic">{stat.value}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Alerts */}
      <div className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 px-1">
          Recent Activity
        </h2>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group active:scale-[0.98] transition-all"
            >
              <div
                className={`size-2 shrink-0 rounded-full ${alert.urgent ? "bg-rose-500 animate-pulse" : "bg-blue-400"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold leading-tight line-clamp-1">{alert.message}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
                  {alert.time}
                </p>
              </div>
              <button className="text-slate-300 group-hover:text-blue-500 transition-colors">
                <ChevronRight className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* In-Use Hardware */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black tracking-tight">Active Fleet</h2>
          <Link
            to="/equipments/provide/my-equipments"
            className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-transform"
          >
            Manage All <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="space-y-4">
          {activeInventory.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black tracking-tight group-hover:text-blue-600 transition-colors leading-none">
                    {item.name}
                  </h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">
                    Utility: {item.utilization}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    item.status === "On Rent"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}
                >
                  {item.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Current Tenant
                  </p>
                  <p className="text-[10px] font-black uppercase">{item.tenant}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Availability
                  </p>
                  <p className="text-[10px] font-black uppercase">{item.returns}</p>
                </div>
              </div>
            </div>
          ))}
          {activeInventory.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                No equipment listings yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Link Card */}
      <Link
        to="/equipments/provide/requests"
        className="block bg-blue-600 rounded-[2.5rem] p-7 text-white relative overflow-hidden group shadow-2xl shadow-blue-500/30"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-black tracking-tight italic uppercase">Rent Requests</h3>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
              {requests.filter((r: any) => r.status === "Pending").length} Pending Approvals
            </p>
          </div>
          <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="size-6" />
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-24 -mt-24" />
      </Link>
    </div>
  );
};

export default ProvideDashboard;
