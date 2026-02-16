import { useEffect, useState } from "react";
import { ArrowLeft, Star, Car, Shield, MessageCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const VehicleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await resourceService.getById("vehicles", id);
        setVehicle(data);

        if (!user) {
          setHasApplied(false);
        } else {
          const myApps: any = await applicationService.getMyApplications();
          const alreadyApplied = (myApps.resources || []).some((app: any) => {
            const appResourceType = (app.resourceType || "").toLowerCase();
            const appCategory = (app.resourceId?.category || "").toLowerCase();
            const appResourceId = app.resourceId?._id || app.resourceId?.id || app.resourceId;
            return (
              appResourceId === id &&
              (appResourceType === "vehicles" ||
                appResourceType === "vehicle" ||
                appCategory.includes("vehicle"))
            );
          });
          setHasApplied(alreadyApplied);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load vehicle details");
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
      await applicationService.applyToResource("vehicles", id, {
        message: "Interested in renting this vehicle. Please share availability.",
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
      <div className="py-6 space-y-8 select-none border-t border-slate-50">
        <div className="h-12 rounded-2xl bg-slate-100 animate-pulse" />
        <div className="h-80 rounded-[3rem] bg-slate-100 animate-pulse" />
      </div>
    );
  }

  if (!vehicle) {
    return <div className="p-10 text-center font-black">Vehicle not found</div>;
  }

  if ((vehicle.status || "Active") === "Inactive") {
    return <div className="p-10 text-center font-black">This vehicle is currently unavailable.</div>;
  }

  return (
    <div className="py-6 space-y-8 select-none border-t border-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => navigate(-1)}
          className="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft className="size-6" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleApply}
            disabled={hasApplied || applying}
            className="px-6 h-12 rounded-2xl bg-cyan-600 text-white font-black text-sm uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-cyan-600/20 disabled:opacity-60"
          >
            {hasApplied ? "Applied" : applying ? "Applying..." : "Book Now"}
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-4 px-4 py-8 bg-cyan-600/5 rounded-[3rem] border border-cyan-600/10">
          <div className="size-24 rounded-3xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-4xl font-black shadow-xl">
            {(vehicle.title || "R").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter mb-1">{vehicle.title}</h1>
            <p className="text-cyan-600 font-black uppercase tracking-widest text-[10px]">
              {(vehicle.vehicleTypes?.[0] || "Vehicle").toString()} • {vehicle.type || "Rental"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <Star className="size-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-black text-amber-700">{vehicle.rating || 4.9} (45 reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20">
              <Car className="size-4 text-cyan-600" />
              <span className="text-sm font-black text-cyan-700">{vehicle.urgency || "Immediate"}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Price
            </p>
            <p className="text-base font-black italic">{vehicle.compensation || "N/A"}</p>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-200 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Safety
            </p>
            <p className="text-base font-black italic">5 Star</p>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-200 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Location
            </p>
            <p className="text-base font-black italic">{vehicle.location || "N/A"}</p>
          </div>
        </div>

        {/* About */}
        <div className="space-y-3 px-1">
          <h2 className="text-xl font-black tracking-tight">Vehicle Description</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {vehicle.description || "No description provided."}
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 px-1 pb-20">
          <h2 className="text-xl font-black tracking-tight">Key Features</h2>
          <div className="flex flex-wrap gap-2">
            {(vehicle.requirements && vehicle.requirements.length > 0
              ? vehicle.requirements
              : ["Sunroof", "Leather Seats", "360 Camera", "Premium Audio"]
            ).map((feature: string) => (
              <div
                key={feature}
                className="px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 py-4 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-40">
        <div className="flex gap-3">
          <button
            onClick={handleApply}
            disabled={hasApplied || applying}
            className="flex-1 h-16 rounded-[2rem] bg-slate-900 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
          >
            <MessageCircle className="size-5" />
            {hasApplied ? "Applied" : applying ? "Sending..." : "Check Dates"}
          </button>
          <button className="size-16 rounded-[2rem] bg-cyan-600 text-white flex items-center justify-center active:scale-95 transition-transform shadow-lg shadow-cyan-600/20">
            <Shield className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
