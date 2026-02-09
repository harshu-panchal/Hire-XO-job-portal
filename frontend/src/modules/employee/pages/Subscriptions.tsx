import { Check, Zap, Sparkles, Rocket, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const PLANS = [
  {
    id: "15-day",
    name: "Standard",
    price: "₹23",
    duration: "15 Days",
    description: "Perfect for active employees",
    features: ["Priority Job Alerts", "Direct Message Employers", "Profile Visibility Boost"],
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
  },
  {
    id: "1-week",
    name: "Professional",
    price: "₹41",
    duration: "7 Days",
    description: "Intensive job hunting",
    features: ["All Standard features", "Mock Interviews", "Resume Review"],
    popular: true,
    icon: <Sparkles className="h-6 w-6 text-primary" />,
  },
  {
    id: "same-day",
    name: "Executive",
    price: "₹99",
    duration: "1 Day",
    description: "Urgent placement",
    features: ["Instant Verification", "Fast-track Applications", "Live Chat Support"],
    icon: <Rocket className="h-6 w-6 text-primary-dark" />,
  },
];

const Subscriptions = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const activePlanId = user?.activeSubscriptionId;

  return (
    <div className="py-8 space-y-10 select-none">
      <div className="flex items-center gap-4 px-4">
        <button
          onClick={() => navigate(-1)}
          className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all shadow-sm"
        >
          <ChevronLeft className="size-6" />
        </button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight leading-tight">
            Choose Your <span className="text-primary">Growth</span>
          </h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
            Premium features to accelerate your career
          </p>
        </div>
      </div>

      <div className="grid gap-8 pb-10">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-[3rem] p-8 border-2 transition-all duration-300 active:scale-[0.98] ${plan.popular
                ? "bg-slate-900 border-primary shadow-2xl shadow-primary/20 text-white"
                : "bg-white border-slate-200 text-slate-900"
              }`}
          >
            {plan.popular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-xl">
                Most Popular
              </div>
            )}

            <div className="flex justify-between items-start mb-8">
              <div>
                <h3
                  className={`text-2xl font-black tracking-tight ${plan.popular ? "text-white" : "text-slate-900"}`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className={`text-sm font-black uppercase tracking-widest opacity-40`}>
                    /month
                  </span>
                </div>
              </div>
              <div
                className={`p-4 rounded-3xl ${plan.popular ? "bg-primary/20 text-primary-light" : "bg-primary/10 text-primary"}`}
              >
                {plan.icon}
              </div>
            </div>

            <div className="space-y-5 mb-10">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div
                    className={`shrink-0 size-6 rounded-full flex items-center justify-center ${plan.popular ? "bg-primary/20 text-primary-light" : "bg-primary/10 text-primary"}`}
                  >
                    <Check className="size-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-black tracking-wide opacity-80">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                if (!user) {
                  navigate("/login/employee");
                  return;
                }
                // TODO: Implement subscription purchase API
                alert(`Successfully upgraded to ${plan.name} plan!`);
              }}
              className={`w-full py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] transition-all active:scale-90 shadow-xl ${activePlanId === plan.id
                  ? "bg-green-500 text-white shadow-green-500/20"
                  : plan.popular
                    ? "bg-white text-slate-900 shadow-white/10"
                    : "bg-primary text-white shadow-primary/20"
                }`}
            >
              {activePlanId === plan.id ? "Current Plan" : "Upgrade Now"}
            </button>
          </div>
        ))}
      </div>

      {/* Trust Badge */}
      <div className="flex flex-col items-center gap-4 py-6 px-8 rounded-[2rem] bg-slate-100 border border-slate-200 text-center">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="size-10 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-200"
            >
              <img
                src={`https://i.pravatar.cc/150?u=${i}`}
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="size-10 rounded-full border-4 border-slate-100 bg-primary flex items-center justify-center text-[10px] font-black text-white">
            +2k
          </div>
        </div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Joined by <span className="text-slate-900 font-black">2,400+</span>{" "}
          professionals this month
        </p>
      </div>
    </div>
  );
};

export default Subscriptions;
