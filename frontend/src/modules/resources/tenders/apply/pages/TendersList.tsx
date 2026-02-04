import { useState, useEffect } from "react";
import { Search, Filter, MapPin, Building2, Calendar, Clock, ArrowRight, Wallet } from "lucide-react";
import { resourceService } from "@/services/resourceService";
import { useNavigate } from "react-router-dom";

const TendersList = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [tenders, setTenders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const categories = ["All", "Civil Works", "IT Services", "Renewable Energy", "Healthcare", "Consultancy", "Construction", "Supply"];

    useEffect(() => {
        const fetchTenders = async () => {
            try {
                const data = await resourceService.getAll('tenders');
                setTenders(data);
            } catch (error) {
                console.error("Failed to fetch tenders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTenders();
    }, []);

    const filteredTenders = tenders.filter(tender => {
        const matchesCategory = selectedCategory === "All" ||
            (tender.tenderCategory && tender.tenderCategory.includes(selectedCategory)) ||
            tender.category === selectedCategory;

        const q = searchQuery.toLowerCase();
        const matchesSearch =
            (tender.title || "").toLowerCase().includes(q) ||
            (tender.company || "").toLowerCase().includes(q) ||
            (tender.id || "").toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-sm font-black uppercase tracking-widest text-slate-400">Loading Tenders...</div>
            </div>
        );
    }

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight">Browse Tenders</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    {filteredTenders.length} Active opportunities found
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by title, organization or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-12 pr-12 py-0 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-xl bg-violet-600 flex items-center justify-center text-white active:scale-95 transition-transform shadow-lg shadow-violet-500/20">
                        <Filter className="size-4" />
                    </button>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedCategory === cat
                                ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20"
                                : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-700"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tenders Grid */}
            <div className="space-y-4">
                {filteredTenders.map((tender) => (
                    <div
                        key={tender.id}
                        onClick={() => navigate(`/tenders/apply/tenders/${tender.id}`)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
                    >
                        {/* Status/Type Badge */}
                        <div className="absolute top-0 right-0 pt-5 pr-5">
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${tender.type?.includes("Global")
                                    ? "bg-purple-100 dark:bg-purple-950/30 text-purple-600 border-purple-200 dark:border-purple-900"
                                    : "bg-violet-100 dark:bg-violet-950/30 text-violet-600 border-violet-200 dark:border-violet-900"
                                    }`}>
                                    {tender.type || "Open Tender"}
                                </span>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">#{tender.id?.slice(-6)}</p>
                            </div>
                        </div>

                        {/* Top Section */}
                        <div className="flex items-start gap-4 mb-4 pr-32">
                            <div className="size-14 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border border-violet-100 dark:border-violet-900 flex items-center justify-center shrink-0">
                                {tender.companyLogo ? (
                                    <img src={tender.companyLogo} alt={tender.company} className="size-14 rounded-2xl object-cover" />
                                ) : (
                                    <Building2 className="size-7 text-violet-600" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-violet-600">{tender.company}</p>
                                <h3 className="text-lg font-black tracking-tight leading-tight">{tender.title}</h3>
                            </div>
                        </div>

                        {/* Middle Section - Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-5">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-1">
                                    <Wallet className="size-3 text-slate-400" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Tender Value</p>
                                </div>
                                <p className="text-lg font-black text-emerald-600 tracking-tight">{tender.tenderValue || tender.compensation || "N/A"}</p>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-1">
                                    <Calendar className="size-3 text-slate-400" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Posted Date</p>
                                </div>
                                <p className="text-base font-black tracking-tight">
                                    {tender.postedAt ? new Date(tender.postedAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Bottom Section - Location & Action */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-2">
                                <MapPin className="size-3.5 text-slate-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tender.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-violet-600 font-black text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                                View Details <ArrowRight className="size-4" />
                            </div>
                        </div>
                    </div>
                ))}

                {filteredTenders.length === 0 && (
                    <div className="text-center py-20 space-y-4">
                        <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
                            <Search className="size-8 text-slate-400" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">No tenders found</p>
                            <p className="text-xs text-slate-500">Try adjusting your filters or search keywords</p>
                        </div>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                            className="bg-violet-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-transform"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Load More Button - Only show if there are many items */}
            {filteredTenders.length >= 20 && (
                <button className="w-full py-5 rounded-[2rem] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-xs uppercase tracking-widest active:scale-95 transition-transform border border-slate-200 dark:border-white/5">
                    Load More Opportunities
                </button>
            )}
        </div>
    );
};

export default TendersList;
