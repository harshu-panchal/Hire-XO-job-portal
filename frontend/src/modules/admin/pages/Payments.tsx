import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, Download, DollarSign, TrendingUp, Users, CreditCard, CheckCircle, XCircle, Clock, Eye } from "lucide-react";

interface Payment {
    id: string;
    user: string;
    email: string;
    plan: string;
    amount: number;
    status: "Completed" | "Pending" | "Failed";
    date: string;
    method: string;
}

const paymentsData: Payment[] = [
    { id: "PAY001", user: "Rahul Sharma", email: "rahul@techcorp.in", plan: "Professional", amount: 599, status: "Completed", date: "Jan 30, 2024", method: "UPI" },
    { id: "PAY002", user: "Priya Patel", email: "priya@innovate.com", plan: "Business", amount: 4999, status: "Completed", date: "Jan 29, 2024", method: "Card" },
    { id: "PAY003", user: "Amit Kumar", email: "amit@startup.io", plan: "Basic", amount: 299, status: "Pending", date: "Jan 29, 2024", method: "UPI" },
    { id: "PAY004", user: "Sneha Gupta", email: "sneha@globalhr.com", plan: "Enterprise", amount: 9999, status: "Completed", date: "Jan 28, 2024", method: "Bank Transfer" },
    { id: "PAY005", user: "Vikram Singh", email: "vikram@company.in", plan: "Professional", amount: 599, status: "Failed", date: "Jan 28, 2024", method: "Card" },
];

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

export default function Payments() {
    const [payments] = useState(paymentsData);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const filteredPayments = payments.filter(p => {
        const matchesSearch = p.user.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalRevenue = payments.filter(p => p.status === "Completed").reduce((acc, p) => acc + p.amount, 0);
    const completedCount = payments.filter(p => p.status === "Completed").length;
    const pendingCount = payments.filter(p => p.status === "Pending").length;

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
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Payments</h1>
                    <p className="text-slate-500 dark:text-white/60 mt-1">Track and manage all transactions</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-500/20">
                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Total Revenue</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{payments.length}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Total Transactions</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Completed</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-500/20">
                            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Pending</p>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    <option value="">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                </select>
            </motion.div>

            {/* Table */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-white/10">
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Transaction ID</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">User</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Plan</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Date</th>
                                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm font-medium text-slate-900 dark:text-white">{payment.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{payment.user}</p>
                                            <p className="text-sm text-slate-500 dark:text-white/50">{payment.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600 dark:text-white/70">{payment.plan}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-slate-900 dark:text-white">₹{payment.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${payment.status === 'Completed'
                                                ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                                                : payment.status === 'Pending'
                                                    ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                                                    : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                                            }`}>
                                            {payment.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
                                            {payment.status === 'Pending' && <Clock className="w-3 h-3" />}
                                            {payment.status === 'Failed' && <XCircle className="w-3 h-3" />}
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-white/70">{payment.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                                            <Eye className="w-4 h-4 text-slate-500 dark:text-white/50" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPayments.length === 0 && (
                    <div className="py-12 text-center">
                        <CreditCard className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-white/50">No payments found</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
