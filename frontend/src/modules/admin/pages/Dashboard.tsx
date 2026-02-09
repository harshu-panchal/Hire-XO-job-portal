import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { adminService, type SystemStats } from "../../../services/adminService";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  Briefcase,
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  Loader2
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
} as const;

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getSystemStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back, {user?.name?.split(" ")[0] || "Admin"}
        </h1>
        <p className="text-slate-500 mt-1">
          Here's what's happening with your platform today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Users"
          value={stats?.users.total.toLocaleString() || "0"}
          change="+12.5%"
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Jobs"
          value={stats?.jobs.active.toLocaleString() || "0"}
          change="+8.2%"
          icon={Briefcase}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Revenue"
          value={`₹${stats?.revenue.total.toLocaleString() || "0"}`}
          change="+18.7%"
          icon={DollarSign}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Resources"
          value={stats?.resources.total.toLocaleString() || "0"}
          change="+5.4%"
          icon={CreditCard}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Revenue Overview
              </h3>
              <p className="text-sm text-slate-500">
                Monthly revenue performance
              </p>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.charts?.revenue || []}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-10" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Activity
            </h3>
            <button className="text-sm text-primary font-medium hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {stats?.recentActivity?.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {item.action}
                  </p>
                  <p className="text-xs text-slate-500">{item.user}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {new Date(item.time).toLocaleDateString()}
                </span>
              </div>
            ))}
            {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
              <p className="text-sm text-slate-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-slate-200 p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction label="Manage Users" icon={Users} onClick={() => navigate("/admin/employers")} />
          <QuickAction
            label="Account Settings"
            icon={CreditCard}
            onClick={() => navigate("/admin/settings")}
          />
          <QuickAction
            label="View Reports"
            icon={TrendingUp}
            onClick={() => navigate("/admin/reports")}
          />
          <QuickAction
            label="Manage Resources"
            icon={Briefcase}
            onClick={() => navigate("/admin/resources")}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBg,
  iconColor,
  onClick
}: {
  title: string;
  value: string;
  change: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6" onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <ArrowUpRight className="w-4 h-4" />
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{title}</p>
      </div>
    </div>
  );
}

function QuickAction({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: any;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors group"
    >
      <div className="p-3 rounded-lg bg-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon className="w-5 h-5 text-slate-600 group-hover:text-white" />
      </div>
      <span className="text-sm font-medium text-slate-900">{label}</span>
    </button>
  );
}
