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
  Upload,
  FileText,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import type { Job } from "@/types";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, fetchJobs, applications, savedJobs, saveJob, unsaveJob, applyToJob, fetchMyApplications } =
    useEmployeeStore();
  const { isAuthenticated } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);

  // Application Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [additionalDocs, setAdditionalDocs] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isApplied =
    Array.isArray(applications?.jobs) &&
    applications.jobs.some((app: any) => (app.jobId?._id || app.jobId) === id);
  const isBookmarked = Array.isArray(savedJobs) && savedJobs.includes(id || "");

  useEffect(() => {
    if (jobs.length === 0) {
      fetchJobs();
    }
    if (isAuthenticated) {
      fetchMyApplications();
    }
  }, [jobs.length, fetchJobs, fetchMyApplications, isAuthenticated]);

  useEffect(() => {
    const foundJob = jobs.find((j) => (j._id || j.id) === id);
    if (foundJob) {
      setJob(foundJob);
    }
  }, [id, jobs]);

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Spinner size="xl" />
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
      toast.error(error.message || "Failed to update bookmark");
    }
  };

  const handleApply = async () => {
    if (!id) return;
    if (!isAuthenticated) {
      navigate("/login/employee");
      return;
    }
    setIsModalOpen(true);
  };

  const submitApplication = async () => {
    if (!id) return;
    if (!resume) {
      toast.error("Please upload your resume");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("resume", resume);
      additionalDocs.forEach((doc) => {
        formData.append("additionalDocuments", doc);
      });

      await applyToJob(id, formData);
      toast.success("Application submitted successfully!");
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAdditionalDocs([...additionalDocs, e.target.files[0]]);
    }
  };

  const removeDoc = (index: number) => {
    setAdditionalDocs(additionalDocs.filter((_, i) => i !== index));
  };

  if (isApplied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-5 text-center select-none">
        <div className="relative mb-8">
          <div className="size-32 rounded-[3rem] bg-green-500/10 flex items-center justify-center animate-bounce-subtle">
            <CheckCircle2 className="size-16 text-green-500" />
          </div>
          <div className="absolute -top-2 -right-2 size-8 bg-green-500 rounded-full border-4 border-slate-50 flex items-center justify-center shadow-lg">
            <span className="text-white text-[10px] font-black">1</span>
          </div>
        </div>

        <div className="space-y-3 mb-10">
          <h1 className="text-3xl font-black tracking-tight">Application Sent!</h1>
          <p className="text-slate-500 text-sm font-black leading-relaxed max-w-[280px] mx-auto">
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
            className="h-16 w-full rounded-3xl bg-white border border-slate-200 text-slate-400 font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
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
      <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 -mx-5 px-5">
        <button
          onClick={() => navigate(-1)}
          className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all"
        >
          <ChevronLeft className="size-6" />
        </button>
        <div className="flex gap-3">
          <button
            onClick={toggleSave}
            className={`size-11 flex items-center justify-center rounded-2xl border transition-all active:scale-90 ${isBookmarked ? "bg-primary/10 border-primary" : "bg-white border-slate-200"}`}
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
          <div className="size-24 rounded-[2rem] bg-white shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden">
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
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
              <MapPin className="size-5 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Location
              </p>
              <p className="text-xs font-black truncate">{job.location}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
              <DollarSign className="size-5 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Salary
              </p>
              <p className="text-xs font-black truncate">{job.salary}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
              <Clock className="size-5 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Posted
              </p>
              <p className="text-xs font-black truncate">{job.postedAt}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
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
          <p className="text-slate-600 text-sm font-black leading-relaxed">
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
                <p className="text-sm font-black text-slate-600">{req}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black tracking-tight">Responsibilities</h2>
          <div className="space-y-3">
            {job.responsibilities.map((resp, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="size-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-black text-slate-400">{i + 1}</span>
                </div>
                <p className="text-sm font-black text-slate-600">{resp}</p>
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
                className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-xs font-black uppercase tracking-widest"
              >
                {benefit}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 z-40">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-4 shadow-2xl shadow-primary/20 flex items-center gap-4">
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
            className={`h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-90 flex items-center gap-2 ${isApplied
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

      {/* Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          />
          <div className="bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 duration-500">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight">Apply for Position</h3>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  {job.title}
                </p>
              </div>
              <button
                disabled={isSubmitting}
                onClick={() => setIsModalOpen(false)}
                className="size-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 active:scale-90 transition-all hover:text-slate-900"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 sm:p-8 space-y-8 overflow-y-auto min-h-0 h-full">
              {/* Message to Recruiter */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <FileText className="size-4" /> Message to Employer
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell the employer why you're a great fit for this role..."
                  className="w-full h-32 p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary focus:bg-white transition-all text-sm font-bold resize-none placeholder:text-slate-300"
                />
              </div>

              {/* Resume Upload */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Upload className="size-4" /> Required Resume (PDF/Word)
                </label>
                {!resume ? (
                  <label className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-white hover:border-primary transition-all cursor-pointer group">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => e.target.files && setResume(e.target.files[0])}
                    />
                    <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors mb-3">
                      <Upload className="size-6" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                      Click to Upload Resume
                    </p>
                    <p className="text-[10px] font-bold text-slate-300 mt-1">PDF, DOC or DOCX (Max 10MB)</p>
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                        <FileText className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black truncate max-w-[200px]">{resume.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">
                          {(resume.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setResume(null)}
                      className="size-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-red-500 hover:bg-red-50 active:scale-90 transition-all"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Additional Documents */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Plus className="size-4" /> Additional Documents
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">
                    {additionalDocs.length}/5 files
                  </span>
                </div>

                <div className="space-y-3">
                  {additionalDocs.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400">
                          <FileText className="size-4" />
                        </div>
                        <p className="text-xs font-bold truncate max-w-[180px]">{doc.name}</p>
                      </div>
                      <button
                        onClick={() => removeDoc(index)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}

                  {additionalDocs.length < 5 && (
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-200 hover:border-primary hover:bg-slate-50 transition-all cursor-pointer group">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleAddDoc}
                      />
                      <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        <Plus className="size-4" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                        Add Another Document
                      </p>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 sm:p-8 bg-slate-50/50 border-t border-slate-100 mt-auto">
              <button
                disabled={isSubmitting || !resume}
                onClick={submitApplication}
                className="w-full h-16 rounded-3xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-5" />
                    Confirm Application
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
