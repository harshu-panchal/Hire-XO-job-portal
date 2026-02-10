import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronLeft, ShieldCheck, Zap, Crown, Shield, XCircle, Star } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { subscriptionService } from "@/services/subscriptionService";
import type { SubscriptionPlan } from "@/types";
import { toast } from "sonner";

const Subscription = () => {
  const navigate = useNavigate();
  const { purchaseSubscription, user, isLoading: isAuthLoading } = useAuthStore();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await subscriptionService.getAllPlans();
        // Specifically remove only the 2nd, 3rd, and 4th options as requested
        // This keeps the 1st option and any main hiring plans that appear later
        setPlans(data.filter((_, index) => index === 0 || index >= 4));
      } catch (error: any) {
        console.error("Failed to fetch plans:", error);
        toast.error("Failed to load plans");
      } finally {
        setIsLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  // Calculate expiry date if exists
  const isSubscribed = user?.profile?.subscriptionExpiry
    ? new Date(user.profile.subscriptionExpiry) > new Date()
    : false;

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("premium")) return Star;
    if (name.includes("unlimited")) return Crown;
    if (name.includes("verification")) return ShieldCheck;
    if (name.includes("employees")) return Zap;
    return Shield;
  };

  const getPlanColor = (index: number) => {
    const colors = [
      { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20", gradient: "from-blue-500/20 to-blue-500/5" },
      { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20", gradient: "from-purple-500/20 to-purple-500/5" },
      { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20", gradient: "from-amber-500/20 to-amber-500/5" },
      { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/20", gradient: "from-green-500/20 to-green-500/5" },
    ];
    return colors[index % colors.length];
  };

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    // If it's the free plan, just navigate back
    const isFree = plan.price === 0 || plan.name.toLowerCase().includes("free");
    if (isFree) {
      toast.info("You're already on the free plan!");
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
    } catch (error: any) {
      toast.error(error.message || "Failed to upgrade subscription");
    } finally {
      setIsProcessing(false);
    }
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
          onClick={() => navigate(-1)}
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

            // Logic for badges based on description keywords from seed
            const isPopular = plan.description.toLowerCase().includes("popular");
            const isBestValue = plan.description.toLowerCase().includes("best value");
            const isVerification = plan.name.toLowerCase().includes("verification");

            return (
              <div
                key={plan.id || (plan as any)._id}
                className={`bg-white rounded-[2.5rem] border-2 p-6 relative overflow-hidden transition-all hover:shadow-lg ${isPopular || isBestValue
                  ? "border-primary/30 shadow-lg shadow-primary/10"
                  : "border-slate-200"
                  }`}
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${colors.gradient} rounded-full blur-3xl opacity-50 -z-0`}></div>

                {(isPopular || isBestValue) && (
                  <div className={`absolute top-0 right-0 ${isPopular ? "bg-blue-500" : "bg-primary"} text-white text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-bl-2xl z-10 shadow-lg`}>
                    {isPopular ? "Most Popular" : "Best Value"}
                  </div>
                )}

                <div className="space-y-4 relative z-10">
                  {/* Plan Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`size-14 rounded-2xl ${colors.bg} flex items-center justify-center ${colors.text} shadow-lg`}>
                        <Icon className="size-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black tracking-tight leading-tight max-w-[200px]">{plan.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {plan.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-black text-slate-900">
                      {isFree ? "FREE" : `₹${plan.price}`}
                    </span>
                    {!isFree && !isVerification && (
                      <span className="text-sm font-bold text-slate-400">
                        / Month
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 pt-2">
                    {plan.features.map((feature, i) => {
                      // Check if feature is "crossed out" style (convention: 'Resources access' in 'Only Employees' plan)
                      // Or simple text matching as per user requirement
                      const isCrossedOut = feature.toLowerCase().includes("resources access") && plan.name.toLowerCase().includes("only employees");

                      return (
                        <li key={i} className="flex items-start gap-3">
                          <div className={`size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isCrossedOut ? "bg-red-500/10" : "bg-green-500/10"}`}>
                            {isCrossedOut ? (
                              <XCircle className="size-3 text-red-500" />
                            ) : (
                              <CheckCircle2 className="size-3 text-green-500" />
                            )}
                          </div>
                          <span className={`text-sm font-bold leading-relaxed ${isCrossedOut ? "text-slate-400 line-through decoration-slate-400/50" : "text-slate-600"}`}>
                            {feature}
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  {/* Select Button */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isProcessing}
                    className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 mt-4 border-2 ${isPopular || isBestValue
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                      : isVerification
                        ? "bg-white border-slate-900 text-slate-900 hover:bg-slate-50"
                        : "bg-slate-900 border-slate-900 text-white"
                      }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : isVerification ? (
                      "Verify Now"
                    ) : (
                      "Get Started"
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

export default Subscription;
