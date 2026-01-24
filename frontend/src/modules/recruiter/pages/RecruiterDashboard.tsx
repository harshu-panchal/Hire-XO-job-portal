import { Users, Briefcase, TrendingUp, Clock, Plus, Search, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
  const stats = [
    { label: "Active Jobs", value: "12", icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Applications", value: "154", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Interviews", value: "28", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  const recentApplications = [
    { id: "1", name: "Alex Rivera", role: "Senior React Developer", status: "Pending", time: "2h ago", avatar: "AR" },
    { id: "2", name: "Sarah Chen", role: "UI/UX Designer", status: "Interviewed", time: "5h ago", avatar: "SC" },
    { id: "3", name: "Marcus Thorne", role: "Frontend Engineer", status: "Rejected", time: "1d ago", avatar: "MT" },
  ];

  return (
    <div className="py-6 space-y-8 select-none pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter">Recruiter <br /><span className="text-primary">Dashboard</span></h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Manage your hiring pipeline</p>
        </div>
        <Link
          to="/recruiter/post-job"
          className="size-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 active:scale-90 transition-all"
        >
          <Plus className="size-6" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`size - 14 rounded - 2xl ${stat.bg} flex items - center justify - center`}>
                <stat.icon className={`size - 7 ${stat.color} `} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</p>
                <p className="text-2xl font-black tracking-tight">{stat.value}</p>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
              <ArrowUpRight className="size-5 text-slate-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Search Applications */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search candidates..."
          className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black placeholder:text-slate-400"
        />
      </div>

      {/* Recent Applications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Recent Applications</h2>
          <button className="text-[10px] font-black text-primary uppercase tracking-widest">View All</button>
        </div>

        <div className="grid gap-4">
          {recentApplications.map((app) => (
            <div key={app.id} className="bg-white dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-200 dark:border-white/10 flex items-center gap-4 active:scale-[0.98] transition-all">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-black text-xs">{app.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm truncate tracking-tight">{app.name}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{app.role}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className={`px - 2.5 py - 1 rounded - lg text - [9px] font - black uppercase tracking - widest border ${app.status === "Pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                    app.status === "Interviewed" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                      "bg-red-500/10 text-red-600 border-red-500/20"
                  } `}>
                  {app.status}
                </div>
                <div className="flex items-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  <Clock className="size-3 mr-1" />
                  {app.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;