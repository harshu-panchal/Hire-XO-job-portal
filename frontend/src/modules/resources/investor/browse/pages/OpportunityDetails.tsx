import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Bookmark,
    Share2,
    MapPin,
    Calendar,
    TrendingUp,
    Users,
    CheckCircle2,
    Mail,
    Phone,
    Building2,
    DollarSign,
    Percent
} from "lucide-react";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const OpportunityDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [opportunity, setOpportunity] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isExpressing, setIsExpressing] = useState(false);
    const [hasExpressed, setHasExpressed] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                const data = await resourceService.getById('investors', id);
                setOpportunity(data);

                // Check if already applied
                const myApps: any = await applicationService.getMyApplications();
                const alreadyApplied = (myApps.resources || []).some(
                    (app: any) => app.resourceId === id && app.resourceType === 'Investor'
                );
                setHasExpressed(alreadyApplied);

            } catch (error) {
                console.error("Failed to fetch opportunity details:", error);
                toast.error("Could not load opportunity details");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleExpressInterest = async () => {
        if (!user) {
            toast.error("Please login to express interest");
            return;
        }

        setIsExpressing(true);
        try {
            await applicationService.applyToResource(
                'Investor',
                id!,
                { message: "Interested in this investment opportunity. Let's discuss further." }
            );
            setHasExpressed(true);
            toast.success("Interest expressed successfully! The company will be notified.");
        } catch (error: any) {
            toast.error(error.message || "Failed to express interest");
        } finally {
            setIsExpressing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-sm font-black uppercase tracking-widest text-slate-400">Loading Details...</div>
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="py-20 text-center space-y-4">
                <p className="text-xl font-black text-slate-500">Opportunity not found</p>
                <Link to="/investor/browse/opportunities" className="text-violet-600 font-black uppercase tracking-widest text-xs">Return to list</Link>
            </div>
        );
    }

    return (
        <div className="py-6 space-y-6 select-none animate-in fade-in duration-500">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-violet-600 transition-colors active:scale-95"
            >
                <ArrowLeft className="size-4" />
                <span>Back to Opportunities</span>
            </button>

            {/* Main Header Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div className="flex items-start gap-5">
                        <div className="size-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white font-black text-4xl shadow-lg shadow-violet-500/20">
                            {opportunity.company?.charAt(0) || "I"}
                        </div>
                        <div className="space-y-1">
                            <p className="text-violet-600 font-black uppercase tracking-widest text-[10px]">
                                {opportunity.company || "Direct Listing"}
                            </p>
                            <h1 className="text-3xl font-black tracking-tight leading-tight">{opportunity.title}</h1>
                            <div className="flex flex-wrap gap-2 pt-1">
                                <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/30 text-violet-600 text-[9px] font-black uppercase tracking-widest border border-violet-200/50">
                                    {opportunity.industry || opportunity.category || "Investment"}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <MapPin className="size-3" /> {opportunity.location || "Remote"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-all border border-slate-100 dark:border-white/5"
                        >
                            <Bookmark className={`size-5 ${isBookmarked ? "fill-violet-600 text-violet-600" : "text-slate-400"}`} />
                        </button>
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title: opportunity.title, url: window.location.href });
                                } else {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("Link copied to clipboard");
                                }
                            }}
                            className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-all border border-slate-100 dark:border-white/5"
                        >
                            <Share2 className="size-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Investment Board */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-[2rem] p-5 border border-emerald-100 dark:border-emerald-900/30">
                        <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                            <DollarSign className="size-5 text-emerald-600" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">Total Seeking</p>
                        <p className="text-xl font-black text-emerald-700 dark:text-emerald-500">₹{opportunity.amount || opportunity.seekingAmount || "Negotiable"}</p>
                    </div>
                    <div className="bg-violet-50 dark:bg-violet-950/20 rounded-[2rem] p-5 border border-violet-100 dark:border-violet-900/30">
                        <div className="size-10 rounded-xl bg-violet-600/10 flex items-center justify-center mb-3">
                            <Percent className="size-5 text-violet-600" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-violet-600 mb-1">Equity Offered</p>
                        <p className="text-xl font-black text-violet-700 dark:text-violet-500">{opportunity.equity || "Discussion"}</p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-[2rem] p-5 border border-indigo-100 dark:border-indigo-900/30">
                        <div className="size-10 rounded-xl bg-indigo-600/10 flex items-center justify-center mb-3">
                            <TrendingUp className="size-5 text-indigo-600" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600 mb-1">Expected ROI</p>
                        <p className="text-xl font-black text-indigo-700 dark:text-indigo-500">{opportunity.roi || "18-25%"}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-5 border border-slate-100 dark:border-white/5">
                        <div className="size-10 rounded-xl bg-slate-500/10 flex items-center justify-center mb-3">
                            <Calendar className="size-5 text-slate-500" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Timeline</p>
                        <p className="text-xl font-black">{opportunity.duration || "24-36M"}</p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Side: Stats & Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-4">
                        <h2 className="text-xl font-black tracking-tight">Executive Summary</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{opportunity.description}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8">
                        <h2 className="text-xl font-black tracking-tight mb-6">Company Profile</h2>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { icon: MapPin, label: "Registered In", value: opportunity.location || "N/A" },
                                { icon: Calendar, label: "Founded Year", value: opportunity.founded || "N/A" },
                                { icon: Users, label: "Team Strength", value: opportunity.employees || "10-25" },
                                { icon: Building2, label: "Sector", value: opportunity.category || "Technology" },
                            ].map((stat, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                        <stat.icon className="size-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                        <p className="text-sm font-black">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: CTA & Contact */}
                <div className="space-y-6">
                    <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-900/10">
                        <h3 className="text-lg font-black tracking-tight mb-4">Invest in {opportunity.company || "Tomorrow"}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Interested? Start the conversation.</p>

                        <button
                            onClick={handleExpressInterest}
                            disabled={isExpressing || hasExpressed}
                            className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg ${hasExpressed
                                    ? "bg-emerald-600 text-white shadow-emerald-500/20"
                                    : "bg-violet-600 text-white shadow-violet-500/20"
                                } disabled:opacity-80`}
                        >
                            {isExpressing ? "Sending Message..." : hasExpressed ? "Interest Expressed" : "Express Interest Now"}
                        </button>

                        <p className="text-[8px] font-black uppercase text-center mt-4 opacity-40">Verified enterprise listing</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 text-center">Contact Info</h3>
                        <div className="space-y-3">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center gap-3">
                                <Mail className="size-5 text-violet-600" />
                                <span className="text-[11px] font-black truncate">{user ? opportunity.email || "info@" + (opportunity.company?.replace(/\s/g, "").toLowerCase() || "company") + ".com" : "••••••••••••••"}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center gap-3">
                                <Phone className="size-5 text-violet-600" />
                                <span className="text-[11px] font-black">{user ? opportunity.phone || "+91 ••••• •••••" : "••••••••••••••"}</span>
                            </div>
                            {!user && (
                                <p className="text-[8px] font-black uppercase text-center text-slate-400">Sign in to view full contact details</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Footer */}
            <div className="py-8 flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                    <CheckCircle2 className="size-5 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Enterprise Verified Opportunity</span>
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest max-w-sm text-center leading-relaxed">
                    This opportunity has been manually reviewed by our compliance team. Investors are advised to conduct their own due diligence.
                </p>
            </div>
        </div>
    );
};

export default OpportunityDetails;
