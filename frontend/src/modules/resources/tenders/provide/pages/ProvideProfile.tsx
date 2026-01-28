import { Building2, MapPin, Globe, ShieldCheck, FileCheck, Edit3, BarChart3, Mail, Phone, CheckCircle2 } from "lucide-react";

const ProvideProfile = () => {
    const orgData = {
        name: "Mumbai Municipal Corporation (MMC)",
        type: "Government Authority",
        industry: "Public Infrastructure & Governance",
        location: "Mumbai, Maharashtra",
        website: "www.mmc.gov.in",
        founded: "1888",
        tendersPublished: 1245,
        totalValueDistributed: "₹18,500 Cr",
        activeTenders: 15,
        departments: ["Infrastructure", "Public Health", "Education", "City Planning"],
        regDetails: [
            { label: "Authority ID", value: "MMC-AUTH-001" },
            { label: "GSTIN", value: "27AAAGM0001A1Z1" },
            { label: "Type", value: "Urban Local Body" }
        ]
    };

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Profile Header */}
            <div className="relative pt-4">
                <div className="bg-gradient-to-br from-indigo-700 to-violet-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/30 overflow-hidden relative text-center">
                    <div className="relative z-10 flex flex-col items-center space-y-4">
                        <div className="size-24 rounded-[2rem] bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center p-4">
                            <Building2 className="size-full text-white" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black tracking-tight">{orgData.name}</h1>
                            <div className="flex items-center justify-center gap-2 opacity-70">
                                <MapPin className="size-3" />
                                <p className="text-[10px] font-black uppercase tracking-widest">{orgData.location}</p>
                            </div>
                        </div>
                        <button className="bg-white text-indigo-700 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-black/10">
                            <Edit3 className="size-3" /> Edit Authority
                        </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-24 -mt-24" />
                    <div className="absolute bottom-0 left-0 size-32 bg-black/5 rounded-full -ml-16 -mb-16" />
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 flex flex-col items-center text-center space-y-2 shadow-sm">
                    <div className="size-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                        <FileCheck className="size-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black tracking-tight">{orgData.tendersPublished}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tenders Published</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 flex flex-col items-center text-center space-y-2 shadow-sm">
                    <div className="size-12 rounded-2xl bg-violet-100 dark:bg-violet-950/30 flex items-center justify-center">
                        <BarChart3 className="size-6 text-violet-600" />
                    </div>
                    <div>
                        <p className="text-lg font-black tracking-tight">{orgData.totalValueDistributed}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Awarded Value</p>
                    </div>
                </div>
            </div>

            {/* Departments */}
            <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Active Departments</h2>
                <div className="flex flex-wrap gap-2">
                    {orgData.departments.map((dept) => (
                        <span key={dept} className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-indigo-500" /> {dept}
                        </span>
                    ))}
                </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                    <ShieldCheck className="size-5 text-indigo-600" /> Authority Verifications
                </h2>
                <div className="space-y-4">
                    {orgData.regDetails.map((reg) => (
                        <div key={reg.label} className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{reg.label}</p>
                                <p className="text-sm font-black tracking-tight">{reg.value}</p>
                            </div>
                            <CheckCircle2 className="size-5 text-emerald-500" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Details */}
            <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-[2.5rem] p-6 shadow-xl space-y-6">
                <h2 className="text-lg font-black tracking-tight uppercase tracking-widest opacity-80">Official Channels</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-white/10 dark:bg-slate-900/10 flex items-center justify-center">
                            <Globe className="size-6 opacity-60" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Official Portal</p>
                            <p className="text-sm font-black truncate">{orgData.website}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 dark:bg-slate-900/5 space-y-1">
                            <Mail className="size-4 opacity-40" />
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Gov Mail</p>
                            <p className="text-[10px] font-black">tender@gov.in</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 dark:bg-slate-900/5 space-y-1">
                            <Phone className="size-4 opacity-40" />
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Helpline</p>
                            <p className="text-[10px] font-black">1800 234 567</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-4" />
        </div>
    );
};

export default ProvideProfile;
