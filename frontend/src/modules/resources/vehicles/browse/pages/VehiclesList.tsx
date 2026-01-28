import { Search, Filter, Star, MapPin, Car, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const VehiclesList = () => {
    const vehicles = [
        {
            id: 1,
            name: "Elite Wheels",
            vehicle: "Range Rover Sport 2024",
            category: "Luxury",
            rating: 4.9,
            reviews: 45,
            location: "Delhi, NCR",
            price: "₹15,000/day",
            image: "E",
            color: "from-cyan-500 to-teal-600",
        },
        {
            id: 2,
            name: "Transport Pro",
            vehicle: "Tata Intra V30 Truck",
            category: "Commercial",
            rating: 4.7,
            reviews: 120,
            location: "Mumbai, MH",
            price: "₹2,500/day",
            image: "T",
            color: "from-teal-500 to-cyan-600",
        },
        {
            id: 3,
            name: "Go Electric",
            vehicle: "2024 Tesla Model 3",
            category: "Electric",
            rating: 4.8,
            reviews: 32,
            location: "Bangalore, KA",
            price: "₹5,500/day",
            image: "G",
            color: "from-cyan-600 to-teal-700",
        },
    ];

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
                        placeholder="Search for models or categories..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-cyan-600/10 focus:border-cyan-600 transition-all shadow-sm"
                    />
                    <button className="absolute inset-y-2 right-2 px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl flex items-center gap-2 text-slate-600 dark:text-slate-300 transition-colors">
                        <Filter className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {vehicles.map((item) => (
                    <Link
                        key={item.id}
                        to={`/vehicles/browse/list/${item.id}`}
                        className="block bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-cyan-600/5 group"
                    >
                        <div className="flex items-center gap-5">
                            <div className={`size-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
                                {item.image}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-black text-lg tracking-tight truncate">{item.vehicle}</h3>
                                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                                        <Star className="size-3 text-amber-500 fill-amber-500" />
                                        <span className="text-[10px] font-black text-amber-600">{item.rating}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <Car className="size-3" />
                                        <span>{item.category}</span>
                                    </div>
                                    <div className="size-1 rounded-full bg-slate-200 mt-1" />
                                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <MapPin className="size-3" />
                                        <span>{item.location}</span>
                                    </div>
                                    <div className="size-1 rounded-full bg-slate-200 mt-1" />
                                    <div className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">
                                        {item.price}
                                    </div>
                                </div>
                            </div>
                            <div className="size-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-600 group-hover:bg-cyan-600/10 transition-colors">
                                <ChevronRight className="size-6" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default VehiclesList;
