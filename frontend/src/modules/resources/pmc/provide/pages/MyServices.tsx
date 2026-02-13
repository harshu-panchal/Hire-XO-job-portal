import { useEffect, useRef, useState } from "react";
import { Eye, MessageSquare, MoreVertical, Edit3, Trash2, ShieldCheck, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";

const MyServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const [myServices, myInquiries] = await Promise.all([
          resourceService.getMyListings("pmc"),
          applicationService.getReceivedResourceApplications("pmc"),
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

  const handleEdit = (service: any) => {
    navigate("/pmc/provide/post", { state: { service } });
  };

  const handleDelete = async (serviceId: string) => {
    try {
      await resourceService.delete("pmc", serviceId);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
    } catch (error) {
      // keep current state unchanged
    }
  };

  const getInquiryCount = (serviceId: string) =>
    inquiries.filter((inq: any) => (inq.resourceId?._id || inq.resourceId) === serviceId).length;

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-black tracking-tighter">My Listings</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
          Manage your active PMC offerings
        </p>
      </div>

      {/* List */}
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                  <ShieldCheck className="size-5" />
                </div>
                <div
                  className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                    service.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}
                >
                  {service.status || "Active"}
                </div>
              </div>
              <button className="size-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors">
                <MoreVertical className="size-5" />
              </button>
            </div>

            <h3 className="font-black text-lg tracking-tight mb-2 leading-tight">
              {service.title}
            </h3>

            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6 px-1">
              <span className="text-indigo-600 italic">#{service.category || "PMC"}</span>
              <div className="size-1 rounded-full bg-slate-200" />
              <span>
                Posted {service.postedAt ? new Date(service.postedAt).toLocaleDateString() : "Recently"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Eye className="size-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Views
                  </p>
                  <p className="text-xs font-black italic">{service.views || 0}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <MessageSquare className="size-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Leads
                  </p>
                  <p className="text-xs font-black italic">{getInquiryCount(service.id)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleEdit(service)}
                className="h-12 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
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
        {services.length === 0 && (
          <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
              No PMC services listed
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/pmc/provide/post")}
        className="w-full h-16 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-[0.98]"
      >
        <Plus className="size-4" />
        Post New PMC Offering
      </button>
    </div>
  );
};

export default MyServices;
