import { useNavigate } from "react-router-dom";
import { ArrowLeft, Car, Key } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

const VehicleOptions = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && user?.role === "resource" && user.profile.vehicleType) {
            if (user.profile.vehicleType === "rent-out-vehicles") {
                navigate("/vehicles/provide/dashboard");
            } else if (user.profile.vehicleType === "rent-vehicles") {
                navigate("/vehicles/browse/dashboard");
            }
        }
    }, [isAuthenticated, user, navigate]);

    const options = [
        {
            id: "rent-out-vehicles",
            title: "Rent Out Vehicles",
            description: "List your vehicles for rental",
            icon: Car,
            color: "from-blue-500 to-cyan-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            dashboardPath: "/vehicles/provide/dashboard"
        },
        {
            id: "rent-vehicles",
            title: "Rent Vehicles",
            description: "Find vehicles to rent for your needs",
            icon: Key,
            color: "from-cyan-500 to-teal-600",
            bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
            iconColor: "text-cyan-600 dark:text-cyan-400",
            dashboardPath: "/vehicles/browse/dashboard"
        },
    ];

    const handleOptionClick = (option: typeof options[0]) => {
        if (isAuthenticated && user?.role === "resource") {
            navigate(option.dashboardPath);
        } else {
            navigate(`/signup/resource/vehicles?type=${option.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-background dark:via-slate-950 dark:to-background flex items-center justify-center p-5">
            <div className="w-full max-w-[430px]">
                <button
                    onClick={() => navigate("/resources/categories")}
                    className="mb-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="size-5" />
                    <span className="font-semibold">Back</span>
                </button>

                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-4">
                        <Car className="size-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter mb-2">Vehicle Options</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Choose your vehicle preference
                    </p>
                </div>

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
                                    <div
                                        className={`${option.bgColor} size-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <Icon className={`size-8 ${option.iconColor}`} />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-black tracking-tight mb-1">
                                            {option.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {option.description}
                                        </p>
                                    </div>

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

                                <div
                                    className={`h-1 bg-gradient-to-r ${option.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                                />
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl">
                    <p className="text-sm text-blue-900 dark:text-indigo-100 text-center">
                        {isAuthenticated && user?.role === "resource" ? (
                            <span><strong>Note:</strong> Select the module you want to access</span>
                        ) : (
                            <span><strong>Note:</strong> Select the option that best matches your vehicle needs</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VehicleOptions;
