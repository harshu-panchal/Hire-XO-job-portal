import { useEffect, useState } from "react";
import { Briefcase, Calendar, ChevronRight, Clock, Star } from "lucide-react";
import { applicationService } from "@/services/applicationService";

const MyHires = () => {
  const [hires, setHires] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const apps: any = await applicationService.getMyApplications();
        const mapped = (apps.resources || [])
          .filter((app: any) => {
            const category = (app.resourceId?.category || "").toLowerCase();
            const type = (app.resourceType || "").toLowerCase();
            return category.includes("csm") || type.includes("csm");
          })
          .map((app: any, idx: number) => ({
            id: app.id || app._id,
            firmName: app.resourceId?.company || "CSM Firm",
            projectName: app.resourceId?.title || "CSM Project",
            status: app.status === "Rejected" ? "Completed" : "Active",
            startDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A",
            hiredOn: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A",
            rating: null,
            image: (app.resourceId?.company || "C").charAt(0).toUpperCase(),
            color: idx % 2 === 0 ? "from-rose-500 to-pink-600" : "from-pink-500 to-fuchsia-600",
          }));
        setHires(mapped);
      } catch (error) {
        setHires([]);
      }
    };
    load();
  }, []);

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-black tracking-tighter">My Hires</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
          Manage your CSM team
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-rose-600 p-6 rounded-[2.5rem] text-white">
          <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <Clock className="size-5" />
          </div>
          <p className="text-2xl font-black italic">
            {String(hires.filter((h) => h.status === "Active").length).padStart(2, "0")}
          </p>
          <p className="text-[9px] font-black uppercase tracking-widest opacity-80">
            Active Projects
          </p>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white">
          <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <Briefcase className="size-5" />
          </div>
          <p className="text-2xl font-black italic">{String(hires.length).padStart(2, "0")}</p>
          <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Total Hires</p>
        </div>
      </div>

      {/* Hires List */}
      <div className="space-y-4">
        <h2 className="text-xl font-black tracking-tight px-1">Recent Hires</h2>
        <div className="space-y-4">
          {hires.map((hire) => (
            <div
              key={hire.id}
              className="bg-white rounded-[2rem] p-5 border border-slate-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`size-14 rounded-2xl bg-gradient-to-br ${hire.color} flex items-center justify-center text-white text-xl font-black shadow-lg`}
                  >
                    {hire.image}
                  </div>
                  <div>
                    <h3 className="font-black text-lg tracking-tight leading-tight">
                      {hire.firmName}
                    </h3>
                    <p className="text-rose-600 font-black uppercase tracking-widest text-[9px] mt-0.5">
                      {hire.projectName}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    hire.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                  }`}
                >
                  {hire.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-slate-400" />
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                      Started
                    </p>
                    <p className="text-[10px] font-black">{hire.startDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-slate-300" />
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                      Rating
                    </p>
                    <p className="text-[10px] font-black">Pending</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 h-12 rounded-2xl bg-slate-50 text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform group">
                View Details
                <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
          {hires.length === 0 && (
            <div className="text-center p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              No hires found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyHires;
