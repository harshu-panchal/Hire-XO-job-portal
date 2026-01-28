import { Briefcase, Calendar, ChevronRight, Clock, Star } from "lucide-react";

const MyHires = () => {
    const hires = [
        {
            id: 1,
            firmName: "Prime Project Group",
            projectName: "Sector 14 Bridge Dev",
            status: "Active",
            startDate: "Jan 12, 2026",
            hiredOn: "Jan 05, 2026",
            rating: null,
            image: "P",
            color: "from-indigo-500 to-blue-600",
        },
        {
            id: 2,
            firmName: "EcoBuild Solutions",
            projectName: "Green Heights Mall",
            status: "Completed",
            startDate: "Nov 20, 2025",
            hiredOn: "Nov 15, 2025",
            rating: 5,
            image: "E",
            color: "from-emerald-500 to-teal-600",
        },
    ];

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-1 px-1">
                <h1 className="text-3xl font-black tracking-tighter">My Hires</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                    Manage your consulting team
                </p>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-600 p-6 rounded-[2.5rem] text-white">
                    <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                        <Clock className="size-5" />
                    </div>
                    <p className="text-2xl font-black italic">01</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Active Projects</p>
                </div>
                <div className="bg-slate-900 dark:bg-white p-6 rounded-[2.5rem] text-white dark:text-slate-900">
                    <div className="size-10 rounded-xl bg-white/20 dark:bg-slate-900/10 flex items-center justify-center mb-3">
                        <Briefcase className="size-5" />
                    </div>
                    <p className="text-2xl font-black italic">12</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Total Hires</p>
                </div>
            </div>

            {/* Hires List */}
            <div className="space-y-4">
                <h2 className="text-xl font-black tracking-tight px-1">Recent Hires</h2>
                <div className="space-y-4">
                    {hires.map((hire) => (
                        <div
                            key={hire.id}
                            className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-200 dark:border-white/10"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`size-14 rounded-2xl bg-gradient-to-br ${hire.color} flex items-center justify-center text-white text-xl font-black shadow-lg`}>
                                        {hire.image}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg tracking-tight leading-tight">{hire.firmName}</h3>
                                        <p className="text-indigo-600 font-black uppercase tracking-widest text-[9px] mt-0.5">
                                            {hire.projectName}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${hire.status === "Active"
                                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                    : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                                    }`}>
                                    {hire.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-4 text-slate-400" />
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Started</p>
                                        <p className="text-[10px] font-black">{hire.startDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className={`size-4 ${hire.rating ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Rating</p>
                                        <p className="text-[10px] font-black">{hire.rating ? `${hire.rating}.0` : "Pending"}</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-4 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform group">
                                View Details
                                <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyHires;
