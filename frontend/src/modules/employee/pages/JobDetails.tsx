import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Share2,
  Bookmark,
  CheckCircle2,
  Building2,
  ArrowRight,
} from "lucide-react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import type { Job } from "@/types";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, fetchJobs, applications, savedJobs, saveJob, unsaveJob, applyToJob } =
    useEmployeeStore();
  const { isAuthenticated } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);

  const isApplied =
    Array.isArray(applications) && applications.some((app: any) => app.jobId === id);
  const isBookmarked = Array.isArray(savedJobs) && savedJobs.includes(id || "");

  useEffect(() => {
    if (jobs.length === 0) {
      fetchJobs();
    }
  }, [jobs.length, fetchJobs]);

  useEffect(() => {
    const foundJob = jobs.find((j) => j.id === id);
    if (foundJob) {
      setJob(foundJob);
    }
  }, [id, jobs]);

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
          Loading Job Details...
        </p>
      </div>
    );
  }

  const toggleSave = async () => {
    if (!id) return;
    if (!isAuthenticated) {
      navigate("/login/employee");
      return;
    }
    try {
      if (isBookmarked) {
        await unsaveJob(id);
      } else {
        await saveJob(id);
      }
    } catch (error: any) {
      alert(error.message || "Failed to update bookmark");
    }
  };

  const handleApply = async () => {
    if (!id) return;
    if (!isAuthenticated) {
      navigate("/login/employee");
      return;
    }
    try {
      await applyToJob(id, {}); // Pass empty object if no form is used
    } catch (error: any) {
      alert(error.message || "Failed to submit application");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  if (isApplied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-5 text-center select-none">
        <div className="relative mb-8">
          <div className="size-32 rounded-[3rem] bg-green-500/10 flex items-center justify-center animate-bounce-subtle">
            <CheckCircle2 className="size-16 text-green-500" />
          </div>
          <div className="absolute -top-2 -right-2 size-8 bg-green-500 rounded-full border-4 border-slate-50 dark:border-background flex items-center justify-center shadow-lg">
            <span className="text-white text-[10px] font-black">1</span>
          </div>
        </div>

        <div className="space-y-3 mb-10">
          <h1 className="text-3xl font-black tracking-tight">Application Sent!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-black leading-relaxed max-w-[280px] mx-auto">
            Your profile has been shared with <span className="text-primary">{job.company}</span>.
            They will contact you via email if your profile matches.
          </p>
        </div>

        <div className="grid w-full gap-4">
          <button
            onClick={() => navigate("/jobs")}
            className="h-16 w-full rounded-3xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Find More Jobs
            <ArrowRight className="size-4" />
          </button>
          <button
            onClick={() => navigate("/my-applications")}
            className="h-16 w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-400 font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
          >
            View Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 -mx-5 px-5">
        <button
          onClick={() => navigate(-1)}
          className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all"
        >
          <ChevronLeft className="size-6" />
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all"
          >
            <Share2 className="size-5 text-slate-400" />
          </button>
          <button
            onClick={toggleSave}
            className={`size-11 flex items-center justify-center rounded-2xl border transition-all active:scale-90 ${isBookmarked ? "bg-primary/10 border-primary" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10"}`}
          >
            <Bookmark
              className={`size-5 ${isBookmarked ? "fill-primary text-primary" : "text-slate-400"}`}
            />
          </button>
        </div>
      </div>

      {/* Company & Title Section */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="size-24 rounded-[2rem] bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden">
            {job.companyLogo ? (
              <img
                src={
                  job.companyLogo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`
                }
                alt={job.company}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`;
                }}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="size-10 text-primary" />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight leading-tight">{job.title}</h1>
            <div className="flex flex-col items-center gap-1">
              <p className="text-primary font-black uppercase tracking-widest text-xs">
                {job.company}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {job.category}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-white/10 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
              <MapPin className="size-5 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Location
              </p>
              <p className="text-xs font-black truncate">{job.location}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-white/10 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
              <DollarSign className="size-5 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Salary
              </p>
              <p className="text-xs font-black truncate">{job.salary}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-white/10 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
              <Clock className="size-5 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Posted
              </p>
              <p className="text-xs font-black truncate">{job.postedAt}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-white/10 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
              <Briefcase className="size-5 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Type
              </p>
              <p className="text-xs font-black truncate">{job.type}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Content Section */}
      <div className="mt-10 space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">Description</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-black leading-relaxed">
            {job.description}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black tracking-tight">Requirements</h2>
          <div className="space-y-3">
            {job.requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                  <CheckCircle2 className="size-3.5 text-primary" />
                </div>
                <p className="text-sm font-black text-slate-600 dark:text-slate-400">{req}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black tracking-tight">Responsibilities</h2>
          <div className="space-y-3">
            {job.responsibilities.map((resp, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="size-6 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-black text-slate-400">{i + 1}</span>
                </div>
                <p className="text-sm font-black text-slate-600 dark:text-slate-400">{resp}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black tracking-tight">Benefits</h2>
          <div className="flex flex-wrap gap-2">
            {job.benefits.map((benefit, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-black uppercase tracking-widest"
              >
                {benefit}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 z-40">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-4 shadow-2xl shadow-primary/20 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">
              Application
            </p>
            <p className="text-xs font-black text-primary uppercase tracking-widest">
              Immediate Start
            </p>
          </div>
          <button
            onClick={handleApply}
            disabled={isApplied}
            className={`h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-90 flex items-center gap-2 ${
              isApplied
                ? "bg-green-500 text-white shadow-green-500/20"
                : "bg-primary text-white shadow-xl shadow-primary/20"
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="size-5" />
                Applied
              </>
            ) : (
              <>
                Apply Now
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
