import { Search, Filter, Star, MapPin, Building2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const ConsultantList = () => {
    const consultants = [
        {
            id: 1,
            name: "Prime Project Group",
            category: "Infrastructure",
            rating: 4.9,
            reviews: 124,
            location: "Mumbai, Maharashtra",
            experience: "20+ Years",
            image: "P",
            color: "from-indigo-500 to-blue-600",
        },
        {
            id: 2,
            name: "EcoBuild Solutions",
            category: "Green Building",
            rating: 4.8,
            reviews: 89,
            location: "Bangalore, Karnataka",
            experience: "12+ Years",
            image: "E",
            color: "from-emerald-500 to-teal-600",
        },
        {
            id: 3,
            name: "Urban Metro PMC",
            category: "Transportation",
            rating: 4.7,
            reviews: 56,
            location: "Delhi, NCR",
            experience: "15+ Years",
            image: "U",
            color: "from-orange-500 to-red-600",
        },
    ];

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="space-y-4 px-1">
                <h1 className="text-3xl font-black tracking-tighter">Find PMC Firms</h1>

                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Search className="size-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or specialty..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all shadow-sm"
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
                        to={`/pmc/browse/consultants/${firm.id}`}
                        className="block bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all hover:shadow-xl hover:shadow-indigo-600/5 group"
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
                            <div className="size-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-600/10 transition-colors">
                                <ChevronRight className="size-6" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ConsultantList;
