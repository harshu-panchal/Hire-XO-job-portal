import { useEffect, useRef, useState } from "react";
import { Star, Edit3, MoreVertical, Plus, Trash2, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { resourceService } from "@/services/resourceService";

const MyEquipments = () => {
  const [fleet, setFleet] = useState<any[]>([]);
  const fetchedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const data = await resourceService.getMyListings("equipments");
        setFleet(data || []);
      } catch (error) {
        setFleet([]);
      }
    };

    load();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "On Rent":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Available":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Maintenance":
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await resourceService.delete("equipments", id);
      setFleet((prev) => prev.filter((item) => (item.id || item._id) !== id));
    } catch (error) {
      // keep UI unchanged on failure
    }
  };

  const handleEdit = (item: any) => {
    navigate("/equipments/provide/post", { state: { equipment: item } });
  };

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight leading-none">Fleet Inventory</h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
            Manage {fleet.length} pieces of hardware
          </p>
        </div>
        <Link
          to="/equipments/provide/post"
          className="size-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <Plus className="size-5" />
        </Link>
      </div>

      {/* Fleet List */}
      <div className="space-y-6 pb-20">
        {fleet.map((item) => (
          <div
            key={item.id || item._id}
            className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm group"
          >
            <div className="p-5 flex gap-5">
              <div className="size-24 rounded-3xl overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={item.image || item.images?.[0]}
                  alt={item.name || item.title}
                  className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 space-y-1 py-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div
                    className={`px-3 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusStyle(
                      item.status || "Available"
                    )}`}
                  >
                    {item.status || "Available"}
                  </div>
                  <button className="text-slate-400">
                    <MoreVertical className="size-4" />
                  </button>
                </div>
                <h3 className="text-sm font-black tracking-tight leading-tight truncate">
                  {item.name || item.title}
                </h3>
                <div className="flex items-center gap-1">
                  <Star className="size-2.5 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black">{item.rating || 0}</span>
                  <span className="text-[10px] text-slate-400 ml-1 uppercase tracking-widest font-black">
                    Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 space-y-0.5">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none">
                  Last Base
                </p>
                <p className="text-[10px] font-black leading-none">{item.location || "N/A"}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 space-y-0.5">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none">
                  Pricing
                </p>
                <p className="text-[10px] font-black leading-none">
                  {item.price || item.compensation || "N/A"}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-slate-50 p-2 flex gap-2 border-t border-slate-100">
              <button
                onClick={() => handleEdit(item)}
                className="flex-1 py-3 rounded-2xl bg-white border border-slate-200 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Edit3 className="size-3.5" /> Edit Details
              </button>
              <button className="flex-1 py-3 rounded-2xl bg-white border border-slate-200 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all text-slate-600 hover:text-blue-600 transition-colors">
                <Eye className="size-3.5" /> View Stats
              </button>
              <button
                onClick={() => handleDelete(item.id || item._id)}
                className="size-11 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center active:scale-90 transition-transform"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {fleet.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
              No equipment listings found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEquipments;
