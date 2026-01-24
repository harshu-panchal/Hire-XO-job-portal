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
    AlertCircle,
} from "lucide-react";
import { useResourceStore } from "@/store/useResourceStore";
import { useState, useEffect } from "react";
import type { Resource } from "@/types";

const ResourceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { resources, fetchResources, bookmarkedResources, toggleBookmark, applications, applyToResource } = useResourceStore();
    const [resource, setResource] = useState<Resource | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const isBookmarked = resource ? bookmarkedResources.includes(resource.id) : false;
    const isApplied = resource ? applications.includes(resource.id) : false;

    useEffect(() => {
        if (resources.length === 0) {
            fetchResources();
        }
    }, [resources.length, fetchResources]);

    useEffect(() => {
        const foundResource = resources.find((r) => r.id === id);
        if (foundResource) {
            setResource(foundResource);
        }
    }, [id, resources]);

    if (!resource) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
                    Loading Resource Details...
                </p>
            </div>
        );
    }

    const handleApply = () => {
        applyToResource(resource.id);
        setShowSuccess(true);
    };

    // Category-specific colors
    const categoryColors: Record<string, { bg: string; text: string }> = {
        Tenders: { bg: "bg-purple-500/10", text: "text-purple-600" },
        Logistics: { bg: "bg-orange-500/10", text: "text-orange-600" },
        Equipments: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
        Vehicles: { bg: "bg-blue-500/10", text: "text-blue-600" },
        PMC: { bg: "bg-indigo-500/10", text: "text-indigo-600" },
        CSM: { bg: "bg-rose-500/10", text: "text-rose-600" },
    };

    const colors = categoryColors[resource.category] || categoryColors.Tenders;

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-5 text-center select-none">
                <div className="relative mb-8">
                    <div className="size-32 rounded-[3rem] bg-green-500/10 flex items-center justify-center animate-bounce-subtle">
                        <CheckCircle2 className="size-16 text-green-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 size-8 bg-green-500 rounded-full border-4 border-slate-50 dark:border-background flex items-center justify-center shadow-lg">
                        <span className="text-white text-[10px] font-black">✓</span>
                    </div>
                </div>

                <div className="space-y-3 mb-10">
                    <h1 className="text-3xl font-black tracking-tight">Application Submitted!</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-black leading-relaxed max-w-[280px] mx-auto">
                        Your application for <span className="text-primary">{resource.title}</span> has been sent to{" "}
                        <span className="text-primary">{resource.company}</span>. They will contact you if selected.
                    </p>
                </div>

                <div className="grid w-full gap-4">
                    <button
                        onClick={() => navigate("/resources")}
                        className="h-16 w-full rounded-3xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Browse More Resources
                        <ArrowRight className="size-4" />
                    </button>
                    <button
                        onClick={() => navigate("/my-applications")}
                        className="h-16 w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-400 font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
                    >
                        View My Applications
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
                    <button className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all">
                        <Share2 className="size-5 text-slate-400" />
                    </button>
                    <button
                        onClick={() => toggleBookmark(resource.id)}
                        className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all"
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
                        {resource.companyLogo ? (
                            <img src={resource.companyLogo} alt={resource.company} className="w-full h-full object-cover" />
                        ) : (
                            <Building2 className="size-10 text-primary" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight leading-tight">{resource.title}</h1>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-primary font-black uppercase tracking-widest text-xs">
                                {resource.company}
                            </p>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full ${colors.bg} border border-${resource.category.toLowerCase()}-500/10`}>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text}`}>
                                    {resource.category}
                                </span>
                            </div>
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
                            <p className="text-xs font-black truncate">{resource.location}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-white/10 flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                            <DollarSign className="size-5 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Value
                            </p>
                            <p className="text-xs font-black truncate">{resource.compensation}</p>
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
                            <p className="text-xs font-black truncate">{resource.postedAt}</p>
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
                            <p className="text-xs font-black truncate">{resource.type}</p>
                        </div>
                    </div>
                    {resource.duration && (
                        <div className="bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-white/10 flex items-center gap-3 col-span-2">
                            <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                <Clock className="size-5 text-slate-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Duration
                                </p>
                                <p className="text-xs font-black">{resource.duration}</p>
                            </div>
                            {resource.urgency && (
                                <>
                                    <div className="ml-auto size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                        <AlertCircle className={`size-5 ${resource.urgency === "Immediate" ? "text-red-500" : "text-slate-400"}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Urgency
                                        </p>
                                        <p className={`text-xs font-black ${resource.urgency === "Immediate" ? "text-red-500" : ""}`}>
                                            {resource.urgency}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="mt-10 space-y-10">
                <section className="space-y-4">
                    <h2 className="text-xl font-black tracking-tight flex items-center gap-2">Description</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-black leading-relaxed">
                        {resource.description}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-black tracking-tight">Requirements</h2>
                    <div className="space-y-3">
                        {resource.requirements.map((req, i) => (
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
                        {resource.responsibilities.map((resp, i) => (
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
                        {resource.benefits.map((benefit, i) => (
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
                            Open to All
                        </p>
                    </div>
                    <button
                        onClick={handleApply}
                        disabled={isApplied}
                        className={`h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-90 flex items-center gap-2 ${isApplied
                                ? "bg-green-500 text-white shadow-green-500/20 cursor-not-allowed"
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

export default ResourceDetails;
