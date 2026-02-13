import {
  TrendingUp,
  Package,
  ArrowRight,
  MapPin,
  Building2,
  Star,
  Search,
  BadgeCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { resourceService } from "@/services/resourceService";

const BuyDashboard = () => {
  const [allMachines, setAllMachines] = useState<any[]>([]);
  const [featuredMachines, setFeaturedMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const data = await resourceService.getAll("machinery");
        setAllMachines(data || []);
        setFeaturedMachines((data || []).slice(0, 5));
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to load marketplace");
      } finally {
        setLoading(false);
      }
    };
    fetchMachines();
  }, []);

  const totalListings = allMachines.length;
  const topSellers = useMemo(
    () =>
      new Set(
        allMachines.map((item) => (item.company || "").trim()).filter(Boolean)
      ).size,
    [allMachines]
  );
  const priceDrop = useMemo(
    () => allMachines.filter((item) => (item.status || "").toLowerCase().includes("drop")).length,
    [allMachines]
  );

  const stats = [
    {
      label: "New Listings",
      value: totalListings.toString(),
      icon: Package,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      label: "Price Drop",
      value: priceDrop.toString(),
      icon: TrendingUp,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
    {
      label: "Top Sellers",
      value: `${topSellers}+`,
      icon: BadgeCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ];

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    allMachines.forEach((item) => {
      const key = item.category || item.machineryTypes?.[0] || "Machinery";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [allMachines]);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Marketplace...</div>;

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight leading-tight">
          Machinery <br />
          <span className="text-amber-600">Marketplace</span>
        </h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
          Buy verified industrial machinery
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

      {/* Category Scroll */}
      <div className="space-y-4">
        <h2 className="text-xl font-black tracking-tight px-1">Shop Categories</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.name}
              className="flex flex-col items-center gap-2 group cursor-pointer shrink-0"
            >
              <div className="size-16 rounded-[2rem] bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 group-hover:bg-amber-50 group-hover:border-amber-200 transition-all">
                {idx + 1}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {cat.name} ({cat.count})
              </p>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-4">
              No categories available
            </div>
          )}
        </div>
      </div>

      {/* Featured Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black tracking-tight text-amber-600 italic">
            Pre-Owned Deals
          </h2>
          <Link
            to="/machinery/buy/list"
            className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-transform"
          >
            Browse All <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="space-y-5">
          {error && (
            <div className="text-center p-4 text-rose-500 text-xs font-bold uppercase">{error}</div>
          )}
          {featuredMachines.length === 0 ? (
            <div className="text-center p-4 text-slate-400 text-xs font-bold uppercase">
              No machinery listed
            </div>
          ) : (
            featuredMachines.map((item) => (
              <Link
                key={item.id}
                to={`/machinery/buy/item/${item.id}`}
                className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-5 active:scale-[0.98] transition-all group overflow-hidden relative"
              >
                <div className="flex gap-4">
                  <div className="size-24 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center">
                        <Package className="text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="size-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-black">4.8</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                        {item.condition || "Used"}
                      </span>
                    </div>
                    <h3 className="text-base font-black tracking-tight group-hover:text-amber-600 transition-colors leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 opacity-60">
                      <Building2 className="size-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest truncate">
                        {item.brand || "Generic"} • {item.year || "202x"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="size-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {item.location}
                    </span>
                  </div>
                  <p className="text-xl font-black tracking-tight text-amber-600">
                    {item.compensation || item.price || "N/A"}
                  </p>
                </div>

                {/* Decorative side element */}
                <div className="absolute top-0 right-0 h-full w-1.5 bg-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Selling CTA */}
      <Link
        to="/machinery/sell/post"
        className="block bg-amber-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-amber-500/30"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tighter uppercase leading-none italic">
              Sell Your <br />
              Machinery
            </h3>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 text-white">
              List in 2 Minutes
            </p>
          </div>
          <div className="size-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Search className="size-8" />
          </div>
        </div>
        <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-24 -mt-24" />
      </Link>
    </div>
  );
};

export default BuyDashboard;
