import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import JobSeekerLayout from "./layouts/JobSeekerLayout";
import RecruiterLayout from "./layouts/RecruiterLayout";

// Auth Pages
import RoleSelection from "./modules/auth/pages/RoleSelection";
import Login from "./modules/auth/pages/Login";
import JobSeekerSignup from "./modules/auth/pages/JobSeekerSignup";
import RecruiterSignup from "./modules/auth/pages/RecruiterSignup";
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

// Job Seeker Pages
import JobList from "./modules/job-seeker/pages/JobList";
import JobDetails from "./modules/job-seeker/pages/JobDetails";
import Subscriptions from "./modules/job-seeker/pages/Subscriptions";
import Certificates from "./modules/job-seeker/pages/Certificates";
import Profile from "./modules/job-seeker/pages/Profile";
import MyApplications from "./modules/job-seeker/pages/MyApplications";
import SavedJobs from "./modules/job-seeker/pages/SavedJobs";
import Settings from "./modules/job-seeker/pages/Settings";
import ResourcesList from "./modules/job-seeker/pages/ResourcesList";
import ResourceDetails from "./modules/job-seeker/pages/ResourceDetails";

// Recruiter Pages
import RecruiterDashboard from "./modules/recruiter/pages/RecruiterDashboard";
import PostJob from "./modules/recruiter/pages/PostJob";
import ManageApplications from "./modules/recruiter/pages/ManageApplications";
import RecruiterSettings from "./modules/recruiter/pages/RecruiterSettings";
import Subscription from "./modules/recruiter/pages/Subscription";
import RecruiterProfile from "./modules/recruiter/pages/RecruiterProfile";
import RecruiterCompany from "./modules/recruiter/pages/RecruiterCompany";
import RecruiterWallet from "./modules/recruiter/pages/RecruiterWallet";
import RecruiterNotifications from "./modules/recruiter/pages/RecruiterNotifications";
import RecruiterSecurity from "./modules/recruiter/pages/RecruiterSecurity";

// Other Pages
import StyleGuide from "./modules/resources/pages/StyleGuide";

// Investor Browse App (Want to Invest)
import BrowseLayout from "./modules/resources/investor/browse/layouts/BrowseLayout";
import BrowseDashboard from "./modules/resources/investor/browse/pages/BrowseDashboard";
import BrowseProfile from "./modules/resources/investor/browse/pages/BrowseProfile";
import OpportunitiesList from "./modules/resources/investor/browse/pages/OpportunitiesList";
import OpportunityDetails from "./modules/resources/investor/browse/pages/OpportunityDetails";
import MyInvestments from "./modules/resources/investor/browse/pages/MyInvestments";
import BrowseSettings from "./modules/resources/investor/browse/pages/BrowseSettings";

// Investor Seek App (Want Investment)
import SeekLayout from "./modules/resources/investor/seek/layouts/SeekLayout";
import SeekDashboard from "./modules/resources/investor/seek/pages/SeekDashboard";
import PostFundingNeed from "./modules/resources/investor/seek/pages/PostFundingNeed";
import MyFundingRequests from "./modules/resources/investor/seek/pages/MyFundingRequests";
import InvestorInquiries from "./modules/resources/investor/seek/pages/InvestorInquiries";
import SeekSettings from "./modules/resources/investor/seek/pages/SeekSettings";

// Tender Apply App (Apply for Tenders)
import ApplyLayout from "./modules/resources/tenders/apply/layouts/ApplyLayout";
import ApplyDashboard from "./modules/resources/tenders/apply/pages/ApplyDashboard";
import TendersList from "./modules/resources/tenders/apply/pages/TendersList";
import TenderDetails from "./modules/resources/tenders/apply/pages/TenderDetails";
import ApplyMyApplications from "./modules/resources/tenders/apply/pages/MyApplications";
import ApplyProfile from "./modules/resources/tenders/apply/pages/ApplyProfile";
import ApplySettings from "./modules/resources/tenders/apply/pages/ApplySettings";

// Tender Provide App (Provide Tenders)
import ProvideLayout from "./modules/resources/tenders/provide/layouts/ProvideLayout";
import ProvideDashboard from "./modules/resources/tenders/provide/pages/ProvideDashboard";
import PostTender from "./modules/resources/tenders/provide/pages/PostTender";
import MyTenders from "./modules/resources/tenders/provide/pages/MyTenders";
import ReceivedBids from "./modules/resources/tenders/provide/pages/ReceivedBids";
import ProvideProfile from "./modules/resources/tenders/provide/pages/ProvideProfile";
import ProvideSettings from "./modules/resources/tenders/provide/pages/ProvideSettings";

// Equipment Rent App (Rent Gear)
import RentLayout from "./modules/resources/equipments/rent/layouts/RentLayout";
import RentDashboard from "./modules/resources/equipments/rent/pages/RentDashboard";
import EquipmentList from "./modules/resources/equipments/rent/pages/EquipmentList";
import EquipmentDetails from "./modules/resources/equipments/rent/pages/EquipmentDetails";
import MyRentals from "./modules/resources/equipments/rent/pages/MyRentals";
import RentProfile from "./modules/resources/equipments/rent/pages/RentProfile";
import RentSettings from "./modules/resources/equipments/rent/pages/RentSettings";

// Equipment Provide App (Lender Portal)
import EquipmentProvideLayout from "./modules/resources/equipments/provide/layouts/ProvideLayout";
import EquipmentProvideDashboard from "./modules/resources/equipments/provide/pages/ProvideDashboard";
import PostEquipment from "./modules/resources/equipments/provide/pages/PostEquipment";
import MyEquipments from "./modules/resources/equipments/provide/pages/MyEquipments";
import RentalRequests from "./modules/resources/equipments/provide/pages/RentalRequests";
import EquipmentProvideProfile from "./modules/resources/equipments/provide/pages/ProvideProfile";
import EquipmentProvideSettings from "./modules/resources/equipments/provide/pages/ProvideSettings";

// Machinery Buy App (Marketplace)
import BuyLayout from "./modules/resources/machinery/buy/layouts/BuyLayout";
import BuyDashboard from "./modules/resources/machinery/buy/pages/BuyDashboard";
import MachineryList from "./modules/resources/machinery/buy/pages/MachineryList";
import MachineDetails from "./modules/resources/machinery/buy/pages/MachineDetails";
import MyOrders from "./modules/resources/machinery/buy/pages/MyOrders";
import BuyProfile from "./modules/resources/machinery/buy/pages/BuyProfile";
import BuySettings from "./modules/resources/machinery/buy/pages/BuySettings";

// Machinery Sell App (Seller Console)
import SellLayout from "./modules/resources/machinery/sell/layouts/SellLayout";
import SellDashboard from "./modules/resources/machinery/sell/pages/SellDashboard";
import PostMachine from "./modules/resources/machinery/sell/pages/PostMachine";
import MyMachinery from "./modules/resources/machinery/sell/pages/MyMachinery";
import MachineryInquiries from "./modules/resources/machinery/sell/pages/MachineryInquiries";
import SellProfile from "./modules/resources/machinery/sell/pages/SellProfile";
import SellSettings from "./modules/resources/machinery/sell/pages/SellSettings";

// PMC Browse App (Hire PMC)
import PMCBrowseLayout from "./modules/resources/pmc/browse/layouts/BrowseLayout";
import PMCBrowseDashboard from "./modules/resources/pmc/browse/pages/BrowseDashboard";
import PMCConsultantList from "./modules/resources/pmc/browse/pages/ConsultantList";
import PMCConsultantDetails from "./modules/resources/pmc/browse/pages/ConsultantDetails";
import PMCMyHires from "./modules/resources/pmc/browse/pages/MyHires";
import PMCBrowseProfile from "./modules/resources/pmc/browse/pages/BrowseProfile";
import PMCBrowseSettings from "./modules/resources/pmc/browse/pages/BrowseSettings";

// PMC Provide App (Offer PMC)
import PMCProvideLayout from "./modules/resources/pmc/provide/layouts/ProvideLayout";
import PMCProvideDashboard from "./modules/resources/pmc/provide/pages/ProvideDashboard";
import PMCPostService from "./modules/resources/pmc/provide/pages/PostService";
import PMCMyServices from "./modules/resources/pmc/provide/pages/MyServices";
import PMCInquiries from "./modules/resources/pmc/provide/pages/Inquiries";
import PMCProvideProfile from "./modules/resources/pmc/provide/pages/ProvideProfile";
import PMCProvideSettings from "./modules/resources/pmc/provide/pages/ProvideSettings";

// CSM Browse App (Hire CSM)
import CSMBrowseLayout from "./modules/resources/csm/browse/layouts/BrowseLayout";
import CSMBrowseDashboard from "./modules/resources/csm/browse/pages/BrowseDashboard";
import CSMList from "./modules/resources/csm/browse/pages/CSMList";
import CSMDetails from "./modules/resources/csm/browse/pages/CSMDetails";
import CSMMyHires from "./modules/resources/csm/browse/pages/MyHires";
import CSMBrowseProfile from "./modules/resources/csm/browse/pages/BrowseProfile";
import CSMBrowseSettings from "./modules/resources/csm/browse/pages/BrowseSettings";

// CSM Provide App (Offer CSM)
import CSMProvideLayout from "./modules/resources/csm/provide/layouts/ProvideLayout";
import CSMProvideDashboard from "./modules/resources/csm/provide/pages/ProvideDashboard";
import CSMPostService from "./modules/resources/csm/provide/pages/PostService";
import CSMMyServices from "./modules/resources/csm/provide/pages/MyServices";
import CSMInquiries from "./modules/resources/csm/provide/pages/Inquiries";
import CSMProvideProfile from "./modules/resources/csm/provide/pages/ProvideProfile";
import CSMProvideSettings from "./modules/resources/csm/provide/pages/ProvideSettings";

// Logistics Browse App (Hire Logistics)
import LogisticsBrowseLayout from "./modules/resources/logistics/browse/layouts/BrowseLayout";
import LogisticsBrowseDashboard from "./modules/resources/logistics/browse/pages/BrowseDashboard";
import LogisticsList from "./modules/resources/logistics/browse/pages/LogisticsList";
import LogisticsDetails from "./modules/resources/logistics/browse/pages/LogisticsDetails";
import LogisticsMyHires from "./modules/resources/logistics/browse/pages/MyHires";
import LogisticsBrowseProfile from "./modules/resources/logistics/browse/pages/BrowseProfile";
import LogisticsBrowseSettings from "./modules/resources/logistics/browse/pages/BrowseSettings";

// Logistics Provide App (Offer Logistics)
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

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public Routes - Authentication */}
        <Route
          path="/"
          element={
            isAuthenticated && user ? (
              user.role === "job-seeker" ? (
                <Navigate to="/jobs" replace />
              ) : user.role === "recruiter" ? (
                <Navigate to="/recruiter" replace />
              ) : (
                <Navigate to="/resources/categories" replace />
              )
            ) : (
              <RoleSelection />
            )
          }
        />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/signup/job-seeker" element={<JobSeekerSignup />} />
        <Route path="/signup/recruiter" element={<RecruiterSignup />} />
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

        {/* Protected Job Seeker Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["job-seeker"]}>
              <JobSeekerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/resources" element={<ResourcesList />} />
          <Route path="/resources/:id" element={<ResourceDetails />} />
          <Route path="/style-guide" element={<StyleGuide />} />
        </Route>

        {/* Protected Recruiter Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <RecruiterLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/post-job" element={<PostJob />} />
          <Route path="/recruiter/applications" element={<ManageApplications />} />
          <Route path="/recruiter/settings" element={<RecruiterSettings />} />
          <Route path="/recruiter/subscription" element={<Subscription />} />
          <Route path="/recruiter/profile" element={<RecruiterProfile />} />
          <Route path="/recruiter/company" element={<RecruiterCompany />} />
          <Route path="/recruiter/wallet" element={<RecruiterWallet />} />
          <Route path="/recruiter/notifications" element={<RecruiterNotifications />} />
          <Route path="/recruiter/security" element={<RecruiterSecurity />} />
        </Route>

        {/* Protected Investor Browse Routes (Want to Invest) */}
        <Route element={<BrowseLayout />}>
          <Route path="/investor/browse/dashboard" element={<BrowseDashboard />} />
          <Route path="/investor/browse/profile" element={<BrowseProfile />} />
          <Route path="/investor/browse/opportunities" element={<OpportunitiesList />} />
          <Route path="/investor/browse/opportunities/:id" element={<OpportunityDetails />} />
          <Route path="/investor/browse/my-investments" element={<MyInvestments />} />
          <Route path="/investor/browse/settings" element={<BrowseSettings />} />
        </Route>

        {/* Protected Investor Seek Routes (Want Investment) */}
        <Route element={<SeekLayout />}>
          <Route path="/investor/seek/dashboard" element={<SeekDashboard />} />
          <Route path="/investor/seek/post" element={<PostFundingNeed />} />
          <Route path="/investor/seek/my-requests" element={<MyFundingRequests />} />
          <Route path="/investor/seek/inquiries" element={<InvestorInquiries />} />
          <Route path="/investor/seek/settings" element={<SeekSettings />} />
        </Route>

        {/* Protected Tender Apply Routes (Apply for Tenders) */}
        <Route element={<ApplyLayout />}>
          <Route path="/tenders/apply/dashboard" element={<ApplyDashboard />} />
          <Route path="/tenders/apply/tenders" element={<TendersList />} />
          <Route path="/tenders/apply/tenders/:id" element={<TenderDetails />} />
          <Route path="/tenders/apply/my-bids" element={<ApplyMyApplications />} />
          <Route path="/tenders/apply/profile" element={<ApplyProfile />} />
          <Route path="/tenders/apply/settings" element={<ApplySettings />} />
        </Route>

        {/* Protected Tender Provide Routes (Provide Tenders) */}
        <Route element={<ProvideLayout />}>
          <Route path="/tenders/provide/dashboard" element={<ProvideDashboard />} />
          <Route path="/tenders/provide/post" element={<PostTender />} />
          <Route path="/tenders/provide/my-tenders" element={<MyTenders />} />
          <Route path="/tenders/provide/bids" element={<ReceivedBids />} />
          <Route path="/tenders/provide/profile" element={<ProvideProfile />} />
          <Route path="/tenders/provide/settings" element={<ProvideSettings />} />
        </Route>

        {/* Protected Equipment Rent Routes (Rent Gear) */}
        <Route element={<RentLayout />}>
          <Route path="/equipments/rent/dashboard" element={<RentDashboard />} />
          <Route path="/equipments/rent/list" element={<EquipmentList />} />
          <Route path="/equipments/rent/equipment/:id" element={<EquipmentDetails />} />
          <Route path="/equipments/rent/my-rentals" element={<MyRentals />} />
          <Route path="/equipments/rent/profile" element={<RentProfile />} />
          <Route path="/equipments/rent/settings" element={<RentSettings />} />
        </Route>

        {/* Protected Equipment Provide Routes (Lender Portal) */}
        <Route element={<EquipmentProvideLayout />}>
          <Route path="/equipments/provide/dashboard" element={<EquipmentProvideDashboard />} />
          <Route path="/equipments/provide/post" element={<PostEquipment />} />
          <Route path="/equipments/provide/my-equipments" element={<MyEquipments />} />
          <Route path="/equipments/provide/requests" element={<RentalRequests />} />
          <Route path="/equipments/provide/profile" element={<EquipmentProvideProfile />} />
          <Route path="/equipments/provide/settings" element={<EquipmentProvideSettings />} />
        </Route>

        {/* Protected Machinery Buy Routes (Marketplace) */}
        <Route element={<BuyLayout />}>
          <Route path="/machinery/buy/dashboard" element={<BuyDashboard />} />
          <Route path="/machinery/buy/list" element={<MachineryList />} />
          <Route path="/machinery/buy/item/:id" element={<MachineDetails />} />
          <Route path="/machinery/buy/my-orders" element={<MyOrders />} />
          <Route path="/machinery/buy/profile" element={<BuyProfile />} />
          <Route path="/machinery/buy/settings" element={<BuySettings />} />
        </Route>

        {/* Protected Machinery Sell Routes (Seller Console) */}
        <Route element={<SellLayout />}>
          <Route path="/machinery/sell/dashboard" element={<SellDashboard />} />
          <Route path="/machinery/sell/post" element={<PostMachine />} />
          <Route path="/machinery/sell/inventory" element={<MyMachinery />} />
          <Route path="/machinery/sell/inquiries" element={<MachineryInquiries />} />
          <Route path="/machinery/sell/profile" element={<SellProfile />} />
          <Route path="/machinery/sell/settings" element={<SellSettings />} />
        </Route>

        {/* Protected PMC Browse Routes (Hire PMC) */}
        <Route element={<PMCBrowseLayout />}>
          <Route path="/pmc/browse/dashboard" element={<PMCBrowseDashboard />} />
          <Route path="/pmc/browse/consultants" element={<PMCConsultantList />} />
          <Route path="/pmc/browse/consultants/:id" element={<PMCConsultantDetails />} />
          <Route path="/pmc/browse/my-hires" element={<PMCMyHires />} />
          <Route path="/pmc/browse/profile" element={<PMCBrowseProfile />} />
          <Route path="/pmc/browse/settings" element={<PMCBrowseSettings />} />
        </Route>

        {/* Protected PMC Provide Routes (Offer PMC) */}
        <Route element={<PMCProvideLayout />}>
          <Route path="/pmc/provide/dashboard" element={<PMCProvideDashboard />} />
          <Route path="/pmc/provide/post" element={<PMCPostService />} />
          <Route path="/pmc/provide/my-services" element={<PMCMyServices />} />
          <Route path="/pmc/provide/inquiries" element={<PMCInquiries />} />
          <Route path="/pmc/provide/profile" element={<PMCProvideProfile />} />
          <Route path="/pmc/provide/settings" element={<PMCProvideSettings />} />
        </Route>

        {/* Protected CSM Browse Routes (Hire CSM) */}
        <Route element={<CSMBrowseLayout />}>
          <Route path="/csm/browse/dashboard" element={<CSMBrowseDashboard />} />
          <Route path="/csm/browse/list" element={<CSMList />} />
          <Route path="/csm/browse/list/:id" element={<CSMDetails />} />
          <Route path="/csm/browse/my-hires" element={<CSMMyHires />} />
          <Route path="/csm/browse/profile" element={<CSMBrowseProfile />} />
          <Route path="/csm/browse/settings" element={<CSMBrowseSettings />} />
        </Route>

        {/* Protected CSM Provide Routes (Offer CSM) */}
        <Route element={<CSMProvideLayout />}>
          <Route path="/csm/provide/dashboard" element={<CSMProvideDashboard />} />
          <Route path="/csm/provide/post" element={<CSMPostService />} />
          <Route path="/csm/provide/my-services" element={<CSMMyServices />} />
          <Route path="/csm/provide/inquiries" element={<CSMInquiries />} />
          <Route path="/csm/provide/profile" element={<CSMProvideProfile />} />
          <Route path="/csm/provide/settings" element={<CSMProvideSettings />} />
        </Route>

        {/* Protected Logistics Browse Routes (Hire Logistics) */}
        <Route element={<LogisticsBrowseLayout />}>
          <Route path="/logistics/browse/dashboard" element={<LogisticsBrowseDashboard />} />
          <Route path="/logistics/browse/list" element={<LogisticsList />} />
          <Route path="/logistics/browse/list/:id" element={<LogisticsDetails />} />
          <Route path="/logistics/browse/my-hires" element={<LogisticsMyHires />} />
          <Route path="/logistics/browse/profile" element={<LogisticsBrowseProfile />} />
          <Route path="/logistics/browse/settings" element={<LogisticsBrowseSettings />} />
        </Route>

        {/* Protected Logistics Provide Routes (Offer Logistics) */}
        <Route element={<LogisticsProvideLayout />}>
          <Route path="/logistics/provide/dashboard" element={<LogisticsProvideDashboard />} />
          <Route path="/logistics/provide/post" element={<LogisticsPostService />} />
          <Route path="/logistics/provide/my-services" element={<LogisticsMyServices />} />
          <Route path="/logistics/provide/inquiries" element={<LogisticsInquiries />} />
          <Route path="/logistics/provide/profile" element={<LogisticsProvideProfile />} />
          <Route path="/logistics/provide/settings" element={<LogisticsProvideSettings />} />
        </Route>

        {/* Protected Vehicle Browse Routes (Hire Vehicle) */}
        <Route element={<VehicleBrowseLayout />}>
          <Route path="/vehicles/browse/dashboard" element={<VehicleBrowseDashboard />} />
          <Route path="/vehicles/browse/list" element={<VehiclesList />} />
          <Route path="/vehicles/browse/list/:id" element={<VehicleDetails />} />
          <Route path="/vehicles/browse/my-rentals" element={<VehicleMyRentals />} />
          <Route path="/vehicles/browse/profile" element={<VehicleBrowseProfile />} />
          <Route path="/vehicles/browse/settings" element={<VehicleBrowseSettings />} />
        </Route>

        {/* Protected Vehicle Provide Routes (Offer Vehicle) */}
        <Route element={<VehicleProvideLayout />}>
          <Route path="/vehicles/provide/dashboard" element={<VehicleProvideDashboard />} />
          <Route path="/vehicles/provide/post" element={<VehiclePostService />} />
          <Route path="/vehicles/provide/my-vehicles" element={<MyVehicles />} />
          <Route path="/vehicles/provide/inquiries" element={<VehicleInquiries />} />
          <Route path="/vehicles/provide/profile" element={<VehicleProvideProfile />} />
          <Route path="/vehicles/provide/settings" element={<VehicleProvideSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

