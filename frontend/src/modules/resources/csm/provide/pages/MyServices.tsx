import {
  Eye,
  MessageSquare,
  MoreVertical,
  Edit3,
  Trash2,
  ShieldCheck,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { useCSMStore } from "@/store/useCSMStore";
import { useNavigate } from "react-router-dom";

const MyServices = () => {
  const { myServices, deleteService } = useCSMStore();
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      deleteService(id);
    }
  };

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-4 px-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/csm/provide/dashboard")}
            className="size-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 active:scale-95 transition-all"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter">My Listings</h1>
            <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
              Manage your active CSM offerings
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {myServices.map((service: any) => (
          <div
            key={service.id}
            className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/10 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-rose-600/10 flex items-center justify-center text-rose-600">
                  <ShieldCheck className="size-5" />
                </div>
                <div
                  className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                    service.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}
                >
                  {service.status}
                </div>
              </div>
              <button className="size-10 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-center text-slate-400 transition-colors">
                <MoreVertical className="size-5" />
              </button>
            </div>

            <h3 className="font-black text-lg tracking-tight mb-2 leading-tight">
              {service.title}
            </h3>

            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6 px-1">
              <span className="text-rose-600 italic">#{service.category}</span>
              <div className="size-1 rounded-full bg-slate-200" />
              <span>Posted {service.postedDate}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                  <Eye className="size-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Views
                  </p>
                  <p className="text-xs font-black italic">{service.views}</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                  <MessageSquare className="size-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Leads
                  </p>
                  <p className="text-xs font-black italic">{service.inquiries}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="h-12 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <Edit3 className="size-3.5" />
                Edit Listing
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="h-12 rounded-2xl bg-red-500/10 text-red-600 border border-red-500/10 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Trash2 className="size-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {myServices.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10">
            <div className="size-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ShieldCheck className="size-7 text-slate-300" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              No active services
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/csm/provide/post")}
        className="w-full h-16 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-rose-600 hover:text-rose-600 transition-all active:scale-[0.98]"
      >
        <Plus className="size-4" />
        Post New CSM Offering
      </button>
    </div>
  );
};

export default MyServices;
