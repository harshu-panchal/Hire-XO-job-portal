import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, MessageSquare, Edit3, MoreVertical, Trash2, Box, Search, RotateCcw, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";
import { toast } from "sonner";

const MyMachinery = () => {
  const navigate = useNavigate();
  const [machinery, setMachinery] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<"Active" | "Archived">("Active");
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [myMachinery, myInquiries] = await Promise.all([
        resourceService.getMyListings("machinery"),
        applicationService.getReceivedResourceApplications("machinery"),
      ]);
      setMachinery(myMachinery || []);
      setInquiries(myInquiries || []);
    } catch (error) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    loadData();
  }, []);

  const getInquiryCount = (itemId: string) =>
    inquiries.filter(
      (inq: any) => (inq.resourceId?._id || inq.resourceId?.id || inq.resourceId) === itemId
    ).length;

  const activeCount = useMemo(
    () => machinery.filter((item) => (item.status || "Active") === "Active").length,
    [machinery]
  );

  const archivedCount = useMemo(
    () => machinery.filter((item) => item.status === "Archived").length,
    [machinery]
  );

  const filteredMachinery = useMemo(() => {
    return machinery.filter((item) => {
      const matchesFilter = currentFilter === "Active"
        ? (item.status || "Active") === "Active"
        : item.status === "Archived";
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [machinery, currentFilter, searchQuery]);

  const handleEdit = (item: any) => {
    navigate("/machinery/sell/post", { state: { machine: item } });
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await resourceService.delete("machinery", itemId);
      setMachinery((prev) => prev.filter((item) => (item.id || item._id) !== itemId));
      toast.success("Listing deleted");
    } catch (error) {
      toast.error("Failed to delete listing");
    }
  };

  const toggleStatus = async (item: any) => {
    const newStatus = (item.status || "Active") === "Active" ? "Archived" : "Active";
    try {
      const id = item.id || item._id;
      await resourceService.update("machinery", id, { status: newStatus });
      setMachinery((prev) =>
        prev.map((m) => (m.id || m._id) === id ? { ...m, status: newStatus } : m)
      );
      toast.success(`Asset ${newStatus === "Archived" ? "archived" : "restored"}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="py-6 space-y-8 select-none bg-slate-50 min-h-screen text-slate-900 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Asset Fleet</h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] leading-none">
            Manage your industrial assets
          </p>
        </div>
        <button
          onClick={loadData}
          className="size-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center active:scale-90 transition-transform shadow-sm"
        >
          <RotateCcw className={`size-5 text-slate-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-12 pr-4 py-4 rounded-3xl bg-white border border-slate-200 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 shadow-sm"
          />
        </div>

        <div className="flex gap-4 p-2 bg-white rounded-full border border-slate-200 shadow-sm">
          <button
            onClick={() => setCurrentFilter("Active")}
            className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${currentFilter === "Active"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-500 hover:bg-slate-50"
              }`}
          >
            Active ({String(activeCount).padStart(2, "0")})
          </button>
          <button
            onClick={() => setCurrentFilter("Archived")}
            className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${currentFilter === "Archived"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-500 hover:bg-slate-50"
              }`}
          >
            Archived ({String(archivedCount).padStart(2, "0")})
          </button>
        </div>
      </div>

      {/* Inventory List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 animate-pulse font-black text-[10px] uppercase tracking-widest text-slate-400">
            Scanning Hangar...
          </div>
        ) : filteredMachinery.map((item, index) => (
          <div
            key={item.id || item._id}
            className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden group shadow-sm relative animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="p-6 flex gap-6">
              <div className="size-28 rounded-[2rem] overflow-hidden bg-slate-100 shrink-0 relative">
                <img
                  src={
                    item.images?.[0] ||
                    "https://images.unsplash.com/photo-1579412691525-4c07da01ee7b?auto=format&fit=crop&q=80&w=400"
                  }
                  alt={item.title}
                  className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className={`absolute top-2 left-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${(item.status || "Active") === "Active"
                      ? "bg-emerald-500 text-white border-emerald-400/30 shadow-lg shadow-emerald-500/20"
                      : "bg-amber-500 text-white border-amber-400/30 shadow-lg shadow-amber-500/20"
                    }`}
                >
                  {item.status || "Active"}
                </div>
              </div>
              <div className="flex-1 space-y-2 py-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black tracking-widest text-indigo-600 uppercase italic leading-none">
                    ID: AST-{index + 1}92
                  </p>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical className="size-4" />
                  </button>
                </div>
                <h3 className="text-base font-black tracking-tighter leading-tight uppercase italic truncate">
                  {item.title}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 opacity-60">
                    <Eye className="size-3 text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {item.views || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-60">
                    <MessageSquare className="size-3 text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {getInquiryCount(item.id || item._id)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex items-center justify-between">
              <p className="text-xl font-black tracking-tight italic text-indigo-600">
                {item.compensation || "N/A"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="size-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100 active:scale-90 transition-transform"
                  title="Edit"
                >
                  <Edit3 className="size-4" />
                </button>
                <button
                  onClick={() => toggleStatus(item)}
                  className="size-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-amber-600 transition-colors border border-slate-100 active:scale-90 transition-transform"
                  title={(item.status || "Active") === "Active" ? "Archive" : "Restore"}
                >
                  {(item.status || "Active") === "Active" ? <Archive className="size-4" /> : <RotateCcw className="size-4" />}
                </button>
                <button
                  onClick={() => handleDelete(item.id || item._id)}
                  className="size-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors border border-rose-100 active:scale-90 transition-transform"
                  title="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
                <button
                  onClick={() => navigate("/machinery/sell/inquiries")}
                  className="px-6 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-indigo-500/20"
                >
                  Insights
                </button>
              </div>
            </div>

            {/* Decorative side accent */}
            <div className={`absolute top-0 right-0 h-full w-1 transition-opacity ${(item.status || "Active") === "Active" ? "bg-indigo-600" : "bg-amber-500"
              } opacity-0 group-hover:opacity-100`} />
          </div>
        ))}

        {!loading && filteredMachinery.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-[2.5rem] py-16 text-center">
            <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Box className="size-8 text-slate-300" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {searchQuery ? "No assets matching search" : `No ${currentFilter.toLowerCase()} assets listed`}
            </p>
          </div>
        )}

        {/* Listing Limit Info */}
        <div className="p-6 bg-white rounded-[2rem] border border-dashed border-slate-300 flex items-center gap-4 shadow-sm">
          <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
            <Box className="size-5" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-500">
              Inventory slots {machinery.length}/10 used
            </p>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-1000"
                style={{ width: `${(machinery.length / 10) * 100}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => navigate("/resource-plans")}
            className="text-[9px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-600/30"
          >
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyMachinery;

