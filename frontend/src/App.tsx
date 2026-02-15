import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileRedirect from "./components/ProfileRedirect";
import PaymentRedirect from "./components/PaymentRedirect";
import { useAuthStore } from "@/store/useAuthStore";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import ErrorBoundary from "./components/ErrorBoundary";

// Layouts
import EmployeeLayout from "./layouts/EmployeeLayout";
import EmployerLayout from "./layouts/EmployerLayout";
import AdminLayout from "./layouts/AdminLayout";

// Auth Pages
import RoleSelection from "./modules/auth/pages/RoleSelection";
import Login from "./modules/auth/pages/Login";
import ForgotPassword from "./modules/auth/pages/ForgotPassword";
import ResetPassword from "./modules/auth/pages/ResetPassword";
import EmployeeSignup from "./modules/auth/pages/EmployeeSignup";
import EmployerSignup from "./modules/auth/pages/EmployerSignup";
import ResourceCategories from "./modules/auth/pages/ResourceCategories";
import InvestorOptions from "./modules/auth/pages/InvestorOptions";
import TenderOptions from "./modules/auth/pages/TenderOptions";
import EquipmentOptions from "./modules/auth/pages/EquipmentOptions";
import MachineryOptions from "./modules/auth/pages/MachineryOptions";
import PMCOptions from "./modules/auth/pages/PMCOptions";
import CSMOptions from "./modules/auth/pages/CSMOptions";
import LogisticsOptions from "./modules/auth/pages/LogisticsOptions";
import VehicleOptions from "./modules/auth/pages/VehicleOptions";
import ResourceSignup from "./modules/auth/pages/ResourceSignup";

// Employee Pages
import JobList from "./modules/employee/pages/JobList";
import JobDetails from "./modules/employee/pages/JobDetails";
import Subscriptions from "./modules/employee/pages/Subscriptions";
import Certificates from "./modules/employee/pages/Certificates";
import Profile from "./modules/employee/pages/Profile";
import MyApplications from "./modules/employee/pages/MyApplications";
import SavedJobs from "./modules/employee/pages/SavedJobs";
import Settings from "./modules/employee/pages/Settings";
import ResourcesList from "./modules/employee/pages/ResourcesList";
import ResourceDetails from "./modules/employee/pages/ResourceDetails";
import Notifications from "./modules/employee/pages/Notifications";
import Post from "./modules/employee/pages/Post";
import Interviews from "./modules/employee/pages/Interviews";
import FAQ from "./modules/employee/pages/FAQ";

// Employer Pages
import EmployerDashboard from "./modules/employer/pages/EmployerDashboard";
import MyJobs from "./modules/employer/pages/MyJobs";
import PostJob from "./modules/employer/pages/PostJob";
import ManageApplications from "./modules/employer/pages/ManageApplications";
import EmployerSettings from "./modules/employer/pages/EmployerSettings";
import Subscription from "./modules/employer/pages/Subscription";
import EmployerProfile from "./modules/employer/pages/EmployerProfile";
import EmployerCompany from "./modules/employer/pages/EmployerCompany";
import EmployerWallet from "./modules/employer/pages/EmployerWallet";
import TransactionHistory from "./modules/employer/pages/TransactionHistory";
import EmployerActivity from "./modules/employer/pages/EmployerActivity";
import EmployerNotificationSettings from "./modules/employer/pages/EmployerNotificationSettings";
import EmployerSecurity from "./modules/employer/pages/EmployerSecurity";
import EmployerPromotions from "./modules/employer/pages/EmployerPromotions";
import EmployerCertificates from "./modules/employer/pages/EmployerCertificates";

// Other Pages
import StyleGuide from "./modules/resources/pages/StyleGuide";

import ResourcePlans from "./modules/resources/pages/ResourcePlans";
import ResourceFAQ from "./modules/resources/pages/ResourceFAQ";
// Admin Pages
import AdminDashboard from "./modules/admin/pages/Dashboard";
import Employers from "./modules/admin/pages/Employers";
import JobSeekers from "./modules/admin/pages/JobSeekers";
import EmployeePlans from "./modules/admin/pages/EmployeePlans";
import EmployerPlans from "./modules/admin/pages/EmployerPlans";
import InterviewTiers from "./modules/admin/pages/InterviewTiers";
import PromotionPlans from "./modules/admin/pages/PromotionPlans";
import ResourcePlansAdmin from "./modules/admin/pages/ResourcePlansAdmin";
import Payments from "./modules/admin/pages/Payments";
import AdminCertificates from "./modules/admin/pages/Certificates";
import AdminReports from "./modules/admin/pages/Reports";
import AdminSettings from "./modules/admin/pages/Settings";
import AdminInvestors from "./modules/admin/pages/resources/Investors";
import AdminTenders from "./modules/admin/pages/resources/Tenders";
import AdminPMC from "./modules/admin/pages/resources/PMC";
import AdminMachinery from "./modules/admin/pages/resources/Machinery";
import AdminCSM from "./modules/admin/pages/resources/CSM";
import AdminLogistics from "./modules/admin/pages/resources/Logistics";
import AdminVehicles from "./modules/admin/pages/resources/Vehicles";
import AdminEquipments from "./modules/admin/pages/resources/Equipments";

// Investor Browse App (Ready to Invest)
import BrowseLayout from "./modules/resources/investor/browse/layouts/BrowseLayout";
import BrowseDashboard from "./modules/resources/investor/browse/pages/BrowseDashboard";
import BrowseProfile from "./modules/resources/investor/browse/pages/BrowseProfile";
import OpportunitiesList from "./modules/resources/investor/browse/pages/OpportunitiesList";
import OpportunityDetails from "./modules/resources/investor/browse/pages/OpportunityDetails";
import MyInvestments from "./modules/resources/investor/browse/pages/MyInvestments";
import InvestorBrowseNotifications from "./modules/resources/investor/browse/pages/InvestorBrowseNotifications";
import BrowseSettings from "./modules/resources/investor/browse/pages/BrowseSettings";

// Investor Seek App (Need Investor)
import SeekLayout from "./modules/resources/investor/seek/layouts/SeekLayout";
import SeekDashboard from "./modules/resources/investor/seek/pages/SeekDashboard";
import PostFundingNeed from "./modules/resources/investor/seek/pages/PostFundingNeed";
import MyFundingRequests from "./modules/resources/investor/seek/pages/MyFundingRequests";
import InvestorInquiries from "./modules/resources/investor/seek/pages/InvestorInquiries";
import SeekSettings from "./modules/resources/investor/seek/pages/SeekSettings";

// Tender Apply App (Find Tender)
import ApplyLayout from "./modules/resources/tenders/apply/layouts/ApplyLayout";
import ApplyDashboard from "./modules/resources/tenders/apply/pages/ApplyDashboard";
import TendersList from "./modules/resources/tenders/apply/pages/TendersList";
import TenderDetails from "./modules/resources/tenders/apply/pages/TenderDetails";
import ApplyMyApplications from "./modules/resources/tenders/apply/pages/MyApplications";
import ApplyProfile from "./modules/resources/tenders/apply/pages/ApplyProfile";
import ApplySettings from "./modules/resources/tenders/apply/pages/ApplySettingsPage";
import TenderApplyNotifications from "./modules/resources/tenders/apply/pages/TenderApplyNotifications";

// Tender Provide App (Post Tender)
import ProvideLayout from "./modules/resources/tenders/provide/layouts/ProvideLayout";
import ProvideDashboard from "./modules/resources/tenders/provide/pages/ProvideDashboard";
import PostTender from "./modules/resources/tenders/provide/pages/PostTender";
import MyTenders from "./modules/resources/tenders/provide/pages/MyTenders";
import ReceivedBids from "./modules/resources/tenders/provide/pages/ReceivedBids";
import TenderProvideNotifications from "./modules/resources/tenders/provide/pages/TenderProvideNotifications";
import ProvideProfile from "./modules/resources/tenders/provide/pages/ProvideProfile";
import ProvideSettings from "./modules/resources/tenders/provide/pages/ProvideSettings";

// Equipment App (Need Equipment)
import RentLayout from "./modules/resources/equipments/rent/layouts/RentLayout";
import RentDashboard from "./modules/resources/equipments/rent/pages/RentDashboard";
import EquipmentList from "./modules/resources/equipments/rent/pages/EquipmentList";
import EquipmentDetails from "./modules/resources/equipments/rent/pages/EquipmentDetails";
import MyRentals from "./modules/resources/equipments/rent/pages/MyRentals";
import RentProfile from "./modules/resources/equipments/rent/pages/RentProfile";
import RentSettings from "./modules/resources/equipments/rent/pages/RentSettings";

// Equipment Provider App (List Equipment)
import EquipmentProvideLayout from "./modules/resources/equipments/provide/layouts/ProvideLayout";
import EquipmentProvideDashboard from "./modules/resources/equipments/provide/pages/ProvideDashboard";
import PostEquipment from "./modules/resources/equipments/provide/pages/PostEquipment";
import MyEquipments from "./modules/resources/equipments/provide/pages/MyEquipments";
import RentalRequests from "./modules/resources/equipments/provide/pages/RentalRequests";
import EquipmentProvideProfile from "./modules/resources/equipments/provide/pages/ProvideProfile";
import EquipmentProvideSettings from "./modules/resources/equipments/provide/pages/ProvideSettings";

// Machinery App (Need Machinery)
import BuyLayout from "./modules/resources/machinery/buy/layouts/BuyLayout";
import BuyDashboard from "./modules/resources/machinery/buy/pages/BuyDashboard";
import MachineryList from "./modules/resources/machinery/buy/pages/MachineryList";
import MachineDetails from "./modules/resources/machinery/buy/pages/MachineDetails";
import MyOrders from "./modules/resources/machinery/buy/pages/MyOrders";
import BuyProfile from "./modules/resources/machinery/buy/pages/BuyProfile";
import BuySettings from "./modules/resources/machinery/buy/pages/BuySettings";

// Machinery Provider App (List Machinery)
import SellLayout from "./modules/resources/machinery/sell/layouts/SellLayout";
import SellDashboard from "./modules/resources/machinery/sell/pages/SellDashboard";
import PostMachine from "./modules/resources/machinery/sell/pages/PostMachine";
import MyMachinery from "./modules/resources/machinery/sell/pages/MyMachinery";
import MachineryInquiries from "./modules/resources/machinery/sell/pages/MachineryInquiries";
import SellProfile from "./modules/resources/machinery/sell/pages/SellProfile";
import SellSettings from "./modules/resources/machinery/sell/pages/SellSettings";

// PMC App (Need Service)
import PMCBrowseLayout from "./modules/resources/pmc/browse/layouts/BrowseLayout";
import PMCBrowseDashboard from "./modules/resources/pmc/browse/pages/BrowseDashboard";
import PMCConsultantList from "./modules/resources/pmc/browse/pages/ConsultantList";
import PMCConsultantDetails from "./modules/resources/pmc/browse/pages/ConsultantDetails";
import PMCMyHires from "./modules/resources/pmc/browse/pages/MyHires";
import PMCBrowseProfile from "./modules/resources/pmc/browse/pages/BrowseProfile";
import PMCBrowseSettings from "./modules/resources/pmc/browse/pages/BrowseSettings";

// PMC Provider App (Provide Service)
import PMCProvideLayout from "./modules/resources/pmc/provide/layouts/ProvideLayout";
import PMCProvideDashboard from "./modules/resources/pmc/provide/pages/ProvideDashboard";
import PMCPostService from "./modules/resources/pmc/provide/pages/PostService";
import PMCMyServices from "./modules/resources/pmc/provide/pages/MyServices";
import PMCInquiries from "./modules/resources/pmc/provide/pages/Inquiries";
import PMCProvideProfile from "./modules/resources/pmc/provide/pages/ProvideProfile";
import PMCProvideSettings from "./modules/resources/pmc/provide/pages/ProvideSettings";

// CSM App (Need Service)
import CSMBrowseLayout from "./modules/resources/csm/browse/layouts/BrowseLayout";
import CSMBrowseDashboard from "./modules/resources/csm/browse/pages/BrowseDashboard";
import CSMList from "./modules/resources/csm/browse/pages/CSMList";
import CSMDetails from "./modules/resources/csm/browse/pages/CSMDetails";
import CSMMyHires from "./modules/resources/csm/browse/pages/MyHires";
import CSMBrowseProfile from "./modules/resources/csm/browse/pages/BrowseProfile";
import CSMBrowseSettings from "./modules/resources/csm/browse/pages/BrowseSettings";

// CSM Provider App (Provide Service)
import CSMProvideLayout from "./modules/resources/csm/provide/layouts/ProvideLayout";
import CSMProvideDashboard from "./modules/resources/csm/provide/pages/ProvideDashboard";
import CSMPostService from "./modules/resources/csm/provide/pages/PostService";
import CSMMyServices from "./modules/resources/csm/provide/pages/MyServices";
import CSMInquiries from "./modules/resources/csm/provide/pages/Inquiries";
import CSMProvideProfile from "./modules/resources/csm/provide/pages/ProvideProfile";
import CSMProvideSettings from "./modules/resources/csm/provide/pages/ProvideSettings";

// Logistics App (Need Service)
import LogisticsBrowseLayout from "./modules/resources/logistics/browse/layouts/BrowseLayout";
import LogisticsBrowseDashboard from "./modules/resources/logistics/browse/pages/BrowseDashboard";
import LogisticsList from "./modules/resources/logistics/browse/pages/LogisticsList";
import LogisticsDetails from "./modules/resources/logistics/browse/pages/LogisticsDetails";
import LogisticsMyHires from "./modules/resources/logistics/browse/pages/MyHires";
import LogisticsBrowseProfile from "./modules/resources/logistics/browse/pages/BrowseProfile";
import LogisticsBrowseSettings from "./modules/resources/logistics/browse/pages/BrowseSettings";

// Logistics Provider App (Provide Service)
import LogisticsProvideLayout from "./modules/resources/logistics/provide/layouts/ProvideLayout";
import LogisticsProvideDashboard from "./modules/resources/logistics/provide/pages/ProvideDashboard";
import LogisticsPostService from "./modules/resources/logistics/provide/pages/PostLogisticsService";
import LogisticsMyServices from "./modules/resources/logistics/provide/pages/MyLogisticsServices";
import LogisticsInquiries from "./modules/resources/logistics/provide/pages/LogisticsInquiries";
import LogisticsProvideProfile from "./modules/resources/logistics/provide/pages/ProvideProfile";
import LogisticsProvideSettings from "./modules/resources/logistics/provide/pages/ProvideSettings";

// Vehicle Pages
import VehicleBrowseLayout from "./modules/resources/vehicles/browse/layouts/BrowseLayout";
import VehicleBrowseDashboard from "./modules/resources/vehicles/browse/pages/BrowseDashboard";
import VehiclesList from "./modules/resources/vehicles/browse/pages/VehiclesList";
import VehicleDetails from "./modules/resources/vehicles/browse/pages/VehicleDetails";
import VehicleMyRentals from "./modules/resources/vehicles/browse/pages/MyRentals";
import VehicleBrowseProfile from "./modules/resources/vehicles/browse/pages/BrowseProfile";
import VehicleBrowseSettings from "./modules/resources/vehicles/browse/pages/BrowseSettings";

import VehicleProvideLayout from "./modules/resources/vehicles/provide/layouts/ProvideLayout";
import VehicleProvideDashboard from "./modules/resources/vehicles/provide/pages/ProvideDashboard";
import VehiclePostService from "./modules/resources/vehicles/provide/pages/PostVehicle";
import MyVehicles from "./modules/resources/vehicles/provide/pages/MyVehicles";
import VehicleInquiries from "./modules/resources/vehicles/provide/pages/VehicleInquiries";
import VehicleProvideProfile from "./modules/resources/vehicles/provide/pages/ProvideProfile";
import VehicleProvideSettings from "./modules/resources/vehicles/provide/pages/ProvideSettings";
import VehicleProvideNotifications from "./modules/resources/vehicles/provide/pages/VehicleProvideNotifications";

const InterviewsRedirect = () => {
  const { user } = useAuthStore();
  if (user?.role === 'employer') return <Navigate to="/employer/interviews" replace />;
  if (user?.role === 'employee') return <Navigate to="/employee/interviews" replace />;
  return <Navigate to="/" replace />;
};


function App() {
  const { user } = useAuthStore();
  const { setSavedJobs } = useEmployeeStore();

  useEffect(() => {
    if (user?.bookmarks) {
      setSavedJobs(user.bookmarks);
    }
  }, [user, setSavedJobs]);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes - Authentication */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/interviews" element={<InterviewsRedirect />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/signup/employee" element={<EmployeeSignup />} />
        <Route path="/signup/employer" element={<EmployerSignup />} />
        <Route path="/resources/categories" element={<ResourceCategories />} />
        {/* Resource Sub-Option Routes */}
        <Route path="/resources/investor" element={<InvestorOptions />} />
        <Route path="/resources/tenders" element={<TenderOptions />} />
        <Route path="/resources/equipments" element={<EquipmentOptions />} />
        <Route path="/resources/machinery" element={<MachineryOptions />} />
        <Route path="/resources/pmc" element={<PMCOptions />} />
        <Route path="/resources/csm" element={<CSMOptions />} />
        <Route path="/resources/logistics" element={<LogisticsOptions />} />
        <Route path="/resources/vehicles" element={<VehicleOptions />} />
        <Route path="/signup/resource/:category" element={<ResourceSignup />} />
        <Route path="/profile" element={<ProfileRedirect />} />


        <Route path="/resource-plans" element={<ResourcePlans />} />
        <Route path="/resource-plans/faq" element={<ResourceFAQ />} />

        {/* Employee Routes - Mixed Public/Protected */}
        <Route element={<EmployeeLayout />}>
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/employee/resources" element={<ResourcesList />} />
          <Route path="/employee/resources/:id" element={<ResourceDetails />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/payments" element={<Subscriptions />} />
          <Route path="/style-guide" element={<StyleGuide />} />

          {/* Protected Employee Sub-Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["employee"]} loginPath="/login/employee">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/employee/profile" element={<Profile />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/employee/interviews" element={<Interviews />} />
          </Route>
          <Route path="/faq" element={<FAQ />} />

          {/* Community Route - Shared by both roles */}
          <Route
            path="/post"
            element={
              <ProtectedRoute allowedRoles={["employee", "employer"]} loginPath="/">
                <Post />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Employer Routes - Mixed Public/Protected */}
        <Route element={<EmployerLayout />}>
          <Route path="/employer" element={<EmployerDashboard />} />

          <Route path="/employer/subscription" element={<Subscription />} />

          {/* Protected Employer Sub-Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["employer"]} loginPath="/login/employer">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/employer/jobs" element={<MyJobs />} />
            <Route path="/employer/post-job" element={<PostJob />} />
            <Route path="/employer/applications" element={<ManageApplications />} />
            <Route path="/employer/settings" element={<EmployerSettings />} />
            <Route path="/employer/profile" element={<EmployerProfile />} />
            <Route path="/employer/company" element={<EmployerCompany />} />
            <Route path="/employer/wallet" element={<EmployerWallet />} />
            <Route path="/employer/wallet/history" element={<TransactionHistory />} />
            {/* Employer Activities and Settings */}
            <Route path="/employer/notifications" element={<EmployerActivity />} />
            <Route
              path="/employer/settings/notifications"
              element={<EmployerNotificationSettings />}
            />
            <Route path="/employer/security" element={<EmployerSecurity />} />
            <Route path="/employer/promotions" element={<EmployerPromotions />} />
            <Route path="/employer/certificates" element={<EmployerCertificates />} />
            <Route path="/employer/interviews" element={<Interviews />} />
            <Route path="/employer/community" element={<Post />} />
            <Route path="/employer/faq" element={<FAQ />} />
          </Route>
        </Route>

        {/* Investor Browse Routes (Want to Invest) */}
        <Route element={<BrowseLayout />}>
          <Route path="/investor/browse/dashboard" element={<BrowseDashboard />} />
          <Route path="/investor/browse/opportunities" element={<OpportunitiesList />} />
          <Route path="/investor/browse/opportunities/:id" element={<OpportunityDetails />} />
          <Route path="/investor/browse/profile" element={<BrowseProfile />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/investor/browse/my-investments" element={<MyInvestments />} />
            <Route path="/investor/browse/settings" element={<BrowseSettings />} />
            <Route path="/investor/browse/notifications" element={<InvestorBrowseNotifications />} />
          </Route>
        </Route>

        {/* Investor Seek Routes (Want Investment) */}
        <Route element={<SeekLayout />}>
          <Route path="/investor/seek/dashboard" element={<SeekDashboard />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/investor/seek/post" element={<PostFundingNeed />} />
            <Route path="/investor/seek/my-requests" element={<MyFundingRequests />} />
            <Route path="/investor/seek/inquiries" element={<InvestorInquiries />} />
            <Route path="/investor/seek/settings" element={<SeekSettings />} />
          </Route>
        </Route>

        {/* Tender Apply Routes (Apply for Tenders) */}
        <Route element={<ApplyLayout />}>
          <Route path="/tenders/apply/dashboard" element={<ApplyDashboard />} />
          <Route path="/tenders/apply/tenders" element={<TendersList />} />
          <Route path="/tenders/apply/tenders/:id" element={<TenderDetails />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/tenders/apply/my-bids" element={<ApplyMyApplications />} />
            <Route path="/tenders/apply/profile" element={<ApplyProfile />} />
            <Route path="/tenders/apply/settings" element={<ApplySettings />} />
            <Route path="/tenders/apply/notifications" element={<TenderApplyNotifications />} />
          </Route>
        </Route>

        {/* Tender Provide Routes (Provide Tenders) */}
        <Route element={<ProvideLayout />}>
          <Route path="/tenders/provide/dashboard" element={<ProvideDashboard />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/tenders/provide/post" element={<PostTender />} />
            <Route path="/tenders/provide/my-tenders" element={<MyTenders />} />
            <Route path="/tenders/provide/bids" element={<ReceivedBids />} />
            <Route path="/tenders/provide/profile" element={<ProvideProfile />} />
            <Route path="/tenders/provide/settings" element={<ProvideSettings />} />
            <Route path="/tenders/provide/notifications" element={<TenderProvideNotifications />} />
          </Route>
        </Route>

        {/* Equipment Rent Routes (Rent Gear) */}
        <Route element={<RentLayout />}>
          <Route path="/equipments/rent/dashboard" element={<RentDashboard />} />
          <Route path="/equipments/rent/list" element={<EquipmentList />} />
          <Route path="/equipments/rent/equipment/:id" element={<EquipmentDetails />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/equipments/rent/my-rentals" element={<MyRentals />} />
            <Route path="/equipments/rent/profile" element={<RentProfile />} />
            <Route path="/equipments/rent/settings" element={<RentSettings />} />
          </Route>
        </Route>

        {/* Equipment Provide Routes (Lender Portal) */}
        <Route element={<EquipmentProvideLayout />}>
          <Route path="/equipments/provide/dashboard" element={<EquipmentProvideDashboard />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/equipments/provide/post" element={<PostEquipment />} />
            <Route path="/equipments/provide/my-equipments" element={<MyEquipments />} />
            <Route path="/equipments/provide/requests" element={<RentalRequests />} />
            <Route path="/equipments/provide/profile" element={<EquipmentProvideProfile />} />
            <Route path="/equipments/provide/settings" element={<EquipmentProvideSettings />} />
          </Route>
        </Route>

        {/* Machinery Buy Routes (Marketplace) */}
        <Route element={<BuyLayout />}>
          <Route path="/machinery/buy/dashboard" element={<BuyDashboard />} />
          <Route path="/machinery/buy/list" element={<MachineryList />} />
          <Route path="/machinery/buy/item/:id" element={<MachineDetails />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/machinery/buy/my-orders" element={<MyOrders />} />
            <Route path="/machinery/buy/profile" element={<BuyProfile />} />
            <Route path="/machinery/buy/settings" element={<BuySettings />} />
          </Route>
        </Route>

        {/* Machinery Sell Routes (Seller Console) */}
        <Route element={<SellLayout />}>
          <Route path="/machinery/sell/dashboard" element={<SellDashboard />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/machinery/sell/post" element={<PostMachine />} />
            <Route path="/machinery/sell/inventory" element={<MyMachinery />} />
            <Route path="/machinery/sell/inquiries" element={<MachineryInquiries />} />
            <Route path="/machinery/sell/profile" element={<SellProfile />} />
            <Route path="/machinery/sell/settings" element={<SellSettings />} />
          </Route>
        </Route>

        {/* PMC Browse Routes (Hire PMC) */}
        <Route element={<PMCBrowseLayout />}>
          <Route path="/pmc/browse/dashboard" element={<PMCBrowseDashboard />} />
          <Route path="/pmc/browse/consultants" element={<PMCConsultantList />} />
          <Route path="/pmc/browse/consultants/:id" element={<PMCConsultantDetails />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/pmc/browse/my-hires" element={<PMCMyHires />} />
            <Route path="/pmc/browse/profile" element={<PMCBrowseProfile />} />
            <Route path="/pmc/browse/settings" element={<PMCBrowseSettings />} />
          </Route>
        </Route>

        {/* PMC Provide Routes (Offer PMC) */}
        <Route element={<PMCProvideLayout />}>
          <Route path="/pmc/provide/dashboard" element={<PMCProvideDashboard />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/pmc/provide/post" element={<PMCPostService />} />
            <Route path="/pmc/provide/my-services" element={<PMCMyServices />} />
            <Route path="/pmc/provide/inquiries" element={<PMCInquiries />} />
            <Route path="/pmc/provide/profile" element={<PMCProvideProfile />} />
            <Route path="/pmc/provide/settings" element={<PMCProvideSettings />} />
          </Route>
        </Route>

        {/* CSM Browse Routes (Hire CSM) */}
        <Route element={<CSMBrowseLayout />}>
          <Route path="/csm/browse/dashboard" element={<CSMBrowseDashboard />} />
          <Route path="/csm/browse/list" element={<CSMList />} />
          <Route path="/csm/browse/list/:id" element={<CSMDetails />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/csm/browse/my-hires" element={<CSMMyHires />} />
            <Route path="/csm/browse/profile" element={<CSMBrowseProfile />} />
            <Route path="/csm/browse/settings" element={<CSMBrowseSettings />} />
          </Route>
        </Route>

        {/* CSM Provide Routes (Offer CSM) */}
        <Route element={<CSMProvideLayout />}>
          <Route path="/csm/provide/dashboard" element={<CSMProvideDashboard />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/csm/provide/post" element={<CSMPostService />} />
            <Route path="/csm/provide/my-services" element={<CSMMyServices />} />
            <Route path="/csm/provide/inquiries" element={<CSMInquiries />} />
            <Route path="/csm/provide/profile" element={<CSMProvideProfile />} />
            <Route path="/csm/provide/settings" element={<CSMProvideSettings />} />
          </Route>
        </Route>

        {/* Logistics Browse Routes (Hire Logistics) */}
        <Route element={<LogisticsBrowseLayout />}>
          <Route path="/logistics/browse/dashboard" element={<LogisticsBrowseDashboard />} />
          <Route path="/logistics/browse/list" element={<LogisticsList />} />
          <Route path="/logistics/browse/list/:id" element={<LogisticsDetails />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/logistics/browse/my-hires" element={<LogisticsMyHires />} />
            <Route path="/logistics/browse/profile" element={<LogisticsBrowseProfile />} />
            <Route path="/logistics/browse/settings" element={<LogisticsBrowseSettings />} />
          </Route>
        </Route>

        {/* Logistics Provide Routes (Offer Logistics) */}
        <Route element={<LogisticsProvideLayout />}>
          <Route path="/logistics/provide/dashboard" element={<LogisticsProvideDashboard />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/logistics/provide/post" element={<LogisticsPostService />} />
            <Route path="/logistics/provide/my-services" element={<LogisticsMyServices />} />
            <Route path="/logistics/provide/inquiries" element={<LogisticsInquiries />} />
            <Route path="/logistics/provide/profile" element={<LogisticsProvideProfile />} />
            <Route path="/logistics/provide/settings" element={<LogisticsProvideSettings />} />
          </Route>
        </Route>

        {/* Vehicle Browse Routes (Hire Vehicle) */}
        <Route element={<VehicleBrowseLayout />}>
          <Route path="/vehicles/browse/dashboard" element={<VehicleBrowseDashboard />} />
          <Route path="/vehicles/browse/list" element={<VehiclesList />} />
          <Route path="/vehicles/browse/list/:id" element={<VehicleDetails />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/vehicles/browse/my-rentals" element={<VehicleMyRentals />} />
            <Route path="/vehicles/browse/profile" element={<VehicleBrowseProfile />} />
            <Route path="/vehicles/browse/settings" element={<VehicleBrowseSettings />} />
          </Route>
        </Route>

        {/* Vehicle Provide Routes (Offer Vehicle) */}
        <Route element={<VehicleProvideLayout />}>
          <Route path="/vehicles/provide/dashboard" element={<VehicleProvideDashboard />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["resource"]} loginPath="/login/resource">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/vehicles/provide/post" element={<VehiclePostService />} />
            <Route path="/vehicles/provide/my-vehicles" element={<MyVehicles />} />
            <Route path="/vehicles/provide/inquiries" element={<VehicleInquiries />} />
            <Route path="/vehicles/provide/profile" element={<VehicleProvideProfile />} />
            <Route path="/vehicles/provide/settings" element={<VehicleProvideSettings />} />
            <Route path="/vehicles/provide/notifications" element={<VehicleProvideNotifications />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]} loginPath="/login/admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/employers" element={<Employers />} />
          <Route path="/admin/job-seekers" element={<JobSeekers />} />
          <Route path="/admin/employee-plans" element={<EmployeePlans />} />
          <Route path="/admin/interview-tiers" element={<InterviewTiers />} />
          <Route path="/admin/employer-plans" element={<EmployerPlans />} />
          <Route path="/admin/promotion-plans" element={<PromotionPlans />} />
          <Route path="/admin/resource-plans" element={<ResourcePlansAdmin />} />
          <Route path="/admin/payments" element={<Payments />} />
          <Route path="/admin/certificates" element={<AdminCertificates />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/interviews" element={<Interviews />} />

          {/* Resource Management Routes */}
          <Route path="/admin/resources/investors" element={<AdminInvestors />} />
          <Route path="/admin/resources/tenders" element={<AdminTenders />} />
          <Route path="/admin/resources/pmc" element={<AdminPMC />} />
          <Route path="/admin/resources/machinery" element={<AdminMachinery />} />
          <Route path="/admin/resources/csm" element={<AdminCSM />} />
          <Route path="/admin/resources/logistics" element={<AdminLogistics />} />
          <Route path="/admin/resources/vehicles" element={<AdminVehicles />} />
          <Route path="/admin/resources/equipments" element={<AdminEquipments />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
