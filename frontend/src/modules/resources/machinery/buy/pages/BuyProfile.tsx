import { MapPin, Building2, ShieldCheck, Mail, Phone, Globe, Package, Award, CreditCard } from "lucide-react";

const BuyProfile = () => {
    const buyerData = {
        name: "Acme Industrial Group",
        type: "Large Scale Infra",
        location: "Mumbai, Maharashtra",
        email: "procurement@acmeindus.com",
        phone: "+91 22 8899 0011",
        website: "www.acmeindus.in",
        totalSpent: "₹85,00,000",
        machinesOwned: 12,
        ordersCompleted: 28,
        rating: 4.9,
        verifications: ["Enterprise Account", "Tax Compliant", "Identity Verified"],
        tier: "Platinum Buyer"
    };

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="relative pt-4">
                <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-amber-500/30 overflow-hidden relative text-center">
                    <div className="relative z-10 flex flex-col items-center space-y-4">
                        <div className="size-24 rounded-[2.2rem] bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center p-4">
                            <Building2 className="size-full text-white" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black tracking-tight leading-none uppercase italic">{buyerData.name}</h1>
                            <div className="flex items-center justify-center gap-2 opacity-70">
                                <MapPin className="size-3" />
                                <p className="text-[10px] font-black uppercase tracking-widest">{buyerData.location}</p>
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full border border-white/30 flex items-center gap-2">
                            <Award className="size-4 text-amber-200" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{buyerData.tier}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 space-y-3 shadow-sm text-center">
                    <div className="size-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mx-auto text-amber-600">
                        <CreditCard className="size-6" />
                    </div>
                    <div>
                        <p className="text-xl font-black tracking-tight leading-none italic">{buyerData.totalSpent}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Total Procurement</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 space-y-3 shadow-sm text-center">
                    <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-600">
                        <Package className="size-6" />
                    </div>
                    <div>
                        <p className="text-xl font-black tracking-tight leading-none italic">{buyerData.machinesOwned}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Acquired Assets</p>
                    </div>
                </div>
            </div>

            {/* Company Info */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-amber-600 italic">Procurement Profile</h2>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Organization Type</p>
                            <p className="text-xs font-black tracking-tight uppercase leading-none">{buyerData.type}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Market Trust</p>
                            <p className="text-xs font-black tracking-tight italic">{buyerData.rating} Rating</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                        <div className="flex flex-wrap gap-2">
                            {buyerData.verifications.map((v) => (
                                <span key={v} className="px-5 py-2.5 rounded-full bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-slate-100 dark:border-white/5">
                                    <ShieldCheck className="size-3.5 text-emerald-500" /> {v}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Channels */}
            <div className="bg-slate-950 text-white rounded-[2.5rem] p-8 shadow-xl space-y-6">
                <h2 className="text-lg font-black tracking-tight flex items-center gap-3 italic">
                    <Globe className="size-6 text-amber-500" /> Procurement Desk
                </h2>
                <div className="space-y-5">
                    <div className="flex items-center gap-4">
                        <div className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                            <Mail className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Business Email</p>
                            <p className="text-sm font-black truncate">{buyerData.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                            <Phone className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Contact Line</p>
                            <p className="text-sm font-black truncate">{buyerData.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                            <Globe className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Enterprise Portal</p>
                            <p className="text-sm font-black truncate">{buyerData.website}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-4" />
        </div>
    );
};

export default BuyProfile;
