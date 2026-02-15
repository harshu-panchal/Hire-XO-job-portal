import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, Trash2 } from "lucide-react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useEffect, useMemo, useState } from "react";
import JobCard from "@/modules/employee/components/JobCard";

const SavedJobs = () => {
  const navigate = useNavigate();
  const { jobs, savedJobs, fetchJobs, unsaveJob } = useEmployeeStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!Array.isArray(jobs) || jobs.length === 0) {
      fetchJobs();
    }
  }, [jobs, fetchJobs]);

  // Filter jobs array by savedJobs IDs (savedJobs is string[])
  const displayJobs = useMemo(() => {
    if (!Array.isArray(jobs) || !Array.isArray(savedJobs)) return [];
    return jobs.filter((job) => {
      const jobId = (job as any).id || (job as any)._id;
      return Boolean(jobId && savedJobs.includes(jobId));
    });
  }, [jobs, savedJobs]);

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return displayJobs;
    return displayJobs.filter((job) =>
      [job.title, job.company, job.location, job.type, job.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [displayJobs, search]);

  return (
    <div className="pb-32 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 px-5 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all shadow-sm"
          >
            <ChevronLeft className="size-6" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight">Saved Jobs</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {displayJobs.length} Saved
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="size-5" />
          </div>
          <input
            type="text"
            placeholder="Search saved..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const jobId = (job as any).id || (job as any)._id;
            return (
            <div key={jobId} className="relative group">
              <JobCard job={job} />
              <button
                className="absolute top-4 right-4 size-10 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-red-500 active:scale-90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (jobId) unsaveJob(jobId);
                }}
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          )})}

          {filteredJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="size-20 rounded-full bg-slate-100 flex items-center justify-center">
                <Trash2 className="size-10 text-slate-300" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {search.trim() ? "No Matching Jobs" : "No Saved Jobs"}
                </h3>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  {search.trim()
                    ? "Try a different keyword."
                    : "Jobs you bookmark will appear here."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;
