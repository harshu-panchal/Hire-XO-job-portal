import { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  Plus,
  Search,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "@/services/userService";
import { applicationService } from "@/services/applicationService";
import { jobService } from "@/services/jobService";
import { postService, type Post } from "@/services/postService";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDistanceToNow } from "date-fns";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    interviews: 0,
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const [statsData, appsData, myJobs, postsData] = await Promise.all([
          userService.getDashboardStats(),
          applicationService.getReceivedApplications(),
          jobService.getMyListings(),
          postService.getAllPosts(),
        ]);

        setStats({
          activeJobs: myJobs.length || statsData.activeJobs || 0,
          totalApplications: statsData.totalApplications || 0,
          interviews: 0,
        });

        // Format applications
        const formattedApps = appsData.slice(0, 5).map((app: any) => ({
          id: app.id || app._id,
          name: app.applicantId?.name || "Unknown Candidate",
          role: app.jobId?.title || "Unknown Role",
          status: app.status,
          time: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A",
          avatar: (app.applicantId?.name || "U").charAt(0).toUpperCase(),
        }));
        setRecentApplications(formattedApps);
        const { data } = await postService.getAllPosts(1, 10);
        setRecentPosts(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const statCards = [
    {
      label: "Active Jobs",
      value: stats.activeJobs,
      icon: Briefcase,
      color: "text-primary",
      bg: "bg-primary/10",
      to: "/employer/jobs",
    },
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      to: "/employer/applications",
    },
    {
      label: "Interviews",
      value: stats.interviews,
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse">
        <div className="text-sm font-black uppercase tracking-widest text-slate-400">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  // GUEST VIEW
  if (!isAuthenticated) {
    return (
      <div className="py-6 space-y-8 select-none pb-24">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-black tracking-tighter leading-tight">
            Hire Top <br />
            <span className="text-primary">Talent Today</span>
          </h1>
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest max-w-[280px] mx-auto">
            Post jobs, manage applications, and find the perfect candidate.
          </p>
        </div>

        {/* CTA Card */}
        <div className="bg-primary text-white rounded-[2.5rem] p-8 shadow-xl shadow-primary/20 text-center space-y-6">
          <div className="size-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm">
            <Plus className="size-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black mb-2">Post a Job</h3>
            <p className="text-white/80 text-sm font-medium">
              Reach thousands of qualified candidates.
            </p>
          </div>
          <Link
            to="/login/employer"
            className="block w-full py-4 rounded-xl bg-white text-primary font-black text-sm uppercase tracking-widest hover:bg-white/90 active:scale-95 transition-all"
          >
            Get Started
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[2rem] border border-slate-200 space-y-3">
            <div className="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <Users className="size-5" />
            </div>
            <h4 className="font-black text-sm">Smart Matching</h4>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
              AI-powered candidate recommendations.
            </p>
          </div>
          <div className="bg-white p-5 rounded-[2rem] border border-slate-200 space-y-3">
            <div className="size-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
              <Zap className="size-5" />
            </div>
            <h4 className="font-black text-sm">Fast Hiring</h4>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
              Streamlined application process.
            </p>
          </div>
          <div className="bg-white p-5 rounded-[2rem] border border-slate-200 space-y-3 col-span-2">
            <div className="size-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
              <ShieldCheck className="size-5" />
            </div>
            <h4 className="font-black text-sm">Verified Profiles</h4>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
              We verify all candidates to ensure quality and trust.
            </p>
          </div>
        </div>

        {/* Login Prompt */}
        <div className="text-center">
          <p className="text-xs font-bold text-slate-400 mb-2">Already have an account?</p>
          <Link
            to="/login/employer"
            className="text-primary font-black uppercase tracking-widest text-xs hover:underline"
          >
            Login to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD (Existing Code)
  return (
    <div className="py-6 space-y-8 select-none pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter">
            Employer <br />
            <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
            Manage your hiring pipeline
          </p>
        </div>
        <Link
          to="/employer/post-job"
          className="size-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 active:scale-90 transition-all"
        >
          <Plus className="size-6" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4">
        {statCards.map((stat, i) =>
          stat.to ? (
            <Link
              key={i}
              to={stat.to}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex items-center justify-between active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`size-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`size-7 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                </div>
              </div>
              <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <ArrowUpRight className="size-5 text-slate-300" />
              </div>
            </Link>
          ) : (
            <div
              key={i}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`size-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`size-7 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                </div>
              </div>
              <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <ArrowUpRight className="size-5 text-slate-300" />
              </div>
            </div>
          )
        )}
      </div>

      {/* Search Applications */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search candidates..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const query = (e.target as HTMLInputElement).value;
              navigate(`/employer/applications?q=${encodeURIComponent(query)}`);
            }
          }}
          className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-white border-2 border-slate-100 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black placeholder:text-slate-400"
        />
      </div>

      {/* Recent Applications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Recent Applications
          </h2>
          <Link
            to="/employer/applications"
            className="text-[10px] font-black text-primary uppercase tracking-widest active:scale-95 transition-transform"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-4">
          {recentApplications.map((app) => (
            <Link
              key={app.id}
              to="/employer/applications"
              className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center gap-4 active:scale-[0.98] transition-all"
            >
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-black text-xs">{app.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm truncate tracking-tight">{app.name}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                  {app.role}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${app.status === "Pending"
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : app.status === "Accepted"
                      ? "bg-green-500/10 text-green-600 border-green-500/20"
                      : "bg-red-500/10 text-red-600 border-red-500/20"
                    }`}
                >
                  {app.status}
                </div>
                <div className="flex items-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  <Clock className="size-3 mr-1" />
                  {app.time}
                </div>
              </div>
            </Link>
          ))}
          {recentApplications.length === 0 && (
            <div className="text-center p-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
              No applications yet
            </div>
          )}
        </div>
        {/* Recent Talent Posts (Community) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Recent Talent Feed
            </h2>
            <Link
              to="/post"
              className="text-[10px] font-black text-primary uppercase tracking-widest active:scale-95 transition-transform"
            >
              Go to Feed
            </Link>
          </div>

          <div className="grid gap-4">
            {recentPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white p-5 rounded-[2.5rem] border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                    {post.userId.profilePhoto ? (
                      <img src={post.userId.profilePhoto} alt="" className="size-full object-cover" />
                    ) : (
                      <Users className="size-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-xs truncate tracking-tight text-slate-900">
                      {post.userId.name}
                    </h4>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      Available for Work • {formatDistanceToNow(new Date(post.createdAt))} ago
                    </p>
                  </div>
                  {post.userId.isContactHidden && (
                    <Link
                      to="/employer/subscription"
                      className="size-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-500/10"
                    >
                      <ShieldCheck className="size-4" />
                    </Link>
                  )}
                </div>

                <p className="text-[11px] font-medium text-slate-600 line-clamp-2 leading-relaxed">
                  {post.content}
                </p>

                {(post.email || post.phoneNumber || post.resume) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {post.email && (
                      <div className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                        <div className="size-1.5 rounded-full bg-slate-300" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Attached</span>
                      </div>
                    )}
                    {post.phoneNumber && (
                      <div className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                        <div className="size-1.5 rounded-full bg-slate-300" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Phone Provided</span>
                      </div>
                    )}
                    {post.resume && (
                      <div className="px-2 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-1.5">
                        <div className="size-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Resume Uploaded</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {recentPosts.length === 0 && (
              <div className="text-center p-8 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  No talent updates yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
