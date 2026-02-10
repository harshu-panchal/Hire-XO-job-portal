import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  X,
  DollarSign,
  Briefcase,
  ChevronDown,
  Layers,
  FileText,
  BadgeCheck,
  Building2,
  Truck,
  Wrench,
  CarFront,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import logo from "@/assets/logo.png";

const mainItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Job Seekers", path: "/admin/job-seekers" },
  { icon: Building2, label: "Employers", path: "/admin/employers" },
];

const financialItems = [
  { icon: CreditCard, label: "Employee Plans", path: "/admin/employee-plans" },
  { icon: CreditCard, label: "Employer Plans", path: "/admin/employer-plans" },
  { icon: DollarSign, label: "Payments", path: "/admin/payments" },
];

const systemItems = [
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: BadgeCheck, label: "Certificates", path: "/admin/certificates" },
  { icon: Settings, label: "Admin Settings", path: "/admin/settings" },
];

const resourceItems = [
  { icon: DollarSign, label: "Investment", path: "/admin/resources/investors" },
  { icon: FileText, label: "Tenders", path: "/admin/resources/tenders" },
  { icon: Briefcase, label: "PMC", path: "/admin/resources/pmc" },
  { icon: Wrench, label: "Machinery", path: "/admin/resources/machinery" },
  { icon: Users, label: "CSM", path: "/admin/resources/csm" },
  { icon: Truck, label: "Logistics", path: "/admin/resources/logistics" },
  { icon: CarFront, label: "Vehicles", path: "/admin/resources/vehicles" },
  { icon: Layers, label: "Equipments", path: "/admin/resources/equipments" },
];

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login/admin");
  };

  const NavItem = ({ item }: { item: any }) => (
    <NavLink
      to={item.path}
      end={item.path === "/admin"}
      onClick={onClose}
      className={({ isActive }: { isActive: boolean }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
          isActive
            ? "bg-primary text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )
      }
    >
      <item.icon className="w-5 h-5" />
      <span className="text-sm font-medium">{item.label}</span>
    </NavLink>
  );

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 w-full border-r border-slate-200 overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-slate-100 shrink-0">
        <div className="flex flex-col gap-1 text-left">
          <img src={logo} alt="HireXO" className="h-10 w-auto object-contain self-start" />
          <span className="text-[10px] uppercase tracking-wider text-primary font-bold ml-1">Admin Console</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-6 scrollbar-hide">
        {/* Main Management */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Management
          </p>
          {mainItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {/* Financials */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Financials
          </p>
          {financialItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {/* Resources Dropdown */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Entities
          </p>
          <button
            onClick={() => setIsResourcesOpen(!isResourcesOpen)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200",
              isResourcesOpen
                ? "bg-slate-50 text-slate-900 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-primary" />
              <span className="text-sm">Extended Resources</span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-300 opacity-50",
                isResourcesOpen && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence>
            {isResourcesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pl-4 space-y-0.5 pt-1 border-l-2 border-slate-100 ml-5 mt-1">
                  {resourceItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }: { isActive: boolean }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                          isActive
                            ? "text-primary bg-primary/5 font-medium"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        )
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* System */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            System
          </p>
          {systemItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
