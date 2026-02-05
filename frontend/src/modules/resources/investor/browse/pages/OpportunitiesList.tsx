import { useState, useEffect } from "react";
import { Search, Bookmark, Eye, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "@/services/resourceService";

const OpportunitiesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sectors = [
    { id: "all", label: "All Sectors" },
    { id: "technology", label: "Technology" },
    { id: "healthcare", label: "Healthcare" },
    { id: "manufacturing", label: "Manufacturing" },
    { id: "finance", label: "Finance" },
    { id: "education", label: "Education" },
  ];

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const data = await resourceService.getAll("investors");
        setOpportunities(data);
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      (opp.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (opp.company?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (opp.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const sector = (opp.industry || opp.category || "").toLowerCase();
    const matchesSector = selectedSector === "all" || sector === selectedSector.toLowerCase();

    return matchesSearch && matchesSector;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-sm font-black uppercase tracking-widest text-slate-400">
          Loading Opportunities...
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6 select-none">
      {/* Header */}
      <div className="space-y-4">
        <div className="px-1">
          <h1 className="text-3xl font-black tracking-tight">
            Investment <span className="text-violet-600">Opportunities</span>
          </h1>
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest mt-1">
            {filteredOpportunities.length} opportunities available
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company, title or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-white border border-slate-200 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm"
          />
        </div>

        {/* Sector Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {sectors.map((sector) => (
            <button
              key={sector.id}
              onClick={() => setSelectedSector(sector.id)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedSector === sector.id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "bg-slate-100 text-slate-600"
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
          <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="size-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="size-10 text-slate-300" />
            </div>
            <p className="text-lg font-black text-slate-500">No opportunities found</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-[2.5rem] p-6 border border-slate-200 relative group hover:border-violet-300 transition-all shadow-sm hover:shadow-xl"
            >
              <Link to={`/investor/browse/opportunities/${opp.id}`} className="block">
                {/* Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shrink-0 group-hover:scale-105 transition-transform">
                    {opp.company?.charAt(0) || "I"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-violet-600 font-black uppercase tracking-widest text-[10px]">
                        {opp.company || "Direct Listing"}
                      </p>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="size-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          {opp.location || "Remote"}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-black text-xl tracking-tight mb-2 group-hover:text-violet-600 transition-colors">
                      {opp.title}
                    </h3>
                    <div className="flex gap-2">
                      <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/10">
                        <span className="text-[8px] font-black uppercase tracking-widest text-violet-600">
                          {opp.industry || opp.category || "Investment"}
                        </span>
                      </div>
                      {opp.founded && (
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-500/10 border border-slate-500/10">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                            Est. {opp.founded}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-6 line-clamp-2 font-bold leading-relaxed">
                  {opp.description}
                </p>

                {/* Investment Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                      Investment Seeking
                    </p>
                    <p className="text-xl font-black text-emerald-700">
                      ₹{opp.amount || opp.seekingAmount || "Negotiable"}
                    </p>
                  </div>
                  <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-violet-600 mb-1">
                      Equity Offered
                    </p>
                    <p className="text-xl font-black text-violet-700">
                      {opp.equity || "To be discussed"}
                    </p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Eye className="size-3.5 text-slate-400" />
                      <span>{(opp.views || 0) + 10} views</span>
                    </div>
                    <div className="size-1 rounded-full bg-slate-300" />
                    <span>ROI: {opp.roi || "18-25%"}</span>
                  </div>
                  <div className="text-violet-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore Details <Search className="size-3" />
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <h4 className="text-xl font-black tracking-tight">Expand your portfolio.</h4>
          <p className="text-xs font-bold opacity-60">
            Get notifications for new opportunities matching your preferred sectors.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 size-40 bg-violet-600/30 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default OpportunitiesList;
