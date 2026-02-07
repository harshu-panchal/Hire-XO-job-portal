import { Search, Users, CheckCircle2, TrendingUp, Loader2 } from "lucide-react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useMemo } from "react";
import JobCard from "@/modules/employee/components/JobCard";
import { isAfter, subDays } from "date-fns";

const JobList = () => {
  const {
    jobs,
    filters,
    setSearch,
    setType,
    fetchJobs,
    fetchMyApplications,
    isLoading,
  } = useEmployeeStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchJobs();
    if (isAuthenticated) {
      fetchMyApplications();
    }
  }, [fetchJobs, fetchMyApplications, isAuthenticated]);

  const categories = [
    { id: "all", label: "All Jobs" },
    { id: "Development", label: "Development" },
    { id: "Design", label: "Design" },
    { id: "Marketing", label: "Marketing" },
    { id: "Management", label: "Management" },
    { id: "Testing", label: "Testing" },
    { id: "Logistics", label: "Logistics" },
  ];

  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = filters.type === "all" || job.category === filters.type;
      return matchesSearch && matchesType;
    });
  }, [jobs, filters]);

  // Derived stats
  const totalJobs = jobs?.length || 0;
  const newJobsCount = jobs?.filter((j) =>
    j.postedAt ? isAfter(new Date(j.postedAt), subDays(new Date(), 7)) : false
  ).length || 0;
  const successRate = totalJobs > 0 ? "High" : "N/A";

  return (
    <div className="py-6 space-y-8 select-none antialiased">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-1 px-1">
          <h1 className="text-4xl font-black tracking-tighter leading-tight text-slate-900">
            Find Your <br />
            <span className="text-primary italic">Perfect Career</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
            {filteredJobs.length} opportunities currently active
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 py-2">
          <div
            className="w-full bg-primary/5 border border-primary/10 rounded-[2.5rem] p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="size-7 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-0.5">
                  Platform Success
                </p>
                <p className="text-2xl font-black tracking-tight">{successRate}</p>
              </div>
            </div>
            <div className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">
              Live Data
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              className="bg-white border border-slate-200 rounded-[2.5rem] p-5 text-left"
            >
              <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                <Users className="size-6 text-orange-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Total Roles
              </p>
              <p className="text-xl font-black tracking-tight">{totalJobs}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-orange-500/60 mt-2">
                Across Categories
              </p>
            </div>

            <div
              className="bg-white border border-slate-200 rounded-[2.5rem] p-5 text-left"
            >
              <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="size-6 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                New Jobs
              </p>
              <p className="text-xl font-black tracking-tight">{newJobsCount}</p>
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
            placeholder="Search roles, skills or companies..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-white border-2 border-slate-100 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black placeholder:text-slate-400 placeholder:font-black"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5 pt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setType(cat.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${filters.type === cat.id
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                : "bg-white border border-slate-200 text-slate-400 hover:border-slate-300"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="grid gap-5 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="size-16 rounded-3xl bg-primary/5 flex items-center justify-center mb-4">
              <Loader2 className="size-8 text-primary animate-spin" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Fetching Opportunities...
            </p>
          </div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
              <Search className="size-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black mb-2">No jobs matched</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest max-w-[200px] mx-auto">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
