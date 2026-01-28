import { useState } from "react";
import { Search, MapPin, Star, SlidersHorizontal, ChevronRight, X, Heart, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const MachineryList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const filters = ["All", "Top Rated", "Lowest Price", "Certified", "Recently Added"];

    const machines = [
        {
            id: 1,
            name: "Schwing Stetter CP30 Mixer",
            brand: "Schwing Stetter",
            category: "Concrete Mixer",
            location: "Chennai, TN",
            price: "₹12,45,000",
            year: "2021",
            rating: 4.8,
            status: "For Sale",
            certified: true,
            image: "https://images.unsplash.com/photo-1579412691525-4c07da01ee7b?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 2,
            name: "Kirloskar 500kVA DG Set",
            brand: "Kirloskar",
            category: "Generators",
            location: "Bangalore, KA",
            price: "₹8,00,000",
            year: "2019",
            rating: 4.9,
            status: "Fast Sale",
            certified: true,
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 3,
            name: "Godrej 5-Ton Forklift",
            brand: "Godrej",
            category: "Forklifts",
            location: "Mumbai, MH",
            price: "₹15,20,000",
            year: "2022",
            rating: 4.7,
            status: "For Sale",
            certified: false,
            image: "https://images.unsplash.com/photo-1541625602330-2277a7c4354d?auto=format&fit=crop&q=80&w=400"
        }
    ];

    const filteredMachines = machines.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight italic">Find Machine</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    {filteredMachines.length} verified listings available
                </p>
            </div>

            {/* Sticky Search & Filter */}
            <div className="space-y-4 sticky top-[72px] z-30 bg-slate-50 dark:bg-slate-950 py-2 -mx-2 px-2">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search model, brand or type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold text-sm focus:ring-2 focus:ring-amber-500/20 outline-none shadow-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-xl bg-amber-600 flex items-center justify-center text-white active:scale-95 transition-transform shadow-lg shadow-amber-500/20">
                        <SlidersHorizontal className="size-4" />
                    </button>
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeFilter === filter
                                ? "bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-500/20"
                                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/10"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="space-y-5">
                {filteredMachines.map((item) => (
                    <Link
                        key={item.id}
                        to={`/machinery/buy/item/${item.id}`}
                        className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-5 active:scale-[0.98] transition-all relative overflow-hidden shadow-sm"
                    >
                        <div className="flex gap-4">
                            <div className="size-28 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                                <img src={item.image} alt={item.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <button className="absolute top-2 right-2 size-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                                    <Heart className="size-4" />
                                </button>
                            </div>
                            <div className="flex-1 space-y-2 py-0.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="size-3 fill-current" />
                                        <span className="text-[10px] font-black">{item.rating}</span>
                                    </div>
                                    {item.certified && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 text-[8px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/50">
                                            <ShieldCheck className="size-2.5" /> Certified
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-base font-black tracking-tight leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors uppercase italic">{item.name}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {item.brand} • {item.year} Model
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <MapPin className="size-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.location}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-xl font-black tracking-tight text-amber-600">
                                    {item.price}
                                </p>
                                <div className="size-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center group-hover:scale-110 transition-all">
                                    <ChevronRight className="size-5" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MachineryList;
