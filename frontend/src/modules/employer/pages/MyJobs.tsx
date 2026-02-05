import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobService } from "@/services/jobService";
import {
  ChevronRight,
  Clock,
  MapPin,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  MoreVertical,
} from "lucide-react";

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getMyListings();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this job listing?")) {
      try {
        await jobService.deleteJob(id);
        setJobs(jobs.filter((job) => job.id !== id));
      } catch (error) {
        console.error("Failed to delete job", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-sm font-black uppercase tracking-widest text-slate-400">
          Loading Jobs...
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 select-none">
      {/* Header */}
      <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 -mx-5 px-5">
        <button
          onClick={() => navigate(-1)}
          className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all"
        >
          <ChevronLeft className="size-6" />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest">Active Jobs</h1>
        <Link
          to="/employer/post-job"
          className="size-11 flex items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 active:scale-90 transition-all"
        >
          <Plus className="size-5" />
        </Link>
      </div>

      {/* Jobs List */}
      <div className="space-y-4 mt-2">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4">
              <Clock className="size-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-1">
              No Active Jobs
            </h3>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 max-w-[200px] mb-6">
              You haven't posted any jobs yet. Start hiring today!
            </p>
            <Link
              to="/employer/post-job"
              className="px-8 py-4 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Post a Job
            </Link>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              // onClick={() => navigate(`/employer/jobs/${job.id}`)} // Placeholder detail page
              className="group bg-white dark:bg-slate-900/50 p-5 rounded-[2rem] border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[10px] font-black tracking-widest text-primary uppercase mb-1">
                    {job.category}
                  </div>
                  <h3 className="text-lg font-black tracking-tight leading-tight mb-1">
                    {job.title}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {job.company}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleDelete(e, job.id)}
                    className="size-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center active:scale-90 transition-all"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center gap-1.5">
                  <MapPin className="size-3 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {job.location}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center gap-1.5">
                  <DollarSign className="size-3 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {job.salary}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center gap-1.5">
                  <Clock className="size-3 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {new Date(job.postedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {job.type}
                </span>
                <div className="flex items-center gap-1 text-primary">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    View Details
                  </span>
                  <ChevronRight className="size-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyJobs;
