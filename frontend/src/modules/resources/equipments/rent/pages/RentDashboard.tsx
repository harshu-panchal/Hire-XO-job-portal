import {
  TrendingUp,
  Clock,
  Package,
  ArrowRight,
  MapPin,
  Building2,
  Star,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";

const RentDashboard = () => {
  const [equipments, setEquipments] = useState<any[]>([]);
  const [myRentals, setMyRentals] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [all, apps] = await Promise.all([
          resourceService.getAll("equipments"),
          applicationService.getMyApplications(),
        ]);
        setEquipments(all || []);
        const filtered = (apps.resources || []).filter((app: any) => {
          const category = (app.resourceId?.category || "").toLowerCase();
          const type = (app.resourceType || "").toLowerCase();
          return category.includes("equipment") || type.includes("equipment");
        });
        setMyRentals(filtered);
      } catch (error) {
        setEquipments([]);
        setMyRentals([]);
      }
    };
    load();
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    equipments.forEach((item: any) => {
      const key = item.category || "Equipments";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .slice(0, 4)
      .map(([name, count], idx) => ({ name, count, icon: String(idx + 1) }));
  }, [equipments]);

  const featuredEquipment = useMemo(() => equipments.slice(0, 2), [equipments]);
  const activeRentals = myRentals.filter((r: any) => r.status === "Pending" || r.status === "Accepted").length;

  const stats = [
    {
      label: "Active Rentals",
      value: String(activeRentals),
      icon: Package,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      label: "Hours Logged",
      value: `${myRentals.length * 24}h`,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      label: "Available Near",
      value: `${equipments.length}+`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ];

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight leading-tight">
          Find Your <br />
          <span className="text-emerald-600">Equipment</span>
        </h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
          High performance gear for your project
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col items-center text-center space-y-2 shadow-sm"
          >
            <div className={`size-10 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`size-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-black tracking-tight">{stat.value}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Horizontal Scroll */}
      <div className="space-y-4">
        <h2 className="text-xl font-black tracking-tight px-1">Top Categories</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex flex-col items-center gap-2 group cursor-pointer shrink-0"
            >
              <div className="size-16 rounded-[2rem] bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all">
                {cat.icon}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Equipment */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black tracking-tight">Featured Gear</h2>
          <Link
            to="/equipments/rent/list"
            className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-transform"
          >
            View All <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="space-y-5">
          {featuredEquipment.map((item) => (
            <Link
              key={item.id}
              to={`/equipments/rent/equipment/${item.id}`}
              className="block bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-[0.98] transition-all group overflow-hidden relative"
            >
              <div className="flex gap-4">
                <div className="size-24 rounded-3xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={
                      item.images?.[0] ||
                      "https://images.unsplash.com/photo-1579412691525-4c07da01ee7b?auto=format&fit=crop&q=80&w=400"
                    }
                    alt={item.title}
                    className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="size-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black">{item.rating || 4.8}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      12 reviews
                    </span>
                  </div>
                  <h3 className="text-base font-black tracking-tight group-hover:text-emerald-600 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Building2 className="size-3 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 truncate">
                      {item.company || "Resource Provider"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="size-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {item.location || "N/A"}
                  </span>
                </div>
                <p className="text-lg font-black tracking-tight text-emerald-600">
                  {item.compensation || "N/A"}
                  <span className="text-[10px] text-slate-400 tracking-widest font-black uppercase">
                    /day
                  </span>
                </p>
              </div>

              {/* Decorative element */}
              <div className="absolute top-0 right-0 size-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
            </Link>
          ))}
          {featuredEquipment.length === 0 && (
            <div className="text-center p-4 text-slate-400 text-xs font-bold uppercase">
              No featured equipment
            </div>
          )}
        </div>
      </div>

      {/* Quick Search CTA */}
      <Link
        to="/equipments/rent/list"
        className="block bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tighter uppercase leading-none italic">
              Instant <br />
              Rentals
            </h3>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
              Verified Providers Only
            </p>
          </div>
          <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Search className="size-8" />
          </div>
        </div>
        <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-700" />
      </Link>
    </div>
  );
};

export default RentDashboard;
