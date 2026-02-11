import { useState, useEffect } from "react";
import { CheckCircle, ShieldCheck, Briefcase, Users, ChevronLeft, Loader2, Star, Zap, Globe, Package, Cpu, Hammer, Truck, Ship, Car, Box } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { subscriptionService } from "@/services/subscriptionService";
import type { SubscriptionPlan } from "@/types";
import { Home, User, CreditCard, HelpCircle, LogOut } from "lucide-react";

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
            // If guest, we should probably send them to resource signup or login
            toast.info("Please login or signup as a resource to subscribe");
            navigate("/login/resource");
            return;
        }

        const planId = plan._id || plan.id;
        if (!planId) return;

        setIsProcessing(planId);
        try {
            toast.info(`Processing subscription for ${plan.name}...`);
            await purchaseSubscription(planId);
            toast.success(`Successfully subscribed to ${plan.name}!`);
        } catch (error: any) {
            toast.error(error.message || "Failed to purchase subscription");
        } finally {
            setIsProcessing(null);
        }
    };

    const getPlanIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes("verification")) return <ShieldCheck className="h-6 w-6 text-purple-600" />;
        if (n.includes("tender")) return <Package className="h-6 w-6 text-blue-500" />;
        if (n.includes("investor")) return <Globe className="h-6 w-6 text-emerald-500" />;
        if (n.includes("equipment")) return <Hammer className="h-6 w-6 text-orange-500" />;
        if (n.includes("machinery")) return <Cpu className="h-6 w-6 text-slate-600" />;
        if (n.includes("pmc")) return <Briefcase className="h-6 w-6 text-cyan-600" />;
        if (n.includes("csm")) return <Star className="h-6 w-6 text-amber-500" />;
        if (n.includes("logistics")) return <Ship className="h-6 w-6 text-blue-700" />;
        if (n.includes("vehicles")) return <Car className="h-6 w-6 text-red-500" />;
        if (n.includes("all resources")) return <Zap className="h-6 w-6 text-indigo-600" />;
        return <Box className="h-6 w-6 text-slate-400" />;
    };

    const getPlanColor = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes("verification")) return "from-purple-500 to-indigo-600";
        if (n.includes("all resources")) return "from-blue-600 to-indigo-700";
        return "from-sky-400 to-blue-500";
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
        <div className="py-8 space-y-8 select-none bg-slate-50 min-h-screen pb-24">
            <div className="flex items-center gap-4 px-4 max-w-5xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all shadow-sm"
                >
                    <ChevronLeft className="size-6 text-slate-600" />
                </button>
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight leading-tight text-slate-900">
                        Resource <span className="text-primary">Subscription Plans</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        Choose a plan to grow your business
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-5xl mx-auto">
                {plans.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
                        <p className="text-slate-500 font-medium">No resource plans available at the moment.</p>
                    </div>
                ) : (
                    plans.map((plan) => {
                        const planId = plan._id || plan.id;
                        const isSpecial = plan.name.toLowerCase().includes("verification") || plan.name.toLowerCase().includes("all resources");
                        const isActive = activePlanId === planId;
                        const colorGradient = getPlanColor(plan.name);

                        return (
                            <div
                                key={planId}
                                className={`relative flex flex-col rounded-[2.5rem] overflow-hidden border bg-white transition-all duration-300 hover:shadow-xl group ${isActive ? "ring-2 ring-primary border-primary" : "border-slate-100"}`}
                            >
                                {/* Dynamic Header based on UI inspiration */}
                                <div className={`h-40 w-full bg-gradient-to-br ${colorGradient} p-8 flex flex-col items-center justify-center text-center relative`}>
                                    <div className="absolute top-0 left-0 w-full h-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="size-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30 shadow-inner">
                                        <div className="size-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                            {getPlanIcon(plan.name)}
                                        </div>
                                    </div>
                                    <h3 className="text-white font-black text-xl leading-none mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline text-white">
                                        <span className="text-3xl font-black">₹{plan.price}</span>
                                        <span className="text-xs font-bold opacity-80 ml-1">/{plan.durationDays === 30 ? 'Month' : `${plan.durationDays} Days`}</span>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="space-y-4 mb-8 flex-1">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <div className="shrink-0 mt-1">
                                                    {feature.toLowerCase().includes("not included") ? (
                                                        <div className="size-4 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                                                            <span className="text-red-500 font-black text-[10px]">×</span>
                                                        </div>
                                                    ) : (
                                                        <CheckCircle className="size-4 text-emerald-500" />
                                                    )}
                                                </div>
                                                <span className={`text-sm font-medium leading-tight ${feature.toLowerCase().includes("not included") ? "text-slate-400 line-through decoration-slate-300" : "text-slate-600"}`}>
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePurchase(plan)}
                                        className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-[0.1em] transition-all active:scale-95 shadow-lg ${isActive
                                            ? "bg-slate-100 text-slate-400 shadow-none cursor-default border border-slate-200"
                                            : isSpecial
                                                ? `bg-gradient-to-r ${colorGradient} text-white hover:brightness-110 shadow-blue-500/20`
                                                : "bg-sky-500 text-white hover:bg-sky-600 shadow-sky-500/20"
                                            }`}
                                        disabled={isActive || isProcessing === planId}
                                    >
                                        {isActive
                                            ? "Active Plan"
                                            : isProcessing === planId
                                                ? "Processing..."
                                                : plan.name.toLowerCase().includes("verification") ? "Get Verified" : "Subscribe Now"}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modern Bottom Navigation - Consistent with ResourceCategories */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[400px] z-50">
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] p-2 flex items-center justify-between">
                    {[
                        { id: "home", label: "Home", icon: Home, path: "/" },
                        { id: "profile", label: "Profile", icon: User, path: "/profile" },
                        { id: "payment", label: "Payment", icon: CreditCard, path: "/resource-plans" },
                        { id: "faq", label: "FAQ", icon: HelpCircle, path: "/faq" },
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
