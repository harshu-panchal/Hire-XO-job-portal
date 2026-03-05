import { useState, useEffect } from "react";
import { Calendar, Clock, Video, MapPin, CheckCircle, XCircle, AlertCircle, Search, ShieldCheck, Check, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { interviewService } from "@/services/interviewService";
import { applicationService, type SLAExpiredApplication } from "@/services/applicationService";
import { subscriptionService } from "@/services/subscriptionService";
import { interviewTierService } from "@/services/interviewTierService";
import type { SubscriptionPlan } from "@/types";

import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Interviews = () => {
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, checkAuth } = useAuthStore();
    const navigate = useNavigate();
    const isEmployer = ["employer", "recruiter"].includes(user?.role ?? "");
    const isAdmin = user?.role === "admin";
    const isEmployee = user?.role === "employee" || user?.role === "job-seeker";
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        title: "",
        date: "",
        time: "",
        type: "Remote" as "Remote" | "On-site",
        link: "",
        location: "",
        status: "scheduled" as "scheduled" | "pending" | "completed" | "cancelled",
    });

    const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'history' | 'verification' | 'overrides'>('upcoming');
    const [searchQuery, setSearchQuery] = useState("");
    const [verificationPlans, setVerificationPlans] = useState<SubscriptionPlan[]>([]);
    const [loadingVerificationPlans, setLoadingVerificationPlans] = useState(false);
    const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
    const [slaExpiredApplications, setSlaExpiredApplications] = useState<SLAExpiredApplication[]>([]);
    const [loadingSlaExpiredApplications, setLoadingSlaExpiredApplications] = useState(false);
    const [selectedSlaApplication, setSelectedSlaApplication] = useState<SLAExpiredApplication | null>(null);
    const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
    const [isForceScheduling, setIsForceScheduling] = useState(false);
    const [overrideForm, setOverrideForm] = useState({
        date: "",
        time: "",
        type: "Remote" as "Remote" | "On-site",
        link: "",
        location: "",
        reason: "",
    });
    const interviewTabs = (isEmployee
        ? ['upcoming', 'pending', 'history', 'verification']
        : isAdmin
            ? ['upcoming', 'pending', 'history', 'overrides']
            : ['upcoming', 'pending', 'history']) as Array<'upcoming' | 'pending' | 'history' | 'verification' | 'overrides'>;

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const data = await interviewService.getMyInterviews();
                setInterviews(data);
            } catch (error) {
                console.error("Failed to fetch interviews:", error);
                toast.error("Failed to load interviews");
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    useEffect(() => {
        if (!isEmployee) return;
        const fetchVerificationPlans = async () => {
            setLoadingVerificationPlans(true);
            try {
                const plans = await interviewTierService.getPublicTiers();
                const tierPlans = (plans || [])
                    .filter((plan) => Number(plan.maxScheduleDays || 0) > 0)
                    .sort((a, b) => Number(a.maxScheduleDays || 0) - Number(b.maxScheduleDays || 0));
                setVerificationPlans(tierPlans);
            } catch (error) {
                console.error("Failed to load verification plans", error);
                toast.error("Failed to load verification tiers");
            } finally {
                setLoadingVerificationPlans(false);
            }
        };
        fetchVerificationPlans();
    }, [isEmployee]);

    useEffect(() => {
        if (!isAdmin) return;
        const fetchSlaExpiredApplications = async () => {
            setLoadingSlaExpiredApplications(true);
            try {
                const data = await applicationService.getSLAExpiredApplications();
                setSlaExpiredApplications(data);
            } catch (error) {
                console.error("Failed to load SLA expired applications", error);
                toast.error("Failed to load SLA override queue");
            } finally {
                setLoadingSlaExpiredApplications(false);
            }
        };
        fetchSlaExpiredApplications();
    }, [isAdmin]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "scheduled":
                return "text-blue-600 bg-blue-50 border-blue-200";
            case "pending":
                return "text-amber-600 bg-amber-50 border-amber-200";
            case "completed":
                return "text-green-600 bg-green-50 border-green-200";
            case "cancelled":
                return "text-red-600 bg-red-50 border-red-200";
            default:
                return "text-slate-600 bg-slate-50 border-slate-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "scheduled":
                return <Clock className="w-4 h-4" />;
            case "pending":
                return <AlertCircle className="w-4 h-4" />;
            case "completed":
                return <CheckCircle className="w-4 h-4" />;
            case "cancelled":
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const handleAction = (interview: any) => {
        if (interview.type === 'Remote') {
            if (interview.link) {
                window.open(interview.link, "_blank");
            } else {
                toast.info("Meeting link not available yet");
            }
        } else {
            if (interview.location) {
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(interview.location)}`, "_blank");
            } else {
                toast.info("Location details not available");
            }
        }
    };

    const handleVerify = async (plan: SubscriptionPlan) => {
        const planId = plan._id || plan.id;
        if (!planId) return;

        try {
            setProcessingPlanId(planId);

            // Free tiers don't require payment gateway
            if (plan.price <= 0) {
                await interviewTierService.purchaseTier(planId);
                await checkAuth();
                toast.success(`${plan.name} interview tier activated successfully`);
                return;
            }

            toast.info(`Redirecting to secure payment for ${plan.name}...`);
            const { subscriptionId, razorpayKeyId } = await subscriptionService.initializeInterviewTierRazorpaySubscription(planId);

            const options = {
                key: razorpayKeyId,
                subscription_id: subscriptionId,
                name: "HireXO",
                description: `Verification Tier: ${plan.name}`,
                handler: async function (_response: any) {
                    try {
                        // Record wallet top-up and tier purchase only after successful payment
                        await subscriptionService.rechargeWallet(plan.price);
                        await interviewTierService.purchaseTier(planId);
                        const { checkAuth } = useAuthStore.getState();
                        await checkAuth();
                        toast.success(`${plan.name} interview tier activated successfully`);
                    } catch (error: any) {
                        toast.error(error.message || "Payment succeeded, but failed to activate verification tier. Please contact support if it doesn’t appear.");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phoneNumber
                },
                theme: {
                    color: "#3B82F6"
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error: any) {
            toast.error(error.message || "Failed to initialize payment");
        } finally {
            setProcessingPlanId(null);
        }
    };

    const getTierPresentation = (plan: SubscriptionPlan) => {
        const days = Number(plan.maxScheduleDays || 0);
        if (days <= 7) {
            return {
                label: "UP TO 7 DAYS",
                accent: "border-amber-200 bg-amber-50",
                stripe: "bg-amber-500",
                text: "text-amber-600",
            };
        }
        if (days <= 15) {
            return {
                label: "7-15 DAYS",
                accent: "border-blue-200 bg-blue-50/40",
                stripe: "bg-blue-500",
                text: "text-blue-600",
            };
        }
        return {
            label: "15-30 DAYS",
            accent: "border-violet-200 bg-violet-50/40",
            stripe: "bg-violet-500",
            text: "text-violet-600",
        };
    };

    const openEditModal = (interview: any) => {
        setSelectedInterview(interview);
        setEditForm({
            title: interview.title || "",
            date: interview.date ? new Date(interview.date).toISOString().split("T")[0] : "",
            time: interview.time || "",
            type: interview.type || "Remote",
            link: interview.link || "",
            location: interview.location || "",
            status: interview.status || "scheduled",
        });
        setIsEditModalOpen(true);
    };

    const handleSaveInterview = async () => {
        if (!selectedInterview) return;

        if (!editForm.date || !editForm.time) {
            toast.error("Date and time are required");
            return;
        }

        if (editForm.type === "Remote" && !editForm.link) {
            toast.error("Meeting link is required for remote interviews");
            return;
        }

        if (editForm.type === "On-site" && !editForm.location) {
            toast.error("Location is required for on-site interviews");
            return;
        }

        try {
            setIsSaving(true);
            const updated = await interviewService.updateInterview(selectedInterview._id, editForm as any);
            setInterviews((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
            setIsEditModalOpen(false);
            setSelectedInterview(null);
            toast.success("Interview updated");
        } catch (error) {
            console.error("Failed to update interview:", error);
            toast.error("Failed to update interview");
        } finally {
            setIsSaving(false);
        }
    };

    const getSlaDeadline = (app: SLAExpiredApplication) => {
        const appliedAt = new Date(app.appliedAt);
        if (Number.isNaN(appliedAt.getTime())) return "N/A";
        const maxDays = Number(app.verificationMaxScheduleDays || 0);
        if (maxDays <= 0) return "N/A";
        const deadline = new Date(appliedAt);
        deadline.setDate(deadline.getDate() + maxDays);
        return deadline.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    };

    const openOverrideModal = (app: SLAExpiredApplication) => {
        setSelectedSlaApplication(app);
        setOverrideForm({
            date: "",
            time: "",
            type: "Remote",
            link: "",
            location: "",
            reason: "",
        });
        setIsOverrideModalOpen(true);
    };

    const handleForceSchedule = async () => {
        if (!selectedSlaApplication) return;
        if (!overrideForm.date || !overrideForm.time) {
            toast.error("Date and time are required");
            return;
        }
        if (!overrideForm.reason.trim()) {
            toast.error("Override reason is required");
            return;
        }
        if (overrideForm.type === "Remote" && !overrideForm.link.trim()) {
            toast.error("Meeting link is required for remote interview");
            return;
        }
        if (overrideForm.type === "On-site" && !overrideForm.location.trim()) {
            toast.error("Location is required for on-site interview");
            return;
        }

        const applicationId = selectedSlaApplication._id || selectedSlaApplication.id;
        const applicantId = selectedSlaApplication.applicantId?._id || selectedSlaApplication.applicantId?.id;
        const jobId = selectedSlaApplication.jobId?._id || selectedSlaApplication.jobId?.id;
        const employerId = selectedSlaApplication.employerId || selectedSlaApplication.jobId?.userId;

        if (!applicationId || !applicantId || !jobId || !employerId) {
            toast.error("Missing application details for force scheduling");
            return;
        }

        try {
            setIsForceScheduling(true);
            await interviewService.scheduleInterview({
                applicationId,
                applicationType: "JobApplication",
                employerId,
                applicantId,
                jobId,
                title: `${selectedSlaApplication.jobId?.title || "Interview"} Interview`,
                date: overrideForm.date as any,
                time: overrideForm.time,
                type: overrideForm.type,
                link: overrideForm.type === "Remote" ? overrideForm.link : "",
                location: overrideForm.type === "On-site" ? overrideForm.location : "",
                forceSchedule: true,
                overrideReason: overrideForm.reason.trim(),
            });

            const [updatedInterviews, updatedSlaQueue] = await Promise.all([
                interviewService.getMyInterviews(),
                applicationService.getSLAExpiredApplications(),
            ]);
            setInterviews(updatedInterviews);
            setSlaExpiredApplications(updatedSlaQueue);
            setIsOverrideModalOpen(false);
            setSelectedSlaApplication(null);
            toast.success("Interview force scheduled by admin");
        } catch (error: any) {
            toast.error(error?.message || "Failed to force schedule interview");
        } finally {
            setIsForceScheduling(false);
        }
    };

    const filteredInterviews = interviews.filter(interview => {
        const query = searchQuery.trim().toLowerCase();
        const searchableText = [
            interview.title,
            interview.time,
            interview.status,
            interview.type,
            interview.location,
            interview.jobId?.title,
            interview.jobId?.company,
            interview.applicantId?.name,
            interview.applicantId?.email,
            interview.employerId?.name,
            interview.resourceType,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
        const matchesSearch = !query || searchableText.includes(query);

        if (!matchesSearch) return false;

        if (activeTab === 'upcoming') return interview.status === 'scheduled';
        if (activeTab === 'pending') return interview.status === 'pending';
        if (activeTab === 'history') return ['completed', 'cancelled'].includes(interview.status);
        if (activeTab === 'verification') return false;
        if (activeTab === 'overrides') return false;
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-5 space-y-4">
                <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Loading interviews...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-700">
            <div className="bg-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-sm mb-6 sticky top-0 z-10">
                <h1 className="text-2xl font-black text-slate-900 mb-1">My Interviews</h1>
                <p className="text-slate-500 font-medium mb-6">
                    {isAdmin ? "View and edit all scheduled interviews" : "Manage your upcoming and past interviews"}
                </p>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-2xl mb-4 overflow-x-auto no-scrollbar">
                    {interviewTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search */}
                {activeTab !== 'verification' && activeTab !== 'overrides' && (
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                        <input
                            type="text"
                            placeholder="Search interviews..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                )}
            </div>

            <div className="px-5 space-y-4">
                {activeTab === 'verification' ? (
                    <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2">
                            <div className="size-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                                <ShieldCheck className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-[30px] leading-none sm:text-2xl font-black text-slate-900">Verification Pricing Tiers</h2>
                            <p className="text-xs font-medium text-slate-500">Choose the tier that matches your verification timeline</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-white p-4 shadow-sm">
                                <div className="absolute top-0 left-0 h-full w-1 bg-emerald-500" />
                                <h4 className="text-[26px] font-black text-slate-900 leading-none">Free Tier</h4>
                                <div className="mt-3 text-[38px] font-black leading-none text-slate-900">Rs0</div>
                                <p className="mt-2 text-[10px] uppercase tracking-widest font-black text-slate-400">1 MONTH+</p>
                                {!user?.interviewTierId && (
                                    <span className="inline-flex mt-3 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] uppercase tracking-widest font-black">
                                        Active
                                    </span>
                                )}
                            </div>

                            {loadingVerificationPlans ? (
                                <div className="col-span-1 rounded-3xl border border-slate-200 bg-white p-4 text-xs font-black text-slate-500 flex items-center justify-center">
                                    Loading...
                                </div>
                            ) : verificationPlans.length === 0 ? (
                                <div className="col-span-1 rounded-3xl border border-slate-200 bg-white p-4 text-xs font-black text-slate-500 flex items-center justify-center text-center">
                                    No tiers configured
                                </div>
                            ) : (
                                verificationPlans.map((plan) => {
                                    const planId = plan._id || plan.id;
                                    const isCurrentPlan = Boolean(planId && user?.interviewTierId === planId);
                                    const isProcessing = processingPlanId === planId;
                                    const view = getTierPresentation(plan);

                                    return (
                                        <div key={planId} className={`relative overflow-hidden rounded-3xl border p-4 shadow-sm ${view.accent}`}>
                                            <div className={`absolute top-0 left-0 h-full w-1 ${view.stripe}`} />
                                            <h4 className="text-[26px] font-black text-slate-900 leading-none">{plan.name}</h4>
                                            <div className="mt-3 text-[38px] font-black leading-none text-slate-900">Rs{plan.price}</div>
                                            <p className={`mt-2 text-[10px] uppercase tracking-widest font-black ${view.text}`}>{view.label}</p>
                                            <Button
                                                onClick={() => handleVerify(plan)}
                                                disabled={isCurrentPlan || isProcessing}
                                                className="mt-3 h-8 w-full rounded-xl text-[10px] uppercase tracking-widest font-black"
                                            >
                                                {isCurrentPlan ? (
                                                    <>
                                                        <Check className="size-3 mr-1" />
                                                        Active
                                                    </>
                                                ) : isProcessing ? "Processing..." : "Apply Tier"}
                                            </Button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                            <h4 className="text-lg font-black text-slate-900">Stage 1 Clearance</h4>
                            <p className="mt-2 text-sm font-medium text-slate-700 leading-relaxed">
                                Verified for urgent / immediate requirement (up to 7 days). Prioritized profile visibility for recruiters.
                            </p>
                        </div>
                    </div>
                ) : activeTab === 'overrides' ? (
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="font-black text-slate-900 text-sm mb-1">Admin SLA Overrides</h3>
                            <p className="text-xs font-medium text-slate-600">
                                Force schedule interviews only for applications that are in <span className="font-black">SLAExpired</span> status.
                            </p>
                        </div>

                        {loadingSlaExpiredApplications ? (
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center text-sm font-bold text-slate-500">
                                Loading SLA override queue...
                            </div>
                        ) : slaExpiredApplications.length === 0 ? (
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center text-sm font-bold text-slate-500">
                                No SLA expired applications pending override.
                            </div>
                        ) : (
                            slaExpiredApplications.map((app) => {
                                const appId = app._id || app.id;
                                return (
                                    <Card key={appId} className="p-5 border-slate-200 rounded-[2rem]">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="font-black text-slate-900">
                                                    {app.applicantId?.name || "Candidate"}
                                                </h4>
                                                <p className="text-primary font-black text-[10px] uppercase tracking-widest">
                                                    {app.jobId?.title || "Job"} - {app.jobId?.company || "Company"}
                                                </p>
                                            </div>
                                            <span className="px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 border-orange-200">
                                                SLAExpired
                                            </span>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="text-xs font-bold text-slate-600">
                                                <span className="text-slate-400">Applied:</span>{" "}
                                                {new Date(app.appliedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                                            </div>
                                            <div className="text-xs font-bold text-slate-600">
                                                <span className="text-slate-400">SLA Deadline:</span> {getSlaDeadline(app)}
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => openOverrideModal(app)}
                                            className="w-full mt-4 h-12 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest"
                                        >
                                            Force Schedule Interview
                                        </Button>
                                    </Card>
                                );
                            })
                        )}
                    </div>
                ) : filteredInterviews.length > 0 ? (
                    filteredInterviews.map((interview) => (
                        <Card key={interview._id} className="p-5 border-slate-200 hover:shadow-md transition-all rounded-[2rem]">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-black text-lg text-slate-900 truncate max-w-[200px]">
                                        {isEmployer
                                            ? interview.applicantId?.name || "Candidate"
                                            : interview.jobId?.company || interview.resourceType || "Organization"}
                                    </h3>
                                    <p className="text-primary font-black text-[10px] uppercase tracking-widest">
                                        {interview.title || interview.jobId?.title || "Interview"}
                                    </p>
                                </div>
                                <div
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(
                                        interview.status
                                    )}`}
                                >
                                    {getStatusIcon(interview.status)}
                                    <span>{interview.status}</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-5">
                                <div className="flex items-center gap-3 text-slate-600 text-xs font-bold">
                                    <div className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Calendar className="size-4" />
                                    </div>
                                    <span>{new Date(interview.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 text-xs font-bold">
                                    <div className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Clock className="size-4" />
                                    </div>
                                    <span>{interview.time}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 text-xs font-bold">
                                    <div className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        {interview.type === "Remote" ? <Video className="size-4" /> : <MapPin className="size-4" />}
                                    </div>
                                    <span className="truncate">{interview.location || interview.type}</span>
                                </div>
                            </div>

                            {interview.status === "scheduled" && (
                                <Button
                                    onClick={() => handleAction(interview)}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest rounded-2xl h-14 shadow-lg shadow-primary/20 transition-all active:scale-95"
                                >
                                    {interview.type === "Remote" ? "Join Meeting" : "View Location"}
                                </Button>
                            )}

                            {interview.status === "pending" && (
                                <Button
                                    variant="outline"
                                    className="w-full border-slate-200 font-black text-xs uppercase tracking-widest rounded-2xl h-14 text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Awaiting Confirmation
                                </Button>
                            )}

                            {isAdmin && ["scheduled", "pending"].includes(interview.status) && (
                                <Button
                                    variant="outline"
                                    onClick={() => openEditModal(interview)}
                                    className="w-full mt-3 border-slate-200 font-black text-xs uppercase tracking-widest rounded-2xl h-12 text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
                                >
                                    <Pencil className="size-4" />
                                    Edit Interview
                                </Button>
                            )}
                        </Card>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="size-24 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-center">
                            <Video className="size-10 text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black text-xl text-slate-900 tracking-tight">No {activeTab} interviews</h3>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest max-w-[250px] mx-auto">
                                {activeTab === 'upcoming'
                                    ? "You have no upcoming interviews scheduled."
                                    : activeTab === 'pending'
                                        ? "No pending interview requests."
                                        : "No interview history found."}
                            </p>
                        </div>
                        {activeTab === 'upcoming' && (
                            <Button
                                onClick={() => navigate(isEmployer ? '/employer/applications' : '/jobs')}
                                className="bg-primary text-white font-black px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                            >
                                {isEmployer ? "Manage Applications" : "Browse Jobs"}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {isAdmin && isOverrideModalOpen && selectedSlaApplication && (
                <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => !isForceScheduling && setIsOverrideModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-6 space-y-4">
                        <h3 className="text-lg font-black">Force Schedule Interview</h3>
                        <p className="text-xs text-slate-500">
                            Candidate: <span className="font-black text-slate-700">{selectedSlaApplication.applicantId?.name || "N/A"}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                            Job: <span className="font-black text-slate-700">{selectedSlaApplication.jobId?.title || "N/A"}</span>
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="date"
                                value={overrideForm.date}
                                onChange={(e) => setOverrideForm((prev) => ({ ...prev, date: e.target.value }))}
                                className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                            />
                            <input
                                type="time"
                                value={overrideForm.time}
                                onChange={(e) => setOverrideForm((prev) => ({ ...prev, time: e.target.value }))}
                                className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setOverrideForm((prev) => ({ ...prev, type: "Remote" }))}
                                className={`h-11 rounded-xl border text-xs font-black uppercase tracking-widest ${overrideForm.type === "Remote" ? "border-primary text-primary bg-primary/5" : "border-slate-200 text-slate-500"
                                    }`}
                            >
                                Remote
                            </button>
                            <button
                                onClick={() => setOverrideForm((prev) => ({ ...prev, type: "On-site" }))}
                                className={`h-11 rounded-xl border text-xs font-black uppercase tracking-widest ${overrideForm.type === "On-site" ? "border-primary text-primary bg-primary/5" : "border-slate-200 text-slate-500"
                                    }`}
                            >
                                On-site
                            </button>
                        </div>

                        {overrideForm.type === "Remote" ? (
                            <input
                                type="url"
                                value={overrideForm.link}
                                onChange={(e) => setOverrideForm((prev) => ({ ...prev, link: e.target.value }))}
                                placeholder="Meeting link"
                                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                            />
                        ) : (
                            <input
                                value={overrideForm.location}
                                onChange={(e) => setOverrideForm((prev) => ({ ...prev, location: e.target.value }))}
                                placeholder="Interview location"
                                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                            />
                        )}

                        <textarea
                            value={overrideForm.reason}
                            onChange={(e) => setOverrideForm((prev) => ({ ...prev, reason: e.target.value }))}
                            placeholder="Mandatory override reason"
                            className="w-full min-h-24 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold resize-none"
                        />

                        <div className="flex gap-3 pt-1">
                            <Button
                                variant="outline"
                                onClick={() => setIsOverrideModalOpen(false)}
                                className="flex-1 h-11 rounded-xl"
                                disabled={isForceScheduling}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleForceSchedule}
                                className="flex-1 h-11 rounded-xl bg-primary text-white"
                                disabled={isForceScheduling}
                            >
                                {isForceScheduling ? "Scheduling..." : "Force Schedule"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isAdmin && isEditModalOpen && selectedInterview && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => !isSaving && setIsEditModalOpen(false)}
                    />
                    <div className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl p-6 space-y-4">
                        <h3 className="text-lg font-black">Edit Interview</h3>

                        <input
                            value={editForm.title}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="Interview title"
                            className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="date"
                                value={editForm.date}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                                className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                            />
                            <input
                                type="time"
                                value={editForm.time}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, time: e.target.value }))}
                                className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <select
                                value={editForm.type}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, type: e.target.value as "Remote" | "On-site" }))}
                                className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                            >
                                <option value="Remote">Remote</option>
                                <option value="On-site">On-site</option>
                            </select>
                            <select
                                value={editForm.status}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as any }))}
                                className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                            >
                                <option value="scheduled">scheduled</option>
                                <option value="pending">pending</option>
                                <option value="completed">completed</option>
                                <option value="cancelled">cancelled</option>
                            </select>
                        </div>

                        {editForm.type === "Remote" ? (
                            <input
                                type="url"
                                value={editForm.link}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, link: e.target.value }))}
                                placeholder="Meeting link"
                                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                            />
                        ) : (
                            <input
                                value={editForm.location}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                                placeholder="Interview location"
                                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                            />
                        )}

                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 h-11 rounded-xl"
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveInterview}
                                className="flex-1 h-11 rounded-xl bg-primary text-white"
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Interviews;

