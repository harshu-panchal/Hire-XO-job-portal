import { TrendingUp, DollarSign, Calendar, Eye, MessageSquare, Search, Building2, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { applicationService } from "@/services/applicationService";
import { toast } from "sonner";

const MyInvestments = () => {
    const navigate = useNavigate();
    console.log("Rendering MyInvestments component");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [interests, setInterests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchInterests = async () => {
            try {
                setLoading(true);
                const response: any = await applicationService.getMyApplications();
                // Handle both { resources: [] } and [] formats
                const allApplications = Array.isArray(response) ? response : (response.resources || []);
                const investorApps = allApplications.filter((app: any) => app.resourceType === 'Investor');
                setInterests(investorApps);
            } catch (error) {
                console.error("Failed to fetch interests:", error);
                toast.error("Failed to load your portfolio");
            } finally {
                setLoading(false);
            }
        };
        fetchInterests();
    }, []);

    const filteredInterests = interests.filter(item => {
        const resource = item.resourceId || {};
        const title = resource.title || "";
        const company = resource.company || "";

        const matchesSearch =
            title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            company.toLowerCase().includes(searchQuery.toLowerCase());

        const status = item.status || "Pending";
        const matchesTab = activeTab === "All" || status === activeTab;

        return matchesSearch && matchesTab;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-sm font-black uppercase tracking-widest text-slate-400">Loading Portfolio...</div>
            </div>
        );
    }

    return (
        <div className="py-6 space-y-6 select-none animate-in fade-in duration-500">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors active:scale-95"
            >
                <ArrowLeft className="size-4" />
                <span>Go Back</span>
            </button>

            {/* Header */}
            <div className="px-1">
                <h1 className="text-3xl font-black tracking-tight">
                    My <span className="text-violet-600">Interests</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest mt-1">
                    Track your expressed investment interests
                </p>
            </div>

            {/* Portfolio Summary Card */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-violet-500/20 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Portfolio Overview</p>
                        <h2 className="text-4xl font-black tracking-tight">{interests.length} <span className="text-2xl opacity-60">Total</span></h2>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">Accepted</p>
                            <p className="text-xl font-black">{interests.filter(i => i.status === 'Accepted').length}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">Pending</p>
                            <p className="text-xl font-black">{interests.filter(i => i.status === 'Pending').length}</p>
                        </div>
                    </div>
                </div>
                <div className="absolute -right-20 -top-20 size-64 bg-white/10 rounded-full blur-3xl" />
            </div>

            {/* Search & Tabs */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search your portfolio..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-4 py-4 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all shadow-sm"
                    />
                </div>

                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
                    {["All", "Pending", "Accepted", "Rejected"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                ? "bg-white dark:bg-slate-700 text-violet-600 shadow-sm"
                                : "text-slate-500 hover:bg-white/50 dark:hover:bg-slate-700/30"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Interests List */}
            <div className="space-y-4">
                {filteredInterests.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/5">
                        <Search className="size-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-lg font-black text-slate-500">No records found</p>
                        <Link to="/investor/browse/opportunities" className="text-xs font-black text-violet-600 uppercase tracking-widest mt-2 inline-block hover:underline">Browse Opportunities</Link>
                    </div>
                ) : (
                    filteredInterests.map((interest) => {
                        const resource = interest.resourceId || {};
                        const statusColor =
                            interest.status === 'Accepted' ? 'emerald' :
                                interest.status === 'Rejected' ? 'rose' : 'amber';

                        return (
                            <div
                                key={interest._id}
                                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-6 active:scale-[0.98] transition-all hover:shadow-xl shadow-sm relative overflow-hidden group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="size-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 flex items-center justify-center text-violet-600 font-black text-2xl shrink-0">
                                            {resource.company?.charAt(0) || "I"}
                                        </div>
                                        <div>
                                            <p className="text-violet-600 font-black uppercase tracking-widest text-[9px] mb-1">
                                                {resource.company || "Investment Opportunity"}
                                            </p>
                                            <h3 className="font-black text-lg tracking-tight group-hover:text-violet-600 transition-colors">{resource.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <Clock className="size-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">
                                                        Expressed {interest.appliedAt ? new Date(interest.appliedAt).toLocaleDateString() : "Recently"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full bg-${statusColor}-500/10 border border-${statusColor}-500/20`}>
                                        <span className={`text-[8px] font-black uppercase tracking-widest text-${statusColor}-600`}>
                                            {interest.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Seeking Amount</p>
                                        <p className="text-lg font-black">₹{resource.amount || resource.seekingAmount || "Negotiable"}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Offered Equity</p>
                                        <p className="text-lg font-black">{resource.equity || "Discussion"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="size-3.5" />
                                            <span>{resource.location || "Remote"}</span>
                                        </div>
                                        <div className="size-1 rounded-full bg-slate-200" />
                                        <span>{resource.category || "General"}</span>
                                    </div>
                                    <Link
                                        to={`/investor/browse/opportunities/${resource._id}`}
                                        className="text-violet-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                                    >
                                        View Listing <MessageSquare className="size-3.5" />
                                    </Link>
                                </div>
                                <div className={`absolute top-0 right-0 w-1 h-full bg-${statusColor}-500 opacity-50`} />
                            </div>
                        );
                    })
                )}
            </div>

            {/* Performance Context */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 text-center space-y-4">
                <div className="size-16 rounded-3xl bg-violet-600/10 text-violet-600 flex items-center justify-center mx-auto">
                    <TrendingUp className="size-8" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-black tracking-tight">Expand your horizon.</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">A diversified portfolio is a strong portfolio.</p>
                </div>
                <button
                    onClick={() => toast.info("Portfolio analytics coming soon!")}
                    className="px-8 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all shadow-sm active:scale-95"
                >
                    Detailed Analysis
                </button>
            </div>
        </div>
    );
};

export default MyInvestments;
