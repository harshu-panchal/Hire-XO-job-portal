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
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-20 px-5 pt-12 pb-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 active:scale-95 transition-all text-slate-500 hover:text-slate-900"
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <h1 className="text-lg font-black uppercase tracking-widest text-slate-900">Ad Manager</h1>
                    <div className="size-10" />
                </div>
            </div>

            <div className="px-5 mt-6 space-y-8 max-w-2xl mx-auto">
                {/* Stats Cards */}
                {error ? (
                    <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center">
                        <AlertCircle className="size-10 text-red-400 mx-auto mb-3" />
                        <h3 className="text-red-900 font-bold mb-2">Error Loading Data</h3>
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                        <button
                            onClick={fetchData}
                            className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-50 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                <TrendingUp className="size-16" />
                            </div>
                            <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                                <Users className="size-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Reach</p>
                                <h3 className="text-xl font-black text-slate-900 leading-tight">
                                    {isLoading ? "..." : (stats?.totalReach || "0")}
                                </h3>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                <DollarSign className="size-16" />
                            </div>
                            <div className="size-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                                <DollarSign className="size-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Spent</p>
                                <h3 className="text-xl font-black text-slate-900 leading-tight">
                                    {isLoading ? "..." : `₹${stats?.totalSpent || "0"}`}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* Promotion Plans */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 pl-2">Choose Your Plan</h3>

                    {isLoading ? (
                        <div className="text-center py-10 text-slate-400 text-sm font-medium">
                            Loading plans...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {promotionPlans.map(plan => (
                                <button
                                    key={plan._id}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`w-full text-left p-6 rounded-3xl border-2 transition-all relative overflow-hidden ${selectedPlan?._id === plan._id
                                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                        }`}
                                >
                                    {plan.isMostPopular && (
                                        <div className="absolute top-4 right-4">
                                            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-black uppercase tracking-wider shadow-lg">
                                                <Crown className="size-3" />
                                                <span>Most Popular</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="text-2xl font-black text-slate-900 mb-1">{plan.name}</h4>
                                            <p className="text-sm font-medium text-slate-500">
                                                {plan.estimatedReachMin} - {plan.estimatedReachMax} Employees
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-primary">₹{plan.price}</div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                {plan.duration} Days
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm">
                                                <Zap className="size-4 text-primary flex-shrink-0" />
                                                <span className="text-slate-700 font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedPlan?._id === plan._id && (
                                        <div className="absolute top-6 left-6">
                                            <CheckCircle2 className="size-6 text-primary" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Select Content to Promote */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Megaphone className="size-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">Select Content</h2>
                            <p className="text-xs font-medium text-slate-500">Choose what to promote</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Your Jobs & Posts</label>

                        <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {myJobs.map(job => (
                                <button
                                    key={job.id}
                                    onClick={() => setSelectedResource({ id: job.id, type: 'Job', title: job.title })}
                                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedResource?.id === job.id
                                            ? "border-primary bg-primary/5"
                                            : "border-slate-100 bg-slate-50 hover:border-slate-200"
                                        }`}
                                >
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md mb-1 inline-block">Job</span>
                                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{job.title}</h4>
                                    </div>
                                    {selectedResource?.id === job.id && <CheckCircle2 className="size-5 text-primary" />}
                                </button>
                            ))}

                            {myPosts.map(post => (
                                <button
                                    key={post._id}
                                    onClick={() => setSelectedResource({ id: post._id, type: 'Post', title: post.content })}
                                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedResource?.id === post._id
                                            ? "border-primary bg-primary/5"
                                            : "border-slate-100 bg-slate-50 hover:border-slate-200"
                                        }`}
                                >
                                    <div className="flex-1 mr-4">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md mb-1 inline-block">Post</span>
                                        <h4 className="font-medium text-slate-700 text-sm line-clamp-2">{post.content}</h4>
                                    </div>
                                    {selectedResource?.id === post._id && <CheckCircle2 className="size-5 text-primary flex-shrink-0" />}
                                </button>
                            ))}

                            {myJobs.length === 0 && myPosts.length === 0 && !isLoading && (
                                <div className="text-center py-8 text-slate-400 text-sm font-medium bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                    <p className="mb-2">No active jobs or posts found.</p>
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={() => navigate('/employer/post-job')}
                                            className="text-primary font-bold hover:underline"
                                        >
                                            Post Job
                                        </button>
                                        <button
                                            onClick={() => navigate('/employer/community')}
                                            className="text-primary font-bold hover:underline"
                                        >
                                            Create Post
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowPaymentModal(true)}
                        disabled={!selectedResource || !selectedPlan}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/25 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 mt-6"
                    >
                        <span>Proceed to Pay</span>
                        <ChevronLeft className="rotate-180 size-4" />
                    </button>
                </div>

                {/* Active Promotions */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 pl-2">Recent Promotions</h3>

                    {isLoading ? (
                        <div className="text-center py-10 text-slate-400 text-sm font-medium">
                            Loading promotions...
                        </div>
                    ) : promotions.length > 0 ? (
                        promotions.map(promo => (
                            <div key={promo._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`size-2 rounded-full ${promo.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{promo.status}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                                        {promo.resourceType} {promo.planId?.name ? `- ${promo.planId.name}` : ''}
                                    </h4>
                                    <p className="text-xs font-medium text-slate-500">Reach: {promo.estimatedReach}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-black text-slate-900 block">₹{promo.budget}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spent</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-white rounded-3xl border border-slate-100">
                            <AlertCircle className="size-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-sm font-bold text-slate-400">No promotions yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedPlan && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-6">
                            <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                <DollarSign className="size-8" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Confirm Payment</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1">
                                You are about to purchase <span className="text-slate-900 font-bold">{selectedPlan.name}</span>
                            </p>
                        </div>

                        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Plan</span>
                                <span className="font-bold text-slate-900">{selectedPlan.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Duration</span>
                                <span className="font-bold text-slate-900">{selectedPlan.duration} Days</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Estimated Reach</span>
                                <span className="font-bold text-slate-900">{selectedPlan.estimatedReachMin}-{selectedPlan.estimatedReachMax}</span>
                            </div>
                            <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between">
                                <span className="text-slate-500 font-medium">Total Amount</span>
                                <span className="font-black text-primary text-lg">₹{selectedPlan.price}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="h-12 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePromotion}
                                disabled={isCreating}
                                className="h-12 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                            >
                                {isCreating ? "Processing..." : "Pay Now"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployerPromotions;
