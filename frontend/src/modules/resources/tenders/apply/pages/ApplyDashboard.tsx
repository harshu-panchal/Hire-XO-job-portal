import { TrendingUp, Clock, FileText, ArrowRight, MapPin, Building2, Calendar, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService"; // Use existing service

const ApplyDashboard = () => {
    const [tenders, setTenders] = useState<any[]>([]);
    const [stats, setStats] = useState({
        activeTenders: 0,
        closingSoon: 0,
        myBids: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all tenders to show recommended and calculate stats
                const tendersData = await resourceService.getAll('tenders');

                // Get my applications to count active bids
                const myApps: any = await applicationService.getMyApplications();
                const myTenderBids = (myApps.resources || []).filter((app: any) => app.resourceType === 'Tender');

                // Process tenders for "Closing Soon" (e.g., deadline within 7 days)
                const now = new Date();
                const sevenDaysFromNow = new Date();
                sevenDaysFromNow.setDate(now.getDate() + 7);

                const closingSoonCount = tendersData.filter((t: any) => {
                    if (!t.deadline && !t.applicationDeadline) return false;
                    const deadline = new Date(t.deadline || t.applicationDeadline);
                    return deadline > now && deadline <= sevenDaysFromNow;
                }).length;

                setTenders(tendersData.slice(0, 5)); // Show top 5 recommended
                setStats({
                    activeTenders: tendersData.length,
                    closingSoon: closingSoonCount,
                    myBids: myTenderBids.length
                });

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const dashboardStats = [
        { label: "Active Tenders", value: stats.activeTenders.toString(), icon: TrendingUp, color: "text-violet-600", bgColor: "bg-violet-100 dark:bg-violet-950/30" },
        { label: "Closing Soon", value: stats.closingSoon.toString(), icon: Clock, color: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-950/30" },
        { label: "My Active Bids", value: stats.myBids.toString(), icon: FileText, color: "text-emerald-600", bgColor: "bg-emerald-100 dark:bg-emerald-950/30" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-sm font-black uppercase tracking-widest text-slate-400">Loading Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Welcome Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight leading-tight">
                    Find Your Next <br />
                    <span className="text-violet-600">Opportunity</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                    Browse latest tenders and bidding opportunities
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
                {dashboardStats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-4 flex flex-col items-center text-center space-y-2">
                        <div className={`size-10 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                            <stat.icon className={`size-5 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xl font-black tracking-tight">{stat.value}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recommended Tenders */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight">Recommended for You</h2>
                    <Link to="/tenders/apply/tenders" className="text-xs font-black text-violet-600 uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-transform">
                        See All <ArrowRight className="size-3" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {tenders.length === 0 ? (
                        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5">
                            <p className="text-sm font-bold text-slate-500">No active tenders found at the moment.</p>
                        </div>
                    ) : (
                        tenders.map((tender) => (
                            <Link
                                key={tender._id}
                                to={`/tenders/apply/tenders/${tender._id}`}
                                className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-5 active:scale-[0.98] transition-all group overflow-hidden relative shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="size-3.5 text-violet-600" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tender.company || "Organization"}</span>
                                        </div>
                                        <h3 className="text-lg font-black tracking-tight group-hover:text-violet-600 transition-colors leading-tight line-clamp-2">
                                            {tender.title}
                                        </h3>
                                    </div>
                                    <div className="bg-violet-50 dark:bg-violet-950/30 text-violet-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-violet-100 dark:border-violet-900 shrink-0">
                                        {tender.type || "Open"}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Tender Value</p>
                                        <p className="text-base font-black text-emerald-600">{tender.tenderValue || tender.compensation || "N/A"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Deadline</p>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="size-3 text-amber-500" />
                                            <p className="text-[12px] font-black">
                                                {tender.deadline ? new Date(tender.deadline).toLocaleDateString() : (tender.applicationDeadline ? new Date(tender.applicationDeadline).toLocaleDateString() : "Open")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <MapPin className="size-3" />
                                        <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[100px]">{tender.location}</span>
                                    </div>
                                    <div className="size-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-violet-500/70 truncate max-w-[120px]">{tender.category || "General"}</span>
                                </div>

                                {/* Decorative element */}
                                <div className="absolute top-0 right-0 size-24 bg-violet-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/tenders/apply/tenders" className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-[2rem] p-6 text-white active:scale-95 transition-transform shadow-xl shadow-violet-500/20">
                    <div className="size-10 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                        <Search className="size-6 text-white" />
                    </div>
                    <p className="text-sm font-black tracking-tight">Browse Tenders</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Find opportunities</p>
                </Link>
                <Link to="/tenders/apply/my-bids" className="bg-slate-900 dark:bg-white rounded-[2rem] p-6 text-white dark:text-slate-900 active:scale-95 transition-transform shadow-xl shadow-slate-900/20">
                    <div className="size-10 rounded-2xl bg-white/10 dark:bg-slate-900/10 flex items-center justify-center mb-4">
                        <FileText className="size-6 text-white dark:text-slate-900" />
                    </div>
                    <p className="text-sm font-black tracking-tight">My Active Bids</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Manage applications</p>
                </Link>
            </div>
        </div>
    );
};

export default ApplyDashboard;
