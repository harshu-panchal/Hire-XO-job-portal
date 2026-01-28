import { useState } from "react";
import { Search, Filter, MapPin, Building2, Calendar, Clock, ArrowRight } from "lucide-react";

const TendersList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Civil Works", "IT Services", "Renewable Energy", "Healthcare", "Consultancy"];

    const tenders = [
        {
            id: 1,
            title: "Smart City Infrastructure Project",
            organization: "Municipal Corporation",
            location: "Mumbai, Maharashtra",
            value: "₹25 Cr",
            deadline: "15 Oct 2024",
            category: "Civil Works",
            type: "Open Tender",
            refNo: "MC-2024-001"
        },
        {
            id: 2,
            title: "Solar Power Plant Installation",
            organization: "State Energy Board",
            location: "Pune, Maharashtra",
            value: "₹12 Cr",
            deadline: "20 Oct 2024",
            category: "Renewable Energy",
            type: "Limited Tender",
            refNo: "SEB-SLR-2024"
        },
        {
            id: 3,
            title: "E-Governance Software Solution",
            organization: "IT Department",
            location: "New Delhi",
            value: "₹5 Cr",
            deadline: "10 Oct 2024",
            category: "IT Services",
            type: "Open Tender",
            refNo: "ITD-SFT-042"
        },
        {
            id: 4,
            title: "Hospital Medical Equipment Supply",
            organization: "Public Health Dept",
            location: "Chennai, Tamil Nadu",
            value: "₹8 Cr",
            deadline: "05 Nov 2024",
            category: "Healthcare",
            type: "Open Tender",
            refNo: "PHD-MED-2024"
        },
        {
            id: 5,
            title: "Urban Planning Consultancy",
            organization: "Urban Housing Board",
            location: "Bangalore, Karnataka",
            value: "₹3 Cr",
            deadline: "18 Oct 2024",
            category: "Consultancy",
            type: "Limited Tender",
            refNo: "UHB-CNS-015"
        },
        {
            id: 6,
            title: "Metro Extension Phase 3",
            organization: "Metro Rail Corp",
            location: "Hyderabad, Telangana",
            value: "₹150 Cr",
            deadline: "30 Nov 2024",
            category: "Civil Works",
            type: "Global Tender",
            refNo: "MRC-MET-003"
        }
    ];

    const filteredTenders = tenders.filter(tender =>
        (selectedCategory === "All" || tender.category === selectedCategory) &&
        (tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tender.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tender.refNo.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
                        placeholder="Search by title, organization or Ref No..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm"
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
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                        {/* Status/Type Badge */}
                        <div className="absolute top-0 right-0 pt-5 pr-5">
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${tender.type.includes("Global")
                                    ? "bg-purple-100 dark:bg-purple-950/30 text-purple-600 border-purple-200 dark:border-purple-900"
                                    : "bg-violet-100 dark:bg-violet-950/30 text-violet-600 border-violet-200 dark:border-violet-900"
                                    }`}>
                                    {tender.type}
                                </span>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{tender.refNo}</p>
                            </div>
                        </div>

                        {/* Top Section */}
                        <div className="flex items-start gap-4 mb-4 pr-32">
                            <div className="size-14 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border border-violet-100 dark:border-violet-900 flex items-center justify-center shrink-0">
                                <Building2 className="size-7 text-violet-600" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-violet-600">{tender.organization}</p>
                                <h3 className="text-lg font-black tracking-tight leading-tight">{tender.title}</h3>
                            </div>
                        </div>

                        {/* Middle Section - Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-5">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-1">
                                    <Clock className="size-3 text-slate-400" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Tender Value</p>
                                </div>
                                <p className="text-lg font-black text-emerald-600 tracking-tight">{tender.value}</p>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-1">
                                    <Calendar className="size-3 text-slate-400" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Closing Date</p>
                                </div>
                                <p className="text-base font-black tracking-tight">{tender.deadline}</p>
                            </div>
                        </div>

                        {/* Bottom Section - Location & Action */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-2">
                                <MapPin className="size-3.5 text-slate-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tender.location}</span>
                            </div>
                            <button className="flex items-center gap-2 text-violet-600 font-black text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                                View Details <ArrowRight className="size-4" />
                            </button>
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

            {/* Load More Button */}
            {filteredTenders.length > 0 && (
                <button className="w-full py-5 rounded-[2rem] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-xs uppercase tracking-widest active:scale-95 transition-transform border border-slate-200 dark:border-white/5">
                    Load 24 More Opportunities
                </button>
            )}
        </div>
    );
};

export default TendersList;
