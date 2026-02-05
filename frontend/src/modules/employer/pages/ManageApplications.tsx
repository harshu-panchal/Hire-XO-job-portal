import { useState, useEffect } from "react";
import {
  Search,
  MoreVertical,
  Mail,
  Download,
  Clock,
  ChevronRight,
  Briefcase,
  X,
  Phone,
  User,
  ExternalLink,
  CheckCircle2,
  XCircle,
  UserPlus,
} from "lucide-react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { applicationService, type Application } from "@/services/applicationService";

const ManageApplications = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState("All");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const navigate = useNavigate();
  const { checkSubscription, user: currentUser } = useAuthStore();

  const searchQuery = searchParams.get("q") || "";
  const linkedId = searchParams.get("id");

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await applicationService.getReceivedApplications();
        const formatted = data.map((app: any) => ({
          id: app.id,
          name: app.applicantId?.name || "Unknown",
          role: app.jobId?.title || "Unknown Role",
          status: app.status,
          appliedAt: new Date(app.appliedAt).toLocaleDateString(),
          experience: app.applicantId?.profile?.experience || [],
          skills: app.applicantId?.profile?.skills || [],
          bio: app.applicantId?.profile?.bio || "No bio provided.",
          email: app.applicantId?.email,
          phone: app.applicantId?.phoneNumber,
          avatarUrl: app.applicantId?.profilePhoto,
          avatar: (app.applicantId?.name || "U").charAt(0).toUpperCase(),
          message: app.message,
        }));
        setApplications(formatted);

        // Check for deep-linked application ID
        if (linkedId) {
          const app = formatted.find((a: any) => a.id === linkedId);
          if (app) setSelectedApp(app);
        }
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();

    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchQuery, linkedId]);

  const statusColors = {
    Shortlisted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Interviewed: "bg-green-500/10 text-green-600 border-green-500/20",
    Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Rejected: "bg-red-500/10 text-red-600 border-red-500/20",
    Accepted: "bg-green-500/10 text-green-600 border-green-500/20", // Added Accepted mappings
  };

  const handleViewDetails = (app: any) => {
    setSelectedApp(app);
    setActiveMenu(null);
  };

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      setUpdating(appId);
      await applicationService.updateApplicationStatus(appId, newStatus as any);
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      setActiveMenu(null);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const handleRestrictedAction = (action: string, app: any) => {
    setActiveMenu(null);
    if (checkSubscription()) {
      alert(`${action} successfully! For ${app.name}`);
      return;
    }

    if (confirm(`You need a PRO subscription to ${action.toLowerCase()}. Upgrade now?`)) {
      navigate("/employer/subscription");
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Applications...</div>;

  return (
    <div className="py-6 space-y-8 select-none pb-24">
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-black tracking-tighter">
          Manage <br />
          <span className="text-primary">Applications</span>
        </h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
          Review and process candidates
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-5 px-5">
        {["All", "Pending", "Shortlisted", "Interviewed", "Rejected"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-90 ${
              filter === f
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black placeholder:text-slate-400"
        />
      </div>

      {/* Applications List */}
      <div className="grid gap-4">
        {applications.length > 0 ? (
          applications
            .filter((app) => filter === "All" || app.status === filter)
            .filter(
              (app) =>
                app.name.toLowerCase().includes(search.toLowerCase()) ||
                app.role.toLowerCase().includes(search.toLowerCase())
            )
            .map((app) => (
              <div
                key={app.id}
                onClick={() => handleViewDetails(app)}
                className="bg-white dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-white/10 overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-black text-lg">{app.avatar}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-base truncate tracking-tight">{app.name}</h3>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                          {app.role}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveMenu(activeMenu === app.id ? null : app.id)}
                        className={`size-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 active:scale-90 transition-all ${activeMenu === app.id ? "ring-2 ring-primary/20 bg-primary/5 text-primary" : ""}`}
                      >
                        <MoreVertical className="size-5" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenu === app.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/10 shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-2 space-y-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(app.id, "Shortlisted")}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-600 dark:text-slate-300 transition-colors text-xs font-bold"
                              >
                                <UserPlus className="size-4 text-blue-500" />
                                Shortlist Candidate
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(app.id, "Accepted")}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-500/10 text-slate-600 dark:text-slate-300 transition-colors text-xs font-bold"
                              >
                                <CheckCircle2 className="size-4 text-green-500" />
                                Hire Candidate
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(app.id, "Rejected")}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-600 dark:text-slate-300 transition-colors text-xs font-bold"
                              >
                                <XCircle className="size-4 text-red-500" />
                                Reject Application
                              </button>
                              <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
                              <button
                                type="button"
                                onClick={() => handleViewDetails(app)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors text-xs font-bold"
                              >
                                <User className="size-4 text-slate-400" />
                                View Full Profile
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Clock className="size-3.5 mr-1.5 text-primary/60" />
                      {app.appliedAt}
                    </div>
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Briefcase className="size-3.5 mr-1.5 text-primary/60" />
                      {Array.isArray(app.experience) && app.experience.length > 0
                        ? `${app.experience[0].role} at ${app.experience[0].company}`
                        : "No experience listed"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        statusColors[app.status as keyof typeof statusColors] ||
                        statusColors.Pending
                      }`}
                    >
                      {app.status}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(app)}
                        className="size-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center active:scale-90 transition-all"
                      >
                        <Mail className="size-4 text-slate-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRestrictedAction("Download Resume", app)}
                        className="size-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center active:scale-90 transition-all"
                      >
                        <Download className="size-4 text-slate-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleViewDetails(app)}
                  className="w-full h-12 bg-slate-50 dark:bg-white/5 flex items-center justify-center gap-2 border-t border-slate-100 dark:border-white/5 active:bg-slate-100 transition-all"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    View Full Profile
                  </span>
                  <ChevronRight className="size-3.5 text-slate-400" />
                </button>
              </div>
            ))
        ) : (
          <div className="text-center py-10 text-slate-400">No applications found.</div>
        )}
      </div>

      {/* Candidate Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-10 h-full sm:h-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl uppercase">
                  {selectedApp.avatarUrl ? (
                    <img
                      src={selectedApp.avatarUrl}
                      alt={selectedApp.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    selectedApp.avatar
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{selectedApp.name}</h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                    {selectedApp.role}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="size-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 no-scrollbar">
              {/* Bio Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  About Candidate
                </h3>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{selectedApp.bio}"
                </p>
              </div>

              {/* Message from Candidate */}
              {selectedApp.message && (
                <div className="p-5 bg-primary/5 rounded-3xl border border-primary/10 space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <Mail className="size-3" /> Application Message
                  </h3>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {selectedApp.message}
                  </p>
                </div>
              )}

              {/* Experience */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Briefcase className="size-4" /> Professional Experience
                </h3>
                <div className="space-y-4">
                  {Array.isArray(selectedApp.experience) && selectedApp.experience.length > 0 ? (
                    selectedApp.experience.map((exp: any, i: number) => (
                      <div key={i} className="flex gap-4 relative">
                        {i !== selectedApp.experience.length - 1 && (
                          <div className="absolute left-3.5 top-10 bottom-0 w-0.5 bg-slate-100 dark:bg-white/5" />
                        )}
                        <div className="size-7 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 z-10 border-2 border-white dark:border-slate-900">
                          <div className="size-2 rounded-full bg-primary" />
                        </div>
                        <div className="space-y-1 pb-4">
                          <h4 className="font-black text-sm">{exp.role}</h4>
                          <p className="text-xs font-bold text-primary">{exp.company}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                            {exp.period}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm font-bold text-slate-400">
                      No experience details provided.
                    </p>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Key Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.skills.length > 0 ? (
                    selectedApp.skills.map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm font-bold text-slate-400">No skills listed.</p>
                  )}
                </div>
              </div>

              {/* Contact Information (Restricted) */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                      <Mail className="size-3" /> Email Address
                    </p>
                    <p className="text-sm font-black truncate">
                      {checkSubscription()
                        ? selectedApp.email
                        : selectedApp.email.replace(/(?<=.{3}).(?=.*@)/g, "*")}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                      <Phone className="size-3" /> Phone Number
                    </p>
                    <p className="text-sm font-black">
                      {checkSubscription()
                        ? selectedApp.phone || "Not provided"
                        : selectedApp.phone
                          ? selectedApp.phone.replace(/.(?=.{4})/g, "*")
                          : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 sm:p-8 bg-slate-50 dark:bg-white/5 flex gap-4">
              <button
                type="button"
                onClick={() => handleRestrictedAction("Contact Candidate", selectedApp)}
                className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Hire Candidate
                <ExternalLink className="size-4" />
              </button>
              <button
                type="button"
                className="h-14 px-8 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-white/5 font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
                onClick={() => handleRestrictedAction("Download Resume", selectedApp)}
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
