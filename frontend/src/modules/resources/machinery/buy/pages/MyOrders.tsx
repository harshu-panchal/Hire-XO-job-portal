import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { applicationService } from "@/services/applicationService";

const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const apps: any = await applicationService.getMyApplications();
        const mapped = (apps.resources || [])
          .filter((app: any) => {
            const category = (app.resourceId?.category || "").toLowerCase();
            const type = (app.resourceType || "").toLowerCase();
            return category.includes("machinery") || type.includes("machinery");
          })
          .map((app: any) => ({
            id: app.id || app._id,
            name: app.resourceId?.title || "Machinery Asset",
            seller: app.resourceId?.company || "Machinery Seller",
            status:
              app.status === "Accepted"
                ? "Delivered"
                : app.status === "Rejected"
                  ? "Closed"
                  : "Processing",
            date: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A",
            amount: app.bidAmount ? `INR ${app.bidAmount}` : app.resourceId?.compensation || "N/A",
            image:
              app.resourceId?.images?.[0] ||
              "https://images.unsplash.com/photo-1579412691525-4c07da01ee7b?auto=format&fit=crop&q=80&w=400",
          }));
        setOrders(mapped);
      } catch (error) {
        setOrders([]);
      }
    };
    load();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Processing":
        return "text-amber-600 bg-amber-100 border-amber-200";
      case "Delivered":
        return "text-emerald-600 bg-emerald-100 border-emerald-200";
      case "Transit":
        return "text-blue-600 bg-blue-100 border-blue-200";
      default:
        return "text-slate-500 bg-slate-100";
    }
  };

  const totalSpent = useMemo(
    () =>
      orders.reduce((sum, order) => {
        const val = parseFloat((order.amount || "0").toString().replace(/[^0-9.]/g, ""));
        return sum + (isNaN(val) ? 0 : val);
      }, 0),
    [orders]
  );

  return (
    <div className="py-6 space-y-8 select-none">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">Asset History</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest leading-none">
          Track your machinery purchases and orders
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 shrink-0 w-48 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
            Portfolio Value
          </p>
          <p className="text-3xl font-black tracking-tighter italic mt-1">INR {Math.round(totalSpent)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shrink-0 w-48 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Total Assets
          </p>
          <p className="text-3xl font-black tracking-tighter mt-1 italic">{String(orders.length).padStart(2, "0")}</p>
        </div>
      </div>

      <div className="space-y-6 pb-20">
        <h2 className="text-xs font-black uppercase tracking-widest text-amber-600 px-1 italic">
          Recent Purchases
        </h2>
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm relative group"
          >
            <div className="p-5 flex gap-5">
              <div className="size-24 rounded-3xl overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={order.image}
                  alt={order.name}
                  className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 space-y-1 py-1 min-w-0">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}
                >
                  {order.status === "Processing" && <Clock className="size-2.5 animate-spin" />}
                  {order.status === "Delivered" && <CheckCircle2 className="size-2.5" />}
                  {order.status}
                </div>
                <h3 className="text-sm font-black tracking-tight leading-tight truncate uppercase italic">
                  {order.name}
                </h3>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {order.seller}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 space-y-0.5">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                  Net Amount
                </p>
                <p className="text-[10px] font-black">{order.amount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 space-y-0.5">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                  Order Ref
                </p>
                <p className="text-[10px] font-black">{order.id}</p>
              </div>
            </div>

            <div className="bg-slate-950 text-white py-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="size-4 opacity-40" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                  {order.date}
                </span>
              </div>
              <button className="text-[10px] font-black uppercase tracking-[0.2em] decoration-slate-500 underline underline-offset-4">
                Invoice
              </button>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-dashed border-slate-200 rounded-2xl">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
