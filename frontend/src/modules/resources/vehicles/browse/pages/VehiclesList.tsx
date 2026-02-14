import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Filter, Star, MapPin, Car, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "@/services/resourceService";

const PAGE_SIZE = 6;

const VehiclesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicles, setVehicles] = useState<any[]>([]);
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
        const data = await resourceService.getAll("vehicles");
        setVehicles(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load vehicles");
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(
    () =>
      vehicles.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.vehicleTypes?.[0] || "").toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [vehicles, searchQuery]
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
        <h1 className="text-3xl font-black tracking-tighter">Available Vehicles</h1>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-600 transition-colors">
            <Search className="size-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for models or categories..."
            className="w-full bg-white border border-slate-200 rounded-3xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all shadow-sm"
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
          <div className="py-16 text-center text-sm font-black text-slate-500">Loading vehicles...</div>
        )}

        {!loading && error && (
          <div className="py-16 text-center space-y-2">
            <p className="text-lg font-black text-slate-600">Could not load vehicles</p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          paged.map((item, idx) => (
            <Link
              key={item.id}
              to={`/vehicles/browse/list/${item.id}`}
              className="block bg-white rounded-[2.5rem] p-6 border border-slate-200 active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-cyan-600/5 group"
            >
              <div className="flex items-center gap-5">
                <div
                  className={`size-16 rounded-2xl bg-gradient-to-br ${
                    idx % 3 === 0
                      ? "from-cyan-500 to-teal-600"
                      : idx % 3 === 1
                        ? "from-teal-500 to-cyan-600"
                        : "from-cyan-600 to-teal-700"
                  } flex items-center justify-center text-white text-2xl font-black shadow-lg`}
                >
                  {(item.title || "V").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-lg tracking-tight truncate">{item.title}</h3>
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                      <Star className="size-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black text-amber-600">{item.rating || 4.8}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Car className="size-3" />
                      <span>{item.vehicleTypes?.[0] || item.category || "Vehicle"}</span>
                    </div>
                    <div className="size-1 rounded-full bg-slate-200 mt-1" />
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <MapPin className="size-3" />
                      <span>{item.location || "N/A"}</span>
                    </div>
                    <div className="size-1 rounded-full bg-slate-200 mt-1" />
                    <div className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">
                      {item.compensation || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-cyan-600 group-hover:bg-cyan-600/10 transition-colors">
                  <ChevronRight className="size-6" />
                </div>
              </div>
            </Link>
          ))}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-16 text-center text-sm font-black text-slate-500">No vehicles found</div>
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

export default VehiclesList;
