import { TrendingUp, Truck, Target, Search, Briefcase, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const BrowseDashboard = () => {
    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-4">
                <div className="space-y-1 px-1">
                    <h1 className="text-4xl font-black tracking-tighter leading-tight">
                        Hire Best <br />
                        <span className="text-red-600">Logistics Partners</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">
                        Transportation & Supply Chain Solutions
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 py-2">
                    <div className="bg-red-600/5 border border-red-600/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-red-600/10 flex items-center justify-center">
                                <Target className="size-7 text-red-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-red-600/60 mb-0.5">
                                    Verified Fleet Owners
                                </p>
                                <p className="text-2xl font-black tracking-tight">450+</p>
                            </div>
                        </div>
                        <div className="text-[10px] font-black bg-red-600/10 text-red-600 px-3 py-1 rounded-full uppercase tracking-widest">
                            Available Now
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                <TrendingUp className="size-6 text-emerald-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                On-Time Delivery
                            </p>
                            <p className="text-xl font-black tracking-tight">98.5%</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">
                                Reliability Score
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                <Truck className="size-6 text-amber-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Vehicles
                            </p>
                            <p className="text-xl font-black tracking-tight">5.2k+</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60 mt-2">
                                Pan India Network
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Providers */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black tracking-tight">Top Rated Logistics</h2>
                    <Link
                        to="/logistics/browse/list"
                        className="text-xs font-black text-red-600 uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        View All
                    </Link>
                </div>

                <div className="space-y-4">
                    {/* Logistics Card 1 */}
                    <Link
                        to="/logistics/browse/list/1"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-black text-lg">
                                    S
                                </div>
                                <div>
                                    <p className="text-red-600 font-black uppercase tracking-widest text-[9px]">
                                        SwiftLoad Carriers
                                    </p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/10 mt-0.5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-red-600">
                                            Heavy Haulage
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Rating</p>
                                <p className="text-lg font-black text-amber-500">5.0/5</p>
                            </div>
                        </div>
                        <h3 className="font-black text-lg tracking-tight mb-2">
                            Pan-India Express Freight
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            Expertise in long-haul containerized transport with real-time tracking and temperature control.
                        </p>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                <span>Mumbai base</span>
                            </div>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>120+ Trucks</span>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>Fast Delivery</span>
                        </div>
                    </Link>

                    {/* Logistics Card 2 */}
                    <Link
                        to="/logistics/browse/list/2"
                        className="block bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-lg">
                                    V
                                </div>
                                <div>
                                    <p className="text-red-600 font-black uppercase tracking-widest text-[9px]">
                                        Vento Logistics
                                    </p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/10 mt-0.5">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-orange-600">
                                            Last Mile
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Rating</p>
                                <p className="text-lg font-black text-amber-500">4.8/5</p>
                            </div>
                        </div>
                        <h3 className="font-black text-lg tracking-tight mb-2">
                            Urban Supply Chain Experts
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            Comprehensive last-mile delivery solutions for e-commerce and retail businesses.
                        </p>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                <span>Delhi base</span>
                            </div>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>80+ Mini Trucks</span>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span>24/7 Support</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
                <h2 className="text-xl font-black tracking-tight px-1">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/logistics/browse/list"
                        className="bg-gradient-to-br from-red-600 to-red-500 rounded-[2rem] p-5 text-white active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                            <Search className="size-5" />
                        </div>
                        <p className="font-black text-sm">Find Fleet</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Browse Services</p>
                    </Link>
                    <Link
                        to="/logistics/browse/my-hires"
                        className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 rounded-[2rem] p-5 text-white dark:text-slate-900 active:scale-95 transition-transform"
                    >
                        <div className="size-10 rounded-xl bg-white/20 dark:bg-slate-900/20 flex items-center justify-center mb-3">
                            <Briefcase className="size-5" />
                        </div>
                        <p className="font-black text-sm">Active Orders</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Track Shipments</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BrowseDashboard;
