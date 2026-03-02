import { useState, useEffect } from "react";
import { CheckCircle2, ChevronLeft, ShieldCheck, Zap, Crown, Shield, XCircle, Star, Package, Globe, Hammer, Cpu, Briefcase, Ship, Car, Box, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { subscriptionService } from "@/services/subscriptionService";
import { paymentService } from "@/services/paymentService";
import type { SubscriptionPlan } from "@/types";
import { Home, User, CreditCard, HelpCircle } from "lucide-react";

const ResourcePlans = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, purchaseSubscription, logout } = useAuthStore();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const activePlanId = user?.activeSubscriptionId;

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await subscriptionService.getAllPlans('resource');
                setPlans(data);
            } catch (error) {
                console.error("Failed to fetch resource plans:", error);
                toast.error("Failed to load resource plans");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handlePurchase = async (plan: SubscriptionPlan) => {
        if (!user) {
            toast.info("Please login or signup as a resource to subscribe");
            navigate("/login/resource");
            return;
        }

        const planId = plan._id || plan.id;
        if (!planId) return;

        setIsProcessing(planId);
        try {
            toast.info(`Initializing subscription for ${plan.name}...`);
            const { subscriptionId, razorpayKeyId } = await subscriptionService.initializeRazorpaySubscription(planId);

            const options = {
                key: razorpayKeyId,
                subscription_id: subscriptionId,
                name: "HireXO",
                description: `Resource Plan: ${plan.name}`,
                handler: async function (_response: any) {
                    try {
                        toast.success("Payment successful! Creating certificate request...");
                        await paymentService.createCertificateRequest(planId as string);
                        toast.success("Certificate request sent to admin. You’ll be notified once it is issued.");
                    } catch (error: any) {
                        toast.error(error.message || "Payment succeeded, but failed to create certificate request. Please contact support if it doesn’t appear.");
                    } finally {
                        const { checkAuth } = useAuthStore.getState();
                        await checkAuth();
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
            setIsProcessing(null);
        }
    };

    const getPlanIcon = (planName: string) => {
        const name = planName.toLowerCase();
        if (name.includes("verification")) return ShieldCheck;
        if (name.includes("tender")) return Package;
        if (name.includes("investor")) return Globe;
        if (name.includes("equipment")) return Hammer;
        if (name.includes("machinery")) return Cpu;
        if (name.includes("pmc")) return Briefcase;
        if (name.includes("csm")) return Star;
        if (name.includes("logistics")) return Ship;
        if (name.includes("vehicles")) return Car;
        if (name.includes("all resources")) return Zap;
        return Box;
    };

    const getPlanColor = (index: number) => {
        const colors = [
            { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20", gradient: "from-blue-500/20 to-blue-500/5" },
            { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20", gradient: "from-purple-500/20 to-purple-500/5" },
            { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20", gradient: "from-emerald-500/20 to-emerald-500/5" },
            { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20", gradient: "from-amber-500/20 to-amber-500/5" },
            { bg: "bg-indigo-500/10", text: "text-indigo-500", border: "border-indigo-500/20", gradient: "from-indigo-500/20 to-indigo-500/5" },
            { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20", gradient: "from-rose-500/20 to-rose-500/5" },
        ];
        return colors[index % colors.length];
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Resource Plans...</p>
            </div>
        );
    }

    return (
        <div className="pb-32 select-none">
            {/* Header */}
            <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 -mx-5 px-5">
                <button
                    onClick={() => navigate(-1)}
                    className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all"
                >
                    <ChevronLeft className="size-6" />
                </button>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Resource Plans</h2>
                <div className="size-11" />
            </div>

            <div className="mt-6 space-y-6 px-4">
                {/* Title */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black tracking-tighter">
                        Find the <span className="text-primary">Right Resource Plan</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                        Choose a plan to grow your business
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                            <Box className="size-12 text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No plans available at the moment</p>
                        </div>
                    ) : (
                        plans.map((plan, index) => {
                            const planId = plan._id || plan.id;
                            const Icon = getPlanIcon(plan.name);
                            const colors = getPlanColor(index);
                            const isActive = activePlanId === planId;

                            // Badges based on keywords
                            const isSpecial = plan.name.toLowerCase().includes("verification") || plan.name.toLowerCase().includes("all resources");
                            const isPopular = plan.description.toLowerCase().includes("popular") || plan.name.toLowerCase().includes("all resources");
                            const isBestValue = plan.description.toLowerCase().includes("best value") || plan.name.toLowerCase().includes("verification");

                            return (
                                <div
                                    key={planId}
                                    className={`bg-white rounded-[2.5rem] border-2 p-6 relative overflow-hidden transition-all hover:shadow-lg flex flex-col ${isActive
                                        ? "border-primary shadow-lg shadow-primary/10"
                                        : isPopular || isBestValue
                                            ? "border-primary/30 shadow-lg shadow-primary/10"
                                            : "border-slate-100"
                                        }`}
                                >
                                    {/* Background Gradient */}
                                    <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${colors.gradient} rounded-full blur-3xl opacity-50 -z-0`}></div>

                                    {(isPopular || isBestValue) && (
                                        <div className={`absolute top-0 right-0 ${isPopular ? "bg-blue-500" : "bg-primary"} text-white text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-bl-2xl z-20 shadow-lg`}>
                                            {isPopular ? "Most Popular" : "Best Value"}
                                        </div>
                                    )}

                                    {isActive && (
                                        <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-br-2xl z-20 shadow-lg flex items-center gap-1.5">
                                            <CheckCircle2 className="size-3" />
                                            Active Plan
                                        </div>
                                    )}

                                    <div className="space-y-4 relative z-10 flex-1 flex flex-col">
                                        {/* Plan Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-14 rounded-2xl ${colors.bg} flex items-center justify-center ${colors.text} shadow-lg`}>
                                                    <Icon className="size-7" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black tracking-tight leading-tight max-w-[200px]">{plan.name}</h3>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 min-h-[1rem]">
                                                        {plan.isActive ? "Instant Activation" : "Manual Verification"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-1 mt-2">
                                            <span className="text-4xl font-black text-slate-900">
                                                ₹{plan.price}
                                            </span>
                                            <span className="text-sm font-bold text-slate-400">
                                                / {plan.durationDays === 30 ? 'Month' : `${plan.durationDays} Days`}
                                            </span>
                                        </div>

                                        <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
                                            {plan.description}
                                        </p>

                                        {/* Features */}
                                        <ul className="space-y-3 pt-2 flex-1">
                                            {plan.features.map((feature, i) => {
                                                const isNotIncluded = feature.toLowerCase().includes("not included");

                                                return (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className={`size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isNotIncluded ? "bg-red-500/10" : "bg-green-500/10"}`}>
                                                            {isNotIncluded ? (
                                                                <XCircle className="size-3 text-red-500" />
                                                            ) : (
                                                                <CheckCircle2 className="size-3 text-green-500" />
                                                            )}
                                                        </div>
                                                        <span className={`text-sm font-bold leading-relaxed ${isNotIncluded ? "text-slate-400 line-through decoration-slate-400/50" : "text-slate-600"}`}>
                                                            {feature}
                                                        </span>
                                                    </li>
                                                )
                                            })}
                                        </ul>

                                        {/* Select Button */}
                                        <button
                                            onClick={() => handlePurchase(plan)}
                                            disabled={isActive || isProcessing === planId}
                                            className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 mt-6 border-2 ${isActive
                                                ? "bg-slate-100 border-slate-100 text-slate-400 cursor-default"
                                                : isPopular || isBestValue
                                                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                                    : plan.name.toLowerCase().includes("verification")
                                                        ? "bg-white border-slate-900 text-slate-900 hover:bg-slate-50"
                                                        : "bg-slate-900 border-slate-900 text-white"
                                                }`}
                                        >
                                            {isProcessing === planId ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    Processing...
                                                </div>
                                            ) : isActive ? (
                                                "Current Plan"
                                            ) : plan.name.toLowerCase().includes("verification") ? (
                                                "Verify Now"
                                            ) : (
                                                "Subscribe Now"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Info Note */}
                <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 text-center">
                    <p className="text-[10px] font-black text-blue-600 leading-relaxed uppercase tracking-widest">
                        💡 Grow your resource reach and visibility. Upgrade anytime to unlock more features!
                    </p>
                </div>
            </div>

            {/* Modern Bottom Navigation - Consistent with ResourceCategories */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[400px] z-50">
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] p-2 flex items-center justify-between">
                    {[
                        { id: "home", label: "Home", icon: Home, path: "/" },
                        { id: "profile", label: "Profile", icon: User, path: "/profile" },
                        { id: "payment", label: "Payment", icon: CreditCard, path: "/resource-plans" },
                        { id: "faq", label: "FAQ", icon: HelpCircle, path: "/resource-plans/faq" },
                    ].map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (!isAuthenticated && item.path === "/profile") {
                                        navigate("/login/resource");
                                    } else {
                                        navigate(item.path);
                                    }
                                }}
                                className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${isActive ? "text-primary bg-primary/10 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                <Icon className="size-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                {isActive && (
                                    <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ResourcePlans;
