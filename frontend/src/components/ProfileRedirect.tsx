import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const ProfileRedirect = () => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login/employee" replace />;
    }

    // Helper function to determine resource redirect path based on user profile
    const getResourceProfilePath = (user: any): string => {
        const category = (user.profile?.category || user.profile?.resourceCategory)?.toLowerCase();

        const profilePaths: Record<string, string> = {
            investor:
                user.profile?.investorType === "want-to-invest"
                    ? "/investor/browse/profile"
                    : "/investor/seek/settings", // Seek doesn't have a distinct profile page?
            tenders:
                user.profile?.tenderType === "apply-for-tenders"
                    ? "/tenders/apply/profile"
                    : "/tenders/provide/profile",
            equipments:
                user.profile?.equipmentType === "rent-equipment"
                    ? "/equipments/rent/profile"
                    : "/equipments/provide/profile",
            machinery:
                user.profile?.machineryType === "need-machinery"
                    ? "/machinery/buy/profile"
                    : "/machinery/sell/profile",
            pmc: user.profile?.pmcType === "hire-pmc" ? "/pmc/browse/profile" : "/pmc/provide/profile",
            csm: user.profile?.csmType === "hire-csm" ? "/csm/browse/profile" : "/csm/provide/profile",
            logistics:
                user.profile?.logisticsType === "need-logistics"
                    ? "/logistics/browse/profile"
                    : "/logistics/provide/profile",
            vehicles:
                user.profile?.vehicleType === "rent-vehicles"
                    ? "/vehicles/browse/profile"
                    : "/vehicles/provide/profile",
        };

        return profilePaths[category || ""] || "/resources/categories";
    };

    const redirectPaths: Record<string, string> = {
        employee: "/employee/profile",
        employer: "/employer/profile",
        admin: "/admin/settings",
        resource: getResourceProfilePath(user),
    };

    const targetPath = redirectPaths[user.role];

    // If we are already on the target path, we shouldn't redirect to it again (loop)
    // But this component is only hit on /account/profile or similar
    return <Navigate to={targetPath || "/"} replace />;
};

export default ProfileRedirect;
