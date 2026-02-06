import { useState, useEffect } from "react";
import { TrendingUp, Eye, MessageSquare, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";
import { useAuthStore } from "@/store/useAuthStore";

const SeekDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    activeRequests: 0,
    totalViews: 0, // Mock for now
    inquiries: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch my listings (Active Requests)
        // "investors" is the resource type for those seeking investment (SeekDashboard context)
        // Wait, if I am a "Resource" user with category "investors", I post "investor" resources?
        // Actually, the "Seek" dashboard is for those SEEKING investment.
        // In my resource service, this maps to the 'Investor' model?
        // Or 'Tender'?
        // This dashboard is specifically in `investor/seek`.
        // So I am posting requests for Investors to see.
        // The Resource Type is "Investor" (meaning "Investment Opportunity"?) or are we posting "Startups"?
        // The `Investor` model likely represents the "Need" or "Opportunity".

        // Fetch listings
        const listings = await resourceService.getMyListings("investors"); // OR 'investor'? Type is "investors" in service
        setActiveRequests(listings.slice(0, 3));

        // Fetch inquiries (Received Applications)
        // We assume "investors" category for now as we are in Investor/Seek section
        const inquiries = await applicationService.getReceivedResourceApplications("investors");

        // Format inquiries
        const formattedInquiries = inquiries.slice(0, 3).map((inq: any) => ({
          id: inq._id,
          name: inq.applicantId?.name || "Unknown Investor",
          message: inq.message || "No message provided",
          time: new Date(inq.appliedAt).toLocaleDateString(), // Simple date
          avatar: (inq.applicantId?.name || "U").charAt(0).toUpperCase(),
          // We don't have request title easily unless we populate resourceId in backend properly.
          // For now, assume it's linked.
        }));
        setRecentInquiries(formattedInquiries);

        setStats({
          activeRequests: listings.length,
          totalViews: listings.reduce((acc: number, curr: any) => acc + (curr.views || 0), 0),
          inquiries: inquiries.length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-10 text-center animate-pulse">Loading Dashboard...</div>;
  }

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-1 px-1">
          <h1 className="text-4xl font-black tracking-tighter leading-tight">
            Funding <br />
            <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest">
            Manage your funding requests
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 py-2">
          <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileText className="size-7 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-0.5">
                  Active Requests
                </p>
                <p className="text-2xl font-black tracking-tight">{stats.activeRequests}</p>
              </div>
            </div>
            <div className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">
              Live
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
              <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Eye className="size-6 text-blue-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Total Views
              </p>
              <p className="text-xl font-black tracking-tight">{stats.totalViews}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-blue-500/60 mt-2">
                Lifetime
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
              <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <MessageSquare className="size-6 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Inquiries
              </p>
              <p className="text-xl font-black tracking-tight">{stats.inquiries}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">
                Total Received
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black tracking-tight">Recent Inquiries</h2>
          <Link
            to="/investor/seek/inquiries"
            className="text-xs font-black text-primary uppercase tracking-widest active:scale-95 transition-transform"
          >
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {recentInquiries.length > 0 ? (
            recentInquiries.map((inq) => (
              <Link
                key={inq.id}
                to="/investor/seek/inquiries"
                className="block bg-white rounded-[2rem] p-4 border border-slate-200 active:scale-[0.98] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                    {inq.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-black text-sm">{inq.name}</p>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0">
                        {inq.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2 truncate">
                      {inq.message}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">
                        Inquiry
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center p-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
              No inquiries yet
            </div>
          )}
        </div>
      </div>

      {/* My Active Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black tracking-tight">My Active Requests</h2>
          <Link
            to="/investor/seek/my-requests"
            className="text-xs font-black text-primary uppercase tracking-widest active:scale-95 transition-transform"
          >
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {activeRequests.length > 0 ? (
            activeRequests.map((req: any) => (
              <div
                key={req._id}
                className="bg-white rounded-[2rem] p-5 border border-slate-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/10 mb-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">
                        {req.category || "General"}
                      </span>
                    </div>
                    <h3 className="font-black text-lg tracking-tight">
                      {req.title || "Untitled Request"}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Seeking
                    </p>
                    <p className="text-lg font-black text-emerald-600">{req.amount || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1">
                    <Eye className="size-3" />
                    <span>{req.views || 0} views</span>
                  </div>
                  <div className="size-1 rounded-full bg-slate-200" />
                  <div className="flex items-center gap-1">
                    <MessageSquare className="size-3" />
                    <span>{stats.inquiries} inquiries</span> {/* Global count for now */}
                  </div>
                  <div className="size-1 rounded-full bg-slate-200" />
                  <span className="text-emerald-600">Active</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
              No active requests
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-xl font-black tracking-tight px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/investor/seek/post"
            className="bg-gradient-to-br from-primary to-primary/80 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
          >
            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <TrendingUp className="size-5" />
            </div>
            <p className="font-black text-sm">Post Request</p>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">
              New Funding Need
            </p>
          </Link>
          <Link
            to="/investor/seek/inquiries"
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
          >
            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <MessageSquare className="size-5" />
            </div>
            <p className="font-black text-sm">View Inbox</p>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">
              Investor Messages
            </p>
          </Link>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-[2rem] p-5">
        <h3 className="font-black text-sm mb-2 flex items-center gap-2">
          <TrendingUp className="size-4 text-blue-600" />
          Tips for Attracting Investors
        </h3>
        <ul className="space-y-2 text-xs text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-black">•</span>
            <span>Provide detailed business plan and financial projections</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-black">•</span>
            <span>Highlight your unique value proposition and market opportunity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-black">•</span>
            <span>Respond promptly to investor inquiries</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SeekDashboard;
