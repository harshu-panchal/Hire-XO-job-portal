import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/types";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated || !user) {
        // Not authenticated, redirect to role selection
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Authenticated but wrong role, redirect to appropriate dashboard
        if (user.role === "job-seeker") {
            return <Navigate to="/jobs" replace />;
        } else if (user.role === "recruiter") {
            return <Navigate to="/recruiter" replace />;
        } else if (user.role === "resource") {
            return <Navigate to="/resources/categories" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
