import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  ChevronRight,
  Info,
} from "lucide-react";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const EquipmentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const [equipment, setEquipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await resourceService.getById("equipments", id);
        setEquipment(data);

        if (user) {
          const myApps: any = await applicationService.getMyApplications();
          const alreadyApplied = (myApps.resources || []).some((app: any) => {
            const appType = String(app.resourceType || "").toLowerCase();
            const appliedResourceId =
              app.resourceId?._id || app.resourceId?.id || app.resourceId;
            return appType.includes("equipment") && appliedResourceId === id;
          });
          setHasApplied(alreadyApplied);
        } else {
          setHasApplied(false);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load equipment details");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      toast.error("Please login to continue");
      return;
    }
    if (!id || hasApplied || applying) return;

    setApplying(true);
    try {
      await applicationService.applyToResource("equipments", id, {
        message: "Interested in this equipment rental. Please share next steps.",
      });
      setHasApplied(true);
      toast.success("Request sent successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to send request");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6 space-y-8 select-none">
        <div className="h-12 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="h-72 bg-slate-100 rounded-[3rem] animate-pulse" />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-xl font-black text-slate-500">Equipment not found</p>
      </div>
    );
  }

  const specs = [
    { label: "Category", value: equipment.category || "N/A" },
    { label: "Location", value: equipment.location || "N/A" },
    { label: "Type", value: equipment.type || "N/A" },
    { label: "Urgency", value: equipment.urgency || "N/A" },
  ];
  const features =
    equipment.requirements && equipment.requirements.length > 0
      ? equipment.requirements
      : [
          "Advanced hydraulic system for high productivity",
          "Fuel-efficient engine with power modes",
          "Robust undercarriage for durability",
          "Comfortable ergonomic cabin with AC",
        ];

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => navigate(-1)}
          className="size-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm active:scale-90 transition-transform"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="px-5 py-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {equipment.status || "Available Now"}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative group">
        <div className="w-full h-72 rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl">
          <img
            src={
              equipment.images?.[0] ||
              "https://images.unsplash.com/photo-1579412691525-4c07da01ee7b?auto=format&fit=crop&q=80&w=800"
            }
            alt={equipment.title}
            className="size-full object-cover"
          />
        </div>
        <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/20">
          {equipment.images?.length || 1} Photos
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
            <span>{equipment.category || "Equipments"}</span>
            <div className="size-1 rounded-full bg-emerald-200" />
            <div className="flex items-center gap-1">
              <Star className="size-3 fill-amber-500 text-amber-500" />
              <span className="text-slate-900">{equipment.rating || 4.8}</span>
              <span className="text-slate-400">(124)</span>
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight leading-tight">{equipment.title}</h1>
        </div>

        <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400">
              <Building2 className="size-6" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                Provided by
              </p>
              <p className="text-sm font-black tracking-tight">{equipment.company || "Resource Provider"}</p>
            </div>
          </div>
          <ShieldCheck className="size-5 text-blue-500" />
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
          <Info className="size-5 text-emerald-600" /> Tech Specs
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 space-y-1"
            >
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                {spec.label}
              </p>
              <p className="text-sm font-black">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4 px-1">
        <h2 className="text-xl font-black tracking-tight">Overview</h2>
        <p className="text-sm text-slate-500 font-bold leading-relaxed tracking-tight">
          {equipment.description || "No description available."}
        </p>
      </div>

      {/* Features List */}
      <div className="bg-emerald-50 rounded-[2.5rem] p-8 space-y-6">
        <h3 className="text-lg font-black tracking-tight text-emerald-700 italic">
          Why this gear?
        </h3>
        <div className="space-y-4">
          {features.map((feature: string, idx: number) => (
            <div key={idx} className="flex gap-3">
              <div className="size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="size-3" />
              </div>
              <p className="text-xs font-black tracking-tight text-emerald-900/70 leading-relaxed uppercase">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Static Contact Strip */}
      <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
              Local Support
            </p>
            <h4 className="text-lg font-black tracking-tight">{equipment.location || "N/A"}</h4>
          </div>
          <div className="flex gap-2">
            <button className="size-12 rounded-2xl bg-white/10 flex items-center justify-center active:scale-90 transition-transform border border-white/10">
              <Phone className="size-5" />
            </button>
            <button className="size-12 rounded-2xl bg-white/10 flex items-center justify-center active:scale-90 transition-transform border border-white/10">
              <MessageSquare className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-40 pointer-events-none">
        <div className="w-full max-w-[430px] bg-white border border-slate-100 rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl pointer-events-auto">
          <div className="px-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Per Day
            </p>
            <p className="text-xl font-black text-emerald-600 tracking-tight">
              {equipment.compensation || "N/A"}
            </p>
          </div>
          <button
            onClick={handleApply}
            disabled={hasApplied || applying}
            className="bg-emerald-600 text-white font-black text-[12px] uppercase tracking-[0.2em] px-8 py-5 rounded-[1.8rem] shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {hasApplied ? "Applied" : applying ? "Applying..." : "Book Now"}{" "}
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
};

export default EquipmentDetails;
