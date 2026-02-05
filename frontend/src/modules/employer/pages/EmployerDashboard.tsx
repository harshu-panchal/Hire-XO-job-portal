import { useState, useEffect } from "react";
import { Users, Briefcase, TrendingUp, Clock, Plus, Search, ArrowUpRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "@/services/userService";
import { applicationService } from "@/services/applicationService";
import { jobService } from "@/services/jobService";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    interviews: 0,
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, appsData, myJobs] = await Promise.all([
          userService.getDashboardStats(),
          applicationService.getReceivedApplications(),
          jobService.getMyListings(),
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
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              className="bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/10 flex items-center justify-between active:scale-[0.98] transition-all"
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
              <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                <ArrowUpRight className="size-5 text-slate-300" />
              </div>
            </Link>
          ) : (
            <div
              key={i}
              className="bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/10 flex items-center justify-between"
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
              <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
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
          className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black placeholder:text-slate-400"
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
              className="bg-white dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-200 dark:border-white/10 flex items-center gap-4 active:scale-[0.98] transition-all"
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
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    app.status === "Pending"
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
      </div>
    </div>
  );
};

export default EmployerDashboard;
