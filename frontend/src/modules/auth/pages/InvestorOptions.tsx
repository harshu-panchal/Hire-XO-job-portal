import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

const InvestorOptions = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && user?.role === "resource" && user.profile.investorType) {
            if (user.profile.investorType === "want-to-invest") {
                navigate("/investor/browse/dashboard");
            } else if (user.profile.investorType === "want-investment") {
                navigate("/investor/seek/dashboard");
            }
        }
    }, [isAuthenticated, user, navigate]);

    const options = [
        {
            id: "want-to-invest",
            title: "Want to Invest",
            description: "I'm looking for investment opportunities",
            icon: TrendingUp,
            color: "from-green-500 to-emerald-600",
            bgColor: "bg-green-50 dark:bg-green-950/20",
            iconColor: "text-green-600 dark:text-green-400",
            dashboardPath: "/investor/browse/dashboard"
        },
        {
            id: "want-investment",
            title: "Want Investment",
            description: "I'm seeking funding for my business",
            icon: DollarSign,
            color: "from-blue-500 to-cyan-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            dashboardPath: "/investor/seek/dashboard"
        },
    ];

    const handleOptionClick = (option: typeof options[0]) => {
        if (isAuthenticated && user?.role === "resource") {
            navigate(option.dashboardPath);
        } else {
            navigate(`/signup/resource/investor?type=${option.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-background dark:via-slate-950 dark:to-background flex items-center justify-center p-5">
            <div className="w-full max-w-[430px]">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/resources/categories")}
                    className="mb-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="size-5" />
                    <span className="font-semibold">Back</span>
                </button>

                {/* Header */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl shadow-amber-500/20 mb-4">
                        <TrendingUp className="size-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter mb-2">Investor Options</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Choose your investment preference
                    </p>
                </div>

                {/* Option Cards */}
                <div className="space-y-4">
                    {options.map((option, index) => {
                        const Icon = option.icon;
                        return (
                            <Card
                                key={option.id}
                                onClick={() => handleOptionClick(option)}
                                className={`group cursor-pointer border-2 border-transparent hover:border-current transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden animate-in fade-in slide-in-from-bottom-4`}
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animationFillMode: "backwards",
                                }}
                            >
                                <div className="p-6 flex items-center gap-5">
                                    {/* Icon */}
                                    <div
                                        className={`${option.bgColor} size-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <Icon className={`size-8 ${option.iconColor}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black tracking-tight mb-1">
                                            {option.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {option.description}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg
                                            className="size-6 text-slate-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Gradient Border Effect */}
                                <div
                                    className={`h-1 bg-gradient-to-r ${option.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                                />
                            </Card>
                        );
                    })}
                </div>

                {/* Info */}
                <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl">
                    <p className="text-sm text-amber-900 dark:text-indigo-100 text-center">
                        {isAuthenticated && user?.role === "resource" ? (
                            <span><strong>Note:</strong> Select the module you want to access</span>
                        ) : (
                            <span><strong>Note:</strong> You'll need to create an account to access investment features</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InvestorOptions;
