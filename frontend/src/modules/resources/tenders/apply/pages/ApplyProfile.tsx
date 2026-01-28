import { Building2, MapPin, Globe, Award, ShieldCheck, Briefcase, ChevronRight, Edit3, FileCheck } from "lucide-react";

const ApplyProfile = () => {
    const companyData = {
        name: "EcoBuild Infrastructure Ltd.",
        bio: "Leading construction and infrastructure development company specializing in sustainable urban projects and smart city solutions across India.",
        location: "Mumbai, Maharashtra",
        website: "www.ecobuild.infra.in",
        founded: "2012",
        projectsWon: 14,
        experience: "12+ Years",
        expertises: ["Civil Works", "Smart City", "Water Management", "Urban Planning"],
        regDetails: [
            { label: "CIN", value: "U45200MH2012PLC234567" },
            { label: "GSTIN", value: "27AAACE1234F1Z5" },
            { label: "Class", value: "Class A Contractor" }
        ]
    };

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Profile Header */}
            <div className="relative pt-4">
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-violet-500/30 overflow-hidden relative">
                    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                        <div className="size-24 rounded-[2rem] bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center p-4">
                            <Building2 className="size-full text-white" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black tracking-tight">{companyData.name}</h1>
                            <div className="flex items-center justify-center gap-2 opacity-70">
                                <MapPin className="size-3" />
                                <p className="text-[10px] font-black uppercase tracking-widest">{companyData.location}</p>
                            </div>
                        </div>
                        <button className="bg-white text-violet-600 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-black/10">
                            <Edit3 className="size-3" /> Edit Profile
                        </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-24 -mt-24" />
                    <div className="absolute bottom-0 left-0 size-32 bg-black/5 rounded-full -ml-16 -mb-16" />
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-4 flex flex-col items-center text-center space-y-2 shadow-sm">
                    <div className="size-10 rounded-2xl bg-violet-100 dark:bg-violet-950/30 flex items-center justify-center">
                        <Award className="size-5 text-violet-600" />
                    </div>
                    <div>
                        <p className="text-xl font-black tracking-tight">{companyData.projectsWon}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Won</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-4 flex flex-col items-center text-center space-y-2 shadow-sm">
                    <div className="size-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                        <Briefcase className="size-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xl font-black tracking-tight">{companyData.experience}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Exp</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-4 flex flex-col items-center text-center space-y-2 shadow-sm">
                    <div className="size-10 rounded-2xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                        <FileCheck className="size-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xl font-black tracking-tight">Active</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">8 Bids</p>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="space-y-4">
                <h2 className="px-1 text-lg font-black tracking-tight flex items-center gap-2">
                    <ShieldCheck className="size-5 text-violet-600" /> Organization Bio
                </h2>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm">
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        "{companyData.bio}"
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-4">
                        <a href={`https://${companyData.website}`} className="flex items-center gap-2 text-violet-600">
                            <Globe className="size-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Visit Website</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Expertise Chips */}
            <div className="space-y-4">
                <h2 className="px-1 text-lg font-black tracking-tight uppercase tracking-widest text-slate-400 text-[10px]">Prime Sectors</h2>
                <div className="flex flex-wrap gap-2">
                    {companyData.expertises.map((exp) => (
                        <span key={exp} className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest">
                            {exp}
                        </span>
                    ))}
                </div>
            </div>

            {/* Registration Details */}
            <div className="space-y-4 pb-4">
                <h2 className="px-1 text-lg font-black tracking-tight">Verification Assets</h2>
                <div className="space-y-3">
                    {companyData.regDetails.map((reg) => (
                        <div key={reg.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between group">
                            <div className="space-y-0.5">
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{reg.label}</p>
                                <p className="text-sm font-black tracking-tight">{reg.value}</p>
                            </div>
                            <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-violet-50 transition-colors">
                                <ChevronRight className="size-4 text-slate-400 group-hover:text-violet-600" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ApplyProfile;
