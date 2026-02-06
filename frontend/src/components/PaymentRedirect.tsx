import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const PaymentRedirect = () => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login/employee" replace />;
    }

    const redirectPaths: Record<string, string> = {
        employee: "/subscriptions",
        employer: "/employer/subscription",
        admin: "/admin/payments",
        resource: "/investor/browse/dashboard", // Resources might not have a universal payment page yet, or it's dashboard
    };

    return <Navigate to={redirectPaths[user.role] || "/"} replace />;
};

export default PaymentRedirect;
