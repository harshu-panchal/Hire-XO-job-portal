import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, Building2, CheckCircle2, Phone, MessageSquare, ChevronRight, Zap, Award } from "lucide-react";

const MachineDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const machine = {
        id: id,
        name: "Schwing Stetter CP30 Concrete Mixer",
        brand: "Schwing Stetter",
        year: "2021",
        location: "Chennai, Tamil Nadu",
        price: "12,45,000",
        rating: 4.8,
        reviews: 42,
        condition: "Certified Pre-Owned",
        owner: "Modern Infra Solutions",
        description: "Excellent working condition CP30 batching plant. Regularly serviced by authorized dealers. Includes all standard attachments and a 6-month limited warranty on the hydraulic system.",
        specs: [
            { label: "Batch Size", value: "0.5 cu.m." },
            { label: "Throughput", value: "30 cu.m./hr" },
            { label: "Storage Bins", value: "4 Compartments" },
            { label: "Total Power", value: "45 HP" }
        ],
        features: [
            "Fully automated control system",
            "High weighing accuracy",
            "Shortest mixing time",
            "Low maintenance cost"
        ],
        images: ["https://images.unsplash.com/photo-1579412691525-4c07da01ee7b?auto=format&fit=crop&q=80&w=800"]
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
                <div className="px-5 py-2 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 border border-amber-100 dark:border-amber-900/50 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="size-3 fill-amber-500" />
                    Hot Listing
                </div>
            </div>

            {/* Gallery */}
            <div className="relative group">
                <div className="w-full h-72 rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-2xl relative">
                    <img src={machine.images[0]} alt={machine.name} className="size-full object-cover" />
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                        {machine.condition}
                    </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/20">
                    1/5 Media
                </div>
            </div>

            {/* Title & Brand */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-amber-600 text-[10px] font-black uppercase tracking-widest">{machine.brand}</span>
                        <div className="size-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="flex items-center gap-1 font-black text-xs">
                            <Star className="size-3 text-amber-500 fill-amber-500" />
                            {machine.rating} <span className="text-slate-400 font-bold">({machine.reviews})</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">{machine.name}</h1>
                </div>

                <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center text-amber-600">
                            <Building2 className="size-6" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5 italic">Seller</p>
                            <p className="text-sm font-black leading-none">{machine.owner}</p>
                        </div>
                    </div>
                    <Award className="size-5 text-blue-500" />
                </div>
            </div>

            {/* Tech Specs */}
            <div className="space-y-4">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2 italic">
                    <Zap className="size-5 text-amber-500" /> Specifications
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    {machine.specs.map((spec) => (
                        <div key={spec.label} className="p-4 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{spec.label}</p>
                            <p className="text-[12px] font-black">{spec.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Highlights */}
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 space-y-6">
                <h3 className="text-lg font-black tracking-tight italic uppercase text-amber-500">Machine Highlights</h3>
                <div className="grid grid-cols-1 gap-4">
                    {machine.features.map((feature, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                            <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="size-4 text-emerald-400" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{feature}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div className="space-y-4 px-1">
                <h2 className="text-xl font-black tracking-tight italic">Detailed Overview</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed tracking-tight">
                    {machine.description}
                </p>
            </div>

            {/* Footer Contact bar */}
            <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Base</p>
                        <h4 className="text-lg font-black tracking-tighter italic">{machine.location}</h4>
                    </div>
                    <div className="flex gap-2">
                        <button className="size-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-amber-500/20">
                            <Phone className="size-5" />
                        </button>
                        <button className="size-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
                            <MessageSquare className="size-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Price & Buy Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-40 pointer-events-none">
                <div className="w-full max-w-[430px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl pointer-events-auto">
                    <div className="px-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Buying Price</p>
                        <p className="text-xl font-black text-amber-600 tracking-tighter italic">₹ {machine.price}</p>
                    </div>
                    <button className="bg-amber-600 text-white font-black text-[12px] uppercase tracking-[0.2em] px-8 py-5 rounded-[1.8rem] shadow-xl shadow-amber-500/30 active:scale-95 transition-all flex items-center gap-3">
                        Buy Asset <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            <div className="h-20" />
        </div>
    );
};

export default MachineDetails;
