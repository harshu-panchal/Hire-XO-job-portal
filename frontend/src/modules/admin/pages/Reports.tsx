import { useState, useEffect } from "react";
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
  Boxes,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Loader2
} from "lucide-react";
import { adminService, type SystemStats } from "@/services/adminService";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const PIE_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#F43F5E"];

export default function Reports() {
  const [isExporting, setIsExporting] = useState(false);
  const [timeRange, setTimeRange] = useState("30");
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async (range: string) => {
    setIsLoading(true);
    try {
      const data = await adminService.getSystemStats(range);
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast.error("Failed to load reports data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(timeRange);
  }, [timeRange]);

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

  const roleDistributionData = stats ? [
    { name: "Employees", value: stats.users.byRole["job-seeker"] || 0 },
    { name: "Employers", value: stats.users.byRole["recruiter"] || 0 },
    { name: "Resources", value: stats.users.byRole["resource"] || 0 },
    { name: "Admins", value: stats.users.byRole["admin"] || 0 },
  ].filter(d => d.value > 0) : [];

  const resourceDistributionData = stats ? [
    { name: "Investors", value: (stats.resources as any).investors || 0 },
    { name: "Tenders", value: (stats.resources as any).tenders || 0 },
    { name: "Equipments", value: (stats.resources as any).equipments || 0 },
    { name: "Machinery", value: (stats.resources as any).machinery || 0 },
    { name: "PMC", value: (stats.resources as any).pmc || 0 },
    { name: "CSM", value: (stats.resources as any).csm || 0 },
    { name: "Logistics", value: (stats.resources as any).logistics || 0 },
    { name: "Vehicles", value: (stats.resources as any).vehicles || 0 },
  ].filter(d => d.value > 0) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Platform Analytics</h1>
          <p className="text-slate-500 mt-1">
            Comprehensive overview of platform performance and growth
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="180">Last 6 months</option>
            <option value="365">This Year</option>
          </select>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={stats?.users.total.toLocaleString() || "0"}
          trend="+12%"
          trendType="up"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Job Listings"
          value={stats?.jobs.active.toLocaleString() || "0"}
          trend="+8%"
          trendType="up"
          icon={Briefcase}
          color="green"
        />
        <StatCard
          title="Total Platform Revenue"
          value={`₹${stats?.revenue.total.toLocaleString() || "0"}`}
          trend="+18%"
          trendType="up"
          icon={DollarSign}
          color="purple"
        />
        <StatCard
          title="Total Applications"
          value={stats?.applications.total.toLocaleString() || "0"}
          trend="+5%"
          trendType="up"
          icon={FileText}
          color="orange"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 font-display">User Growth</h3>
            <p className="text-sm text-slate-500">Monthly new registrations trend</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={stats?.charts.userGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#3b82f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 font-display">Revenue Performance</h3>
            <p className="text-sm text-slate-500">Platform earnings in INR</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={stats?.charts.revenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 font-display">User Distribution</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleDistributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {roleDistributionData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500 truncate">{item.name}</p>
                  <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 font-display">Specialized Resources</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={resourceDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {resourceDistributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[(index + 3) % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-slate-700">Total Resources</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{stats?.resources.total}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {resourceDistributionData.slice(0, 4).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs p-2 border border-slate-100 rounded-md">
                  <span className="text-slate-500">{item.name}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers / Quick Reports */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-display">Shortcuts & Export</h3>
          <div className="space-y-4">
            <Link
              to="/admin/payments"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 group-hover:bg-primary group-hover:text-white transition-colors">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Transaction Reports</p>
                  <p className="text-xs text-slate-500">Detailed financial history</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary" />
            </Link>

            <div className="p-4 rounded-xl border border-slate-100 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Employers</p>
              <div className="space-y-3">
                {(stats?.topEmployers || []).map((employer, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 truncate mr-2">{employer.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold">{employer.jobs} Jobs</span>
                  </div>
                ))}
                {(!stats?.topEmployers || stats.topEmployers.length === 0) && (
                  <p className="text-xs text-slate-500 italic">No employer data available</p>
                )}
              </div>
            </div>

            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <FileText className="w-5 h-5" />
              <span className="text-sm font-semibold">Generate Monthly PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  trend,
  trendType,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  trend: string;
  trendType: "up" | "down";
  icon: any;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trendType === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trendType === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        <p className="text-sm font-medium text-slate-500 mt-0.5">{title}</p>
      </div>
    </div>
  );
}
