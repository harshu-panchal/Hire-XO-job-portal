import {
  Search,
  Users,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { useJobSeekerStore } from "@/store/useJobSeekerStore";
import { useEffect } from "react";
import JobCard from "@/modules/job-seeker/components/JobCard";

const JobList = () => {
  const { jobs, filters, setSearch, setType, fetchJobs } = useJobSeekerStore();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const categories = [
    { id: "all", label: "All Jobs" },
    { id: "Development", label: "Development" },
    { id: "Design", label: "Design" },
    { id: "Marketing", label: "Marketing" },
    { id: "Management", label: "Management" },
    { id: "Testing", label: "Testing" },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.type === "all" || job.category === filters.type;
    return matchesSearch && matchesType;
  });

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-1 px-1">
          <h1 className="text-4xl font-black tracking-tighter leading-tight">
            Find Your <br />
            <span className="text-primary">Perfect Career</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">
            {filteredJobs.length} opportunities waiting for you
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 py-2">
          <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="size-7 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-0.5">
                  Clearing Interviews
                </p>
                <p className="text-2xl font-black tracking-tight">1,284+</p>
              </div>
            </div>
            <div className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">
              50% Success
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
              <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                <Users className="size-6 text-orange-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Registered
              </p>
              <p className="text-xl font-black tracking-tight">850+</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-orange-500/60 mt-2">
                50% Cracking Plan
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
              <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="size-6 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                New Jobs
              </p>
              <p className="text-xl font-black tracking-tight">142</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">
                Posted This Week
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search roles or companies..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black placeholder:text-slate-400 placeholder:font-black"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-5 px-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setType(cat.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-90 ${filters.type === cat.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-400"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="grid gap-5">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobList;
