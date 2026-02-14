import { useEffect, useMemo, useRef, useState } from "react";
import { TrendingUp, Eye, FileText, Star, PlusSquare, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";

const ProvideDashboard = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const [myVehicles, myInquiries] = await Promise.all([
          resourceService.getMyListings("vehicles"),
          applicationService.getReceivedResourceApplications("vehicles"),
        ]);
        setVehicles(myVehicles || []);
        setInquiries(myInquiries || []);
      } catch (error) {
        setVehicles([]);
        setInquiries([]);
      }
    };

    load();
  }, []);

  const stats = useMemo(
    () => ({
      total: vehicles.length,
      bookings: inquiries.length,
      rating: inquiries.length > 0 ? "4.8" : "0",
    }),
    [vehicles, inquiries]
  );

  const recentInquiries = useMemo(
    () =>
      inquiries.slice(0, 2).map((inq: any, idx: number) => {
        const color =
          idx % 2 === 0
            ? "from-blue-500 to-cyan-600"
            : "from-cyan-500 to-blue-600";
        const name = inq.applicantId?.name || "Unknown";
        return {
          id: inq.id,
          name,
          initial:
            name
              .split(" ")
              .slice(0, 2)
              .map((p: string) => p[0])
              .join("")
              .toUpperCase() || "NA",
          time: inq.appliedAt ? new Date(inq.appliedAt).toLocaleDateString() : "Recently",
          message: inq.message || inq.coverLetter || "New inquiry received",
          type: inq.resourceType || "Rental",
          priority: inq.status === "Pending" ? "Verified Lead" : inq.status,
          color,
        };
      }),
    [inquiries]
  );

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-1 px-1">
          <h1 className="text-4xl font-black tracking-tighter leading-tight">
            Vehicle <br />
            <span className="text-blue-600">Admin</span>
          </h1>
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest">
            Manage your rental fleet
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 py-2">
          <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                <Car className="size-7 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600/60 mb-0.5">
                  Active Vehicles
                </p>
                <p className="text-2xl font-black tracking-tight">{stats.total}</p>
              </div>
            </div>
            <div className="text-[10px] font-black bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">
              Fleet Status
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
              <div className="size-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <Eye className="size-6 text-cyan-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Bookings
              </p>
              <p className="text-xl font-black tracking-tight">{stats.bookings}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-cyan-500/60 mt-2">
                Last 30 Days
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
              <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Star className="size-6 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Avg. Rating
              </p>
              <p className="text-xl font-black tracking-tight">{stats.rating}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 mt-2">
                {inquiries.length} Total Leads
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black tracking-tight">Rental Inquiries</h2>
          <Link
            to="/vehicles/provide/inquiries"
            className="text-xs font-black text-blue-600 uppercase tracking-widest active:scale-95 transition-transform"
          >
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {recentInquiries.map((inquiry) => (
            <Link
              key={inquiry.id}
              to="/vehicles/provide/inquiries"
              className="block bg-white rounded-[2rem] p-4 border border-slate-200 active:scale-[0.98] transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={`size-10 rounded-xl bg-gradient-to-br ${inquiry.color} flex items-center justify-center text-white font-black text-sm shrink-0`}>
                  {inquiry.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-black text-sm">{inquiry.name}</p>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0">
                      {inquiry.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{inquiry.message}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-blue-600 bg-blue-600/10 px-2 py-1 rounded-md">
                      {inquiry.type}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">
                      {inquiry.priority}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {recentInquiries.length === 0 && (
            <div className="block bg-white rounded-[2rem] p-4 border border-slate-200">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">
                No rental inquiries
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-[2.5rem] p-6 text-white shadow-xl shadow-blue-600/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
              Fleet Performance
            </p>
            <h3 className="text-xl font-black tracking-tight">Active Usage</h3>
          </div>
          <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <TrendingUp className="size-6" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span>Uptime</span>
              <span>95%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[95%] bg-white rounded-full"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span>Maintenance</span>
              <span>90%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[90%] bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-xl font-black tracking-tight px-1">Manage Business</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/vehicles/provide/post"
            className="bg-white border border-slate-200 rounded-[2rem] p-5 active:scale-95 transition-transform"
          >
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
              <PlusSquare className="size-5" />
            </div>
            <p className="font-black text-sm">Add Vehicle</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              List New
            </p>
          </Link>
          <Link
            to="/vehicles/provide/my-vehicles"
            className="bg-white border border-slate-200 rounded-[2rem] p-5 active:scale-95 transition-transform"
          >
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3">
              <FileText className="size-5" />
            </div>
            <p className="font-black text-sm">My Fleet</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Manage All
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProvideDashboard;
