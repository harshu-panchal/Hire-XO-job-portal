import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

const TenderOptions = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && user?.role === "resource" && user.profile.tenderType) {
            if (user.profile.tenderType === "provide-tenders") {
                navigate("/tenders/provide/dashboard");
            } else if (user.profile.tenderType === "apply-for-tenders") {
                navigate("/tenders/apply/dashboard");
            }
        }
    }, [isAuthenticated, user, navigate]);

    const options = [
        {
            id: "provide-tenders",
            title: "Provide Tenders",
            description: "Post tender opportunities for contractors and vendors",
            icon: FileText,
            color: "from-violet-500 to-purple-600",
            bgColor: "bg-violet-50 dark:bg-violet-950/20",
            iconColor: "text-violet-600 dark:text-violet-400",
            dashboardPath: "/tenders/provide/dashboard"
        },
        {
            id: "apply-for-tenders",
            title: "Apply for Tenders",
            description: "Find and apply for tender opportunities",
            icon: Search,
            color: "from-purple-500 to-indigo-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/20",
            iconColor: "text-purple-600 dark:text-purple-400",
            dashboardPath: "/tenders/apply/dashboard"
        },
    ];

    const handleOptionClick = (option: typeof options[0]) => {
        if (isAuthenticated && user?.role === "resource") {
            navigate(option.dashboardPath);
        } else {
            navigate(`/signup/resource/tenders?type=${option.id}`);
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
                    <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-xl shadow-violet-500/20 mb-4">
                        <FileText className="size-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter mb-2">Tender Options</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Choose your tender preference
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
                <div className="mt-8 p-4 bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900 rounded-xl">
                    <p className="text-sm text-violet-900 dark:text-indigo-100 text-center">
                        {isAuthenticated && user?.role === "resource" ? (
                            <span><strong>Note:</strong> Select the module you want to access</span>
                        ) : (
                            <span><strong>Note:</strong> Select the option that best matches your tender needs</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TenderOptions;
