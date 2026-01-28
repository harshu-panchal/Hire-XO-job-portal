import { MapPin, ShieldCheck, Globe, Star, Clock, Edit3, Award, TrendingUp, DollarSign, Briefcase } from "lucide-react";

const SellProfile = () => {
    const sellerData = {
        name: "Modern Infra Solutions",
        type: "Industrial Equipment Wholesaler",
        location: "Pune, Maharashtra",
        email: "sales@moderninfra.in",
        phone: "+91 20 2233 4455",
        website: "www.moderninfra.in",
        totalSales: "₹1.4 Cr",
        listingsActive: 8,
        salesCompleted: 42,
        rating: 4.8,
        verifications: ["Verified OEM Seller", "Tax Compliant", "Bank Verified"],
        memberSince: "Jan 2022"
    };

    return (
        <div className="py-6 space-y-8 select-none bg-slate-50 min-h-screen text-slate-900">
            {/* Header */}
            <div className="relative pt-4">
                <div className="bg-white rounded-[3rem] p-10 border border-slate-200 text-center relative overflow-hidden group shadow-sm">
                    <div className="relative z-10 flex flex-col items-center space-y-5">
                        <div className="size-24 rounded-[2.5rem] bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center p-5 shadow-[0_0_40px_rgba(79,70,229,0.05)]">
                            <Briefcase className="size-full text-indigo-600" />
                        </div>
                        <div className="space-y-1.5">
                            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">{sellerData.name}</h1>
                            <div className="flex items-center justify-center gap-2 opacity-100">
                                <MapPin className="size-3 text-indigo-600" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{sellerData.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <div className="bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 flex items-center gap-2">
                                <Award className="size-4 text-indigo-600" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">Prime Merchant</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-black text-xs text-amber-600">
                                <Star className="size-3 fill-current" />
                                {sellerData.rating}
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute top-0 left-0 size-full opacity-5 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-indigo-500 blur-[100px] rounded-full" />
                    </div>
                </div>
            </div>

            {/* Seller Performance Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 space-y-3 shadow-sm text-center group active:scale-[0.98] transition-all">
                    <div className="size-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
                        <DollarSign className="size-6" />
                    </div>
                    <div>
                        <p className="text-xl font-black tracking-tighter italic leading-none">{sellerData.totalSales}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">GTV Generated</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 space-y-3 shadow-sm text-center group active:scale-[0.98] transition-all">
                    <div className="size-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
                        <TrendingUp className="size-6" />
                    </div>
                    <div>
                        <p className="text-xl font-black tracking-tighter italic leading-none">{sellerData.salesCompleted}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Successful Exits</p>
                    </div>
                </div>
            </div>

            {/* Verification Badge Wall */}
            <div className="space-y-4">
                <h2 className="px-2 text-[9px] font-black uppercase tracking-[0.4em] text-indigo-600 italic">Merchant Trust Assets</h2>
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                    <div className="flex flex-col gap-4">
                        {sellerData.verifications.map((v) => (
                            <div key={v} className="flex items-center gap-4 group">
                                <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-500">
                                    <ShieldCheck className="size-5 text-emerald-500" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors">{v}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between opacity-60">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="size-3" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Seller Tenure</span>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest font-bold">{sellerData.memberSince}</span>
                    </div>
                </div>
            </div>

            {/* Contact channels */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-4 flex gap-2 shadow-sm">
                <button className="flex-1 py-5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg">
                    <Edit3 className="size-4" /> Edit Profile
                </button>
                <button className="size-[60px] rounded-2xl bg-indigo-600 text-white flex items-center justify-center active:scale-95 transition-all shadow-xl shadow-indigo-500/10">
                    <Globe className="size-6" />
                </button>
            </div>

            <div className="h-4" />
        </div>
    );
};

export default SellProfile;
