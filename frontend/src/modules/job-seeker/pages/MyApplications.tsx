import { useNavigate } from "react-router-dom";
import { ChevronLeft, Building2, Calendar, MapPin, Search } from "lucide-react";

const MyApplications = () => {
  const navigate = useNavigate();

  // Mock data for applications
  const applications = [
    {
      id: "1",
      jobTitle: "Senior Product Designer",
      company: "Spotify",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png",
      location: "Stockholm, Sweden",
      appliedDate: "Jan 12, 2024",
      status: "In Review",
      statusColor: "text-amber-500",
      statusBg: "bg-amber-500/10",
      salary: "$120k - $160k",
    },
    {
      id: "2",
      jobTitle: "Frontend Developer",
      company: "Airbnb",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png",
      location: "San Francisco, CA",
      appliedDate: "Jan 08, 2024",
      status: "Interview",
      statusColor: "text-primary",
      statusBg: "bg-primary/10",
      salary: "$140k - $180k",
    },
    {
      id: "3",
      jobTitle: "UX Researcher",
      company: "Netflix",
      companyLogo: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png",
      location: "Los Gatos, CA",
      appliedDate: "Dec 15, 2023",
      status: "Rejected",
      statusColor: "text-red-500",
      statusBg: "bg-red-500/10",
      salary: "$130k - $150k",
    },
    {
      id: "4",
      jobTitle: "Product Manager",
      company: "Linear",
      companyLogo: "",
      location: "Remote",
      appliedDate: "Jan 18, 2024",
      status: "Applied",
      statusColor: "text-blue-500",
      statusBg: "bg-blue-500/10",
      salary: "$160k - $200k",
    },
  ];

  return (
    <div className="pb-32 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 px-5 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all shadow-sm"
          >
            <ChevronLeft className="size-6" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight">My Applications</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {applications.length} Active
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
            className="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm active:scale-[0.98] transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  <div className="size-14 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center p-2">
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
                      {app.jobTitle}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {app.company}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl ${app.statusBg} ${app.statusColor} text-[10px] font-black uppercase tracking-widest border border-current/10`}
                >
                  {app.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="size-4" />
                  <span className="text-xs font-bold">{app.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 justify-end">
                  <Calendar className="size-4" />
                  <span className="text-xs font-bold">{app.appliedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
