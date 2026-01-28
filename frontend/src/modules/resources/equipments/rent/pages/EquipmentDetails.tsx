import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, Building2, ShieldCheck, CheckCircle2, Phone, MessageSquare, ChevronRight, Info } from "lucide-react";

const EquipmentDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock data for the equipment
    const equipment = {
        id: id,
        name: "Caterpillar 320 GC Excavator",
        category: "Excavators",
        provider: "BuildRight Rentals",
        location: "Mumbai, Maharashtra",
        price: "₹18,500",
        unit: "day",
        rating: 4.8,
        reviews: 124,
        status: "Available Now",
        description: "The Cat 320 GC offers you the ideal balance of dependable performance, operator productivity features, and cost savings. It is a reliable, low-cost-per-hour machine for your medium-to heavy-duty applications.",
        specs: [
            { label: "Net Power", value: "145 HP" },
            { label: "Operating Weight", value: "21,900 kg" },
            { label: "Max Dig Depth", value: "6,700 mm" },
            { label: "Fuel Tank", value: "390 L" }
        ],
        features: [
            "Advanced hydraulic system for high productivity",
            "Fuel-efficient engine with power modes",
            "Robust undercarriage for durability",
            "Comfortable ergonomic cabin with AC"
        ],
        rentIncludes: [
            "Qualified Operator",
            "Routine Maintenance",
            "Insurance Coverage",
            "On-site Support"
        ],
        images: [
            "https://images.unsplash.com/photo-1579412691525-4c07da01ee7b?auto=format&fit=crop&q=80&w=800"
        ]
    };

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-1">
                <button
                    onClick={() => navigate(-1)}
                    className="size-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 shadow-sm active:scale-90 transition-transform"
                >
                    <ArrowLeft className="size-5" />
                </button>
                <div className="px-5 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-100 dark:border-emerald-900/50 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {equipment.status}
                </div>
            </div>

            {/* Image Gallery */}
            <div className="relative group">
                <div className="w-full h-72 rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-2xl">
                    <img src={equipment.images[0]} alt={equipment.name} className="size-full object-cover" />
                </div>
                <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/20">
                    1/4 Photos
                </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                        <span>{equipment.category}</span>
                        <div className="size-1 rounded-full bg-emerald-200 dark:bg-emerald-800" />
                        <div className="flex items-center gap-1">
                            <Star className="size-3 fill-amber-500 text-amber-500" />
                            <span className="text-slate-900 dark:text-white">{equipment.rating}</span>
                            <span className="text-slate-400">({equipment.reviews})</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight leading-tight">{equipment.name}</h1>
                </div>

                <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-400">
                            <Building2 className="size-6" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Provided by</p>
                            <p className="text-sm font-black tracking-tight">{equipment.provider}</p>
                        </div>
                    </div>
                    <ShieldCheck className="size-5 text-blue-500" />
                </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                    <Info className="size-5 text-emerald-600" /> Tech Specs
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    {equipment.specs.map((spec) => (
                        <div key={spec.label} className="p-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{spec.label}</p>
                            <p className="text-sm font-black">{spec.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div className="space-y-4 px-1">
                <h2 className="text-xl font-black tracking-tight">Overview</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed tracking-tight">
                    {equipment.description}
                </p>
            </div>

            {/* Features List */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-[2.5rem] p-8 space-y-6">
                <h3 className="text-lg font-black tracking-tight text-emerald-700 dark:text-emerald-400 italic">Why this gear?</h3>
                <div className="space-y-4">
                    {equipment.features.map((feature, idx) => (
                        <div key={idx} className="flex gap-3">
                            <div className="size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 className="size-3" />
                            </div>
                            <p className="text-xs font-black tracking-tight text-emerald-900/70 dark:text-emerald-300/70 leading-relaxed uppercase">
                                {feature}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rental Package Includes */}
            <div className="space-y-4">
                <h2 className="text-xl font-black tracking-tight px-1 uppercase tracking-widest text-[10px] text-slate-400">Rental Includes</h2>
                <div className="grid grid-cols-2 gap-4">
                    {equipment.rentIncludes.map((inc) => (
                        <div key={inc} className="flex items-center gap-2 text-slate-500">
                            <div className="size-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{inc}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Static Contact Strip */}
            <div className="p-6 bg-slate-900 dark:bg-white rounded-[2.5rem] text-white dark:text-black shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Local Support</p>
                        <h4 className="text-lg font-black tracking-tight">{equipment.location}</h4>
                    </div>
                    <div className="flex gap-2">
                        <button className="size-12 rounded-2xl bg-white/10 dark:bg-black/5 flex items-center justify-center active:scale-90 transition-transform border border-white/10 dark:border-black/5">
                            <Phone className="size-5" />
                        </button>
                        <button className="size-12 rounded-2xl bg-white/10 dark:bg-black/5 flex items-center justify-center active:scale-90 transition-transform border border-white/10 dark:border-black/5">
                            <MessageSquare className="size-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-40 pointer-events-none">
                <div className="w-full max-w-[430px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl pointer-events-auto">
                    <div className="px-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Per {equipment.unit}</p>
                        <p className="text-xl font-black text-emerald-600 tracking-tight">{equipment.price}</p>
                    </div>
                    <button className="bg-emerald-600 text-white font-black text-[12px] uppercase tracking-[0.2em] px-8 py-5 rounded-[1.8rem] shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-2">
                        Book Now <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            <div className="h-20" />
        </div>
    );
};

export default EquipmentDetails;
