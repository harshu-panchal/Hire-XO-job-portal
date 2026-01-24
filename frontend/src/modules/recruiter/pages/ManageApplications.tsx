import { useState } from "react";
import {
  Search,
  MoreVertical,
  Mail,
  Download,
  Clock,
  ChevronRight,
  Briefcase,
} from "lucide-react";

const ManageApplications = () => {
  const [filter, setFilter] = useState("All");

  const applications = [
    {
      id: "1",
      name: "Alex Rivera",
      role: "Senior React Developer",
      status: "Shortlisted",
      appliedAt: "2h ago",
      experience: "5 years",
      email: "alex@example.com",
      avatar: "AR",
    },
    {
      id: "2",
      name: "Sarah Chen",
      role: "UI/UX Designer",
      status: "Interviewed",
      appliedAt: "5h ago",
      experience: "3 years",
      email: "sarah@example.com",
      avatar: "SC",
    },
    {
      id: "3",
      name: "Marcus Thorne",
      role: "Frontend Engineer",
      status: "Pending",
      appliedAt: "1d ago",
      experience: "2 years",
      email: "marcus@example.com",
      avatar: "MT",
    },
    {
      id: "4",
      name: "Priya Sharma",
      role: "Senior React Developer",
      status: "Rejected",
      appliedAt: "2d ago",
      experience: "6 years",
      email: "priya@example.com",
      avatar: "PS",
    },
  ];

  const statusColors = {
    Shortlisted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Interviewed: "bg-green-500/10 text-green-600 border-green-500/20",
    Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <div className="py-6 space-y-8 select-none pb-24">
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-black tracking-tighter">
          Manage <br />
          <span className="text-primary">Applications</span>
        </h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
          Review and process candidates
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-5 px-5">
        {["All", "Pending", "Shortlisted", "Interviewed", "Rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-90 ${filter === f
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-400"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search by name or role..."
          className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black placeholder:text-slate-400"
        />
      </div>

      {/* Applications List */}
      <div className="grid gap-4">
        {applications
          .filter((app) => filter === "All" || app.status === filter)
          .map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden active:scale-[0.98] transition-all"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-black text-lg">{app.avatar}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-base truncate tracking-tight">{app.name}</h3>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                        {app.role}
                      </p>
                    </div>
                  </div>
                  <button className="size-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400">
                    <MoreVertical className="size-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Clock className="size-3.5 mr-1.5 text-primary/60" />
                    {app.appliedAt}
                  </div>
                  <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Briefcase className="size-3.5 mr-1.5 text-primary/60" />
                    {app.experience} Exp.
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColors[app.status as keyof typeof statusColors]
                      }`}
                  >
                    {app.status}
                  </div>
                  <div className="flex gap-2">
                    <button className="size-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center active:scale-90 transition-all">
                      <Mail className="size-4 text-slate-500" />
                    </button>
                    <button className="size-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center active:scale-90 transition-all">
                      <Download className="size-4 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>

              <button className="w-full h-12 bg-slate-50 dark:bg-white/5 flex items-center justify-center gap-2 border-t border-slate-100 dark:border-white/5 active:bg-slate-100 transition-all">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  View Full Profile
                </span>
                <ChevronRight className="size-3.5 text-slate-400" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ManageApplications;
