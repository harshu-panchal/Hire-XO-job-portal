import { useEffect, useMemo, useRef, useState } from "react";
import { Search, MapPin, Star, Building2, SlidersHorizontal, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "@/services/resourceService";

const PAGE_SIZE = 6;

const EquipmentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await resourceService.getAll("equipments");
        setEquipments(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load equipments");
        setEquipments([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const categories = useMemo(() => {
    const fromData = Array.from(
      new Set((equipments || []).map((item) => item.category).filter(Boolean))
    ) as string[];
    return ["All", ...fromData];
  }, [equipments]);

  const filteredEquipments = useMemo(
    () =>
      equipments.filter(
        (item) =>
          (activeCategory === "All" || (item.category || "") === activeCategory) &&
          ((item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.company || "").toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [equipments, activeCategory, searchQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filteredEquipments.length / PAGE_SIZE));
  const pagedEquipments = filteredEquipments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeCategory]);

  return (
    <div className="py-6 space-y-6 select-none">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight">Available Gear</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
          {filteredEquipments.length} Heavy machines found
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4 sticky top-[72px] z-30 bg-white py-2 -mx-2 px-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by machine name or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-3xl bg-slate-100 border-none font-bold text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="size-4" />
            </button>
          )}
          <button className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white active:scale-95 transition-transform shadow-lg shadow-emerald-500/20">
            <SlidersHorizontal className="size-4" />
          </button>
        </div>

        {/* Categories Scroller */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20"
                  : "bg-white text-slate-500 border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-5">
        {loading && (
          <div className="py-20 text-center space-y-4">
            <p className="font-black tracking-tight text-lg">Loading gear...</p>
          </div>
        )}

        {!loading && error && (
          <div className="py-20 text-center space-y-4">
            <p className="font-black tracking-tight text-lg">Could not load gear</p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          pagedEquipments.map((item) => (
            <Link
              key={item.id}
              to={`/equipments/rent/equipment/${item.id}`}
              className="group block bg-white border border-slate-200 rounded-[2.5rem] p-5 hover:shadow-xl hover:shadow-black/5 transition-all relative overflow-hidden"
            >
              <div className="flex gap-5">
                <div className="size-28 rounded-3xl overflow-hidden bg-slate-50 shrink-0 relative">
                  <img
                    src={
                      item.images?.[0] ||
                      "https://images.unsplash.com/photo-1579412691525-4c07da01ee7b?auto=format&fit=crop&q=80&w=400"
                    }
                    alt={item.title}
                    className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[8px] font-black uppercase tracking-widest border border-slate-100">
                    {item.category || "Equipments"}
                  </div>
                </div>
                <div className="flex-1 space-y-2 py-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {item.status || "Available"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="size-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-black">{item.rating || 4.8}</span>
                    </div>
                  </div>
                  <h3 className="text-base font-black tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 opacity-60">
                    <Building2 className="size-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest truncate">
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
                <div className="flex items-center gap-3">
                  <p className="text-xl font-black tracking-tight text-slate-900">
                    {item.compensation || "N/A"}
                    <span className="text-[10px] text-slate-400 tracking-widest font-black uppercase">
                      /day
                    </span>
                  </p>
                  <div className="size-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:bg-slate-900 transition-colors">
                    <ChevronRight className="size-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}

        {!loading && !error && filteredEquipments.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
              <Search className="size-8 text-slate-300" />
            </div>
            <div>
              <p className="font-black tracking-tight text-lg">No gear found</p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Try adjusting your filters
              </p>
            </div>
          </div>
        )}

        {!loading && !error && filteredEquipments.length > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentList;
