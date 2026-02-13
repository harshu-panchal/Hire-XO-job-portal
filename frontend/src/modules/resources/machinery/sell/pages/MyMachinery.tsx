import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, MessageSquare, Edit3, MoreVertical, Trash2, Box } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";

const MyMachinery = () => {
  const navigate = useNavigate();
  const [machinery, setMachinery] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const [myMachinery, myInquiries] = await Promise.all([
          resourceService.getMyListings("machinery"),
          applicationService.getReceivedResourceApplications("machinery"),
        ]);
        setMachinery(myMachinery || []);
        setInquiries(myInquiries || []);
      } catch (error) {
        setMachinery([]);
        setInquiries([]);
      }
    };

    load();
  }, []);

  const getInquiryCount = (itemId: string) =>
    inquiries.filter((inq: any) => (inq.resourceId?._id || inq.resourceId) === itemId).length;

  const activeCount = useMemo(
    () => machinery.filter((item) => (item.status || "Live") === "Live").length,
    [machinery]
  );

  const handleEdit = (item: any) => {
    navigate("/machinery/sell/post", { state: { machine: item } });
  };

  const handleDelete = async (itemId: string) => {
    try {
      await resourceService.delete("machinery", itemId);
      setMachinery((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      // keep state unchanged on failure
    }
  };

  return (
    <div className="py-6 space-y-8 select-none bg-slate-50 min-h-screen text-slate-900">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">Asset Fleet</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] leading-none">
          Manage your listed industrial assets
        </p>
      </div>

      {/* Quick Filter */}
      <div className="flex gap-4 p-2 bg-white rounded-full border border-slate-200 shadow-sm">
        <button className="flex-1 py-3 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform">
          Active ({String(activeCount).padStart(2, "0")})
        </button>
        <button className="flex-1 py-3 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform">
          Archived
        </button>
      </div>

      {/* Inventory List */}
      <div className="space-y-6 pb-20">
        {machinery.map((item, index) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden group shadow-sm relative"
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
                  className={`absolute top-2 left-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                    (item.status || "Live") === "Live"
                      ? "bg-emerald-500 text-white border-emerald-400/30 shadow-lg shadow-emerald-500/20"
                      : "bg-slate-200 text-slate-600 border-slate-300"
                  }`}
                >
                  {item.status || "Live"}
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
                <h3 className="text-base font-black tracking-tighter leading-tight uppercase italic">
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
                      {getInquiryCount(item.id)}
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
                  className="size-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors border border-slate-100 active:scale-90 transition-transform"
                >
                  <Edit3 className="size-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="size-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors border border-rose-100 active:scale-90 transition-transform"
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
            <div className="absolute top-0 right-0 h-full w-1 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}

        {machinery.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
            No machinery listed
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
              <div className="h-full bg-indigo-600 w-[80%]" />
            </div>
          </div>
          <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-600/30">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyMachinery;
