import { TrendingUp, Eye, FileText, Star, PlusSquare, Car } from "lucide-react";
import { Link } from "react-router-dom";

const ProvideDashboard = () => {
    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-4">
                <div className="space-y-1 px-1">
                    <h1 className="text-4xl font-black tracking-tighter leading-tight">
                        Vehicle <br />
                        <span className="text-blue-600">Admin</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">
                        Manage your rental fleet
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 py-2">
                    <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                                <Car className="size-7 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600/60 mb-0.5">
                                    Active Vehicles
                                </p>
                                <p className="text-2xl font-black tracking-tight">8</p>
                            </div>
                        </div>
                        <div className="text-[10px] font-black bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">
                            Fleet Status
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                                <Eye className="size-6 text-cyan-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Bookings
                            </p>
                            <p className="text-xl font-black tracking-tight">24+</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-cyan-500/60 mt-2">
                                Last 30 Days
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                <Star className="size-6 text-amber-500 fill-amber-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Avg. Rating
                            </p>
                            <p className="text-xl font-black tracking-tight">4.8</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 mt-2">
                                32 Total Reviews
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Inquiries */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight">Rental Inquiries</h2>
                    <Link
                        to="/vehicles/provide/inquiries"
                        className="text-xs font-black text-blue-600 uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        View All
                    </Link>
                </div>

                <div className="space-y-3">
                    {/* Inquiry 1 */}
                    <Link
                        to="/vehicles/provide/inquiries"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-4 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start gap-3">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                                RM
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="font-black text-sm">Rahul Mehta</p>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0">2h ago</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                    Interested in renting the Tata Ace for 3 days for local shifting.
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-blue-600 bg-blue-600/10 px-2 py-1 rounded-md">
                                        Local Rental
                                    </span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">
                                        Verified Lead
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Inquiry 2 */}
                    <Link
                        to="/vehicles/provide/inquiries"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-4 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start gap-3">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                                AS
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="font-black text-sm">Anjali Sharma</p>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0">5h ago</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                    Need a luxury sedan for a wedding ceremony in South Delhi next week.
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-cyan-600 bg-cyan-600/10 px-2 py-1 rounded-md">
                                        Event Rental
                                    </span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-600">
                                        High Priority
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-[2.5rem] p-6 text-white shadow-xl shadow-blue-600/20">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Fleet Performance</p>
                        <h3 className="text-xl font-black tracking-tight">Active Usage</h3>
                    </div>
                    <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <TrendingUp className="size-6" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span>Uptime</span>
                            <span>95%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[95%] bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span>Maintenance</span>
                            <span>90%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[90%] bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
                <h2 className="text-xl font-black tracking-tight px-1">Manage Business</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/vehicles/provide/post"
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] p-5 active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                            <PlusSquare className="size-5" />
                        </div>
                        <p className="font-black text-sm">Add Vehicle</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">List New</p>
                    </Link>
                    <Link
                        to="/vehicles/provide/my-vehicles"
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] p-5 active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3">
                            <FileText className="size-5" />
                        </div>
                        <p className="font-black text-sm">My Fleet</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Manage All</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProvideDashboard;
