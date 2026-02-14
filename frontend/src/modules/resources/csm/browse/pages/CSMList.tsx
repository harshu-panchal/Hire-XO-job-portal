import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Filter, Star, MapPin, Building2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "@/services/resourceService";

const PAGE_SIZE = 6;

const CSMList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [consultants, setConsultants] = useState<any[]>([]);
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
        const data = await resourceService.getAll("csm");
        setConsultants(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load CSM experts");
        setConsultants([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(
    () =>
      consultants.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.company || "").toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [consultants, searchQuery]
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
        <h1 className="text-3xl font-black tracking-tighter">Find CSM Experts</h1>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-rose-600 transition-colors">
            <Search className="size-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for supervisors or firms..."
            className="w-full bg-white border border-slate-200 rounded-3xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-rose-600/10 focus:border-rose-600 transition-all shadow-sm"
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
          <div className="py-16 text-center text-sm font-black text-slate-500">Loading experts...</div>
        )}

        {!loading && error && (
          <div className="py-16 text-center space-y-2">
            <p className="text-lg font-black text-slate-600">Could not load experts</p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          paged.map((firm, idx) => (
            <Link
              key={firm.id}
              to={`/csm/browse/list/${firm.id}`}
              className="block bg-white rounded-[2.5rem] p-6 border border-slate-200 active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-rose-600/5 group"
            >
              <div className="flex items-center gap-5">
                <div
                  className={`size-16 rounded-2xl bg-gradient-to-br ${
                    idx % 3 === 0
                      ? "from-rose-500 to-pink-600"
                      : idx % 3 === 1
                        ? "from-pink-500 to-fuchsia-600"
                        : "from-orange-500 to-rose-600"
                  } flex items-center justify-center text-white text-2xl font-black shadow-lg`}
                >
                  {(firm.company || firm.title || "C").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-lg tracking-tight truncate">{firm.company || firm.title}</h3>
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                      <Star className="size-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black text-amber-600">{firm.rating || 4.9}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Building2 className="size-3" />
                      <span>{firm.requirements?.[0] || firm.category || "CSM"}</span>
                    </div>
                    <div className="size-1 rounded-full bg-slate-200 mt-1" />
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <MapPin className="size-3" />
                      <span>{firm.location || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-rose-600 group-hover:bg-rose-600/10 transition-colors">
                  <ChevronRight className="size-6" />
                </div>
              </div>
            </Link>
          ))}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-16 text-center text-sm font-black text-slate-500">No experts found</div>
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

export default CSMList;
