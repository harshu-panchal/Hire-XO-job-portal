import { Bell, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export const JobSeekerNavbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 px-5 py-4 flex items-center justify-between transition-all duration-300 select-none">
      <Link
        to="/jobs"
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
        <Link
          to="/recruiter"
          className="h-12 px-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center active:scale-90 transition-all shadow-lg"
        >
          <Building2 className="size-5" />
        </Link>
        <button className="relative size-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 active:bg-slate-100 dark:active:bg-white/10 active:scale-90 transition-all duration-200">
          <Bell className="h-6 w-6" />
          <span className="absolute top-3.5 right-3.5 size-2.5 bg-primary rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
      </div>
    </header>
  );
};
