import { MapPin, Building2, ShieldCheck, Mail, Globe, Star, Edit3, Award, Users, Clock } from "lucide-react";

const ProvideProfile = () => {
    const providerData = {
        name: "Metro Equipments & Logistics",
        type: "Rental Authority",
        location: "Pune, Maharashtra",
        email: "logistics@metrogroup.in",
        phone: "+91 20 4455 6677",
        website: "www.metroequipment.in",
        fleetSize: 154,
        experience: "25+ Years",
        rating: 4.8,
        totalRentals: 4500,
        verifications: ["Verified Business", "Quality Assured", "Safe Handler"],
        recentAwards: ["Best Vendor 2023", "Fleet Excellence"]
    };

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Profile Header */}
            <div className="relative pt-4">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-500/30 overflow-hidden relative text-center">
                    <div className="relative z-10 flex flex-col items-center space-y-4">
                        <div className="size-24 rounded-[2.2rem] bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center p-4">
                            <Building2 className="size-full text-white" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black tracking-tighter italic leading-none">{providerData.name}</h1>
                            <div className="flex items-center justify-center gap-2 opacity-70">
                                <MapPin className="size-3" />
                                <p className="text-[10px] font-black uppercase tracking-widest">{providerData.location}</p>
                            </div>
                        </div>
                        <button className="bg-white text-blue-700 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-black/10">
                            <Edit3 className="size-3" /> Edit Profile
                        </button>
                    </div>

                    {/* Decorations */}
                    <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-24 -mt-24" />
                    <div className="absolute bottom-4 left-4 size-12 bg-white/10 rounded-full" />
                </div>
            </div>

            {/* Business Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 text-center space-y-2 shadow-sm">
                    <p className="text-2xl font-black tracking-tight leading-none italic text-blue-600">{providerData.fleetSize}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Machines</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 text-center space-y-2 shadow-sm">
                    <p className="text-2xl font-black tracking-tight leading-none italic text-indigo-600">4.8</p>
                    <div className="flex items-center justify-center gap-1 text-amber-500">
                        <Star className="size-2.5 fill-current" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Lender Rating</p>
                    </div>
                </div>
            </div>

            {/* Provider Details */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-blue-600 italic">Organization Stats</h2>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                <Users className="size-2.5" /> Industry
                            </p>
                            <p className="text-xs font-black tracking-tight">{providerData.type}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-end gap-1">
                                <Clock className="size-2.5" /> Market Exp
                            </p>
                            <p className="text-xs font-black tracking-tight">{providerData.experience}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {providerData.recentAwards.map((award) => (
                                <span key={award} className="px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-amber-100 dark:border-amber-900/40">
                                    <Award className="size-3" /> {award}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Verifications */}
            <div className="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-6 border border-slate-100 dark:border-white/10 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] px-1">Compliance & Verifications</h2>
                <div className="grid grid-cols-1 gap-2">
                    {providerData.verifications.map((v) => (
                        <div key={v} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest">{v}</span>
                            <ShieldCheck className="size-5 text-blue-500" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Strip */}
            <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] p-7 shadow-xl space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="size-11 rounded-xl bg-white/10 dark:bg-black/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <Mail className="size-5" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 leading-none mb-1 text-white dark:text-slate-900">Support Inquiry</p>
                            <p className="text-sm font-black truncate">{providerData.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="size-11 rounded-xl bg-white/10 dark:bg-black/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <Globe className="size-5" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 leading-none mb-1 text-white dark:text-slate-900">Fleet Portal</p>
                            <p className="text-sm font-black truncate">{providerData.website}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-4" />
        </div>
    );
};

export default ProvideProfile;
