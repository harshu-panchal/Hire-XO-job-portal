import { useState, useEffect } from "react";
import { CheckCircle, ShieldCheck, Briefcase, Users, ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { subscriptionService } from "@/services/subscriptionService";
import type { SubscriptionPlan } from "@/types";

const Subscriptions = () => {
  const navigate = useNavigate();
  const { user, purchaseSubscription } = useAuthStore();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const activePlanId = user?.activeSubscriptionId;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await subscriptionService.getAllPlans('job-seeker');
        setPlans(data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        toast.error("Failed to load certificates");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePurchase = async (plan: SubscriptionPlan) => {
    if (!user) {
      navigate("/login/employee");
      return;
    }

    const planId = plan._id || plan.id;
    if (!planId) return;

    setIsProcessing(planId);
    try {
      // For demo/simplicity, we might need to check balance first, 
      // but let's assume the user has balance or the purchaseSubscription logic handles it.
      // Based on previous code, we simulate payment then activate.

      toast.info(`Processing payment for ${plan.name}...`);

      // In a real flow, we'd recharge if needed, but here we just call purchase.
      // Assuming purchaseSubscription in useAuthStore handles the API call and state update.
      await purchaseSubscription(planId);

      toast.success(`Successfully activated ${plan.name}!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to purchase certificate");
    } finally {
      setIsProcessing(null);
    }
  };

  const getPlanIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("verification")) return <ShieldCheck className="h-6 w-6 text-blue-600" />;
    if (n.includes("job loss")) return <Briefcase className="h-6 w-6 text-sky-500" />;
    return <Users className="h-6 w-6 text-indigo-600" />;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Certificates...</p>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8 select-none bg-slate-50 min-h-screen">
      <div className="flex items-center gap-4 px-4">
        <button
          onClick={() => navigate(-1)}
          className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all shadow-sm"
        >
          <ChevronLeft className="size-6 text-slate-600" />
        </button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight leading-tight text-slate-900">
            Employee Support <span className="text-primary">Certificates</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
            Secure your career with premium coverage
          </p>
        </div>
      </div>

      <div className="grid gap-6 pb-24 px-4 overflow-y-auto">
        {plans.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-medium">No certificates available at the moment.</p>
          </div>
        ) : (
          plans.map((plan) => {
            const planId = plan._id || plan.id;
            const isBestValue = plan.description.toLowerCase().includes("best value") || plan.name.toLowerCase().includes("emergency");
            const isActive = activePlanId === planId;

            return (
              <div
                key={planId}
                className={`relative rounded-[2rem] p-6 border transition-all duration-300 ${isBestValue
                  ? "bg-white border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/50"
                  : "bg-white border-slate-200 shadow-sm hover:shadow-md"
                  }`}
              >
                {isBestValue && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                    Best Value
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${isBestValue ? "bg-blue-50" : "bg-slate-50"
                    }`}>
                    {getPlanIcon(plan.name)}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 block">₹{plan.price}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{plan.durationDays} Days</span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight">
                  {plan.name}
                </h3>
                <p className={`text-xs font-bold mb-6 leading-relaxed ${isBestValue ? "text-blue-600" : "text-slate-500"
                  }`}>
                  {plan.description}
                </p>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <CheckCircle className={`size-3.5 ${isBestValue ? "text-blue-500" : "text-green-500"
                          }`} />
                      </div>
                      <span className="text-xs font-medium text-slate-600 leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePurchase(plan)}
                  className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.1em] transition-all active:scale-95 shadow-lg ${isActive
                    ? "bg-green-500 text-white shadow-green-500/20 cursor-default"
                    : isBestValue
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                      : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10"
                    }`}
                  disabled={isActive || isProcessing === planId}
                >
                  {isActive
                    ? "Active Certificate"
                    : isProcessing === planId
                      ? "Processing..."
                      : "Get Certificate"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
