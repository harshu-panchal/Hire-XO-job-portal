import { Eye, MessageSquare, MoreVertical, Edit3, Trash2, Car } from "lucide-react";

const MyVehicles = () => {
    const vehicles = [
        {
            id: 1,
            title: "2023 Tesla Model 3 Long Range",
            category: "Electric",
            views: 120,
            inquiries: 5,
            status: "Active",
            postedDate: "Jan 10, 2026",
            price: "₹4,500/day"
        },
        {
            id: 2,
            title: "Tata Ace Delivery Van",
            category: "Commercial",
            views: 350,
            inquiries: 18,
            status: "Active",
            postedDate: "Jan 18, 2026",
            price: "₹1,800/day"
        },
    ];

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-1 px-1">
                <h1 className="text-3xl font-black tracking-tighter">My Fleet</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                    Manage your active rental vehicles
                </p>
            </div>

            {/* List */}
            <div className="space-y-4">
                {vehicles.map((vehicle) => (
                    <div
                        key={vehicle.id}
                        className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/10 shadow-sm"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                                    <Car className="size-5" />
                                </div>
                                <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${vehicle.status === "Active"
                                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                    }`}>
                                    {vehicle.status}
                                </div>
                            </div>
                            <button className="size-10 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-center text-slate-400 transition-colors">
                                <MoreVertical className="size-5" />
                            </button>
                        </div>

                        <h3 className="font-black text-lg tracking-tight mb-2 leading-tight">
                            {vehicle.title}
                        </h3>

                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6 px-1">
                            <span className="text-blue-600 italic">#{vehicle.category}</span>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>{vehicle.price}</span>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>Posted {vehicle.postedDate}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                                    <Eye className="size-4 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Views</p>
                                    <p className="text-xs font-black italic">{vehicle.views}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                                    <MessageSquare className="size-4 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Leads</p>
                                    <p className="text-xs font-black italic">{vehicle.inquiries}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="h-12 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform">
                                <Edit3 className="size-3.5" />
                                Edit Unit
                            </button>
                            <button className="h-12 rounded-2xl bg-red-500/10 text-red-600 border border-red-500/10 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform">
                                <Trash2 className="size-3.5" />
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="w-full h-16 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all active:scale-[0.98]"
            >
                List New Vehicle
            </button>
        </div>
    );
};

export default MyVehicles;
