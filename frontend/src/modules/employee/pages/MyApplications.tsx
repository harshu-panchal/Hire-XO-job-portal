import { useNavigate } from "react-router-dom";
import { ChevronLeft, Building2, Calendar, MapPin, Search } from "lucide-react";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useState, useEffect } from "react";

const MyApplications = () => {
  const navigate = useNavigate();
  const { applications, fetchMyApplications, isLoading } = useEmployeeStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  // Handle the structure of applications (it might be { jobs: [], resources: [] } or just [])
  const jobApplications = (applications as any)?.jobs || [];
  const resourceApplications = (applications as any)?.resources || [];

  // Combine and format
  const formattedJobs = Array.isArray(jobApplications)
    ? jobApplications.map((app: any) => ({
        id: app.id,
        title: app.jobId?.title || "Unknown Job",
        company: app.jobId?.company || "Unknown Company",
        companyLogo: app.jobId?.companyLogo, // Assuming populated
        location: app.jobId?.location || "N/A",
        postedAt: app.jobId?.postedAt ? new Date(app.jobId.postedAt).toLocaleDateString() : "N/A",
        appType: "Job",
        status: app.status,
      }))
    : [];

  const formattedResources = Array.isArray(resourceApplications)
    ? resourceApplications.map((app: any) => ({
        id: app.id,
        title: app.resourceId?.title || app.resourceId?.name || "Resource Application",
        company: "Resource", // Resource doesn't always have company
        companyLogo: null,
        location: app.resourceId?.location || "N/A",
        postedAt: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A",
        appType: "Resource",
        status: app.status,
      }))
    : [];

  const allApplications = [...formattedJobs, ...formattedResources].filter(
    (app) =>
      app.title.toLowerCase().includes(search.toLowerCase()) ||
      app.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-32 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 px-5 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all shadow-sm"
          >
            <ChevronLeft className="size-6" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight">My Applications</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {allApplications.length} Active
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="size-5" />
          </div>
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10">Loading applications...</div>
          ) : (
            allApplications.map((app) => (
              <div
                key={`${app.appType}-${app.id}`}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm active:scale-[0.98] transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <div className="size-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                      {app.companyLogo ? (
                        <img
                          src={app.companyLogo}
                          alt={app.company}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building2 className="size-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-base tracking-tight leading-tight mb-1">
                        {app.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-500">
                          {app.company}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                            app.appType === "Job"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-purple-500/10 text-purple-500"
                          }`}
                        >
                          {app.appType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-current/10`}
                  >
                    {app.status || "Applied"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="size-4" />
                    <span className="text-xs font-bold">{app.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 justify-end">
                    <Calendar className="size-4" />
                    <span className="text-xs font-bold">{app.postedAt}</span>
                  </div>
                </div>
              </div>
            ))
          )}

          {!isLoading && allApplications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="size-20 rounded-full bg-slate-100 flex items-center justify-center">
                <Building2 className="size-10 text-slate-300" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  No Applications
                </h3>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  Start applying for jobs or resources to see them here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
