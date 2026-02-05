import {
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  ChevronRight,
  Settings,
  LogOut,
  Camera,
  Github,
  Linkedin,
  Twitter,
  Bookmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { useAuthStore } from "@/store/useAuthStore";

const Profile = () => {
  const navigate = useNavigate();
  const { savedJobs, applications, certificates } = useEmployeeStore();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const menuItems = [
    {
      label: "Certificates",
      icon: GraduationCap,
      color: "text-green-500",
      bg: "bg-green-500/10",
      path: "/certificates",
      count: Array.isArray(certificates) ? certificates.length : 0,
    },
    {
      label: "My Applications",
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      path: "/my-applications",
      count: applications?.jobs?.length || 0,
    },
    {
      label: "Saved Jobs",
      icon: Bookmark,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      path: "/saved-jobs",
      count: Array.isArray(savedJobs) ? savedJobs.length : 0,
    },
    {
      label: "Applied Jobs",
      icon: Briefcase,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      path: "/my-applications",
      count: applications?.jobs?.length || 0,
    },
    {
      label: "Account Settings",
      icon: Settings,
      color: "text-slate-500",
      bg: "bg-slate-500/10",
      path: "/settings",
    },
  ];

  const secondaryItems = [
    {
      label: "Switch Account Role",
      icon: User,
      color: "text-primary",
      bg: "bg-primary/10",
      path: "/",
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden relative flex flex-col py-6 space-y-8 pb-32">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-primary/5 -skew-y-6 -translate-y-12 -z-10" />

      {/* Profile Header */}
      <div className="relative pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="size-32 rounded-[3rem] border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden ring-4 ring-primary/20">
              <img
                src={
                  user.profilePhoto ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                }
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => navigate("/settings")}
              className="absolute bottom-0 right-0 size-10 bg-primary text-white rounded-2xl flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg active:scale-90 transition-all"
            >
              <Camera className="size-5" />
            </button>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight leading-tight">{user.name}</h1>
            <p className="text-primary font-black uppercase tracking-widest text-xs">{user.role}</p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            {user.profile?.githubUrl && (
              <button
                onClick={() => window.open(user.profile.githubUrl, "_blank")}
                className="size-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center active:scale-90 transition-all"
              >
                <Github className="size-5 text-slate-400" />
              </button>
            )}
            {user.profile?.linkedinUrl && (
              <button
                onClick={() => window.open(user.profile.linkedinUrl, "_blank")}
                className="size-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center active:scale-90 transition-all"
              >
                <Linkedin className="size-5 text-slate-400" />
              </button>
            )}
            {user.profile?.twitterUrl && (
              <button
                onClick={() => window.open(user.profile.twitterUrl, "_blank")}
                className="size-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center active:scale-90 transition-all"
              >
                <Twitter className="size-5 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4">
        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
              <Mail className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Email Address
              </p>
              <p className="text-sm font-black truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
              <MapPin className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Location
              </p>
              <p className="text-sm font-black truncate">{user.profile?.location || "India"}</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        {user.profile?.skills && user.profile.skills.length > 0 && (
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/10 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {user.profile?.experience && user.profile.experience.length > 0 && (
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Experience
              </h3>
              <button
                onClick={() => navigate("/settings")}
                className="text-[10px] font-black text-primary uppercase tracking-widest"
              >
                Edit
              </button>
            </div>
            <div className="space-y-6">
              {Array.isArray(user.profile.experience) &&
                user.profile.experience.map((exp, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="size-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                      <Briefcase className="size-6 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-sm tracking-tight">{exp.role}</h4>
                      <p className="text-primary font-black text-[10px] uppercase tracking-widest">
                        {exp.company}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {exp.period}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className={`w-full p-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-white/5 transition-all ${i !== menuItems.length - 1 ? "border-b border-slate-100 dark:border-white/5" : ""
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`size-12 rounded-2xl ${item.bg} flex items-center justify-center`}>
                  <item.icon className={`size-6 ${item.color}`} />
                </div>
                <span className="text-sm font-black tracking-tight">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.count !== undefined && (
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/10 text-[10px] font-black text-slate-400">
                    {item.count}
                  </span>
                )}
                <ChevronRight className="size-4 text-slate-300" />
              </div>
            </button>
          ))}
        </div>

        {/* Secondary Items */}
        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden">
          {secondaryItems.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className={`w-full p-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-white/5 transition-all ${i !== secondaryItems.length - 1 ? "border-b border-slate-100 dark:border-white/5" : ""
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`size-12 rounded-2xl ${item.bg} flex items-center justify-center`}>
                  <item.icon className={`size-6 ${item.color}`} />
                </div>
                <span className="text-sm font-black tracking-tight">{item.label}</span>
              </div>
              <ChevronRight className="size-4 text-slate-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="w-full h-16 rounded-[2rem] bg-red-500/10 text-red-600 flex items-center justify-center gap-3 active:scale-95 transition-all border border-red-500/20"
      >
        <LogOut className="size-5" />
        <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
      </button>

      <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] pt-4 font-branding">
        HireXO v1.0.4
      </p>
    </div>
  );
};

export default Profile;
