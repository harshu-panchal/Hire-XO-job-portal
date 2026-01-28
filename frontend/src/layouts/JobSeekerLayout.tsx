import { Outlet, Link, useLocation } from "react-router-dom";
import { Briefcase, CreditCard, User, Package } from "lucide-react";
import { JobSeekerNavbar } from "@/modules/job-seeker/components/JobSeekerNavbar";

const JobSeekerLayout = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto overflow-x-hidden border-x border-gray-100 dark:border-white/5 shadow-2xl bg-slate-50 dark:bg-background transition-colors duration-300">
      {/* Header */}
      <JobSeekerNavbar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="px-5">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 dark:bg-background/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/5 z-50 px-8 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)] select-none">
        <div className="flex justify-between items-center h-20">
          <Link
            to="/jobs"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/jobs") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/jobs") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"}`}
            >
              <Briefcase className={`h-6 w-6 ${isActive("/jobs") ? "fill-primary/20" : ""}`} />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/jobs") ? "opacity-100" : "opacity-40"}`}
            >
              Jobs
            </span>
          </Link>
          <Link
            to="/resources"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/resources") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/resources") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"}`}
            >
              <Package className={`h-6 w-6 ${isActive("/resources") ? "fill-primary/20" : ""}`} />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/resources") ? "opacity-100" : "opacity-40"}`}
            >
              Resources
            </span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/profile") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/profile") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"}`}
            >
              <User className={`h-6 w-6 ${isActive("/profile") ? "fill-primary/20" : ""}`} />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/profile") ? "opacity-100" : "opacity-40"}`}
            >
              Me
            </span>
          </Link>
          <Link
            to="/subscriptions"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/subscriptions") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/subscriptions") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"}`}
            >
              <CreditCard
                className={`h-6 w-6 ${isActive("/subscriptions") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/subscriptions") ? "opacity-100" : "opacity-40"}`}
            >
              Plans
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default JobSeekerLayout;
