import { Search, Filter, Star, MapPin, Building2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const CSMList = () => {
    const consultants = [
        {
            id: 1,
            name: "SiteGuard Professionals",
            category: "Structural",
            rating: 5.0,
            reviews: 156,
            location: "Mumbai, Maharashtra",
            experience: "15+ Years",
            image: "S",
            color: "from-rose-500 to-pink-600",
        },
        {
            id: 2,
            name: "QualiCheck Masters",
            category: "Quality Control",
            rating: 4.9,
            reviews: 92,
            location: "Bangalore, Karnataka",
            experience: "12+ Years",
            image: "Q",
            color: "from-pink-500 to-fuchsia-600",
        },
        {
            id: 3,
            name: "SafetyFirst CSM",
            category: "Safety Compliance",
            rating: 4.8,
            reviews: 64,
            location: "Delhi, NCR",
            experience: "10+ Years",
            image: "SF",
            color: "from-orange-500 to-rose-600",
        },
    ];

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="space-y-4 px-1">
                <h1 className="text-3xl font-black tracking-tighter">Find CSM Experts</h1>

                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-rose-600 transition-colors">
                        <Search className="size-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for supervisors or firms..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-rose-600/10 focus:border-rose-600 transition-all shadow-sm"
                    />
                    <button className="absolute inset-y-2 right-2 px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl flex items-center gap-2 text-slate-600 dark:text-slate-300 transition-colors">
                        <Filter className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {consultants.map((firm) => (
                    <Link
                        key={firm.id}
                        to={`/csm/browse/consultants/${firm.id}`}
                        className="block bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-rose-600/5 group"
                    >
                        <div className="flex items-center gap-5">
                            <div className={`size-16 rounded-2xl bg-gradient-to-br ${firm.color} flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
                                {firm.image}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-black text-lg tracking-tight truncate">{firm.name}</h3>
                                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                                        <Star className="size-3 text-amber-500 fill-amber-500" />
                                        <span className="text-[10px] font-black text-amber-600">{firm.rating}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <Building2 className="size-3" />
                                        <span>{firm.category}</span>
                                    </div>
                                    <div className="size-1 rounded-full bg-slate-200 mt-1" />
                                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <MapPin className="size-3" />
                                        <span>{firm.location}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="size-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-rose-600 group-hover:bg-rose-600/10 transition-colors">
                                <ChevronRight className="size-6" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CSMList;
