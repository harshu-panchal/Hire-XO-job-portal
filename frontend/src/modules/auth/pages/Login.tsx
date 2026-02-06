import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Briefcase,
  Building2,
  Package,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/types";

const Login = () => {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();
  const { login, logout, isLoading, isAuthenticated, user, clearError } = useAuthStore();

  const roleConfig: Record<string, any> = {
    employee: {
      title: "Employee",
      subtitle: "Welcome back, talent!",
      signupPath: "/signup/employee",
      redirectPath: "/jobs",
      accent: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-500/10 text-violet-600",
      icon: Briefcase,
    },
    employer: {
      title: "Employer",
      subtitle: "Welcome back, hiring manager!",
      signupPath: "/signup/employer",
      redirectPath: "/employer",
      accent: "from-blue-500 to-cyan-600",
      iconBg: "bg-blue-500/10 text-blue-600",
      icon: Building2,
    },
    resource: {
      title: "Resource Partner",
      subtitle: "Welcome back, partner!",
      signupPath: "/resources/categories",
      redirectPath: "/resources/categories",
      accent: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-500/10 text-emerald-600",
      icon: Package,
    },
    admin: {
      title: "Admin Panel",
      subtitle: "Accessing high-level control systems.",
      signupPath: "/signup/admin",
      redirectPath: "/admin",
      accent: "from-red-500 to-rose-700",
      iconBg: "bg-red-500/10 text-red-600",
      icon: ShieldCheck,
    },
  };

  // Robust role detection
  const roleId = role?.toLowerCase() || "employee";
  const currentRole = roleConfig[roleId] ? (roleId as UserRole) : "employee";
  const config = roleConfig[currentRole];

  const getResourceRedirectPath = (u: any) => {
    if (!u) return "/";
    if (u.role !== "resource") {
      const pathMap: Record<string, string> = {
        employee: "/jobs",
        employer: "/employer",
        admin: "/admin",
      };
      return pathMap[u.role] || "/";
    }

    const profile = u.profile;
    const category = (profile?.category || profile?.resourceCategory)?.toLowerCase();

    if (!category) return "/resources/categories";

    const resourcePaths: Record<string, string> = {
      investor:
        profile?.investorType === "want-to-invest"
          ? "/investor/browse/dashboard"
          : "/investor/seek/dashboard",
      tenders:
        profile?.tenderType === "apply-for-tenders"
          ? "/tenders/apply/dashboard"
          : "/tenders/provide/dashboard",
      equipments:
        profile?.equipmentType === "rent-equipment"
          ? "/equipments/rent/dashboard"
          : "/equipments/provide/dashboard",
      machinery:
        profile?.machineryType === "need-machinery"
          ? "/machinery/buy/dashboard"
          : "/machinery/sell/dashboard",
      pmc: profile?.pmcType === "hire-pmc" ? "/pmc/browse/dashboard" : "/pmc/provide/dashboard",
      csm: profile?.csmType === "hire-csm" ? "/csm/browse/dashboard" : "/csm/provide/dashboard",
      logistics:
        profile?.logisticsType === "need-logistics"
          ? "/logistics/browse/dashboard"
          : "/logistics/provide/dashboard",
      vehicles:
        profile?.vehicleType === "rent-vehicles"
          ? "/vehicles/browse/dashboard"
          : "/vehicles/provide/dashboard",
    };

    return resourcePaths[category] || "/resources/categories";
  };

  // ... (roleConfig remains same, assumed to be outside or before this block in context, but we are just replacing the useEffect)

  useEffect(() => {
    if (isAuthenticated && user) {
      // If user is already logged in with the SAME role, redirect to their dashboard
      if (user.role === currentRole) {
        navigate(getResourceRedirectPath(user));
      } else {
        // If user is logged in with a DIFFERENT role, logout to allow switching
        // This prevents "stuck" sessions where clicking "Employer" just redirects back to "Employee" dashboard
        logout();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.role, currentRole, logout]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [roleMismatch, setRoleMismatch] = useState<{
    actual: string;
    target: string;
    user: any;
  } | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!formData.email || !formData.password) {
      setLocalError("Please fill in all fields");
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
        role: currentRole,
      });

      const updatedUser = useAuthStore.getState().user;

      // Handle Role Mismatch
      if (updatedUser && updatedUser.role !== currentRole) {
        const actual = roleConfig[updatedUser.role as string]?.title || updatedUser.role;
        const target = roleConfig[currentRole]?.title || currentRole;

        // Set state to show the mismatch UI
        setRoleMismatch({
          actual,
          target,
          user: updatedUser,
        });
        return; // Stop auto-redirect
      }

      // If roles match, proceed to dashboard
      if (updatedUser) {
        navigate(getResourceRedirectPath(updatedUser));
      }
    } catch (err: any) {
      setLocalError(err.message || "Invalid email or password");
    }
  };

  const handleContinueToDashboard = () => {
    if (roleMismatch?.user) {
      navigate(getResourceRedirectPath(roleMismatch.user));
    }
  };

  const handleLogoutAndSwitch = async () => {
    await logout();
    setRoleMismatch(null);
    setFormData({ email: "", password: "" });
  };

  const Icon = config.icon;

  if (roleMismatch) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-slate-50 flex flex-col justify-center p-6 text-slate-900">
        <div
          className={`absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b ${config.accent} opacity-5 rounded-b-[4rem] -z-10`}
        />

        <div className="w-full max-w-[400px] mx-auto space-y-6">
          <Card className="border-0 bg-white/90 backdrop-blur-xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="size-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="size-8" />
            </div>

            <h2 className="text-xl font-black text-slate-900 mb-2">
              Account Role Mismatch
            </h2>

            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              You logged in with a{" "}
              <strong className="text-slate-900">{roleMismatch.actual}</strong>{" "}
              account, but you are on the{" "}
              <strong className="text-slate-900">{roleMismatch.target}</strong>{" "}
              portal.
            </p>

            <div className="space-y-3">
              <Button
                onClick={handleContinueToDashboard}
                className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold hover:opacity-90 transition-all"
              >
                Continue to {roleMismatch.actual} Dashboard
              </Button>

              <Button
                onClick={handleLogoutAndSwitch}
                variant="outline"
                className="w-full h-12 rounded-xl border-dashed border-slate-300 font-bold text-slate-600 hover:bg-slate-50"
              >
                Logout & Try Different Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 flex flex-col justify-center p-6 text-slate-900">
      {/* Animated Background Gradient */}
      <div
        className={`absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b ${config.accent} opacity-5 rounded-b-[4rem] -z-10 transition-colors duration-500`}
      />

      <div className="w-full max-w-[400px] mx-auto space-y-6">
        {/* Back Link */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <div className="size-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
            <ArrowLeft className="size-4" />
          </div>
          <span className="text-sm font-semibold">Back to Roles</span>
        </button>

        {/* Role Header */}
        <div className="text-center space-y-3">
          <div
            className={`inline-flex items-center justify-center size-16 rounded-2xl ${config.iconBg} shadow-xl shadow-current/5 mb-2 mx-auto scale-in duration-500`}
          >
            <Icon className="size-8" />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-black tracking-tight">
              {config.title} <span className="text-slate-400 font-normal">Login</span>
            </h1>
            <p className="text-slate-500 font-medium">{config.subtitle}</p>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div
                className={`relative group transition-all duration-300 ${focusedField === "email" ? "scale-[1.02]" : ""}`}
              >
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "email" ? "text-primary" : "text-slate-400"}`}
                >
                  <Mail className="size-5" />
                </div>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Password
              </label>
              <div
                className={`relative group transition-all duration-300 ${focusedField === "password" ? "scale-[1.02]" : ""}`}
              >
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "password" ? "text-primary" : "text-slate-400"}`}
                >
                  <Lock className="size-5" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="pl-12 pr-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {localError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in zoom-in-95 duration-200">
                <p className="text-sm text-red-600 font-bold text-center">
                  {localError}
                </p>
              </div>
            )}

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full h-14 rounded-2xl text-base font-bold tracking-wide bg-gradient-to-r ${config.accent} hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] outline-none border-none`}
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
