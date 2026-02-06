import { TrendingUp, DollarSign, Target, Eye, Search, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { resourceService } from "@/services/resourceService";

const BrowseDashboard = () => {
  const [stats, setStats] = useState({
    activeOpportunities: 0,
    avgROI: "18.5%",
    totalValue: "₹0",
  });
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await resourceService.getAll("investors");
        setFeatured(data.slice(0, 3));

        // Calculate total value (mocking for now as we don't have a sum API)
        const total = data.reduce((acc, curr: any) => {
          // Extract numeric value from strings like "₹10L - ₹50L" or "50000"
          const amountStr = curr.investmentAmount || curr.compensation || "0";
          const val = parseFloat(amountStr.replace(/[^0-9.]/g, ""));
          return acc + (isNaN(val) ? 0 : val);
        }, 0);

        setStats({
          activeOpportunities: data.length,
          avgROI: "22.4%", // Simplified average ROI
          totalValue: `₹${total}Cr`,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-sm font-black uppercase tracking-widest text-slate-400">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-1 px-1">
          <h1 className="text-4xl font-black tracking-tighter leading-tight">
            Investment <br />
            <span className="text-violet-600">Opportunities</span>
          </h1>
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest">
            Discover your next big investment
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 py-2">
          <div className="bg-violet-600/5 border border-violet-600/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-violet-600/10 flex items-center justify-center">
                <Target className="size-7 text-violet-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-violet-600/60 mb-0.5">
                  Active Opportunities
                </p>
                <p className="text-2xl font-black tracking-tight">{stats.activeOpportunities}+</p>
              </div>
            </div>
            <div className="text-[10px] font-black bg-violet-600/10 text-violet-600 px-3 py-1 rounded-full uppercase tracking-widest">
              Live Now
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200 shadow-sm">
              <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="size-6 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Avg. ROI
              </p>
              <p className="text-xl font-black tracking-tight">{stats.avgROI}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">
                Last Quarter
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200 shadow-sm">
              <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <DollarSign className="size-6 text-amber-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Total Value
              </p>
              <p className="text-xl font-black tracking-tight">{stats.totalValue}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 mt-2">
                Available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black tracking-tight">Featured Opportunities</h2>
          <Link
            to="/investor/browse/opportunities"
            className="text-xs font-black text-violet-600 uppercase tracking-widest active:scale-95 transition-transform"
          >
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {featured.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-[2rem] border border-slate-200">
              <p className="text-sm font-bold text-slate-500">No opportunities found.</p>
            </div>
          ) : (
            featured.map((opp) => (
              <Link
<<<<<<< HEAD
                key={opp._id || opp.id}
                to={`/investor/browse/opportunities/${opp._id || opp.id}`}
                className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
=======
                key={opp._id}
                to={`/investor/browse/opportunities/${opp._id}`}
                className="block bg-white rounded-[2rem] p-5 border border-slate-200 active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
>>>>>>> 0bd50870b778749155b41d50edbce6c758b082bf
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
                      {opp.company?.charAt(0) || opp.title?.charAt(0) || "I"}
                    </div>
                    <div>
                      <p className="text-violet-600 font-black uppercase tracking-widest text-[9px]">
                        {opp.company || "Direct Opportunity"}
                      </p>
                      <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/10 mt-0.5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-violet-600">
                          {opp.investmentSector?.[0] || opp.category || "Investment"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Seeking
                    </p>
                    <p className="text-lg font-black text-emerald-600">
                      {opp.investmentAmount || opp.compensation || "Negotiable"}
                    </p>
                  </div>
                </div>
                <h3 className="font-black text-lg tracking-tight mb-2">{opp.title}</h3>
                <p className="text-xs text-slate-600 mb-3 line-clamp-2 font-bold">
                  {opp.description}
                </p>
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1">
                    <Eye className="size-3" />
                    <span>{(opp.views || 0) + 10} views</span>
                  </div>
                  <div className="size-1 rounded-full bg-slate-200" />
                  <span>{opp.type || "Equity"} Offered</span>
                  <div className="size-1 rounded-full bg-slate-200" />
                  <span>{opp.location || "Online"}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3 pb-8">
        <h2 className="text-xl font-black tracking-tight px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/investor/browse/opportunities"
            className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2rem] p-5 text-white active:scale-95 transition-transform shadow-lg shadow-violet-500/20"
          >
            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Search className="size-5" />
            </div>
            <p className="font-black text-sm">Browse All</p>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">
              Opportunities
            </p>
          </Link>
<<<<<<< HEAD
          <button
            onClick={() => {
              // Check if authenticated (using simple localStorage check or we needs to import store)
              // For simplicity, we just link to it, but we know it's protected.
              // Better user experience: go to login if not authenticated
              const storage = localStorage.getItem("auth-storage");
              const isAuthenticated = storage ? JSON.parse(storage).state.isAuthenticated : false;

              if (isAuthenticated) {
                window.location.href = "/investor/browse/my-investments";
              } else {
                window.location.href = "/login/resource";
              }
            }}
            className="bg-slate-900 dark:bg-white rounded-[2rem] p-5 text-white dark:text-slate-900 active:scale-95 transition-transform shadow-lg shadow-slate-900/10 w-full text-left"
=======
          <Link
            to="/investor/browse/my-investments"
            className="bg-slate-900 rounded-[2rem] p-5 text-white active:scale-95 transition-transform shadow-lg shadow-slate-900/10"
>>>>>>> 0bd50870b778749155b41d50edbce6c758b082bf
          >
            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
              <Briefcase className="size-5" />
            </div>
            <p className="font-black text-sm">My Portfolio</p>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">
              Track Interests
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrowseDashboard;
