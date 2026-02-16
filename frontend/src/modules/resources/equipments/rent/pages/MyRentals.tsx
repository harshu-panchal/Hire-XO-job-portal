import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { applicationService } from "@/services/applicationService";

const MyRentals = () => {
  const [rentals, setRentals] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const apps: any = await applicationService.getMyApplications();
        const mapped = (apps.resources || [])
          .filter((app: any) => {
            const category = (app.resourceId?.category || "").toLowerCase();
            const type = (app.resourceType || "").toLowerCase();
            return category.includes("equipment") || type.includes("equipment");
          })
          .map((app: any) => ({
            id: app.id || app._id,
            name: app.resourceId?.title || "Equipment Rental",
            provider: app.resourceId?.company || "Resource Provider",
            status: app.status === "Rejected" ? "Completed" : "In Progress",
            startDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A",
            endDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A",
            totalAmount: app.bidAmount ? `INR ${app.bidAmount}` : app.resourceId?.compensation || "N/A",
            image:
              app.resourceId?.images?.[0] ||
              "https://images.unsplash.com/photo-1579412691525-4c07da01ee7b?auto=format&fit=crop&q=80&w=400",
          }));
        setRentals(mapped);
      } catch (error) {
        setRentals([]);
      }
    };
    load();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "text-emerald-600 bg-emerald-100 border-emerald-200";
      case "Scheduled":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "Completed":
        return "text-slate-500 bg-slate-100 border-slate-200";
      default:
        return "text-slate-500 bg-slate-100";
    }
  };

  const totalSpent = useMemo(
    () =>
      rentals.reduce((sum, r) => {
        const val = parseFloat((r.totalAmount || "0").toString().replace(/[^0-9.]/g, ""));
        return sum + (isNaN(val) ? 0 : val);
      }, 0),
    [rentals]
  );
  const onRent = rentals.filter((r) => r.status === "In Progress").length;

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight">My Rentals</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
          Track your equipment rental history
        </p>
      </div>

      {/* Quick Stats Summary */}
      <div className="p-1 px-1 flex gap-4 overflow-x-auto no-scrollbar">
        <div className="bg-emerald-600 text-white rounded-[2.5rem] p-6 shrink-0 w-48 shadow-xl shadow-emerald-500/20">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Spent</p>
          <p className="text-3xl font-black tracking-tighter italic">INR {Math.round(totalSpent)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shrink-0 w-48 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">On Rent</p>
          <p className="text-3xl font-black tracking-tighter">{String(onRent).padStart(2, "0")}</p>
        </div>
      </div>

      {/* Rentals List */}
      <div className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 px-1 italic">
          Active & Past Rentals
        </h2>

        <div className="space-y-6 pb-20">
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm relative group"
            >
              <div className="p-5 flex gap-5">
                <div className="size-24 rounded-3xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={rental.image}
                    alt={rental.name}
                    className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 space-y-1 py-1">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusColor(rental.status)}`}
                  >
                    {rental.status === "In Progress" && <Clock className="size-2.5 animate-spin" />}
                    {rental.status === "Completed" && <CheckCircle2 className="size-2.5" />}
                    {rental.status === "Scheduled" && <Calendar className="size-2.5" />}
                    {rental.status}
                  </div>
                  <h3 className="text-sm font-black tracking-tight leading-tight">{rental.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {rental.provider}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 flex items-center justify-between group-hover:bg-slate-100 transition-colors">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none">
                      ID
                    </p>
                    <p className="text-[10px] font-black leading-none">{rental.id}</p>
                  </div>
                  <ChevronRight className="size-4 text-slate-300" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 flex items-center justify-between group-hover:bg-slate-100 transition-colors">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none">
                      Rate
                    </p>
                    <p className="text-[10px] font-black leading-none">{rental.totalAmount}</p>
                  </div>
                  <AlertCircle className="size-4 text-slate-300" />
                </div>
              </div>

              {/* Date Strip */}
              <div className="bg-slate-900 text-white py-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="size-4 opacity-40 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                    {rental.startDate} - {rental.endDate}
                  </span>
                </div>
                <button className="text-[9px] font-black uppercase tracking-widest underline underline-offset-4 active:scale-95 transition-transform">
                  View Receipt
                </button>
              </div>
            </div>
          ))}
          {rentals.length === 0 && (
            <div className="text-center p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              No rentals found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRentals;
