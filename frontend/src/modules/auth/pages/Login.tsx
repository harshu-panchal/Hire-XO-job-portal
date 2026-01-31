import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/types";
import { useEffect } from "react";

const Login = () => {
    const navigate = useNavigate();
    const { role } = useParams<{ role: UserRole }>();
    const { login, isLoading, isAuthenticated, user } = useAuthStore();

    const roleConfig = {
        "job-seeker": {
            title: "Job Seeker",
            subtitle: "Welcome back, talent!",
            signupPath: "/signup/job-seeker",
            redirectPath: "/jobs",
            accent: "from-violet-500 to-purple-600",
            iconBg: "bg-violet-500/10 text-violet-600"
        },
        recruiter: {
            title: "Recruiter",
            subtitle: "Welcome back, hiring manager!",
            signupPath: "/signup/recruiter",
            redirectPath: "/recruiter",
            accent: "from-blue-500 to-cyan-600",
            iconBg: "bg-blue-500/10 text-blue-600"
        },
        resource: {
            title: "Resource Partner",
            subtitle: "Welcome back, partner!",
            signupPath: "/resources/categories",
            redirectPath: "/resources",
            accent: "from-emerald-500 to-teal-600",
            iconBg: "bg-emerald-500/10 text-emerald-600"
        },
        admin: {
            title: "Admin Panel",
            subtitle: "Accessing high-level control systems.",
            signupPath: "/signup/admin", // Usually admins don't signup here but for consistency
            redirectPath: "/admin",
            accent: "from-red-500 to-rose-700",
            iconBg: "bg-red-500/10 text-red-600"
        },
    };

    const config = roleConfig[role as UserRole] || roleConfig["job-seeker"];

    const getResourceRedirectPath = (user: any) => {
        if (user.role !== "resource") return config.redirectPath;

        const profile = user.profile;
        const category = profile.resourceCategory;

        // Investor
        if (category === "Investor") {
            if (profile.investorType === "want-to-invest") return "/investor/browse/dashboard";
            if (profile.investorType === "want-investment") return "/investor/seek/dashboard";
        }
        // Tenders
        if (category === "Tenders") {
            if (profile.tenderType === "provide-tenders") return "/tenders/provide/dashboard";
            if (profile.tenderType === "apply-for-tenders") return "/tenders/apply/dashboard";
        }
        // Equipments
        if (category === "Equipments") {
            if (profile.equipmentType === "rent-out-equipment") return "/equipments/provide/dashboard";
            if (profile.equipmentType === "rent-equipment") return "/equipments/rent/dashboard";
        }
        // Machinery
        if (category === "Machinery") {
            if (profile.machineryType === "provide-machinery") return "/machinery/sell/dashboard";
            if (profile.machineryType === "need-machinery") return "/machinery/buy/dashboard";
        }
        // PMC
        if (category === "PMC") {
            if (profile.pmcType === "offer-pmc-services") return "/pmc/provide/dashboard";
            if (profile.pmcType === "hire-pmc") return "/pmc/browse/dashboard";
        }
        // CSM
        if (category === "CSM") {
            if (profile.csmType === "offer-csm-services") return "/csm/provide/dashboard";
            if (profile.csmType === "hire-csm") return "/csm/browse/dashboard";
        }
        // Logistics
        if (category === "Logistics") {
            if (profile.logisticsType === "provide-logistics") return "/logistics/provide/dashboard";
            if (profile.logisticsType === "need-logistics") return "/logistics/browse/dashboard";
        }
        // Vehicles
        if (category === "Vehicles") {
            if (profile.vehicleType === "rent-out-vehicles") return "/vehicles/provide/dashboard";
            if (profile.vehicleType === "rent-vehicles") return "/vehicles/browse/dashboard";
        }

        return "/resources/categories";
    };

    useEffect(() => {
        if (isAuthenticated && user?.role === role) {
            navigate(getResourceRedirectPath(user));
        }
    }, [isAuthenticated, user, role, navigate]);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            await login({
                email: formData.email,
                password: formData.password,
                role: role as UserRole,
            });

            // Redirect based on user profile/role
            if (role === "resource") {
                navigate(getResourceRedirectPath(useAuthStore.getState().user));
            } else {
                navigate(config.redirectPath);
            }
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-background flex flex-col justify-center p-6">
            {/* Animated Background Elements */}
            <div className={`absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b ${config.accent.replace("to-", "to-transparent/0 ").replace("from-", "from-")}/10 rounded-b-[4rem] -z-10 transition-colors duration-500`} />
            <div className="absolute top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />

            <div className="w-full max-w-[400px] mx-auto space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                    <div className="size-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
                        <ArrowLeft className="size-4" />
                    </div>
                    <span className="text-sm font-semibold">Back to Roles</span>
                </button>

                {/* Header */}
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        {config.title} <span className="text-slate-400 font-normal">Login</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {config.subtitle}
                    </p>
                </div>

                {/* Login Form */}
                <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards delay-100">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                Email Address
                            </label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-primary' : 'text-slate-400'}`}>
                                    <Mail className="size-5" />
                                </div>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                Password
                            </label>
                            <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-primary' : 'text-slate-400'}`}>
                                    <Lock className="size-5" />
                                </div>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className="pl-12 pr-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in zoom-in-95 duration-200">
                                <p className="text-sm text-red-600 dark:text-red-400 font-bold text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Forgot Password */}
                        <div className="text-right">
                            <button type="button" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                                Forgot Password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full h-14 rounded-2xl text-base font-bold tracking-wide bg-gradient-to-r ${config.accent} hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Logging in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Login <ChevronRight className="size-5" />
                                </span>
                            )}
                        </Button>

                        {/* Signup Link */}
                        <div className="text-center pt-2">
                            <p className="text-sm font-medium text-slate-500">
                                New here?{" "}
                                <Link to={config.signupPath} className="text-primary font-bold hover:underline">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
