import { useEffect, useMemo, useRef, useState } from "react";
import { TrendingUp, Eye, FileText, Star, PlusSquare, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";

const ProvideDashboard = () => {
  const [services, setServices] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const [myServices, myInquiries] = await Promise.all([
          resourceService.getMyListings("logistics"),
          applicationService.getReceivedResourceApplications("logistics"),
        ]);
        setServices(myServices || []);
        setInquiries(myInquiries || []);
      } catch (error) {
        setServices([]);
        setInquiries([]);
      }
    };

    load();
  }, []);

  const stats = useMemo(
    () => ({
      total: services.length,
      shipments: inquiries.length,
      rating: inquiries.length > 0 ? "4.9" : "0",
    }),
    [services, inquiries]
  );

  const recentInquiries = useMemo(
    () =>
      inquiries.slice(0, 2).map((inq: any, idx: number) => {
        const color =
          idx % 2 === 0
            ? "from-orange-500 to-red-600"
            : "from-red-500 to-orange-600";
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
          type: inq.resourceType || "Load",
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
            Logistics <br />
            <span className="text-orange-600">Admin</span>
          </h1>
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest">
            Manage your transport fleet
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 py-2">
          <div className="bg-orange-600/5 border border-orange-600/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-orange-600/10 flex items-center justify-center">
                <Truck className="size-7 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-600/60 mb-0.5">
                  Active Trucks
                </p>
                <p className="text-2xl font-black tracking-tight">{stats.total}</p>
              </div>
            </div>
            <div className="text-[10px] font-black bg-orange-600/10 text-orange-600 px-3 py-1 rounded-full uppercase tracking-widest">
              Fleet Status
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
              <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Eye className="size-6 text-blue-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Shipments
              </p>
              <p className="text-xl font-black tracking-tight">{stats.shipments}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-blue-500/60 mt-2">
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
          <h2 className="text-xl font-black tracking-tight">Transit Inquiries</h2>
          <Link
            to="/logistics/provide/inquiries"
            className="text-xs font-black text-orange-600 uppercase tracking-widest active:scale-95 transition-transform"
          >
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {recentInquiries.map((inquiry) => (
            <Link
              key={inquiry.id}
              to="/logistics/provide/inquiries"
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
                    <span className="text-[8px] font-black uppercase tracking-widest text-orange-600 bg-orange-600/10 px-2 py-1 rounded-md">
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
                No transit inquiries
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-[2.5rem] p-6 text-white shadow-xl shadow-orange-600/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
              Transit Performance
            </p>
            <h3 className="text-xl font-black tracking-tight">Express Status</h3>
          </div>
          <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <TrendingUp className="size-6" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span>Delivery Success</span>
              <span>98%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[98%] bg-white rounded-full"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span>Fuel Efficiency</span>
              <span>85%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-xl font-black tracking-tight px-1">Manage Business</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/logistics/provide/post"
            className="bg-white border border-slate-200 rounded-[2rem] p-5 active:scale-95 transition-transform"
          >
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
              <PlusSquare className="size-5" />
            </div>
            <p className="font-black text-sm">Add Service</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Post Load
            </p>
          </Link>
          <Link
            to="/logistics/provide/my-services"
            className="bg-white border border-slate-200 rounded-[2rem] p-5 active:scale-95 transition-transform"
          >
            <div className="size-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-3">
              <FileText className="size-5" />
            </div>
            <p className="font-black text-sm">Active Fleets</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Manage Load
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProvideDashboard;
