import { useState } from "react";
import { Search, Bookmark, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const OpportunitiesList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSector, setSelectedSector] = useState("all");

    const sectors = [
        { id: "all", label: "All Sectors", color: "primary" },
        { id: "technology", label: "Technology", color: "blue" },
        { id: "renewable", label: "Renewable Energy", color: "green" },
        { id: "healthcare", label: "Healthcare", color: "purple" },
        { id: "manufacturing", label: "Manufacturing", color: "orange" },
        { id: "real-estate", label: "Real Estate", color: "cyan" },
    ];

    const opportunities = [
        {
            id: 1,
            company: "TechVenture Solutions",
            logo: "T",
            logoGradient: "from-blue-500 to-cyan-600",
            sector: "Technology",
            sectorColor: "blue",
            title: "AI-Powered SaaS Platform Expansion",
            description: "Looking for strategic investment to scale our AI-driven customer analytics platform across Asian markets. Proven track record with 200+ enterprise clients.",
            amount: "₹5Cr",
            equity: "15%",
            duration: "24 months",
            views: 245,
            location: "Bangalore, India",
            roi: "25-30%",
            bookmarked: false,
        },
        {
            id: 2,
            company: "GreenEnergy Innovations",
            logo: "G",
            logoGradient: "from-green-500 to-emerald-600",
            sector: "Renewable Energy",
            sectorColor: "green",
            title: "Solar Panel Manufacturing Unit",
            description: "Establishing state-of-the-art solar panel manufacturing facility with projected 30% ROI in 3 years. Government subsidies secured.",
            amount: "₹12Cr",
            equity: "20%",
            duration: "36 months",
            views: 189,
            location: "Gujarat, India",
            roi: "28-32%",
            bookmarked: true,
        },
        {
            id: 3,
            company: "HealthTech Dynamics",
            logo: "H",
            logoGradient: "from-purple-500 to-pink-600",
            sector: "Healthcare",
            sectorColor: "purple",
            title: "Telemedicine Platform Development",
            description: "Building comprehensive telemedicine platform connecting patients with specialists across India. Partnerships with 50+ hospitals confirmed.",
            amount: "₹8Cr",
            equity: "18%",
            duration: "30 months",
            views: 312,
            location: "Mumbai, India",
            roi: "22-28%",
            bookmarked: false,
        },
        {
            id: 4,
            company: "Urban Realty Group",
            logo: "U",
            logoGradient: "from-cyan-500 to-blue-600",
            sector: "Real Estate",
            sectorColor: "cyan",
            title: "Premium Residential Complex",
            description: "Luxury residential project in prime location with pre-bookings for 40% units. Expected completion in 24 months with guaranteed returns.",
            amount: "₹25Cr",
            equity: "12%",
            duration: "24 months",
            views: 156,
            location: "Pune, India",
            roi: "18-22%",
            bookmarked: true,
        },
        {
            id: 5,
            company: "AutoParts Manufacturing",
            logo: "A",
            logoGradient: "from-orange-500 to-red-600",
            sector: "Manufacturing",
            sectorColor: "orange",
            title: "EV Component Production Line",
            description: "Setting up production facility for electric vehicle components. MoU signed with 3 major EV manufacturers for supply contracts.",
            amount: "₹15Cr",
            equity: "22%",
            duration: "30 months",
            views: 203,
            location: "Chennai, India",
            roi: "26-30%",
            bookmarked: false,
        },
        {
            id: 6,
            company: "AgriTech Solutions",
            logo: "A",
            logoGradient: "from-lime-500 to-green-600",
            sector: "Technology",
            sectorColor: "blue",
            title: "Smart Farming IoT Platform",
            description: "IoT-based precision farming solution helping farmers optimize crop yields. Pilot programs running successfully in 5 states.",
            amount: "₹6Cr",
            equity: "16%",
            duration: "28 months",
            views: 178,
            location: "Hyderabad, India",
            roi: "24-28%",
            bookmarked: false,
        },
    ];

    const filteredOpportunities = opportunities.filter((opp) => {
        const matchesSearch =
            opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opp.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSector = selectedSector === "all" || opp.sector.toLowerCase() === selectedSector;
        return matchesSearch && matchesSector;
    });

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="space-y-4">
                <div className="px-1">
                    <h1 className="text-3xl font-black tracking-tight">
                        Investment <span className="text-primary">Opportunities</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest mt-1">
                        {filteredOpportunities.length} opportunities available
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search opportunities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                {/* Sector Filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {sectors.map((sector) => (
                        <button
                            key={sector.id}
                            onClick={() => setSelectedSector(sector.id)}
                            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedSector === sector.id
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                }`}
                        >
                            {sector.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Opportunities Grid */}
            <div className="space-y-4">
                {filteredOpportunities.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <Search className="size-8 text-slate-400" />
                        </div>
                        <p className="text-lg font-black text-slate-400">No opportunities found</p>
                        <p className="text-xs text-slate-500 mt-1">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredOpportunities.map((opp) => (
                        <div
                            key={opp.id}
                            className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 relative"
                        >
                            {/* Bookmark Button */}
                            <button className="absolute top-5 right-5 size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-all">
                                <Bookmark
                                    className={`size-5 ${opp.bookmarked ? "fill-primary text-primary" : "text-slate-400"}`}
                                />
                            </button>

                            <Link to={`/investor/browse/opportunities/${opp.id}`} className="block">
                                {/* Header */}
                                <div className="flex items-start gap-3 mb-4 pr-12">
                                    <div
                                        className={`size-14 rounded-xl bg-gradient-to-br ${opp.logoGradient} flex items-center justify-center text-white font-black text-xl shrink-0`}
                                    >
                                        {opp.logo}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-primary font-black uppercase tracking-widest text-[9px] mb-1">
                                            {opp.company}
                                        </p>
                                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/10">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">
                                                {opp.sector}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Title & Description */}
                                <h3 className="font-black text-lg tracking-tight mb-2">{opp.title}</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                    {opp.description}
                                </p>

                                {/* Investment Details */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3 border border-emerald-200 dark:border-emerald-900">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-0.5">
                                            Seeking
                                        </p>
                                        <p className="text-lg font-black text-emerald-700 dark:text-emerald-500">{opp.amount}</p>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-3 border border-blue-200 dark:border-blue-900">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-0.5">
                                            Equity
                                        </p>
                                        <p className="text-lg font-black text-blue-700 dark:text-blue-500">{opp.equity}</p>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-3 border border-purple-200 dark:border-purple-900">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-purple-600 mb-0.5">
                                            ROI
                                        </p>
                                        <p className="text-sm font-black text-purple-700 dark:text-purple-500">{opp.roi}</p>
                                    </div>
                                </div>

                                {/* Meta Info */}
                                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Eye className="size-3" />
                                        <span>{opp.views} views</span>
                                    </div>
                                    <div className="size-1 rounded-full bg-slate-200" />
                                    <span>{opp.duration}</span>
                                    <div className="size-1 rounded-full bg-slate-200" />
                                    <span className="truncate">{opp.location}</span>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </div>

            {/* Load More */}
            {filteredOpportunities.length > 0 && (
                <button className="w-full py-4 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-sm uppercase tracking-widest active:scale-95 transition-all">
                    Load More Opportunities
                </button>
            )}
        </div>
    );
};

export default OpportunitiesList;
