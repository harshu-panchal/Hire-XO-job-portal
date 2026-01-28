import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusSquare, Users, Settings, Bell } from "lucide-react";

const RecruiterLayout = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30">
      {/* Mobile-optimized Header */}
      <header className="sticky top-0 z-50 w-full bg-slate-50/80 dark:bg-background/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
        <div className="max-w-[430px] mx-auto px-5 h-20 flex items-center justify-between">
          <Link
            to="/recruiter"
            className="flex items-center gap-2 active:scale-95 transition-transform"
          >
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-black text-xl tracking-tighter italic">H</span>
            </div>
            <span className="text-xl font-black tracking-tighter">
              Hire <span className="text-primary">XO</span>
            </span>
          </Link>
          <div className="flex gap-2.5">
            <button className="relative size-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center active:scale-90 transition-all">
              <Bell className="size-5 text-slate-400" />
              <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full ring-4 ring-slate-50 dark:ring-background"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[430px] mx-auto px-5">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 px-8 py-4 z-50">
        <div className="flex items-center justify-between">
          <Link
            to="/recruiter"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/recruiter") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/recruiter") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"}`}
            >
              <LayoutDashboard
                className={`h-6 w-6 ${isActive("/recruiter") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/recruiter") ? "opacity-100" : "opacity-40"}`}
            >
              Dash
            </span>
          </Link>

          <Link
            to="/recruiter/post-job"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/recruiter/post-job") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/recruiter/post-job") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"}`}
            >
              <PlusSquare
                className={`h-6 w-6 ${isActive("/recruiter/post-job") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/recruiter/post-job") ? "opacity-100" : "opacity-40"}`}
            >
              Post
            </span>
          </Link>

          <Link
            to="/recruiter/applications"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/recruiter/applications") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/recruiter/applications") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"}`}
            >
              <Users
                className={`h-6 w-6 ${isActive("/recruiter/applications") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/recruiter/applications") ? "opacity-100" : "opacity-40"}`}
            >
              Apps
            </span>
          </Link>

          <Link
            to="/recruiter/settings"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-90 ${isActive("/recruiter/settings") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive("/recruiter/settings") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"}`}
            >
              <Settings
                className={`h-6 w-6 ${isActive("/recruiter/settings") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive("/recruiter/settings") ? "opacity-100" : "opacity-40"}`}
            >
              Setup
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default RecruiterLayout;
