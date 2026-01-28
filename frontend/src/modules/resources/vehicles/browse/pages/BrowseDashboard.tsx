import { TrendingUp, Car, Target, Search, Briefcase, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const BrowseDashboard = () => {
    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-4">
                <div className="space-y-1 px-1">
                    <h1 className="text-4xl font-black tracking-tighter leading-tight">
                        Rent Premium <br />
                        <span className="text-cyan-600">Vehicles Easily</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">
                        Cars, SUVs, and Commercial Units
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 py-2">
                    <div className="bg-cyan-600/5 border border-cyan-600/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-cyan-600/10 flex items-center justify-center">
                                <Target className="size-7 text-cyan-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-cyan-600/60 mb-0.5">
                                    Verified Units
                                </p>
                                <p className="text-2xl font-black tracking-tight">850+</p>
                            </div>
                        </div>
                        <div className="text-[10px] font-black bg-cyan-600/10 text-cyan-600 px-3 py-1 rounded-full uppercase tracking-widest">
                            Live Near You
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                <TrendingUp className="size-6 text-emerald-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Satisfied Hires
                            </p>
                            <p className="text-xl font-black tracking-tight">96%</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">
                                Customer Rating
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                <Car className="size-6 text-amber-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Partner Hubs
                            </p>
                            <p className="text-xl font-black tracking-tight">60+</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 mt-2">
                                Major Cities
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Providers */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight">Top Rated Vehicles</h2>
                    <Link
                        to="/vehicles/browse/list"
                        className="text-xs font-black text-cyan-600 uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        View All
                    </Link>
                </div>

                <div className="space-y-4">
                    {/* Vehicle Card 1 */}
                    <Link
                        to="/vehicles/browse/list/1"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white font-black text-lg">
                                    E
                                </div>
                                <div>
                                    <p className="text-cyan-600 font-black uppercase tracking-widest text-[9px]">
                                        Elite Wheels
                                    </p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/10 mt-0.5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-cyan-600">
                                            Premium SUV
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Rating</p>
                                <p className="text-lg font-black text-amber-500">4.9/5</p>
                            </div>
                        </div>
                        <h3 className="font-black text-lg tracking-tight mb-2">
                            Range Rover Sport 2024
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            Luxurious SUV with all-terrain capabilities and semi-autonomous driving features.
                        </p>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                <span>Delhi base</span>
                            </div>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>₹15,000/day</span>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>Full Insurance</span>
                        </div>
                    </Link>

                    {/* Vehicle Card 2 */}
                    <Link
                        to="/vehicles/browse/list/2"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-black text-lg">
                                    T
                                </div>
                                <div>
                                    <p className="text-cyan-600 font-black uppercase tracking-widest text-[9px]">
                                        Transport Pro
                                    </p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/10 mt-0.5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-teal-600">
                                            Commercial
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Rating</p>
                                <p className="text-lg font-black text-amber-500">4.7/5</p>
                            </div>
                        </div>
                        <h3 className="font-black text-lg tracking-tight mb-2">
                            Tata Intra V30 Truck
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            Efficient and reliable commercial vehicle for heavy loading and urban transport.
                        </p>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                <span>Mumbai base</span>
                            </div>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>₹2,500/day</span>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>24/7 Delivery</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
                <h2 className="text-xl font-black tracking-tight px-1">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/vehicles/browse/list"
                        className="bg-gradient-to-br from-cyan-600 to-cyan-500 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                            <Search className="size-5" />
                        </div>
                        <p className="font-black text-sm">Find Vehicle</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Browse Units</p>
                    </Link>
                    <Link
                        to="/vehicles/browse/my-rentals"
                        className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 rounded-[2rem] p-5 text-white dark:text-slate-900 active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-white/20 dark:bg-slate-900/20 flex items-center justify-center mb-3">
                            <Briefcase className="size-5" />
                        </div>
                        <p className="font-black text-sm">Active Bookings</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Track Status</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BrowseDashboard;
