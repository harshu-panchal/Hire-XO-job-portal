import { Search, Phone, Mail } from "lucide-react";

const VehicleInquiries = () => {
    const inquiries = [
        {
            id: 1,
            name: "Rahul Mehta",
            role: "Logistics Manager",
            message: "Interested in renting the Tata Ace for 3 days for local shifting. Need quote for insurance as well.",
            time: "2h ago",
            status: "New",
            initial: "RM",
            color: "from-blue-500 to-cyan-600"
        },
        {
            id: 2,
            name: "Anjali Sharma",
            role: "Event Planner",
            message: "Need a luxury sedan for a wedding ceremony in South Delhi next week. Please confirm availability.",
            time: "5h ago",
            status: "Replied",
            initial: "AS",
            color: "from-cyan-500 to-blue-600"
        }
    ];

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="space-y-4 px-1">
                <h1 className="text-3xl font-black tracking-tighter italic">Inquiries</h1>

                {/* Search */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
                        <Search className="size-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search leads..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-blue-600 transition-all font-sans"
                    />
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {inquiries.map((inquiry) => (
                    <div
                        key={inquiry.id}
                        className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-5 border border-slate-200 dark:border-white/10 group active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`size-14 rounded-2xl bg-gradient-to-br ${inquiry.color} flex items-center justify-center text-white text-xl font-black shadow-lg`}>
                                {inquiry.initial}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                    <div>
                                        <h3 className="font-black text-base tracking-tight">{inquiry.name}</h3>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">{inquiry.role}</p>
                                    </div>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{inquiry.time}</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 font-medium leading-relaxed">
                                    "{inquiry.message}"
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button className="size-9 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors border border-slate-100 dark:border-white/5">
                                            <Phone className="size-4" />
                                        </button>
                                        <button className="size-9 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors border border-slate-100 dark:border-white/5">
                                            <Mail className="size-4" />
                                        </button>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${inquiry.status === "New"
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-400 dark:bg-white/5"
                                        }`}>
                                        {inquiry.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VehicleInquiries;
