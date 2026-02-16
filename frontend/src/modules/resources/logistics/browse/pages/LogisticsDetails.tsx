import { useEffect, useState } from "react";
import { ArrowLeft, Star, Truck, Shield, MessageCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const LogisticsDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await resourceService.getById("logistics", id);
        setProvider(data);

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
              (appResourceType === "logistics" || appCategory === "logistics")
            );
          });
          setHasApplied(alreadyApplied);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load logistics details");
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
      await applicationService.applyToResource("logistics", id, {
        message: "Interested in this logistics service. Please share quotation details.",
      });
      setHasApplied(true);
      toast.success("Quote request sent");
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
        <div className="h-80 bg-slate-100 rounded-[3rem] animate-pulse" />
      </div>
    );
  }

  if (!provider) {
    return <div className="p-10 text-center font-black">Provider not found</div>;
  }

  if ((provider.status || "Active") === "Inactive") {
    return (
      <div className="p-10 text-center font-black">
        This logistics service is currently unavailable.
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 select-none">
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
            className="px-6 h-12 rounded-2xl bg-red-600 text-white font-black text-sm uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-red-600/20 disabled:opacity-60"
          >
            {hasApplied ? "Applied" : applying ? "Applying..." : "Book Now"}
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-4 px-4 py-8 bg-red-600/5 rounded-[3rem] border border-red-600/10">
          <div className="size-24 rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white text-4xl font-black shadow-xl">
            {(provider.company || provider.title || "S").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter mb-1">{provider.company || provider.title}</h1>
            <p className="text-red-600 font-black uppercase tracking-widest text-[10px]">
              {provider.requirements?.[0] || "Logistics Specialist"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <Star className="size-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-black text-amber-700">{provider.rating || 5.0} (245 reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20">
              <Truck className="size-4 text-red-600" />
              <span className="text-sm font-black text-red-700">{provider.type || "Service Provider"}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Fleet
            </p>
            <p className="text-base font-black">{provider.compensation || "N/A"}</p>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-200 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Cities
            </p>
            <p className="text-base font-black">20+</p>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-200 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
              On-Time
            </p>
            <p className="text-base font-black">99%</p>
          </div>
        </div>

        {/* About */}
        <div className="space-y-3 px-1">
          <h2 className="text-xl font-black tracking-tight">About Provider</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {provider.description || "No description provided."}
          </p>
        </div>

        {/* Services */}
        <div className="space-y-3 px-1">
          <h2 className="text-xl font-black tracking-tight">Our Services</h2>
          <div className="flex flex-wrap gap-2">
            {(provider.requirements && provider.requirements.length > 0
              ? provider.requirements
              : [
                  "FTL Transport",
                  "PTL Services",
                  "Express Freight",
                  "Containerized",
                  "Real-time Tracking",
                ]
            ).map((service: string) => (
              <div
                key={service}
                className="px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600"
              >
                {service}
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
            {hasApplied ? "Applied" : applying ? "Sending..." : "Get Quote"}
          </button>
          <button className="size-16 rounded-[2rem] bg-red-600 text-white flex items-center justify-center active:scale-95 transition-transform shadow-lg shadow-red-600/20">
            <Shield className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogisticsDetails;
