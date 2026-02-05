import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children?: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    verifyAuth();
  }, [checkAuth]);

  // Show loading while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPaths: Record<string, string> = {
      employee: "/jobs",
      employer: "/employer",
      admin: "/admin",
      resource: getResourceRedirectPath(user),
    };
    return <Navigate to={redirectPaths[user.role] || "/"} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

// Helper function to determine resource redirect path based on user profile
function getResourceRedirectPath(user: any): string {
  const category = (user.profile?.category || user.profile?.resourceCategory)?.toLowerCase();

  // Map resource types to their browse/provide paths
  const resourcePaths: Record<string, string> = {
    investor:
      user.profile?.investorType === "want-to-invest"
        ? "/investor/browse/dashboard"
        : "/investor/seek/dashboard",
    tenders:
      user.profile?.tenderType === "apply-for-tenders"
        ? "/tenders/apply/dashboard"
        : "/tenders/provide/dashboard",
    equipments:
      user.profile?.equipmentType === "rent-equipment"
        ? "/equipments/rent/dashboard"
        : "/equipments/provide/dashboard",
    machinery:
      user.profile?.machineryType === "need-machinery"
        ? "/machinery/buy/dashboard"
        : "/machinery/sell/dashboard",
    pmc: user.profile?.pmcType === "hire-pmc" ? "/pmc/browse/dashboard" : "/pmc/provide/dashboard",
    csm: user.profile?.csmType === "hire-csm" ? "/csm/browse/dashboard" : "/csm/provide/dashboard",
    logistics:
      user.profile?.logisticsType === "need-logistics"
        ? "/logistics/browse/dashboard"
        : "/logistics/provide/dashboard",
    vehicles:
      user.profile?.vehicleType === "rent-vehicles"
        ? "/vehicles/browse/dashboard"
        : "/vehicles/provide/dashboard",
  };

  return resourcePaths[category || ""] || "/resources/categories";
}

export default ProtectedRoute;
