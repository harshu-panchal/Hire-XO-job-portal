import { useState } from "react";
import { CheckCircle, ShieldCheck, Briefcase, Users, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const PLANS = [
  {
    id: "emp-verify",
    name: "Employee Verification Certificate",
    tagline: "Verified Employee – Identity & Profile Checked",
    price: "₹99",
    duration: "6 Months",
    features: [
      "Employee identity verification",
      "Verified badge on employee profile",
      "Builds trust with employers & resource providers",
      "Higher chances of selection"
    ],
    icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
    contactHidden: false,
    bestValue: false,
  },
  {
    id: "job-loss",
    name: "Job Loss Cover Certificate",
    tagline: "Job Loss Support – We Help You Get Re-Hired Faster",
    price: "₹99",
    duration: "6 Months",
    features: [
      "If employee loses job due to project closure or employer issue",
      "Platform helps employee find a new job opportunity",
      "Priority support from hub team",
      "Reduced waiting time for next job"
    ],
    icon: <Briefcase className="h-6 w-6 text-sky-500" />,
    contactHidden: false,
    bestValue: false,
  },
  {
    id: "emergency-support",
    name: "Emergency Replacement Support Certificate",
    tagline: "Emergency Support – Managed Replacement & Re-Joining Assistance",
    price: "₹199",
    duration: "6 Months",
    features: [
      "If employee needs to go home due to emergency",
      "Platform coordinates with hub employers",
      "Replacement employee arranged as per employer requirement",
      "Employer project continuity maintained",
      "Employee can re-join later if required"
    ],
    icon: <Users className="h-6 w-6 text-indigo-600" />,
    contactHidden: false,
    bestValue: true,
  },
];

const Subscriptions = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const activePlanId = user?.activeSubscriptionId;

  const handlePurchase = (plan: typeof PLANS[0]) => {
    if (!user) {
      navigate("/login/employee");
      return;
    }

    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: 'Processing payment...',
      success: `Successfully purchased ${plan.name}!`,
      error: 'Payment failed'
    });
  };

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
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-[2rem] p-6 border transition-all duration-300 ${plan.bestValue
              ? "bg-white border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/50"
              : "bg-white border-slate-200 shadow-sm hover:shadow-md"
              }`}
          >
            {plan.bestValue && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                Best Value
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${plan.bestValue ? "bg-blue-50" : "bg-slate-50"
                }`}>
                {plan.icon}
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 block">{plan.price}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{plan.duration}</span>
              </div>
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight">
              {plan.name}
            </h3>
            <p className={`text-xs font-bold mb-6 leading-relaxed ${plan.bestValue ? "text-blue-600" : "text-slate-500"
              }`}>
              {plan.tagline}
            </p>

            <div className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <CheckCircle className={`size-3.5 ${plan.bestValue ? "text-blue-500" : "text-green-500"
                      }`} />
                  </div>
                  <span className="text-xs font-medium text-slate-600 leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handlePurchase(plan)}
              className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.1em] transition-all active:scale-95 shadow-lg ${activePlanId === plan.id
                ? "bg-green-500 text-white shadow-green-500/20 cursor-default"
                : plan.bestValue
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10"
                }`}
              disabled={activePlanId === plan.id}
            >
              {activePlanId === plan.id ? "Active Certificate" : "Get Certificate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
