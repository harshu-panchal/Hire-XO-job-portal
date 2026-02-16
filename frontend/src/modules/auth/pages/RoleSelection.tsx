import { useNavigate } from "react-router-dom";
import { Briefcase, Building2, Package, ArrowRight, User, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import logo from "@/assets/logo.png";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const getResourceRedirectPath = (user: any) => {
    const profile = user.profile;
    const category = (profile?.category || profile?.resourceCategory)?.toLowerCase();

    if (!category) return "/resources/categories";

    // Map resource types to their browse/provide paths
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

  // We removed the auto-redirect useEffect to allow users to switch roles or logout from this page.

  const handleRoleClick = (roleId: string, rolePath: string) => {
    if (isAuthenticated && user?.role === roleId) {
      const redirectPaths: Record<string, string> = {
        employee: "/jobs",
        employer: "/employer",
        admin: "/admin",
        resource: getResourceRedirectPath(user),
      };
      navigate(redirectPaths[roleId] || rolePath);
    } else {
      navigate(rolePath);
    }
  };

  const roles = [
    {
      id: "employee",
      title: "Employee",
      description: "Find your potential",
      icon: Briefcase,
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-500/10 to-purple-600/10",
      iconColor: "text-violet-600",
      path: "/jobs",
      delay: "0ms",
    },
    {
      id: "employer",
      title: "Employer",
      description: "Hire top talent",
      icon: Building2,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-600/10",
      iconColor: "text-blue-600",
      path: "/employer",
      delay: "100ms",
    },
    {
      id: "resource",
      title: "Resources",
      description: "Business partnerships",
      icon: Package,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-600/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      path: "/resources/categories",
      delay: "200ms",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-white flex flex-col justify-center p-6">
      <div className="w-full max-w-[400px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <img
            src={logo}
            alt="HireXO"
            className="w-48 h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Status indicator / Logout if logged in */}
        {isAuthenticated && user && (
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-slate-200 flex items-center justify-between animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary">
                  Logged in as
                </p>
                <p className="text-sm font-bold text-slate-700 capitalize">
                  {user.role.replace("-", " ")}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 p-2 hover:bg-red-500/10 rounded-xl text-red-500 transition-colors active:scale-95"
            >
              <LogOut className="size-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
            </button>
          </div>
        )}

        {/* Cards */}
        <div className="space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleClick(role.id, role.path)}
                className="w-full group relative animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
                style={{ animationDelay: role.delay }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10" />

                <Card className="relative overflow-hidden border-0 bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 p-1">
                  <div className="p-4 flex items-center gap-5">
                    <div
                      className={`size-14 rounded-2xl bg-gradient-to-br ${role.bgGradient} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`size-7 ${role.iconColor}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">
                        {role.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-500">
                        {role.description}
                      </p>
                    </div>
                    <div className="size-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <ArrowRight className="size-4" />
                    </div>
                  </div>

                  {/* Bottom Gradient Line */}
                  <div
                    className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                </Card>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            v1.0.4
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/terms")}
              className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors cursor-pointer"
            >
              Terms
            </button>
            <span className="size-1 rounded-full bg-slate-300" />
            <button
              onClick={() => navigate("/privacy")}
              className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors cursor-pointer"
            >
              Privacy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
