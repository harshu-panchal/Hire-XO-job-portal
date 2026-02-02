import { TrendingUp, TrendingDown, DollarSign, Calendar, Eye, MessageSquare, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const MyInvestments = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    const investments = [
        {
            id: 1,
            company: "TechVenture Solutions",
            logo: "T",
            logoGradient: "from-blue-500 to-cyan-600",
            sector: "Technology",
            title: "AI-Powered SaaS Platform",
            investedAmount: "₹75 Lakhs",
            equity: "15%",
            investedDate: "Jan 2024",
            currentValue: "₹92 Lakhs",
            roi: "+22.7%",
            roiPositive: true,
            status: "Active",
            statusColor: "emerald",
            updates: 12,
            messages: 5,
        },
        {
            id: 2,
            company: "GreenEnergy Innovations",
            logo: "G",
            logoGradient: "from-green-500 to-emerald-600",
            sector: "Renewable Energy",
            title: "Solar Panel Manufacturing",
            investedAmount: "₹1.2 Cr",
            equity: "20%",
            investedDate: "Nov 2023",
            currentValue: "₹1.45 Cr",
            roi: "+20.8%",
            roiPositive: true,
            status: "Active",
            statusColor: "emerald",
            updates: 18,
            messages: 8,
        },
        {
            id: 3,
            company: "HealthTech Dynamics",
            logo: "H",
            logoGradient: "from-purple-500 to-pink-600",
            sector: "Healthcare",
            title: "Telemedicine Platform",
            investedAmount: "₹60 Lakhs",
            equity: "18%",
            investedDate: "Mar 2024",
            currentValue: "₹58 Lakhs",
            roi: "-3.3%",
            roiPositive: false,
            status: "Under Review",
            statusColor: "amber",
            updates: 6,
            messages: 3,
        },
    ];

    const filteredInvestments = investments.filter(inv => {
        const matchesSearch = inv.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.sector.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "All" || inv.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const totalInvested = "₹2.55 Cr";
    const currentValue = "₹2.95 Cr";
    const totalROI = "+15.7%";
    const activeInvestments = investments.filter(i => i.status === "Active").length;

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="px-1">
                <h1 className="text-3xl font-black tracking-tight">
                    My <span className="text-primary">Investments</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest mt-1">
                    Track your investment portfolio
                </p>
            </div>

            {/* Search & Tabs */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search your investments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                <div className="flex gap-2 p-1 bg-white/50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10">
                    {["All", "Active", "Under Review"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Portfolio Summary */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-[2.5rem] p-6 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black tracking-tight">Portfolio Overview</h2>
                    <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <TrendingUp className="size-6 text-primary" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Invested</p>
                        <p className="text-2xl font-black">{totalInvested}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Current Value</p>
                        <p className="text-2xl font-black text-emerald-600">{currentValue}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Total ROI</p>
                        <p className="text-2xl font-black text-emerald-600">{totalROI}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Active</p>
                        <p className="text-2xl font-black">{activeInvestments}</p>
                    </div>
                </div>
            </div>

            {/* Investments List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight">Your Portfolio</h2>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        {filteredInvestments.length} Result{filteredInvestments.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {filteredInvestments.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-900/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10">
                        <Search className="size-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No investments found</p>
                    </div>
                ) : (
                    filteredInvestments.map((investment) => (
                        <Link
                            key={investment.id}
                            to={`/investor/browse/opportunities/${investment.id}`}
                            className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <div
                                    className={`size-14 rounded-xl bg-gradient-to-br ${investment.logoGradient} flex items-center justify-center text-white font-black text-xl shrink-0`}
                                >
                                    {investment.logo}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-primary font-black uppercase tracking-widest text-[9px] mb-1">
                                        {investment.company}
                                    </p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/10 mb-1">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">
                                            {investment.sector}
                                        </span>
                                    </div>
                                    <h3 className="font-black text-base tracking-tight">{investment.title}</h3>
                                </div>
                                <div
                                    className={`px-3 py-1 rounded-full bg-${investment.statusColor}-500/10 border border-${investment.statusColor}-500/20`}
                                >
                                    <span className={`text-[8px] font-black uppercase tracking-widest text-${investment.statusColor}-600`}>
                                        {investment.status}
                                    </span>
                                </div>
                            </div>

                            {/* Investment Details */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Invested</p>
                                    <p className="text-lg font-black">{investment.investedAmount}</p>
                                    <p className="text-[8px] font-bold text-slate-500 mt-0.5">{investment.investedDate}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                        Current Value
                                    </p>
                                    <p className="text-lg font-black">{investment.currentValue}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        {investment.roiPositive ? (
                                            <TrendingUp className="size-3 text-emerald-500" />
                                        ) : (
                                            <TrendingDown className="size-3 text-red-500" />
                                        )}
                                        <span className={`text-[8px] font-black ${investment.roiPositive ? "text-emerald-600" : "text-red-600"}`}>
                                            {investment.roi}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Equity & Meta */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10">
                                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Equity: {investment.equity}</span>
                                    <div className="size-1 rounded-full bg-slate-200" />
                                    <div className="flex items-center gap-1">
                                        <Eye className="size-3" />
                                        <span>{investment.updates} updates</span>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center gap-1 text-primary text-xs font-black uppercase tracking-widest"
                                >
                                    <MessageSquare className="size-3" />
                                    <span>View Details</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Performance Overview */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black tracking-tight">Performance Overview</h2>
                    <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-[10px] font-black uppercase tracking-widest px-3 py-1 outline-none">
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                    </select>
                </div>

                <div className="h-48 flex items-end justify-between gap-2 px-2">
                    {[
                        { month: "Jan", value: 40, active: false },
                        { month: "Feb", value: 55, active: false },
                        { month: "Mar", value: 45, active: false },
                        { month: "Apr", value: 70, active: false },
                        { month: "May", value: 85, active: true },
                        { month: "Jun", value: 65, active: false },
                    ].map((data, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3">
                            <div className="relative w-full group">
                                <div
                                    className={`w-full rounded-t-lg transition-all duration-500 ${data.active
                                        ? "bg-primary shadow-lg shadow-primary/20"
                                        : "bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/20"
                                        }`}
                                    style={{ height: `${data.value}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ₹{data.value}L
                                    </div>
                                </div>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                {data.month}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10">
                    <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                        <DollarSign className="size-6 text-emerald-500" />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Avg. ROI</p>
                    <p className="text-xl font-black">+18.5%</p>
                    <p className="text-[8px] font-bold text-emerald-600 mt-1">Across all investments</p>
                </div>
                <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10">
                    <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
                        <Calendar className="size-6 text-blue-500" />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Avg. Duration</p>
                    <p className="text-xl font-black">18 mo</p>
                    <p className="text-[8px] font-bold text-blue-600 mt-1">Investment period</p>
                </div>
            </div>
        </div>
    );
};

export default MyInvestments;
