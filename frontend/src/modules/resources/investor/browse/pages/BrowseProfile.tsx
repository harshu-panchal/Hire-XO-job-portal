import { Camera, Edit2, MapPin, Briefcase, DollarSign, Target, Mail, Phone, Building2 } from "lucide-react";

const BrowseProfile = () => {
    const profile = {
        name: "Rajesh Kumar",
        email: "rajesh.investor@gmail.com",
        phone: "+91 98765 43210",
        location: "Mumbai, Maharashtra",
        organization: "Kumar Investment Group",
        designation: "Managing Partner",
        experience: "15+ years",
        totalInvestments: "₹45 Cr",
        activeInvestments: 12,
        sectors: ["Technology", "Healthcare", "Renewable Energy", "Real Estate"],
        investmentRange: "₹50 Lakhs - ₹5 Cr",
        preferredEquity: "10-25%",
        bio: "Seasoned investor with focus on early-stage technology and healthcare startups. Looking for innovative businesses with strong growth potential and experienced founding teams.",
    };

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="px-1">
                <h1 className="text-3xl font-black tracking-tight">
                    Investor <span className="text-primary">Profile</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest mt-1">
                    Manage your investor information
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-[2.5rem] p-6 border border-primary/20">
                <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                        <div className="size-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-black text-3xl">
                            {profile.name.charAt(0)}
                        </div>
                        <button className="absolute -bottom-1 -right-1 size-8 rounded-lg bg-white dark:bg-slate-900 border-2 border-primary/20 flex items-center justify-center active:scale-90 transition-all">
                            <Camera className="size-4 text-primary" />
                        </button>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{profile.name}</h2>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{profile.designation}</p>
                            </div>
                            <button className="size-10 rounded-xl bg-white/50 dark:bg-slate-900/50 flex items-center justify-center active:scale-90 transition-all">
                                <Edit2 className="size-5 text-primary" />
                            </button>
                        </div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mt-2">
                            <span className="text-[8px] font-black uppercase tracking-widest text-primary">Verified Investor</span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-3 text-center">
                        <p className="text-lg font-black text-primary">{profile.activeInvestments}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-0.5">Active</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-3 text-center">
                        <p className="text-lg font-black text-emerald-600">{profile.totalInvestments}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-0.5">Invested</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-3 text-center">
                        <p className="text-lg font-black text-blue-600">{profile.experience}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-0.5">Experience</p>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black tracking-tight">Contact Information</h2>
                    <button className="text-xs font-black text-primary uppercase tracking-widest active:scale-95 transition-transform">
                        Edit
                    </button>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                            <Mail className="size-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Email</p>
                            <p className="text-sm font-bold truncate">{profile.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <Phone className="size-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Phone</p>
                            <p className="text-sm font-bold">{profile.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                            <MapPin className="size-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Location</p>
                            <p className="text-sm font-bold">{profile.location}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                            <Building2 className="size-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Organization</p>
                            <p className="text-sm font-bold">{profile.organization}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Investment Preferences */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black tracking-tight">Investment Preferences</h2>
                    <button className="text-xs font-black text-primary uppercase tracking-widest active:scale-95 transition-transform">
                        Edit
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="size-5 text-emerald-600" />
                            <p className="text-sm font-black">Investment Range</p>
                        </div>
                        <p className="text-lg font-black text-emerald-600 ml-7">{profile.investmentRange}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="size-5 text-blue-600" />
                            <p className="text-sm font-black">Preferred Equity</p>
                        </div>
                        <p className="text-lg font-black text-blue-600 ml-7">{profile.preferredEquity}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="size-5 text-purple-600" />
                            <p className="text-sm font-black">Preferred Sectors</p>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-7">
                            {profile.sectors.map((sector, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-black text-purple-600"
                                >
                                    {sector}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black tracking-tight">About Me</h2>
                    <button className="text-xs font-black text-primary uppercase tracking-widest active:scale-95 transition-transform">
                        Edit
                    </button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{profile.bio}</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button className="py-4 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-sm uppercase tracking-widest active:scale-95 transition-all">
                    View Public Profile
                </button>
                <button className="py-4 rounded-[1.5rem] bg-gradient-to-r from-primary to-primary/80 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default BrowseProfile;
