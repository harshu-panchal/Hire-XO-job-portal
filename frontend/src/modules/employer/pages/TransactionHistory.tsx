import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { walletService, type Transaction } from "@/services/walletService";
import {
    ChevronLeft,
    ArrowUpRight,
    ArrowDownLeft,
    Search,
    Download,
    Filter
} from "lucide-react";

const TransactionHistory = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'topup' | 'deduction'>('all');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await walletService.getTransactions();
                // Check if response is array or paginated object
                if (Array.isArray(response)) {
                    setTransactions(response);
                } else if ('data' in response && Array.isArray(response.data)) {
                    setTransactions(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter(tx => {
        if (filter === 'all') return true;
        return tx.type === filter;
    });

    return (
        <div className="pb-10 select-none">
            {/* Header */}
            <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 -mx-5 px-5">
                <button
                    onClick={() => navigate(-1)}
                    className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all"
                >
                    <ChevronLeft className="size-6" />
                </button>
                <h2 className="text-sm font-black uppercase tracking-widest">History</h2>
                <div className="size-11" />
            </div>

            <div className="space-y-6">
                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['all', 'topup', 'deduction'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-white text-slate-400 border border-slate-200"
                                }`}
                        >
                            {f === 'all' ? 'All Transactions' : f === 'topup' ? 'Top Ups' : 'Deductions'}
                        </button>
                    ))}
                </div>

                {/* Transactions List */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden min-h-[50vh]">
                    {isLoading ? (
                        <div className="space-y-4 p-5">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-slate-100 animate-pulse" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                                            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 flex flex-col items-end">
                                        <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
                                        <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredTransactions.length > 0 ? (
                        filteredTransactions.map((tx: Transaction, i: number) => (
                            <div
                                key={tx._id}
                                className={`p-5 flex items-center justify-between ${i !== filteredTransactions.length - 1 ? "border-b border-slate-100" : ""
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`size-12 rounded-2xl flex items-center justify-center ${tx.type === "topup"
                                            ? "bg-green-500/10 text-green-500"
                                            : "bg-red-500/10 text-red-500"
                                            }`}
                                    >
                                        {tx.type === "topup" ? (
                                            <ArrowDownLeft className="size-6" />
                                        ) : (
                                            <ArrowUpRight className="size-6" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black tracking-tight">{tx.description}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {new Date(tx.createdAt).toLocaleString()}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">
                                            ID: {tx._id.slice(-6)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={`text-sm font-black ${tx.type === "topup" ? "text-green-500" : "text-slate-900"
                                            }`}
                                    >
                                        {tx.type === "topup" ? "+" : "-"}₹{tx.amount}
                                    </p>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${tx.type === 'topup' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'
                                        }`}>
                                        Completed
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                            No transactions found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
