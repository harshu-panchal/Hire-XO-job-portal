import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronLeft, ShieldCheck, Zap } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const Subscription = () => {
    const navigate = useNavigate();
    const { purchaseSubscription, user, isLoading } = useAuthStore();

    // Calculate expiry date if exists
    const isSubscribed = user?.profile?.subscriptionExpiry
        ? new Date(user.profile.subscriptionExpiry) > new Date()
        : false;

    const handleSubscribe = async () => {
        await purchaseSubscription();
        // No need to navigate, state update will reflect immediately
    };

    if (isSubscribed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-5 text-center select-none">
                {/* Header */}
                <div className="fixed top-0 left-0 right-0 flex items-center justify-between py-6 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 px-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    <h2 className="text-sm font-black uppercase tracking-widest">Subscription</h2>
                    <div className="size-11" />
                </div>

                <div className="size-32 rounded-[3rem] bg-green-500/10 flex items-center justify-center animate-bounce-subtle mb-8 mt-20">
                    <ShieldCheck className="size-16 text-green-500" />
                </div>
                <h1 className="text-3xl font-black tracking-tight mb-3">You are a Pro!</h1>
                <p className="text-slate-500 text-sm font-black leading-relaxed max-w-[280px] mx-auto mb-10">
                    Your subscription is active until <br />
                    <span className="text-primary">
                        {new Date(user!.profile.subscriptionExpiry!).toLocaleDateString()}
                    </span>
                </p>
                <button
                    onClick={() => navigate("/recruiter")}
                    className="h-16 w-full rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="pb-32 select-none">
            {/* Header */}
            <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 -mx-5 px-5">
                <button
                    onClick={() => navigate(-1)}
                    className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all"
                >
                    <ChevronLeft className="size-6" />
                </button>
                <h2 className="text-sm font-black uppercase tracking-widest">Upgrade Plan</h2>
                <div className="size-11" /> {/* Spacer */}
            </div>

            <div className="mt-6 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black tracking-tighter">
                        Unlock <span className="text-primary">Full Access</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                        Supercharge your hiring process
                    </p>
                </div>

                {/* Pricing Card */}
                <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-primary/20 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-bl-2xl">
                        Best Value
                    </div>

                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Zap className="size-8" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">Pro Recruiter</h3>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">₹999</span>
                                <span className="text-sm font-bold text-slate-400">/ 6 months</span>
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

                        <ul className="space-y-4 text-left w-full">
                            {[
                                "Contact Unlimited Candidates",
                                "Download Unlimited Resumes",
                                "Priority Job Listings",
                                "Verified Recruiter Badge"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="size-3 text-green-500" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 z-50">
                <button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="h-16 w-full rounded-3xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
                >
                    {isLoading ? "Processing..." : "Upgrade Now"}
                </button>
                <p className="text-[10px] text-center mt-4 text-slate-400 font-bold">
                    Secure processing. Cancel anytime.
                </p>
            </div>
        </div>
    );
};

export default Subscription;
