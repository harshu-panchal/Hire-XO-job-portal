import { useEffect, useMemo, useRef, useState } from "react";
import { TrendingUp, Car, Target, Search, Briefcase, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "@/services/resourceService";

const BrowseDashboard = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const data = await resourceService.getAll("vehicles");
        setVehicles((data || []).filter((item: any) => (item.status || "Active") !== "Inactive"));
      } catch (error) {
        setVehicles([]);
      }
    };

    load();
  }, []);

  const featuredVehicles = useMemo(() => vehicles.slice(0, 2), [vehicles]);

  return (
    <div className="py-6 space-y-8 select-none">
      <div className="space-y-4">
        <div className="space-y-1 px-1">
          <h1 className="text-4xl font-black tracking-tighter leading-tight">
            Rent Premium <br />
            <span className="text-cyan-600">Vehicles Easily</span>
          </h1>
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest">
            Cars, SUVs, and Commercial Units
          </p>
        </div>

        <div className="grid gap-4 py-2">
          <div className="bg-cyan-600/5 border border-cyan-600/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-cyan-600/10 flex items-center justify-center">
                <Target className="size-7 text-cyan-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-cyan-600/60 mb-0.5">
                  Verified Units
                </p>
                <p className="text-2xl font-black tracking-tight">{vehicles.length}+</p>
              </div>
            </div>
            <div className="text-[10px] font-black bg-cyan-600/10 text-cyan-600 px-3 py-1 rounded-full uppercase tracking-widest">
              Live Near You
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
              <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="size-6 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Satisfied Hires
              </p>
              <p className="text-xl font-black tracking-tight">96%</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">
                Customer Rating
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
              <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Car className="size-6 text-amber-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Partner Hubs
              </p>
              <p className="text-xl font-black tracking-tight">
                {Math.max(1, Math.ceil(vehicles.length / 5))}+
              </p>
              <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 mt-2">
                Major Cities
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black tracking-tight">Top Rated Vehicles</h2>
          <Link
            to="/vehicles/browse/list"
            className="text-xs font-black text-cyan-600 uppercase tracking-widest active:scale-95 transition-transform"
          >
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {featuredVehicles.map((item, idx) => (
            <Link
              key={item.id || item._id}
              to={`/vehicles/browse/list/${item.id || item._id}`}
              className="block bg-white rounded-[2rem] p-5 border border-slate-200 active:scale-[0.98] transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-12 rounded-xl bg-gradient-to-br ${idx % 2 === 0 ? "from-cyan-500 to-teal-600" : "from-teal-500 to-cyan-600"} flex items-center justify-center text-white font-black text-lg`}
                  >
                    {(item.title || "V").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-cyan-600 font-black uppercase tracking-widest text-[9px]">
                      {item.company || "Vehicle Provider"}
                    </p>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/10 mt-0.5">
                      <span className="text-[8px] font-black uppercase tracking-widest text-cyan-600">
                        {item.vehicleTypes?.[0] || "Vehicle"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Rating
                  </p>
                  <p className="text-lg font-black text-amber-500">{item.rating || 4.8}/5</p>
                </div>
              </div>
              <h3 className="font-black text-lg tracking-tight mb-2">{item.title || "Rental Vehicle"}</h3>
              <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                {item.description || "Well-maintained vehicle with transparent rental support."}
              </p>
              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  <span>{item.location || "City Base"}</span>
                </div>
                <div className="size-1 rounded-full bg-slate-200" />
                <span>{item.compensation || "Rate on request"}</span>
                <div className="size-1 rounded-full bg-slate-200" />
                <span>{item.type || "Rental"}</span>
              </div>
            </Link>
          ))}
          {featuredVehicles.length === 0 && (
            <div className="block bg-white rounded-[2rem] p-5 border border-slate-200">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">
                No featured vehicles yet
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-black tracking-tight px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/vehicles/browse/list"
            className="bg-gradient-to-br from-cyan-600 to-cyan-500 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
          >
            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Search className="size-5" />
            </div>
            <p className="font-black text-sm">Find Vehicle</p>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Browse Units</p>
          </Link>
          <Link
            to="/vehicles/browse/my-rentals"
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
          >
            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Briefcase className="size-5" />
            </div>
            <p className="font-black text-sm">Active Bookings</p>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Track Status</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrowseDashboard;
