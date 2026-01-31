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
    Cell
} from "recharts";
import { Download, Calendar, TrendingUp, Users, DollarSign, Briefcase, FileText } from "lucide-react";

const monthlyData = [
    { name: "Jan", users: 1200, revenue: 32000, jobs: 450 },
    { name: "Feb", users: 1400, revenue: 45000, jobs: 520 },
    { name: "Mar", users: 1100, revenue: 41000, jobs: 480 },
    { name: "Apr", users: 1800, revenue: 58000, jobs: 620 },
    { name: "May", users: 1600, revenue: 49000, jobs: 550 },
    { name: "Jun", users: 2100, revenue: 65000, jobs: 720 },
];

const pieData = [
    { name: "Job Seekers", value: 65 },
    { name: "Recruiters", value: 25 },
    { name: "Resources", value: 10 },
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
} as const;

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    }
} as const;

export default function Reports() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Reports</h1>
                    <p className="text-slate-500 dark:text-white/60 mt-1">View analytics and generate reports</p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>This Year</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Users" value="12,459" change="+12.5%" icon={Users} />
                <StatCard title="Active Jobs" value="3,842" change="+8.2%" icon={Briefcase} />
                <StatCard title="Revenue" value="₹4.2L" change="+18.7%" icon={DollarSign} />
                <StatCard title="Reports Generated" value="156" change="+5.4%" icon={FileText} />
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">User Growth</h3>
                            <p className="text-sm text-slate-500 dark:text-white/50">Monthly new user registrations</p>
                        </div>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-10" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Revenue Chart */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue</h3>
                            <p className="text-sm text-slate-500 dark:text-white/50">Monthly revenue in INR</p>
                        </div>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-10" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Distribution */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">User Distribution</h3>
                    <div className="h-[200px] flex items-center justify-center">
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
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {pieData.map((item, index) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                <span className="text-xs text-slate-600 dark:text-white/60">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Performing */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Recruiters</h3>
                    <div className="space-y-4">
                        {[
                            { name: "TechCorp India", jobs: 45, hires: 32 },
                            { name: "InnovateTech", jobs: 38, hires: 28 },
                            { name: "GlobalHR Solutions", jobs: 32, hires: 24 },
                            { name: "StartupHub", jobs: 28, hires: 18 },
                        ].map((recruiter, index) => (
                            <div key={recruiter.name} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/5 last:border-0">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                    <span className="font-medium text-slate-900 dark:text-white">{recruiter.name}</span>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <span className="text-slate-500 dark:text-white/50">{recruiter.jobs} jobs</span>
                                    <span className="text-green-600 dark:text-green-400 font-medium">{recruiter.hires} hires</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

function StatCard({ title, value, change, icon: Icon }: { title: string; value: string; change: string; icon: any }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {change}
                </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm text-slate-500 dark:text-white/50 mt-1">{title}</p>
        </div>
    );
}
