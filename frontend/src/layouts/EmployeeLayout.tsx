import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, PlusSquare, Video, CreditCard, HelpCircle } from "lucide-react";
import { EmployeeNavbar } from "@/modules/employee/components/EmployeeNavbar";
import { useAuthStore } from "@/store/useAuthStore";

const EmployeeLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const handleProtectedNavigation = (path: string, e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/login/employee");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto overflow-x-hidden border-x border-gray-100 shadow-2xl bg-slate-50 transition-colors duration-300">
      {/* Header */}
      <EmployeeNavbar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="px-5">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 backdrop-blur-xl border-t border-slate-200/50 z-50 px-2 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)] select-none">
        <div className="flex justify-between items-center h-20 w-full px-2">
          <Link
            to="/jobs"
            className={`flex flex-col items-center gap-1 min-w-[3.5rem] transition-all duration-200 active:scale-90 ${isActive("/jobs") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2 rounded-2xl transition-all duration-200 ${isActive("/jobs") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"}`}
            >
              <Home className={`h-5 w-5 ${isActive("/jobs") ? "fill-primary/20" : ""}`} />
            </div>
            <span
              className={`text-[9px] font-black uppercase tracking-wider ${isActive("/jobs") ? "opacity-100" : "opacity-40"}`}
            >
              Home
            </span>
          </Link>

          <Link
            to="/post"
            className={`flex flex-col items-center gap-1 min-w-[3.5rem] transition-all duration-200 active:scale-90 ${isActive("/post") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2 rounded-2xl transition-all duration-200 ${isActive("/post") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"}`}
            >
              <PlusSquare className={`h-5 w-5 ${isActive("/post") ? "fill-primary/20" : ""}`} />
            </div>
            <span
              className={`text-[9px] font-black uppercase tracking-wider ${isActive("/post") ? "opacity-100" : "opacity-40"}`}
            >
              Post
            </span>
          </Link>

          <Link
            to="/interviews"
            onClick={(e) => handleProtectedNavigation("/interviews", e)}
            className={`flex flex-col items-center gap-1 min-w-[3.5rem] transition-all duration-200 active:scale-90 ${isActive("/interviews") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2 rounded-2xl transition-all duration-200 ${isActive("/interviews") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"}`}
            >
              <Video className={`h-5 w-5 ${isActive("/interviews") ? "fill-primary/20" : ""}`} />
            </div>
            <span
              className={`text-[9px] font-black uppercase tracking-wider ${isActive("/interviews") ? "opacity-100" : "opacity-40"}`}
            >
              Interview
            </span>
          </Link>

          <Link
            to="/payments"
            onClick={(e) => handleProtectedNavigation("/payments", e)}
            className={`flex flex-col items-center gap-1 min-w-[3.5rem] transition-all duration-200 active:scale-90 ${isActive("/payments") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2 rounded-2xl transition-all duration-200 ${isActive("/payments") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"}`}
            >
              <CreditCard
                className={`h-5 w-5 ${isActive("/payments") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[9px] font-black uppercase tracking-wider ${isActive("/payments") ? "opacity-100" : "opacity-40"}`}
            >
              Payment
            </span>
          </Link>

          <Link
            to="/faq"
            className={`flex flex-col items-center gap-1 min-w-[3.5rem] transition-all duration-200 active:scale-90 ${isActive("/faq") ? "text-primary" : "text-slate-400"
              }`}
          >
            <div
              className={`p-2 rounded-2xl transition-all duration-200 ${isActive("/faq") ? "bg-primary/10 scale-110 shadow-lg shadow-primary/5" : "bg-transparent"}`}
            >
              <HelpCircle
                className={`h-5 w-5 ${isActive("/faq") ? "fill-primary/20" : ""}`}
              />
            </div>
            <span
              className={`text-[9px] font-black uppercase tracking-wider ${isActive("/faq") ? "opacity-100" : "opacity-40"}`}
            >
              FAQ
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default EmployeeLayout;
