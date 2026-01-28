import { Package, ArrowRight, UserCheck, MessageSquare, PlusCircle, BarChart3, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const SellDashboard = () => {
    const stats = [
        { label: "Asset Value", value: "₹45L", icon: DollarSign, color: "text-indigo-400", bgColor: "bg-indigo-500/10" },
        { label: "Active Listings", value: "08", icon: Package, color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
        { label: "Buyer Interest", value: "24", icon: UserCheck, color: "text-amber-400", bgColor: "bg-amber-500/10" },
    ];

    const alerts = [
        { id: 1, type: "Offer", message: "New inquiry for Schwing Mixer CP30", time: "5m ago", urgent: true },
        { id: 2, type: "System", message: "Listing for DG Set is about to expire", time: "2h ago", urgent: false },
        { id: 3, type: "Verification", message: "Identity verification approved", time: "1d ago", urgent: false },
    ];

    const liveInventory = [
        {
            id: 1,
            name: "Schwing Stetter CP30",
            status: "Live",
            views: "1.2k",
            inquiries: 5,
            price: "₹12.45L"
        },
        {
            id: 2,
            name: "Kirloskar 500kVA DG",
            status: "Sold",
            views: "850",
            inquiries: 12,
            price: "₹8.00L"
        }
    ];

    return (
        <div className="py-6 space-y-8 select-none bg-slate-50 min-h-screen text-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Seller Console</h1>
                    <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">
                        Manage your machinery assets
                    </p>
                </div>
                <Link to="/machinery/sell/post" className="size-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 active:scale-90 transition-transform border border-indigo-500/10">
                    <PlusCircle className="size-6" />
                </Link>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-3">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col items-center text-center space-y-2 relative overflow-hidden group shadow-sm">
                        <div className={`size-10 rounded-2xl ${stat.bgColor} flex items-center justify-center relative z-10`}>
                            <stat.icon className={`size-5 ${stat.color.replace('400', '600')}`} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-lg font-black tracking-tight leading-none italic">{stat.value}</p>
                            <p className="text-[7px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            {/* Notification Center */}
            <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 px-1 italic">Operations Center</h2>
                <div className="space-y-2">
                    {alerts.map((alert) => (
                        <div key={alert.id} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl group active:scale-[0.98] transition-all shadow-sm">
                            <div className={`size-1.5 shrink-0 rounded-full ${alert.urgent ? "bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)]" : "bg-indigo-400"}`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold leading-tight line-clamp-1 text-slate-700">{alert.message}</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">{alert.time}</p>
                            </div>
                            <button className="text-slate-300 group-hover:text-indigo-600 transition-colors">
                                <ArrowRight className="size-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inventory Overview */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight italic uppercase">Current Stock</h2>
                    <Link to="/machinery/sell/inventory" className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-transform">
                        Manage Full Stock <ArrowRight className="size-3" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {liveInventory.map((item) => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <h3 className="text-base font-black tracking-tighter uppercase italic group-hover:text-indigo-600 transition-colors leading-none">{item.name}</h3>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Listed Price: {item.price}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${item.status === 'Live' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }`}>
                                    {item.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Total Views</p>
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="size-3 text-indigo-600" />
                                        <p className="text-[10px] font-black">{item.views}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Hot Leads</p>
                                    <div className="flex items-center justify-end gap-2">
                                        <p className="text-[10px] font-black text-amber-600">{item.inquiries}</p>
                                        <MessageSquare className="size-3 text-amber-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Insights Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
                <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black tracking-tight italic uppercase italic">Market Demand</h3>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Forklifts are trending in Pune</p>
                    </div>
                </div>
                <div className="mt-6 flex items-center gap-4 relative z-10">
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 w-3/4 rounded-full" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest uppercase">75% High</span>
                </div>
                <div className="absolute -bottom-8 -right-8 size-48 bg-white/5 rounded-full" />
            </div>
        </div>
    );
};

export default SellDashboard;
