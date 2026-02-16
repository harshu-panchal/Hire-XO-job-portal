import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  ChevronRight,
  X,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "@/services/resourceService";

const PAGE_SIZE = 6;

const MachineryList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const fetchedRef = useRef(false);

  const filters = ["All", "Top Rated", "Lowest Price", "Certified", "Recently Added"];

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await resourceService.getAll("machinery");
        const activeMachines = (data || []).filter((item: any) => item.status !== "Inactive");
        setMachines(activeMachines);
      } catch (err: any) {
        setError(err.message || "Failed to load machinery");
        setMachines([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredMachines = useMemo(() => {
    let data = machines.filter(
      (item) =>
        (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.brand || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeFilter === "Top Rated") {
      data = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (activeFilter === "Certified") {
      data = data.filter((item) => item.certified || (item.requirements || []).includes("Certified"));
    } else if (activeFilter === "Recently Added") {
      data = [...data].sort(
        (a, b) => new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime()
      );
    }

    return data;
  }, [machines, searchQuery, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMachines.length / PAGE_SIZE));
  const pagedMachines = filteredMachines.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeFilter]);

  return (
    <div className="py-6 space-y-6 select-none">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight italic">Find Machine</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
          {filteredMachines.length} verified listings available
        </p>
      </div>

      {/* Sticky Search & Filter */}
      <div className="space-y-4 sticky top-[72px] z-30 bg-slate-50 py-2 -mx-2 px-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search model, brand or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-3xl bg-white border border-slate-200 font-bold text-sm focus:ring-2 focus:ring-amber-500/20 outline-none shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="size-4" />
            </button>
          )}
          <button className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-xl bg-amber-600 flex items-center justify-center text-white active:scale-95 transition-transform shadow-lg shadow-amber-500/20">
            <SlidersHorizontal className="size-4" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                activeFilter === filter
                  ? "bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-500/20"
                  : "bg-white text-slate-500 border-slate-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-5">
        {loading && (
          <div className="py-16 text-center text-sm font-black text-slate-500">Loading machines...</div>
        )}

        {!loading && error && (
          <div className="py-16 text-center space-y-2">
            <p className="text-lg font-black text-slate-600">Could not load machines</p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          pagedMachines.map((item) => (
            <Link
              key={item.id || item._id}
              to={`/machinery/buy/item/${item.id || item._id}`}
              className="group block bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-[0.98] transition-all relative overflow-hidden shadow-sm"
            >
              <div className="flex gap-4">
                <div className="size-28 rounded-3xl overflow-hidden bg-slate-100 shrink-0 relative">
                  <img
                    src={
                      item.images?.[0] ||
                      "https://images.unsplash.com/photo-1579412691525-4c07da01ee7b?auto=format&fit=crop&q=80&w=400"
                    }
                    alt={item.title}
                    className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute top-2 right-2 size-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                    <Heart className="size-4" />
                  </button>
                </div>
                <div className="flex-1 space-y-2 py-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="size-3 fill-current" />
                      <span className="text-[10px] font-black">{item.rating || 4.8}</span>
                    </div>
                    {(item.certified || (item.requirements || []).includes("Certified")) && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest border border-blue-100">
                        <ShieldCheck className="size-2.5" /> Certified
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-black tracking-tight leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors uppercase italic">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {item.brand || "Brand"} • {item.year || "N/A"} Model
                  </p>
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
                  <p className="text-xl font-black tracking-tight text-amber-600">{item.compensation || "N/A"}</p>
                  <div className="size-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-all">
                    <ChevronRight className="size-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}

        {!loading && !error && filteredMachines.length === 0 && (
          <div className="py-16 text-center text-sm font-black text-slate-500">No machines found</div>
        )}

        {!loading && !error && filteredMachines.length > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-3 pt-2">
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

export default MachineryList;
