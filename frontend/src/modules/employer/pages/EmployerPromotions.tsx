import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, TrendingUp, DollarSign, Users, Megaphone, CheckCircle2, AlertCircle, Crown, Zap } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { promotionService, type Promotion, type PromotionStats } from "@/services/promotionService";
import { promotionPlanService, type PromotionPlan } from "@/services/promotionPlanService";
import { postService, type Post } from "@/services/postService";
import { jobService } from "@/services/jobService";
import type { Job } from "@/types";

const EmployerPromotions = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [stats, setStats] = useState<PromotionStats | null>(null);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [myPosts, setMyPosts] = useState<Post[]>([]);
    const [myJobs, setMyJobs] = useState<Job[]>([]);
    const [promotionPlans, setPromotionPlans] = useState<PromotionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [selectedResource, setSelectedResource] = useState<{ id: string; type: 'Job' | 'Post'; title: string } | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<PromotionPlan | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const fetchData = async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            setError(null);

            // Fetch Promotion Plans
            const plans = await promotionPlanService.getAllPlans();
            setPromotionPlans(plans);

            // Fetch Promotions
            const data = await promotionService.getMyPromotions();
            setStats(data.stats);
            setPromotions(data.promotions);

            // Fetch Posts (Filter by user)
            const { data: postsData } = await postService.getAllPosts(1, 100);
            const userPosts = postsData.filter((p: any) => p.userId?._id === user?.id);
            setMyPosts(userPosts);

            // Fetch Jobs
            if (user.role === 'employer') {
                const jobs = await jobService.getMyListings();
                setMyJobs(jobs);
            }
        } catch (error) {
            console.error("Failed to load promotion data", error);
            setError("Failed to load promotions. Please try again.");
            toast.error("Failed to load dashboard");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleCreatePromotion = async () => {
        if (!selectedResource) {
            toast.error("Please select a post or job to promote");
            return;
        }
        if (!selectedPlan) {
            toast.error("Please select a promotion plan");
            return;
        }

        try {
            setIsCreating(true);
            await promotionService.createPromotion(
                selectedResource.id,
                selectedResource.type,
                selectedPlan._id
            );

            toast.success("Promotion created successfully! Your ad is now active.");
            setShowPaymentModal(false);
            setSelectedResource(null);
            setSelectedPlan(null);

            // Refresh data
            const data = await promotionService.getMyPromotions();
            setStats(data.stats);
            setPromotions(data.promotions);
        } catch (error: any) {
            toast.error(error.message || "Failed to create promotion");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans select-none">
            {/* Header - Aligned with Subscription.tsx */}
            <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-50 px-5">
                <button
                    onClick={() => navigate(-1)}
                    className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all text-slate-600 shadow-sm"
                >
                    <ChevronLeft className="size-6" />
                </button>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Ad Manager</h2>
                <div className="size-11" /> {/* Spacer */}
            </div>

            <div className="px-4 sm:px-6 mt-6 space-y-8 max-w-5xl mx-auto pb-12">

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-center max-w-2xl mx-auto">
                        <AlertCircle className="size-10 text-red-400 mx-auto mb-3" />
                        <h3 className="text-red-900 font-bold mb-2">Error Loading Data</h3>
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                        <button
                            onClick={fetchData}
                            className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-50 transition-colors shadow-sm"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Step 1: Select Content to Promote */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                            1. Select Content
                        </h2>
                        {selectedResource && (
                            <button
                                onClick={() => setSelectedResource(null)}
                                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                            >
                                Change
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                            {myJobs.map(job => (
                                <button
                                    key={job.id}
                                    onClick={() => setSelectedResource({ id: job.id, type: 'Job', title: job.title })}
                                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group min-h-[70px] ${selectedResource?.id === job.id
                                        ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                                        : "border-slate-50 bg-slate-50 hover:border-slate-200"
                                        }`}
                                >
                                    <div className="flex-1 pr-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">Job</span>
                                            {selectedResource?.id === job.id && <span className="text-[9px] font-black text-primary uppercase">Selected</span>}
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{job.title}</h4>
                                    </div>
                                    <div className={`size-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedResource?.id === job.id ? "bg-primary border-primary text-white" : "border-slate-200"}`}>
                                        <CheckCircle2 className="size-4" />
                                    </div>
                                </button>
                            ))}

                            {myPosts.map(post => (
                                <button
                                    key={post._id}
                                    onClick={() => setSelectedResource({ id: post._id, type: 'Post', title: post.content })}
                                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group min-h-[70px] ${selectedResource?.id === post._id
                                        ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                                        : "border-slate-50 bg-slate-50 hover:border-slate-200"
                                        }`}
                                >
                                    <div className="flex-1 pr-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">Post</span>
                                            {selectedResource?.id === post._id && <span className="text-[9px] font-black text-emerald-600 uppercase">Selected</span>}
                                        </div>
                                        <h4 className="font-medium text-slate-700 text-xs line-clamp-2 leading-relaxed">{post.content}</h4>
                                    </div>
                                    <div className={`size-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedResource?.id === post._id ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200"}`}>
                                        <CheckCircle2 className="size-4" />
                                    </div>
                                </button>
                            ))}

                            {myJobs.length === 0 && myPosts.length === 0 && !isLoading && (
                                <div className="col-span-full text-center py-10 text-slate-400 text-sm font-medium bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                    <Megaphone className="size-8 mx-auto mb-3 opacity-20" />
                                    <p className="mb-4">No active jobs or posts to promote.</p>
                                    <div className="flex gap-4 justify-center">
                                        <button onClick={() => navigate('/employer/post-job')} className="text-primary font-bold text-xs uppercase tracking-widest">Post Job</button>
                                        <button onClick={() => navigate('/employer/community')} className="text-primary font-bold text-xs uppercase tracking-widest">Create Post</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Step 2: Choose Promotion Plan */}
                <section className={`space-y-4 transition-opacity duration-500 ${!selectedResource ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex items-center gap-3 px-1">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                            2. Choose Plan
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-3xl" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {promotionPlans.map((plan, index) => {
                                const colors = [
                                    { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20", gradient: "from-blue-500/20 to-blue-500/5" },
                                    { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20", gradient: "from-purple-500/20 to-purple-500/5" },
                                    { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20", gradient: "from-amber-500/20 to-amber-500/5" },
                                ][index % 3];

                                return (
                                    <button
                                        key={plan._id}
                                        onClick={() => setSelectedPlan(plan)}
                                        className={`w-full text-left p-6 rounded-[2.5rem] border-2 transition-all relative overflow-hidden flex flex-col justify-between min-h-[260px] ${selectedPlan?._id === plan._id
                                            ? "border-primary/30 bg-white shadow-xl shadow-primary/10"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                    >
                                        {/* Background Gradient */}
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} rounded-full blur-3xl opacity-50 -z-0`}></div>

                                        {plan.isMostPopular && (
                                            <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-bl-2xl z-10 shadow-lg">
                                                Best Value
                                            </div>
                                        )}

                                        <div className="relative z-10 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className={`size-12 rounded-2xl ${colors.bg} flex items-center justify-center ${colors.text} shadow-sm border ${colors.border}`}>
                                                    <Zap className="size-6" />
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-xl font-black text-slate-900 tracking-tight">{plan.name}</h4>
                                                <div className="flex items-baseline gap-1 mt-1">
                                                    <span className="text-3xl font-black text-slate-900">₹{plan.price}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ {plan.duration} Days</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                                {plan.features.slice(0, 3).map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                                                        <div className="size-4 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                                            <CheckCircle2 className="size-2.5 text-green-500" />
                                                        </div>
                                                        <span className="truncate">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between relative z-10">
                                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Est. Reach: {plan.estimatedReachMin}-{plan.estimatedReachMax}</div>
                                            {selectedPlan?._id === plan._id && (
                                                <div className="size-6 rounded-full bg-primary flex items-center justify-center text-white">
                                                    <CheckCircle2 className="size-4" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Summary & Proceed - Aligned Style */}
                <div className={`transition-all duration-500 transform ${selectedPlan ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden max-w-2xl mx-auto">
                        <div className="relative z-10 space-y-6 text-center">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black tracking-tight">Campaign Summary</h2>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Ready to launch your promotion</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-left">
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Target Content</p>
                                    <p className="text-xs font-bold truncate">{selectedResource?.title}</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-left">
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Selected Plan</p>
                                    <p className="text-xs font-bold">{selectedPlan?.name}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowPaymentModal(true)}
                                className="w-full h-14 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                            >
                                <span>Proceed to Payment</span>
                                <DollarSign className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats Section */}
                <section className="pt-8 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                            Performance Stats
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 flex items-center justify-between transition-all">
                            <div className="flex items-center gap-4">
                                <div className="size-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <TrendingUp className="size-7 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                        Total Reach
                                    </p>
                                    <p className="text-2xl font-black tracking-tight">{isLoading ? "..." : (stats?.totalReach || "0")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 flex items-center justify-between transition-all">
                            <div className="flex items-center gap-4">
                                <div className="size-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                    <DollarSign className="size-7 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                        Total Spent
                                    </p>
                                    <p className="text-2xl font-black tracking-tight">{isLoading ? "..." : `₹${stats?.totalSpent || "0"}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Promotions History */}
                <section className="space-y-4">
                    <div className="px-1">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                            Campaign History
                        </h2>
                    </div>

                    {promotions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {promotions.map(promo => (
                                <div key={promo._id} className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center gap-4 transition-all">
                                    <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${promo.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                                        <Megaphone className="size-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-sm truncate tracking-tight">{promo.resourceType} Promotion</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {promo.planId?.name || 'Standard Plan'} • {new Date(promo.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <div
                                            className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${promo.status === 'Active'
                                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                                : "bg-slate-100 text-slate-400 border-slate-200"
                                                }`}
                                        >
                                            {promo.status}
                                        </div>
                                        <div className="text-[10px] font-black text-slate-900 tracking-tight">₹{promo.budget}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                No campaigns launched yet
                            </p>
                        </div>
                    )}
                </section>
            </div>

            {/* Premium Payment Modal */}
            {showPaymentModal && selectedPlan && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-5">
                    <div className="bg-white w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl relative animate-in slide-in-from-bottom duration-300">
                        <div className="text-center mb-8">
                            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                                <Zap className="size-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Finalize Campaign</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                Confirm your promotion details
                            </p>
                        </div>

                        <div className="space-y-4 bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Plan</span>
                                <span className="text-xs font-black text-slate-900">{selectedPlan.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estimated Reach</span>
                                <span className="text-xs font-black text-slate-900">{selectedPlan.estimatedReachMin}-{selectedPlan.estimatedReachMax}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                                <span className="text-xs font-black text-slate-900">{selectedPlan.duration} Days</span>
                            </div>
                            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Total Cost</span>
                                <span className="text-2xl font-black text-primary">₹{selectedPlan.price}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleCreatePromotion}
                                disabled={isCreating}
                                className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
                            >
                                {isCreating ? (
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Confirm & Pay</span>
                                        <CheckCircle2 className="size-5" />
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="w-full py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                            >
                                Cancel Transaction
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployerPromotions;
