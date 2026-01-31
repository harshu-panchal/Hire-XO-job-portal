import { motion, type Variants } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import {
    Users,
    Briefcase,
    CreditCard,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    MoreHorizontal
} from "lucide-react";

const revenueData = [
    { name: "Jan", value: 3200 },
    { name: "Feb", value: 4500 },
    { name: "Mar", value: 4100 },
    { name: "Apr", value: 5800 },
    { name: "May", value: 4900 },
    { name: "Jun", value: 6500 },
    { name: "Jul", value: 7200 },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
} as const;

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    }
} as const;

const recentActivity = [
    { id: 1, action: "New recruiter registered", user: "Acme Corp", time: "2 min ago" },
    { id: 2, action: "Plan upgraded to Premium", user: "John Doe", time: "15 min ago" },
    { id: 3, action: "New job posting created", user: "TechStart Inc", time: "1 hour ago" },
    { id: 4, action: "Payment received", user: "Global HR", time: "2 hours ago" },
];

export default function Dashboard() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Welcome Section */}
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    Welcome back, Admin
                </h1>
                <p className="text-slate-500 dark:text-white/60 mt-1">
                    Here's what's happening with your platform today.
                </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value="12,459"
                    change="+12.5%"
                    icon={Users}
                    iconBg="bg-blue-100 dark:bg-blue-500/20"
                    iconColor="text-blue-600 dark:text-blue-400"
                />
                <StatCard
                    title="Active Jobs"
                    value="3,842"
                    change="+8.2%"
                    icon={Briefcase}
                    iconBg="bg-green-100 dark:bg-green-500/20"
                    iconColor="text-green-600 dark:text-green-400"
                />
                <StatCard
                    title="Revenue"
                    value="₹4.2L"
                    change="+18.7%"
                    icon={DollarSign}
                    iconBg="bg-purple-100 dark:bg-purple-500/20"
                    iconColor="text-purple-600 dark:text-purple-400"
                />
                <StatCard
                    title="Subscriptions"
                    value="1,284"
                    change="+5.4%"
                    icon={CreditCard}
                    iconBg="bg-orange-100 dark:bg-orange-500/20"
                    iconColor="text-orange-600 dark:text-orange-400"
                />
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Overview</h3>
                            <p className="text-sm text-slate-500 dark:text-white/50">Monthly revenue performance</p>
                        </div>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
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
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3B82F6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
                        <button className="text-sm text-primary font-medium hover:underline">View all</button>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((item) => (
                            <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.action}</p>
                                    <p className="text-xs text-slate-500 dark:text-white/50">{item.user}</p>
                                </div>
                                <span className="text-xs text-slate-400 dark:text-white/40 whitespace-nowrap">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickAction label="Add Recruiter" icon={Users} />
                    <QuickAction label="Create Plan" icon={CreditCard} />
                    <QuickAction label="View Reports" icon={TrendingUp} />
                    <QuickAction label="Manage Jobs" icon={Briefcase} />
                </div>
            </motion.div>
        </motion.div>
    );
}

function StatCard({ title, value, change, icon: Icon, iconBg, iconColor }: {
    title: string;
    value: string;
    change: string;
    icon: any;
    iconBg: string;
    iconColor: string;
}) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${iconBg}`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    {change}
                </div>
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="text-sm text-slate-500 dark:text-white/50 mt-1">{title}</p>
            </div>
        </div>
    );
}

function QuickAction({ label, icon: Icon }: { label: string; icon: any }) {
    return (
        <button className="flex flex-col items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-white/5 group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon className="w-5 h-5 text-slate-600 dark:text-white/60 group-hover:text-white" />
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">{label}</span>
        </button>
    );
}
