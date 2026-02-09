import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  TrendingUp,
  Users,
  DollarSign,
  Briefcase,
  FileText,
} from "lucide-react";
import { adminService, type SystemStats } from "@/services/adminService";
import { toast } from "sonner";



const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
} as const;

export default function Reports() {
  const [isExporting, setIsExporting] = useState(false);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getSystemStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        toast.error("Failed to load reports data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate preparation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple CSV generation
    const headers = ["Month", "Users", "Revenue"];
    const rows = (stats?.charts.revenue || []).map((d, i) => {
      const userGrowth = stats?.charts.userGrowth[i]?.users || 0;
      return [d.name, userGrowth, d.value];
    });

    // Fallback if no data
    if (rows.length === 0) {
      toast.error("No data to export");
      setIsExporting(false);
      return;
    }

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `hire-xo-report-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
  };

  const pieData = stats ? [
    { name: "Employees", value: stats.users.byRole["job-seeker"] || 0 },
    { name: "Employers", value: stats.users.byRole["recruiter"] || 0 },
    { name: "Resources", value: stats.users.byRole["resource"] || 0 },
    { name: "Admins", value: stats.users.byRole["admin"] || 0 },
  ].filter(d => d.value > 0) : [];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
          <p className="text-slate-500 mt-1">
            View analytics and generate reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This Year</option>
          </select>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={isLoading ? "..." : stats?.users.total.toLocaleString() || "0"}
          change="+12.5%"
          icon={Users}
        />
        <StatCard
          title="Active Jobs"
          value={isLoading ? "..." : stats?.jobs.active.toLocaleString() || "0"}
          change="+8.2%"
          icon={Briefcase}
        />
        <StatCard
          title="Total Revenue"
          value={isLoading ? "..." : `₹${stats?.revenue.total.toLocaleString() || "0"}`}
          change="+18.7%"
          icon={DollarSign}
        />
        <StatCard
          title="Total Applications"
          value={isLoading ? "..." : stats?.applications.total.toLocaleString() || "0"}
          change="+5.4%"
          icon={FileText}
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">User Growth</h3>
              <p className="text-sm text-slate-500">
                Monthly new user registrations
              </p>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.charts.userGrowth || []}>
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
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Revenue</h3>
              <p className="text-sm text-slate-500">Monthly revenue in INR</p>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.charts.revenue || []}>
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
                <Bar dataKey="value" name="Revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            User Distribution
          </h3>
          <div className="h-[200px] flex items-center justify-center">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-slate-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Performing */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Top Employers
          </h3>
          <div className="space-y-4">
            {(stats?.topEmployers || []).map((employer, index) => (
              <div
                key={employer.name}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-medium text-slate-900">
                    {employer.name}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-slate-500">{employer.jobs} jobs</span>
                  <span className="text-slate-400 font-medium">
                    (Hires not yet tracked)
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.topEmployers || stats.topEmployers.length === 0) && (
              <p className="text-slate-500 text-sm">No employers found</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: any;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-xs font-medium text-green-600 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{title}</p>
    </div>
  );
}
