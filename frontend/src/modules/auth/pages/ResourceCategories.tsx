import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, FileText, Package, Cog, Truck, Car, HardHat, Building, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import type { ResourceCategory } from "@/types";

const ResourceCategories = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuthStore();

    const categories: Array<{
        id: ResourceCategory;
        title: string;
        description: string;
        icon: React.ElementType;
        color: string;
        bgColor: string;
        iconColor: string;
    }> = [
            {
                id: "Investor",
                title: "Investor",
                description: "Investment opportunities and funding",
                icon: TrendingUp,
                color: "from-amber-500 to-orange-600",
                bgColor: "bg-amber-50 dark:bg-amber-950/20",
                iconColor: "text-amber-600 dark:text-amber-400",
            },
            {
                id: "Tenders",
                title: "Tenders",
                description: "Government and private tenders",
                icon: FileText,
                color: "from-violet-500 to-purple-600",
                bgColor: "bg-violet-50 dark:bg-violet-950/20",
                iconColor: "text-violet-600 dark:text-violet-400",
            },
            {
                id: "Equipments",
                title: "Equipments",
                description: "Construction and industrial equipment",
                icon: Package,
                color: "from-green-500 to-emerald-600",
                bgColor: "bg-green-50 dark:bg-green-950/20",
                iconColor: "text-green-600 dark:text-green-400",
            },
            {
                id: "Machinery",
                title: "Machinery",
                description: "Heavy machinery and tools",
                icon: Cog,
                color: "from-slate-500 to-gray-600",
                bgColor: "bg-slate-50 dark:bg-slate-950/20",
                iconColor: "text-slate-600 dark:text-slate-400",
            },
            {
                id: "PMC",
                title: "PMC",
                description: "Project Management Consultancy",
                icon: Building,
                color: "from-indigo-500 to-blue-600",
                bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
                iconColor: "text-indigo-600 dark:text-indigo-400",
            },
            {
                id: "CSM",
                title: "CSM",
                description: "Construction Supervision Management",
                icon: HardHat,
                color: "from-rose-500 to-pink-600",
                bgColor: "bg-rose-50 dark:bg-rose-950/20",
                iconColor: "text-rose-600 dark:text-rose-400",
            },
            {
                id: "Logistics",
                title: "Logistics",
                description: "Transportation and supply chain",
                icon: Truck,
                color: "from-orange-500 to-red-600",
                bgColor: "bg-orange-50 dark:bg-orange-950/20",
                iconColor: "text-orange-600 dark:text-orange-400",
            },
            {
                id: "Vehicles",
                title: "Vehicles",
                description: "Vehicle rental and services",
                icon: Car,
                color: "from-blue-500 to-cyan-600",
                bgColor: "bg-blue-50 dark:bg-blue-950/20",
                iconColor: "text-blue-600 dark:text-blue-400",
            },
        ];

    const handleCategoryClick = (category: ResourceCategory) => {
        // All categories now have sub-options, route to category-specific options page
        navigate(`/resources/${category.toLowerCase()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-background dark:via-slate-950 dark:to-background py-8 px-5">
            <div className="w-full max-w-[430px] mx-auto">
                <div className="flex items-center justify-between mb-6">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="size-5" />
                        <span className="font-semibold">Back to Roles</span>
                    </button>

                    {/* Logout Button */}
                    {isAuthenticated && (
                        <button
                            onClick={() => {
                                logout();
                                navigate("/");
                            }}
                            className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold transition-colors"
                        >
                            <LogOut className="size-4" />
                            <span>Logout</span>
                        </button>
                    )}
                </div>

                {/* Header */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/20 mb-4">
                        <Package className="size-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter mb-2">Resource Categories</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Select your business category
                    </p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <Card
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={`group cursor-pointer border-2 border-transparent hover:border-current transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden animate-in fade-in slide-in-from-bottom-4`}
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                    animationFillMode: "backwards",
                                }}
                            >
                                <div className="p-5 flex flex-col items-center text-center gap-3">
                                    {/* Icon */}
                                    <div
                                        className={`${category.bgColor} size-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <Icon className={`size-7 ${category.iconColor}`} />
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h3 className="text-base font-black tracking-tight mb-1">
                                            {category.title}
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Gradient Border Effect */}
                                <div
                                    className={`h-1 bg-gradient-to-r ${category.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                                />
                            </Card>
                        );
                    })}
                </div>

                {/* Info */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl">
                    <p className="text-sm text-blue-900 dark:text-blue-100 text-center">
                        <strong>Note:</strong> Select the category that best matches your business needs
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResourceCategories;
