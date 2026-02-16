import { useEffect, useMemo, useRef, useState } from "react";
import { TrendingUp, Truck, Target, Search, Briefcase, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "@/services/resourceService";

const BrowseDashboard = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const data = await resourceService.getAll("logistics");
        setProviders((data || []).filter((item: any) => (item.status || "Active") !== "Inactive"));
      } catch (error) {
        setProviders([]);
      }
    };

    load();
  }, []);

  const featuredProviders = useMemo(() => providers.slice(0, 2), [providers]);

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-1 px-1">
          <h1 className="text-4xl font-black tracking-tighter leading-tight">
            Hire Best <br />
            <span className="text-red-600">Logistics Partners</span>
          </h1>
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest">
            Transportation & Supply Chain Solutions
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 py-2">
          <div className="bg-red-600/5 border border-red-600/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-red-600/10 flex items-center justify-center">
                <Target className="size-7 text-red-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-red-600/60 mb-0.5">
                  Verified Fleet Owners
                </p>
                <p className="text-2xl font-black tracking-tight">{providers.length}+</p>
              </div>
            </div>
            <div className="text-[10px] font-black bg-red-600/10 text-red-600 px-3 py-1 rounded-full uppercase tracking-widest">
              Available Now
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
              <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="size-6 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                On-Time Delivery
              </p>
              <p className="text-xl font-black tracking-tight">98.5%</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">
                Reliability Score
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
              <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Truck className="size-6 text-amber-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Vehicles
              </p>
              <p className="text-xl font-black tracking-tight">{Math.max(providers.length * 8, 0)}+</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 mt-2">
                Pan India Network
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Providers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black tracking-tight">Top Rated Logistics</h2>
          <Link
            to="/logistics/browse/list"
            className="text-xs font-black text-red-600 uppercase tracking-widest active:scale-95 transition-transform"
          >
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {featuredProviders.map((provider, idx) => (
            <Link
              key={provider.id || provider._id}
              to={`/logistics/browse/list/${provider.id || provider._id}`}
              className="block bg-white rounded-[2rem] p-5 border border-slate-200 active:scale-[0.98] transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-12 rounded-xl bg-gradient-to-br ${idx % 2 === 0 ? "from-red-500 to-orange-600" : "from-orange-500 to-red-600"} flex items-center justify-center text-white font-black text-lg`}
                  >
                    {(provider.company || provider.title || "L").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-red-600 font-black uppercase tracking-widest text-[9px]">
                      {provider.company || "Logistics Provider"}
                    </p>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/10 mt-0.5">
                      <span className="text-[8px] font-black uppercase tracking-widest text-red-600">
                        {provider.requirements?.[0] || "Transport"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Rating
                  </p>
                  <p className="text-lg font-black text-amber-500">{provider.rating || 4.8}/5</p>
                </div>
              </div>
              <h3 className="font-black text-lg tracking-tight mb-2">{provider.title || "Logistics Service"}</h3>
              <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                {provider.description || "Professional transportation and supply chain support."}
              </p>
              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  <span>{provider.location || "Pan India"}</span>
                </div>
                <div className="size-1 rounded-full bg-slate-200" />
                <span>{provider.compensation || "Fleet Ready"}</span>
                <div className="size-1 rounded-full bg-slate-200" />
                <span>{provider.type || "Fast Delivery"}</span>
              </div>
            </Link>
          ))}
          {featuredProviders.length === 0 && (
            <div className="block bg-white rounded-[2rem] p-5 border border-slate-200">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">
                No featured providers yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-xl font-black tracking-tight px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/logistics/browse/list"
            className="bg-gradient-to-br from-red-600 to-red-500 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
          >
            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Search className="size-5" />
            </div>
            <p className="font-black text-sm">Find Fleet</p>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">
              Browse Services
            </p>
          </Link>
          <Link
            to="/logistics/browse/my-hires"
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
          >
            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Briefcase className="size-5" />
            </div>
            <p className="font-black text-sm">Active Orders</p>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">
              Track Shipments
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrowseDashboard;
