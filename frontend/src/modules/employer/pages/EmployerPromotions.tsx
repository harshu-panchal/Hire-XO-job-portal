import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, TrendingUp, DollarSign, Users, Megaphone, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { promotionService, type Promotion, type PromotionStats } from "@/services/promotionService";
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
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [selectedResource, setSelectedResource] = useState<{ id: string; type: 'Job' | 'Post'; title: string } | null>(null);
    const [budget, setBudget] = useState<number>(100); // Default 100
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch Promotions
                const data = await promotionService.getMyPromotions();
                setStats(data.stats);
                setPromotions(data.promotions);

                // Fetch Posts (Filter by user)
                const { data: postsData } = await postService.getAllPosts(1, 100);
                const userPosts = postsData.filter((p: any) => p.userId._id === user?.id);
                setMyPosts(userPosts);

                // Fetch Jobs
                if (user?.role === 'recruiter' || user?.role === 'employer') {
                    const jobs = await jobService.getMyListings();
                    setMyJobs(jobs);
                }
            } catch (error) {
                console.error("Failed to load promotion data", error);
                toast.error("Failed to load dashboard");
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    const handleCreatePromotion = async () => {
        if (!selectedResource) {
            toast.error("Please select a post or job to promote");
            return;
        }

        try {
            setIsCreating(true);
            await promotionService.createPromotion(
                selectedResource.id,
                selectedResource.type,
                budget
            );

            toast.success("Promotion created successfully! Your ad is now active.");
            setShowPaymentModal(false);
            setSelectedResource(null);
            setBudget(100);

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

    const getEstimatedReach = (budget: number) => {
        const min = Math.floor(budget * 1.5);
        const max = Math.floor(budget * 2.5);
        return `${min} - ${max} Employees`;
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
                                {stats?.totalReach || "0"}
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
                                ₹{stats?.totalSpent || "0"}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Create New Ad Section */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                    <div className="absolute -right-10 -top-10 size-40 bg-primary/5 rounded-full blur-3xl" />

                    <div className="flex items-center gap-4 mb-6 relative">
                        <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Megaphone className="size-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">Create New Ad</h2>
                            <p className="text-xs font-medium text-slate-500">Boost visibility by 200%</p>
                        </div>
                    </div>

                    <div className="space-y-6 relative">
                        {/* Select Content */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Select Content to Promote</label>

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

                                {myJobs.length === 0 && myPosts.length === 0 && (
                                    <div className="text-center py-8 text-slate-400 text-sm font-medium bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                        No active jobs or posts found.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fixed Budget Display */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-black text-slate-900">Promotion Cost</h3>
                                <p className="text-xs font-medium text-slate-500">Fixed rate per promotion</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-black text-primary">₹100</span>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">/ Post</p>
                            </div>
                        </div>

                        {/* Estimated Reach Preview */}
                        <div className="bg-slate-900 rounded-2xl p-5 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 relative z-10">Estimated Reach</p>
                            <h3 className="text-2xl font-black text-white relative z-10">
                                {getEstimatedReach(budget)}
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-2 relative z-10 font-medium">Potential Employees</p>
                        </div>

                        <button
                            onClick={() => setShowPaymentModal(true)}
                            disabled={!selectedResource}
                            className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/25 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                        >
                            <span>Proceed to Pay</span>
                            <ChevronLeft className="rotate-180 size-4" />
                        </button>
                    </div>
                </div>

                {/* Active Promotions */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 pl-2">Recent Promotions</h3>

                    {promotions.length > 0 ? (
                        promotions.map(promo => (
                            <div key={promo._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`size-2 rounded-full ${promo.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{promo.status}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">{promo.resourceType}: {promo.budget} Budget</h4>
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

            {/* Payment Modal (Mock) */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-6">
                            <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                <DollarSign className="size-8" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Confirm Payment</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1">
                                You are about to spend <span className="text-slate-900 font-bold">₹{budget}</span>
                            </p>
                        </div>

                        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Service Fee</span>
                                <span className="font-bold text-slate-900">₹0</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Total Amount</span>
                                <span className="font-black text-primary text-lg">₹{budget}</span>
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
