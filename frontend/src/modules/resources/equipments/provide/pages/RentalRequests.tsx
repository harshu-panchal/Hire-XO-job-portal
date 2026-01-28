import { MapPin, User, CheckCircle2, XCircle, MessageSquare, Clock } from "lucide-react";

const RentalRequests = () => {
    const requests = [
        {
            id: "REQ-9921",
            equipment: "Caterpillar 320 GC",
            tenant: "Acme Infra Projects",
            location: "Mumbai, MH",
            duration: "15 Days",
            startDate: "20 Oct 2024",
            amount: "₹2,77,500",
            status: "Pending",
            reliability: "4.9/5"
        },
        {
            id: "REQ-9918",
            equipment: "JCB 3DX EcoXcellence",
            tenant: "Global Buildcon",
            location: "Pune, MH",
            duration: "5 Days",
            startDate: "25 Oct 2024",
            amount: "₹60,000",
            status: "Pending",
            reliability: "4.7/5"
        },
        {
            id: "REQ-9902",
            equipment: "Liebherr LTM 11200",
            tenant: "Heavy Lift India",
            location: "Gujarat",
            duration: "30 Days",
            startDate: "01 Nov 2024",
            amount: "₹25,50,000",
            status: "Under Review",
            reliability: "5.0/5"
        }
    ];

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight leading-none">Rent Requests</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    Manage incoming rental applications
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {["Pending", "Reviewing", "Accepted", "Rejected"].map((tab, idx) => (
                    <button
                        key={tab}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${idx === 0
                            ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20"
                            : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/10"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Requests List */}
            <div className="space-y-6 pb-20">
                {requests.map((req) => (
                    <div key={req.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm relative group">
                        {/* Status Ribbon */}
                        <div className="absolute top-0 right-10 px-4 py-1 rounded-b-xl bg-amber-100 dark:bg-amber-950/30 text-amber-600 text-[8px] font-black uppercase tracking-widest border border-t-0 border-amber-200 dark:border-amber-900/50">
                            {req.status}
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Tenant Info */}
                            <div className="flex items-center gap-4">
                                <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 dark:border-blue-900/30">
                                    <User className="size-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base font-black tracking-tight leading-none mb-1 truncate">{req.tenant}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
                                            Reliability: {req.reliability}
                                        </div>
                                        <div className="size-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{req.id}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-1">
                                    <div className="flex items-center gap-1.5 opacity-40">
                                        <Clock className="size-3" />
                                        <p className="text-[8px] font-black uppercase tracking-widest">Duration</p>
                                    </div>
                                    <p className="text-xs font-black italic">{req.duration} ({req.startDate})</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600/60 leading-none">Net Revenue</p>
                                    <p className="text-sm font-black text-emerald-700 dark:text-emerald-400 leading-none">{req.amount}</p>
                                </div>
                            </div>

                            {/* Project Link */}
                            <div className="flex items-center justify-between px-2 text-slate-400 italic">
                                <div className="flex items-center gap-2">
                                    <MapPin className="size-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{req.location}</span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-600 font-black uppercase tracking-widest text-[9px]">
                                    {req.equipment}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button className="flex-1 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <CheckCircle2 className="size-3.5" /> Approve Rent
                                </button>
                                <button className="size-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center active:scale-95 transition-all shadow-xl">
                                    <MessageSquare className="size-5" />
                                </button>
                                <button className="size-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/30 flex items-center justify-center active:scale-90 transition-transform">
                                    <XCircle className="size-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RentalRequests;
