import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import {
    ChevronLeft,
    Wallet,
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    Briefcase
} from "lucide-react";

const RecruiterWallet = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    // Mock Transaction History
    const transactions = [
        { id: 1, type: "deduction", amount: 50, desc: "Job Posted: Senior React Dev", date: "2h ago" },
        { id: 2, type: "deduction", amount: 50, desc: "Job Posted: UI/UX Designer", date: "1d ago" },
        { id: 3, type: "topup", amount: 500, desc: "Wallet Top-up", date: "3d ago" },
        { id: 4, type: "deduction", amount: 50, desc: "Job Posted: Frontend Lead", date: "5d ago" },
    ];

    const handleTopUp = async () => {
        setIsLoading(true);
        // Simulate payment gateway
        await new Promise(resolve => setTimeout(resolve, 2000));

        updateUser({
            profile: {
                ...user!.profile,
                walletBalance: (user?.profile.walletBalance || 0) + 500
            }
        });

        setIsLoading(false);
        alert("₹500 added to your wallet successfully!");
    };

    return (
        <div className="pb-32 select-none">
            {/* Header */}
            <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 -mx-5 px-5">
                <button
                    onClick={() => navigate(-1)}
                    className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all"
                >
                    <ChevronLeft className="size-6" />
                </button>
                <h2 className="text-sm font-black uppercase tracking-widest">Wallet</h2>
                <div className="size-11" />
            </div>

            <div className="mt-6 space-y-8">
                {/* Balance Card */}
                <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wallet className="size-32" />
                    </div>

                    <div className="space-y-1 relative">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Available Balance</p>
                        <h1 className="text-5xl font-black tabular-nums">₹{user?.profile.walletBalance || 0}</h1>
                    </div>

                    <div className="mt-10 flex gap-4 relative">
                        <button
                            onClick={handleTopUp}
                            disabled={isLoading}
                            className="bg-white text-primary px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                        >
                            <Plus className="size-4" />
                            {isLoading ? "Processing..." : "Top Up ₹500"}
                        </button>
                    </div>
                </div>

                {/* Transactions Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Transactions</h3>
                        <Clock className="size-4 text-slate-300" />
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden">
                        {transactions.map((tx, i) => (
                            <div
                                key={tx.id}
                                className={`p-5 flex items-center justify-between ${i !== transactions.length - 1 ? "border-b border-slate-100 dark:border-white/5" : ""}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 rounded-2xl flex items-center justify-center ${tx.type === 'topup' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {tx.type === 'topup' ? <ArrowDownLeft className="size-6" /> : <ArrowUpRight className="size-6" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black tracking-tight">{tx.desc}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-black ${tx.type === 'topup' ? 'text-green-500' : 'text-slate-900 dark:text-white'}`}>
                                        {tx.type === 'topup' ? '+' : '-'}₹{tx.amount}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Box */}
                <div className="p-6 rounded-[2rem] bg-slate-100 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10">
                    <div className="flex gap-4">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Briefcase className="size-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-black uppercase tracking-widest">Pay-per-post</h4>
                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
                                You are currently charged ₹50 for each job you post. Keep your wallet topped up to ensure seamless job postings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterWallet;
