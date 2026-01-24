import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import JobSeekerLayout from "./layouts/JobSeekerLayout";
import RecruiterLayout from "./layouts/RecruiterLayout";
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
import RecruiterDashboard from "./modules/recruiter/pages/RecruiterDashboard";
import PostJob from "./modules/recruiter/pages/PostJob";
import ManageApplications from "./modules/recruiter/pages/ManageApplications";
import RecruiterSettings from "./modules/recruiter/pages/RecruiterSettings";
import StyleGuide from "./modules/resources/pages/StyleGuide";

function App() {
  return (
    <Router>
      <Routes>
        {/* Job Seeker Routes */}
        <Route element={<JobSeekerLayout />}>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
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

        {/* Recruiter Routes */}
        <Route element={<RecruiterLayout />}>
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/post-job" element={<PostJob />} />
          <Route path="/recruiter/applications" element={<ManageApplications />} />
          <Route path="/recruiter/settings" element={<RecruiterSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
