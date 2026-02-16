import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Filter, Star, MapPin, Truck, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "@/services/resourceService";

const PAGE_SIZE = 6;

const LogisticsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await resourceService.getAll("logistics");
        setProviders(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load logistics providers");
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(
    () =>
      providers.filter((item) => {
        const isActive = (item.status || "Active") !== "Inactive";
        const query = searchQuery.toLowerCase();
        const matches =
          (item.title || "").toLowerCase().includes(query) ||
          (item.company || "").toLowerCase().includes(query);
        return isActive && matches;
      }),
    [providers, searchQuery]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return (
    <div className="py-6 space-y-6 select-none">
      {/* Header */}
      <div className="space-y-4 px-1">
        <h1 className="text-3xl font-black tracking-tighter">Logistics Partners</h1>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-600 transition-colors">
            <Search className="size-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for providers or fleets..."
            className="w-full bg-white border border-slate-200 rounded-3xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-red-600/10 focus:border-red-600 transition-all shadow-sm"
          />
          <button className="absolute inset-y-2 right-2 px-4 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center gap-2 text-slate-600 transition-colors">
            <Filter className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading && (
          <div className="py-16 text-center text-sm font-black text-slate-500">Loading providers...</div>
        )}

        {!loading && error && (
          <div className="py-16 text-center space-y-2">
            <p className="text-lg font-black text-slate-600">Could not load providers</p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          paged.map((provider, idx) => (
            <Link
              key={provider.id || provider._id}
              to={`/logistics/browse/list/${provider.id || provider._id}`}
              className="block bg-white rounded-[2.5rem] p-6 border border-slate-200 active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-red-600/5 group"
            >
              <div className="flex items-center gap-5">
                <div
                  className={`size-16 rounded-2xl bg-gradient-to-br ${
                    idx % 3 === 0
                      ? "from-red-500 to-orange-600"
                      : idx % 3 === 1
                        ? "from-orange-500 to-red-600"
                        : "from-rose-500 to-red-600"
                  } flex items-center justify-center text-white text-2xl font-black shadow-lg`}
                >
                  {(provider.company || provider.title || "L").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-lg tracking-tight truncate">
                      {provider.company || provider.title}
                    </h3>
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                      <Star className="size-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black text-amber-600">{provider.rating || 4.8}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Truck className="size-3" />
                      <span>{provider.requirements?.[0] || provider.category || "Logistics"}</span>
                    </div>
                    <div className="size-1 rounded-full bg-slate-200 mt-1" />
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <MapPin className="size-3" />
                      <span>{provider.location || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-red-600 group-hover:bg-red-600/10 transition-colors">
                  <ChevronRight className="size-6" />
                </div>
              </div>
            </Link>
          ))}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-16 text-center text-sm font-black text-slate-500">No providers found</div>
        )}

        {!loading && !error && filtered.length > PAGE_SIZE && (
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

export default LogisticsList;
