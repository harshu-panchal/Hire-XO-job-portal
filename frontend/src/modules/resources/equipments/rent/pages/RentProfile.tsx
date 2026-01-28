import { MapPin, Building2, ShieldCheck, Mail, Phone, Globe, Star, Package, Edit3 } from "lucide-react";

const RentProfile = () => {
    const userData = {
        name: "Acme Constructions Ltd.",
        type: "Prime Contractor",
        location: "Mumbai, MH",
        email: "contact@acmeinfra.com",
        phone: "+91 98765 43210",
        website: "www.acmeinfra.com",
        rentalsCompleted: 42,
        activeRentals: 4,
        experience: "12 Years",
        rating: 4.9,
        verifications: ["GST Verified", "Identity Verified", "Bank Verified"]
    };

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Profile Header */}
            <div className="relative pt-4">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-500/30 overflow-hidden relative text-center">
                    <div className="relative z-10 flex flex-col items-center space-y-4">
                        <div className="size-24 rounded-[2.2rem] bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center p-4">
                            <Building2 className="size-full text-white" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black tracking-tight leading-none">{userData.name}</h1>
                            <div className="flex items-center justify-center gap-2 opacity-70">
                                <MapPin className="size-3" />
                                <p className="text-[10px] font-black uppercase tracking-widest">{userData.location}</p>
                            </div>
                        </div>
                        <button className="bg-white text-emerald-700 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-black/10">
                            <Edit3 className="size-3" /> Edit Profile
                        </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-24 -mt-24" />
                    <div className="absolute bottom-0 left-0 size-32 bg-black/5 rounded-full -ml-16 -mb-16" />
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 space-y-3 shadow-sm text-center">
                    <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto text-emerald-600">
                        <Star className="size-6 fill-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black tracking-tight leading-none italic">{userData.rating}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Tenant Rating</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 space-y-3 shadow-sm text-center">
                    <div className="size-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mx-auto text-amber-600">
                        <Package className="size-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black tracking-tight leading-none italic">{userData.rentalsCompleted}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Total Rentals</p>
                    </div>
                </div>
            </div>

            {/* Company Info */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Organization Details</h2>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Industry</p>
                            <p className="text-xs font-black tracking-tight">{userData.type}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Experience</p>
                            <p className="text-xs font-black tracking-tight">{userData.experience}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                        <div className="flex flex-wrap gap-2">
                            {userData.verifications.map((v) => (
                                <span key={v} className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950">
                                    <ShieldCheck className="size-3 text-emerald-600" /> {v}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Channels */}
            <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] p-7 shadow-xl space-y-6">
                <h2 className="text-lg font-black tracking-tight flex items-center gap-2 opacity-80">
                    <Globe className="size-5" /> Online Presence
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="size-11 rounded-xl bg-white/10 dark:bg-black/5 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                            <Mail className="size-5" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">Business Email</p>
                            <p className="text-sm font-black truncate">{userData.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="size-11 rounded-xl bg-white/10 dark:bg-black/5 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                            <Phone className="size-5" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">Verification OTP Phone</p>
                            <p className="text-sm font-black truncate">{userData.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="size-11 rounded-xl bg-white/10 dark:bg-black/5 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                            <Globe className="size-5" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">Company Website</p>
                            <p className="text-sm font-black truncate">{userData.website}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-4" />
        </div>
    );
};

export default RentProfile;
