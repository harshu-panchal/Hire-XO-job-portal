import { Briefcase, Calendar, ChevronRight, Clock, Star } from "lucide-react";

const MyRentals = () => {
    const rentals = [
        {
            id: 1,
            partnerName: "Elite Wheels",
            vehicleName: "Range Rover Sport 2024",
            status: "Active",
            startDate: "Jan 28, 2026",
            bookedOn: "Jan 26, 2026",
            rating: null,
            image: "E",
            color: "from-cyan-500 to-teal-600",
        },
        {
            id: 2,
            partnerName: "Go Electric",
            vehicleName: "Tesla Model 3",
            status: "Completed",
            startDate: "Jan 10, 2026",
            bookedOn: "Jan 05, 2026",
            rating: 5.0,
            image: "G",
            color: "from-teal-500 to-cyan-600",
        },
    ];

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-1 px-1">
                <h1 className="text-3xl font-black tracking-tighter">My Bookings</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                    Manage your vehicle rentals
                </p>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-cyan-600 p-6 rounded-[2.5rem] text-white shadow-lg shadow-cyan-600/20">
                    <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                        <Clock className="size-5" />
                    </div>
                    <p className="text-2xl font-black italic">01</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Active Booking</p>
                </div>
                <div className="bg-slate-900 dark:bg-white p-6 rounded-[2.5rem] text-white dark:text-slate-900 shadow-lg">
                    <div className="size-10 rounded-xl bg-white/20 dark:bg-slate-900/10 flex items-center justify-center mb-3">
                        <Briefcase className="size-5" />
                    </div>
                    <p className="text-2xl font-black italic">08</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Total Hires</p>
                </div>
            </div>

            {/* Rentals List */}
            <div className="space-y-4">
                <h2 className="text-xl font-black tracking-tight px-1">Recent History</h2>
                <div className="space-y-4">
                    {rentals.map((rental) => (
                        <div
                            key={rental.id}
                            className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10 shadow-sm"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`size-14 rounded-2xl bg-gradient-to-br ${rental.color} flex items-center justify-center text-white text-xl font-black shadow-lg`}>
                                        {rental.image}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg tracking-tight leading-tight">{rental.partnerName}</h3>
                                        <p className="text-cyan-600 font-black uppercase tracking-widest text-[9px] mt-0.5">
                                            {rental.vehicleName}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${rental.status === "Active"
                                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                    : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                                    }`}>
                                    {rental.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-4 text-slate-400" />
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Start Date</p>
                                        <p className="text-[10px] font-black">{rental.startDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className={`size-4 ${rental.rating ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Rating</p>
                                        <p className="text-[10px] font-black">{rental.rating ? `${rental.rating}.0` : "Pending"}</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-4 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform group">
                                View Booking Details
                                <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyRentals;
