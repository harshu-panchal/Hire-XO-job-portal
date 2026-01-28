import { useState } from "react";
import { Search, MapPin, Star, Building2, SlidersHorizontal, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";

const EquipmentList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Excavators", "Cranes", "Generators", "Loaders", "Trucks", "Compactors"];

    const equipments = [
        {
            id: 1,
            name: "Caterpillar 320 GC Excavator",
            category: "Excavators",
            provider: "BuildRight Rentals",
            location: "Mumbai, MH",
            price: "₹18,500",
            unit: "day",
            rating: 4.8,
            status: "Available",
            image: "https://images.unsplash.com/photo-1579412691525-4c07da01ee7b?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 2,
            name: "JCB 3DX EcoXcellence",
            category: "Loaders",
            provider: "Metro Infra Equipment",
            location: "Pune, MH",
            price: "₹12,000",
            unit: "day",
            rating: 4.9,
            status: "Fast Filling",
            image: "https://images.unsplash.com/photo-1541625602330-2277a7c4354d?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 3,
            name: "Liebherr LTM 11200 Crane",
            category: "Cranes",
            provider: "SkyHigh Heavy Lift",
            location: "Gujarat",
            price: "₹85,000",
            unit: "day",
            rating: 4.7,
            status: "Available",
            image: "https://images.unsplash.com/photo-1573167101669-476636b96cea?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 4,
            name: "Kirloskar 125kVA Generator",
            category: "Generators",
            provider: "PowerHouse Solutions",
            location: "Mumbai, MH",
            price: "₹4,500",
            unit: "day",
            rating: 4.6,
            status: "Available",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400"
        }
    ];

    const filteredEquipments = equipments.filter(item =>
        (activeCategory === "All" || item.category === activeCategory) &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.provider.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight">Available Gear</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    {filteredEquipments.length} Heavy machines found
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="space-y-4 sticky top-[72px] z-30 bg-white dark:bg-slate-950 py-2 -mx-2 px-2">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by machine name or provider..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white active:scale-95 transition-transform shadow-lg shadow-emerald-500/20">
                        <SlidersHorizontal className="size-4" />
                    </button>
                </div>

                {/* Categories Scroller */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeCategory === cat
                                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl shadow-slate-900/20"
                                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/10"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results List */}
            <div className="space-y-5">
                {filteredEquipments.map((item) => (
                    <Link
                        key={item.id}
                        to={`/equipments/rent/equipment/${item.id}`}
                        className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-5 hover:shadow-xl hover:shadow-black/5 transition-all relative overflow-hidden"
                    >
                        <div className="flex gap-5">
                            <div className="size-28 rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0 relative">
                                <img src={item.image} alt={item.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-[8px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/5">
                                    {item.category}
                                </div>
                            </div>
                            <div className="flex-1 space-y-2 py-0.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-100 dark:border-emerald-900/50">
                                        <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{item.status}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="size-3 text-amber-400 fill-amber-400" />
                                        <span className="text-[10px] font-black">{item.rating}</span>
                                    </div>
                                </div>
                                <h3 className="text-base font-black tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">{item.name}</h3>
                                <div className="flex items-center gap-1.5 opacity-60">
                                    <Building2 className="size-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest truncate">{item.provider}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <MapPin className="size-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.location}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {item.price}<span className="text-[10px] text-slate-400 tracking-widest font-black uppercase">/{item.unit}</span>
                                </p>
                                <div className="size-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:bg-slate-900 dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                                    <ChevronRight className="size-5" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {filteredEquipments.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <div className="size-20 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto">
                            <Search className="size-8 text-slate-300" />
                        </div>
                        <div>
                            <p className="font-black tracking-tight text-lg">No gear found</p>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Try adjusting your filters</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EquipmentList;
