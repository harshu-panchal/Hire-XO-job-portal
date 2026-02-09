import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Search,
  Download,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Loader2
} from "lucide-react";
import { adminService } from "../../../services/adminService";
import { toast } from "sonner";

interface Payment {
  _id: string;
  user: string;
  email: string;
  plan: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  method: string;
}

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

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Stats
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // In a real app, we might want to fetch stats separately or compute from a larger dataset
      // For now, we fetch a list. If the list is paginated, these stats might only reflect the current page
      // unless the backend returns totals.
      // AdminController currently returns pagination total count, but not "sum of amounts" unless we ask.
      // But getSystemStats does return total revenue. 
      // We can use the data we fetch to display the list.
      // For the top cards, we might want to use values from getSystemStats?
      // Or just compute from the fetched list for now (which is limited by pagination).
      // Let's rely on what we have or fetch all for stats?
      // Fetching all for stats is heavy.
      // I'll fetch 'getSystemStats' independently for the "Total Revenue" card if I want accuracy.
      // But `Payments` page usually implies showing the list.

      const response = await adminService.getAllTransactions({ limit: 100 }); // Fetch more for better initial view
      const data = response.data.map((t: any) => ({
        _id: t._id,
        user: t.userId?.name || "Unknown",
        email: t.userId?.email || "N/A",
        plan: t.description || "N/A",
        amount: t.amount,
        status: t.status,
        date: new Date(t.createdAt).toLocaleDateString(),
        method: "Wallet" // Default for now
      }));
      setPayments(data);

      // Calculate specific stats from this chunk or use global stats if available
      const completed = data.filter((p: any) => p.status === 'completed');
      setCompletedCount(completed.length);
      setPendingCount(data.filter((p: any) => p.status === 'pending').length);
      setTotalRevenue(completed.reduce((acc: number, curr: any) => acc + curr.amount, 0));

    } catch (error) {
      console.error(error);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const headers = [
      "Transaction ID",
      "User",
      "Email",
      "Description",
      "Amount",
      "Status",
      "Date",
      "Method",
    ];
    const rows = payments.map((p) => [
      p._id,
      p.user,
      p.email,
      p.plan,
      p.amount,
      p.status,
      p.date,
      p.method,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `hire-xo-payments-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Payments</h1>
          <p className="text-slate-500 mt-1">
            Track and manage all transactions
          </p>
        </div>
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
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            ₹{totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-slate-500 mt-1">Total Revenue (Visible)</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{payments.length}</p>
          <p className="text-sm text-slate-500 mt-1">Total Transactions</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {completedCount}
          </p>
          <p className="text-sm text-slate-500 mt-1">Completed</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          <p className="text-sm text-slate-500 mt-1">Pending</p>
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
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </motion.div>

      {/* Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-slate-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-slate-900">
                      {payment._id.slice(-6)}...
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{payment.user}</p>
                      <p className="text-sm text-slate-500">{payment.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      {payment.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">
                      ₹{payment.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${payment.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {payment.status === "completed" && <CheckCircle className="w-3 h-3" />}
                      {payment.status === "pending" && <Clock className="w-3 h-3" />}
                      {payment.status === "failed" && <XCircle className="w-3 h-3" />}
                      <span className="capitalize">{payment.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {payment.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="py-12 text-center">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No payments found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
