import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  FileText,
  Package,
  Cog,
  Truck,
  Car,
  HardHat,
  Building,
  LogOut,
  Home,
  User,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import type { ResourceCategory } from "@/types";

const ResourceCategories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("categories");

  // Handle session management
  useEffect(() => {
    if (isAuthenticated && user && user.role !== "resource") {
      // If logged in as Employee or Employer, logout to allow Resource signup
      logout();
    }
  }, [isAuthenticated, user, logout]);

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
        bgColor: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        id: "Tenders",
        title: "Tenders",
        description: "Government and private tenders",
        icon: FileText,
        color: "from-violet-500 to-purple-600",
        bgColor: "bg-violet-50",
        iconColor: "text-violet-600",
      },
      {
        id: "Equipments",
        title: "Equipments",
        description: "Construction and industrial equipment",
        icon: Package,
        color: "from-green-500 to-emerald-600",
        bgColor: "bg-green-50",
        iconColor: "text-green-600",
      },
      {
        id: "Machinery",
        title: "Machinery",
        description: "Heavy machinery and tools",
        icon: Cog,
        color: "from-slate-500 to-gray-600",
        bgColor: "bg-slate-50",
        iconColor: "text-slate-600",
      },
      {
        id: "PMC",
        title: "PMC",
        description: "Project Management Consultancy",
        icon: Building,
        color: "from-indigo-500 to-blue-600",
        bgColor: "bg-indigo-50",
        iconColor: "text-indigo-600",
      },
      {
        id: "CSM",
        title: "CSM",
        description: "Construction Supervision Management",
        icon: HardHat,
        color: "from-rose-500 to-pink-600",
        bgColor: "bg-rose-50",
        iconColor: "text-rose-600",
      },
      {
        id: "Logistics",
        title: "Logistics",
        description: "Transportation and supply chain",
        icon: Truck,
        color: "from-orange-500 to-red-600",
        bgColor: "bg-orange-50",
        iconColor: "text-orange-600",
      },
      {
        id: "Vehicles",
        title: "Vehicles",
        description: "Vehicle rental and services",
        icon: Car,
        color: "from-blue-500 to-cyan-600",
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
      },
    ];

  const handleCategoryClick = (category: ResourceCategory) => {
    // All categories now have sub-options, route to category-specific options page
    navigate(`/resources/${category.toLowerCase()}`);
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
    { id: "payment", label: "Payment", icon: CreditCard, path: "/resource-plans" },
    { id: "faq", label: "FAQ", icon: HelpCircle, path: "/resource-plans/faq" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-5 pb-32">
      <div className="w-full max-w-[430px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
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
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold tracking-wider mb-4 border border-blue-200">
            STEP 1 of 3: CATEGORY SELECTION
          </span>
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/20">
              <Package className="size-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">Resource Categories</h1>
          <p className="text-slate-600">
            Select your business category to create your account
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
                    <h3 className="text-base font-black tracking-tight mb-1">{category.title}</h3>
                    <p className="text-xs text-slate-600 leading-snug">
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
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-8">
          <p className="text-sm text-blue-900 text-center">
            <strong>Note:</strong> Select the category that best matches your business needs
          </p>
        </div>
      </div>

      {/* Modern Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[400px] z-50">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] p-2 flex items-center justify-between">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!isAuthenticated && item.path === "/profile") {
                    // Check if we should send to signup or login
                    // User requested "if account is not created it should ask for resource signup"
                    // Default to Login, which links to Signup. 
                    // Or we could send to a generic Resource Signup if they click Profile? 
                    // Usually Profile -> Login. Payment -> Login.
                    navigate("/login/resource");
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${isActive ? "text-primary bg-primary/10 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <Icon className={`size-5 ${isActive ? "animate-bounce-short" : ""}`} />
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

export default ResourceCategories;
