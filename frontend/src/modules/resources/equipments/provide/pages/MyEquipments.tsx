import { Star, Edit3, MoreVertical, Plus, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const MyEquipments = () => {
    const fleet = [
        {
            id: 1,
            name: "Caterpillar 320 GC Excavator",
            category: "Excavators",
            status: "On Rent",
            location: "Mumbai, MH",
            price: "₹18,500/day",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1579412691525-4c07da01ee7b?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 2,
            name: "JCB 3DX EcoXcellence",
            category: "Loaders",
            status: "Available",
            location: "Pune, MH",
            price: "₹12,000/day",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1541625602330-2277a7c4354d?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 3,
            name: "Kirloskar 125kVA Generator",
            category: "Generators",
            status: "Maintenance",
            location: "Mumbai, MH",
            price: "₹4,500/day",
            rating: 4.6,
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400"
        }
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "On Rent": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Available": return "bg-blue-50 text-blue-600 border-blue-100";
            case "Maintenance": return "bg-amber-50 text-amber-600 border-amber-100";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="flex items-center justify-between px-1">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight leading-none">Fleet Inventory</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                        Manage {fleet.length} pieces of hardware
                    </p>
                </div>
                <Link to="/equipments/provide/post" className="size-11 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <Plus className="size-5" />
                </Link>
            </div>

            {/* Fleet List */}
            <div className="space-y-6 pb-20">
                {fleet.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm group">
                        <div className="p-5 flex gap-5">
                            <div className="size-24 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                <img src={item.image} alt={item.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 space-y-1 py-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <div className={`px-3 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusStyle(item.status)}`}>
                                        {item.status}
                                    </div>
                                    <button className="text-slate-400">
                                        <MoreVertical className="size-4" />
                                    </button>
                                </div>
                                <h3 className="text-sm font-black tracking-tight leading-tight truncate">{item.name}</h3>
                                <div className="flex items-center gap-1">
                                    <Star className="size-2.5 text-amber-500 fill-amber-500" />
                                    <span className="text-[10px] font-black">{item.rating}</span>
                                    <span className="text-[10px] text-slate-400 ml-1 uppercase tracking-widest font-black">Rating</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-5 pb-5 grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-0.5">
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none">Last Base</p>
                                <p className="text-[10px] font-black leading-none">{item.location}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-0.5">
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none">Pricing</p>
                                <p className="text-[10px] font-black leading-none">{item.price}</p>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="bg-slate-50 dark:bg-white/5 p-2 flex gap-2 border-t border-slate-100 dark:border-white/5">
                            <button className="flex-1 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
                                <Edit3 className="size-3.5" /> Edit Details
                            </button>
                            <button className="flex-1 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
                                <Eye className="size-3.5" /> View Stats
                            </button>
                            <button className="size-11 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/30 flex items-center justify-center active:scale-90 transition-transform">
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyEquipments;
