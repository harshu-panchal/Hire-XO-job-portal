import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const PaymentRedirect = () => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/resource-plans" replace />;
    }

    const redirectPaths: Record<string, string> = {
        employee: "/subscriptions",
        employer: "/employer/subscription",
        admin: "/admin/payments",
        resource: "/resource-plans",
    };

    return <Navigate to={redirectPaths[user.role] || "/"} replace />;
};

export default PaymentRedirect;
