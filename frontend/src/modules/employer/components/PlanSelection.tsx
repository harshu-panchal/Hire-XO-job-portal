import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle2, Zap, Crown, Shield } from "lucide-react";
import { subscriptionService } from "@/services/subscriptionService";
import { useAuthStore } from "@/store/useAuthStore";
import type { SubscriptionPlan } from "@/types";
import { toast } from "sonner";

interface PlanSelectionProps {
    onPlanSelected: () => void;
    onBack: () => void;
}

const PlanSelection = ({ onPlanSelected, onBack }: PlanSelectionProps) => {
    const navigate = useNavigate();
    const { purchaseSubscription, user, isAuthenticated } = useAuthStore();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await subscriptionService.getAllPlans();
                setPlans(data);
            } catch (error: any) {
                console.error("Failed to fetch plans:", error);
                toast.error("Failed to load plans");
            } finally {
                setIsLoadingPlans(false);
            }
        };
        fetchPlans();
    }, []);

    // Check if user has active subscription
    const isSubscribed = user?.profile?.subscriptionExpiry
        ? new Date(user.profile.subscriptionExpiry) > new Date()
        : false;

    const handleSelectPlan = async (plan: SubscriptionPlan) => {
        if (!isAuthenticated) {
            toast.info("Please login to choose a plan");
            navigate("/login/employer");
            return;
        }

        // If it's the free plan or user is already subscribed, just proceed
        if (plan.price === 0 || plan.name.toLowerCase().includes("free")) {
            onPlanSelected();
            return;
        }

        // For paid plans, process subscription
        setIsProcessing(true);
        try {
            toast.info("Processing payment...");
            await subscriptionService.rechargeWallet(plan.price);

            toast.info("Activating subscription...");
            await purchaseSubscription(plan.id || (plan as any)._id);

            toast.success(`Successfully upgraded to ${plan.name}!`);
            onPlanSelected();
        } catch (error: any) {
            toast.error(error.message || "Failed to upgrade subscription");
        } finally {
            setIsProcessing(false);
        }
    };

    const getPlanIcon = (planName: string) => {
        if (planName.toLowerCase().includes("premium") || planName.toLowerCase().includes("unlimited")) {
            return Crown;
        }
        if (planName.toLowerCase().includes("pro") || planName.toLowerCase().includes("resources")) {
            return Zap;
        }
        return Shield;
    };

    const getPlanColor = (index: number) => {
        const colors = [
            { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
            { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20" },
            { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
            { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/20" },
        ];
        return colors[index % colors.length];
    };

    if (isLoadingPlans) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-5 text-center select-none">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">
                    Loading Plans...
                </p>
            </div>
        );
    }

    return (
        <div className="pb-32 select-none">
            {/* Header */}
            <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 -mx-5 px-5">
                <button
                    onClick={onBack}
                    className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all"
                >
                    <ChevronLeft className="size-6" />
                </button>
                <h2 className="text-sm font-black uppercase tracking-widest">Choose Your Plan</h2>
                <div className="size-11" /> {/* Spacer */}
            </div>

            <div className="mt-6 space-y-6">
                {/* Title */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black tracking-tighter">
                        Select the <span className="text-primary">Perfect Plan</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                        For your business needs
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="space-y-4">
                    {plans.map((plan, index) => {
                        const Icon = getPlanIcon(plan.name);
                        const colors = getPlanColor(index);
                        const isFree = plan.price === 0 || plan.name.toLowerCase().includes("free");
                        const isRecommended = plan.name.toLowerCase().includes("pro") ||
                            plan.name.toLowerCase().includes("resources");

                        return (
                            <div
                                key={plan.id || (plan as any)._id}
                                className={`bg-white rounded-[2.5rem] border-2 p-6 relative overflow-hidden transition-all ${isRecommended
                                    ? "border-primary/30 shadow-lg shadow-primary/10"
                                    : "border-slate-200"
                                    }`}
                            >
                                {isRecommended && (
                                    <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-bl-2xl">
                                        Recommended
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {/* Plan Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-12 rounded-2xl ${colors.bg} flex items-center justify-center ${colors.text}`}>
                                                <Icon className="size-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black tracking-tight">{plan.name}</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {plan.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-slate-900">
                                            {isFree ? "FREE" : `₹${plan.price}`}
                                        </span>
                                        {!isFree && (
                                            <span className="text-sm font-bold text-slate-400">
                                                / {Math.floor(plan.durationDays / 30)} months
                                            </span>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-2">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <div className="size-4 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                    <CheckCircle2 className="size-2.5 text-green-500" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 leading-relaxed">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Select Button */}
                                    <button
                                        onClick={() => handleSelectPlan(plan)}
                                        disabled={isProcessing}
                                        className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 ${isRecommended
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "bg-slate-900 text-white"
                                            }`}
                                    >
                                        {isProcessing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </div>
                                        ) : isFree ? (
                                            "Get Started"
                                        ) : isSubscribed ? (
                                            "Continue"
                                        ) : (
                                            "Upgrade Now"
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info Note */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                    <p className="text-[10px] font-bold text-blue-600 leading-relaxed">
                        💡 You can post jobs for free with the basic plan. Upgrade anytime to unlock premium features!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlanSelection;
