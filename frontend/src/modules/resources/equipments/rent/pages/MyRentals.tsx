import { Calendar, Clock, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";


const MyRentals = () => {
    const rentals = [
        {
            id: "RNT-88219",
            name: "Caterpillar 320 GC Excavator",
            provider: "BuildRight Rentals",
            status: "In Progress",
            startDate: "12 Oct 2024",
            endDate: "25 Oct 2024",
            totalAmount: "₹2,40,500",
            image: "https://images.unsplash.com/photo-1579412691525-4c07da01ee7b?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: "RNT-88102",
            name: "JCB 3DX EcoXcellence",
            provider: "Metro Infra Equipment",
            status: "Scheduled",
            startDate: "02 Nov 2024",
            endDate: "10 Nov 2024",
            totalAmount: "₹96,000",
            image: "https://images.unsplash.com/photo-1541625602330-2277a7c4354d?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: "RNT-87940",
            name: "Kirloskar 125kVA Generator",
            provider: "PowerHouse Solutions",
            status: "Completed",
            startDate: "15 Sep 2024",
            endDate: "20 Sep 2024",
            totalAmount: "₹22,500",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400"
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "In Progress": return "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800";
            case "Scheduled": return "text-blue-600 bg-blue-100 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800";
            case "Completed": return "text-slate-500 bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-white/5";
            default: return "text-slate-500 bg-slate-100";
        }
    };

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight">My Rentals</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    Track your equipment rental history
                </p>
            </div>

            {/* Quick Stats Summary */}
            <div className="p-1 px-1 flex gap-4 overflow-x-auto no-scrollbar">
                <div className="bg-emerald-600 text-white rounded-[2.5rem] p-6 shrink-0 w-48 shadow-xl shadow-emerald-500/20">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Spent</p>
                    <p className="text-3xl font-black tracking-tighter italic">₹4.2L</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shrink-0 w-48 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">On Rent</p>
                    <p className="text-3xl font-black tracking-tighter">02</p>
                </div>
            </div>

            {/* Rentals List */}
            <div className="space-y-6">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 px-1 italic">Active & Past Rentals</h2>

                <div className="space-y-6 pb-20">
                    {rentals.map((rental) => (
                        <div
                            key={rental.id}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm relative group"
                        >
                            <div className="p-5 flex gap-5">
                                <div className="size-24 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                    <img src={rental.image} alt={rental.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 space-y-1 py-1">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusColor(rental.status)}`}>
                                        {rental.status === "In Progress" && <Clock className="size-2.5 animate-spin" />}
                                        {rental.status === "Completed" && <CheckCircle2 className="size-2.5" />}
                                        {rental.status === "Scheduled" && <Calendar className="size-2.5" />}
                                        {rental.status}
                                    </div>
                                    <h3 className="text-sm font-black tracking-tight leading-tight">{rental.name}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{rental.provider}</p>
                                </div>
                            </div>

                            <div className="px-5 pb-5 grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-between group-hover:bg-slate-100 dark:group-hover:bg-white/10 transition-colors">
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none">ID</p>
                                        <p className="text-[10px] font-black leading-none">{rental.id}</p>
                                    </div>
                                    <ChevronRight className="size-4 text-slate-300" />
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-between group-hover:bg-slate-100 dark:group-hover:bg-white/10 transition-colors">
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none">Rate</p>
                                        <p className="text-[10px] font-black leading-none">{rental.totalAmount}</p>
                                    </div>
                                    <AlertCircle className="size-4 text-slate-300" />
                                </div>
                            </div>

                            {/* Date Strip */}
                            <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-4 px-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Calendar className="size-4 opacity-40 shrink-0" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{rental.startDate} — {rental.endDate}</span>
                                </div>
                                <button className="text-[9px] font-black uppercase tracking-widest underline underline-offset-4 active:scale-95 transition-transform">
                                    View Receipt
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyRentals;
