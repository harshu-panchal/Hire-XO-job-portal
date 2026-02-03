import { useState } from "react";
import {
    MapPin,
    Clock,
    Briefcase,
    Building2,
    Bookmark,
    X,
    Upload,
    FileText,
    CheckCircle,
    User,
    Mail,
    Phone,
} from "lucide-react";
import { useJobSeekerStore } from "@/store/useJobSeekerStore";
import type { Job } from "@/types";

interface JobCardProps {
    job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
    const { savedJobs, saveJob, unsaveJob, applyToJob } = useJobSeekerStore();
    const isSaved = Array.isArray(savedJobs) && savedJobs.includes(job.id);

    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        resume: null as File | null,
        coverLetter: ""
    });

    const handleCardClick = () => {
        setShowApplicationModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
        }
    };

    const toggleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (isSaved) {
                await unsaveJob(job.id);
            } else {
                await saveJob(job.id);
            }
        } catch (error: any) {
            alert(error.message || "Failed to update bookmark");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.fullName || !formData.email || !formData.phone) {
            alert("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const applicationData = new FormData();
            applicationData.append("fullName", formData.fullName);
            applicationData.append("email", formData.email);
            applicationData.append("phone", formData.phone);
            applicationData.append("coverLetter", formData.coverLetter);
            if (formData.resume) {
                applicationData.append("resume", formData.resume);
            }

            await applyToJob(job.id, applicationData);

            // Close application modal and show success modal
            setShowApplicationModal(false);
            setShowSuccessModal(true);

            // Reset form
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                resume: null,
                coverLetter: ""
            });
        } catch (error: any) {
            alert(error.message || "Failed to submit application");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div
                onClick={handleCardClick}
                className="block group relative bg-white dark:bg-slate-900/50 rounded-[2rem] p-4 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:scale-[0.98] hover:border-primary/20 transition-all cursor-pointer"
            >
                {/* Top row: Company & Bookmark */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden">
                            {job.companyLogo ? (
                                <img
                                    src={job.companyLogo}
                                    alt={job.company}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`;
                                    }}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Building2 className="size-5 text-primary/60" />
                            )}
                        </div>
                        <div>
                            <p className="text-primary font-black uppercase tracking-widest text-[9px]">
                                {job.company}
                            </p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                {job.category}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleSave}
                        className={`size-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform border border-slate-100 dark:border-white/10 ${isSaved ? "bg-primary/10 border-primary" : "bg-slate-50 dark:bg-white/5"}`}
                    >
                        <Bookmark className={`size-4 ${isSaved ? "fill-primary text-primary" : "text-slate-300"}`} />
                    </button>
                </div>

                {/* Middle row: Job Title & Salary */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="space-y-2">
                        <h3 className="font-black text-xl tracking-tight group-hover:text-primary transition-colors leading-tight">
                            {job.title}
                        </h3>
                        {job.requirements && job.requirements.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {job.requirements.slice(0, 2).map((req, i) => (
                                    <span
                                        key={i}
                                        className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500"
                                    >
                                        {req.split(" ").slice(0, 2).join(" ")}
                                    </span>
                                ))}
                                {job.requirements.length > 2 && (
                                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-400">
                                        +{job.requirements.length - 2} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="shrink-0 px-3 py-1.5 rounded-xl bg-green-500/10 text-green-600 border border-green-500/10">
                        <span className="text-xs font-black uppercase tracking-wider whitespace-nowrap">
                            {job.salary}
                        </span>
                    </div>
                </div>

                {/* Bottom row: Info Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                        <MapPin className="size-3 mr-1.5 text-primary/60" />
                        {job.location}
                    </div>
                    <div className="size-1 rounded-full bg-slate-200 dark:bg-white/10" />
                    <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                        <Briefcase className="size-3 mr-1.5 text-primary/60" />
                        {job.type}
                    </div>
                    <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-400 ml-auto">
                        <Clock className="size-3 mr-1.5 text-primary/60" />
                        {job.postedAt}
                    </div>
                </div>
            </div>

            {/* Application Form Modal */}
            {showApplicationModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-black">Apply for Position</h3>
                                <p className="text-sm text-slate-500 mt-1">{job.title} at {job.company}</p>
                            </div>
                            <button
                                onClick={() => setShowApplicationModal(false)}
                                className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                    <User className="size-4" />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                    <Mail className="size-4" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                    <Phone className="size-4" />
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="+91 98765 43210"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            {/* Resume Upload */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                    <Upload className="size-4" />
                                    Resume/CV
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                        id="resume-upload"
                                    />
                                    <label
                                        htmlFor="resume-upload"
                                        className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-primary/50 transition-all cursor-pointer"
                                    >
                                        <FileText className="size-5 text-slate-400" />
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                            {formData.resume ? formData.resume.name : "Click to upload resume (PDF, DOC, DOCX)"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Cover Letter */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                    <FileText className="size-4" />
                                    Cover Letter (Optional)
                                </label>
                                <textarea
                                    name="coverLetter"
                                    value={formData.coverLetter}
                                    onChange={handleInputChange}
                                    rows={5}
                                    placeholder="Tell us why you're a great fit for this role..."
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                />
                            </div>

                            {/* Job Details Summary */}
                            <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20">
                                <p className="text-xs font-black uppercase tracking-widest text-primary/60 mb-2">Application Summary</p>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold">{job.title}</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">{job.company} • {job.location}</p>
                                    <p className="text-xs font-black text-green-600">{job.salary}</p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowApplicationModal(false)}
                                    className="flex-1 px-6 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-4 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Application"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl text-center">
                        <div className="size-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="size-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-black mb-3">Application Submitted!</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                            Your application for <span className="font-bold text-primary">{job.title}</span> at <span className="font-bold">{job.company}</span> has been successfully submitted.
                        </p>
                        <p className="text-sm text-slate-500 mb-6">
                            We'll review your application and get back to you soon.
                        </p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full px-6 py-4 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20"
                        >
                            Continue Browsing
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default JobCard;
