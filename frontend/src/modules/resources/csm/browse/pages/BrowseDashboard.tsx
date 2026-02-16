import { useEffect, useState } from "react";
import { TrendingUp, Award, Target, Eye, Search, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "@/services/resourceService";

const BrowseDashboard = () => {
  const [featuredCSM, setFeaturedCSM] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await resourceService.getAll("csm");
        setFeaturedCSM((Array.isArray(data) ? data : []).slice(0, 2));
      } catch (_error) {
        setFeaturedCSM([]);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-1 px-1">
          <h1 className="text-4xl font-black tracking-tighter leading-tight">
            Hire Best <br />
            <span className="text-rose-600">CSM Experts</span>
          </h1>
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest">
            Construction Supervision Management
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 py-2">
          <div className="bg-rose-600/5 border border-rose-600/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-rose-600/10 flex items-center justify-center">
                <Target className="size-7 text-rose-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-600/60 mb-0.5">
                  Verified CSM Firms
                </p>
                <p className="text-2xl font-black tracking-tight">120+</p>
              </div>
            </div>
            <div className="text-[10px] font-black bg-rose-600/10 text-rose-600 px-3 py-1 rounded-full uppercase tracking-widest">
              Available Now
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
              <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="size-6 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Success Rate
              </p>
              <p className="text-xl font-black tracking-tight">99%</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">
                Project Quality
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
              <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Award className="size-6 text-amber-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Site Experts
              </p>
              <p className="text-xl font-black tracking-tight">2.5k+</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 mt-2">
                On-site Staff
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Consultants */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black tracking-tight">Top Rated Supervisors</h2>
          <Link
            to="/csm/browse/list"
            className="text-xs font-black text-rose-600 uppercase tracking-widest active:scale-95 transition-transform"
          >
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {featuredCSM.length > 0 ? (
            featuredCSM.map((item, index) => {
              const id = item.id || item._id;
              const name = item.company || "CSM Firm";
              const title = item.title || "CSM Service";
              const description =
                item.description ||
                "Specialized CSM services for quality and compliance supervision.";
              const badge = item.requirements?.[0] || item.category || "CSM";
              const avatar = (name || "C").charAt(0).toUpperCase();
              const gradient =
                index % 2 === 0
                  ? "from-rose-500 to-pink-600"
                  : "from-pink-500 to-fuchsia-600";

              return (
                <Link
                  key={id || index}
                  to={id ? `/csm/browse/list/${id}` : "/csm/browse/list"}
                  className="block bg-white rounded-[2rem] p-5 border border-slate-200 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-lg`}
                      >
                        {avatar}
                      </div>
                      <div>
                        <p className="text-rose-600 font-black uppercase tracking-widest text-[9px]">
                          {name}
                        </p>
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/10 mt-0.5">
                          <span className="text-[8px] font-black uppercase tracking-widest text-rose-600">
                            {badge}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Rating
                      </p>
                      <p className="text-lg font-black text-amber-500">{item.rating || "4.8/5"}</p>
                    </div>
                  </div>
                  <h3 className="font-black text-lg tracking-tight mb-2">{title}</h3>
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2">{description}</p>
                  <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-1">
                      <Eye className="size-3" />
                      <span>{item.views || 0} views</span>
                    </div>
                    <div className="size-1 rounded-full bg-slate-200" />
                    <span>{item.projectExperience || "Experienced"}</span>
                    <div className="size-1 rounded-full bg-slate-200" />
                    <span>{item.certifications?.[0] || "Verified"}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-[2rem] border border-slate-200">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                No CSM listings available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-xl font-black tracking-tight px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/csm/browse/list"
            className="bg-gradient-to-br from-rose-600 to-rose-500 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
          >
            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Search className="size-5" />
            </div>
            <p className="font-black text-sm">Find CSM</p>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">
              Browse Experts
            </p>
          </Link>
          <Link
            to="/csm/browse/my-hires"
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
          >
            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Briefcase className="size-5" />
            </div>
            <p className="font-black text-sm">My Hires</p>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Manage CSM</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrowseDashboard;
