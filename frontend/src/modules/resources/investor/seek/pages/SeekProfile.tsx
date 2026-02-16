import {
    Camera,
    Edit2,
    MapPin,
    Briefcase,
    DollarSign,
    Target,
    Mail,
    Phone,
    Building2,
    Save,
    X,
    Loader2,
    ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const SeekProfile = () => {
    const navigate = useNavigate();
    const { user, updateProfile } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: user?.name || "User",
        email: user?.email || "",
        phone: user?.phoneNumber || "Add phone number",
        location: user?.profile?.location || "India",
        organization: user?.profile?.company || "My Startup",
        designation: user?.profile?.jobTitle || "Founder",
        experience: "N/A",
        fundingRaised: "₹0 Cr",
        activeRequests: 0,
        sectors: ["Technology"],
        fundingGoal: user?.profile?.investmentRange || "₹0 - ₹0",
        equityOffered: user?.profile?.preferredEquity || "N/A",
        bio: user?.profile?.bio || "Describe your business or funding needs.",
    });

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name,
                email: user.email,
                phone: user.phoneNumber || "Add phone number",
                location: user.profile?.location || "India",
                organization: user.profile?.company || "My Startup",
                designation: user.profile?.jobTitle || "Founder",
                experience: "N/A",
                fundingRaised: "₹0 Cr",
                activeRequests: 0,
                sectors: ["Technology"],
                fundingGoal: user.profile?.investmentRange || "₹0 - ₹0",
                equityOffered: user.profile?.preferredEquity || "N/A",
                bio: user.profile?.bio || "Describe your business or funding needs.",
            });
        }
    }, [user]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        try {
            setIsLoading(true);
            await updateProfile({
                name: profile.name,
                email: profile.email,
                phoneNumber: profile.phone,
                profile: {
                    ...user?.profile,
                    location: profile.location,
                    company: profile.organization,
                    jobTitle: profile.designation,
                    investmentRange: profile.fundingGoal,
                    preferredEquity: profile.equityOffered,
                    bio: profile.bio,
                },
            });
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user || user.role !== "resource") {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="size-24 rounded-3xl bg-primary/10 flex items-center justify-center rotate-3">
                    <Camera className="size-10 text-primary" />
                </div>
                <div className="space-y-2 max-w-sm">
                    <h2 className="text-3xl font-black tracking-tighter">
                        Profile <span className="text-primary">Access</span>
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Login to manage your business profile, track funding requests, and connect with investors.
                    </p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button
                        onClick={() => navigate("/login/resource")}
                        className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                    >
                        Login Now
                    </button>
                    <button
                        onClick={() => navigate("/resources/categories")}
                        className="w-full py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black uppercase tracking-widest active:scale-95 transition-all"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6 space-y-6 select-none animate-in fade-in duration-500">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors active:scale-95"
            >
                <ArrowLeft className="size-4" />
                <span>Go Back</span>
            </button>

            {/* Header */}
            <div className="px-1">
                <h1 className="text-3xl font-black tracking-tight">
                    Business <span className="text-primary">Profile</span>
                </h1>
                <p className="text-slate-500 font-black text-xs uppercase tracking-widest mt-1">
                    Manage your business and funding information
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-[2.5rem] p-6 border border-primary/20">
                <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                        <div className="size-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-black text-3xl">
                            {profile.name.charAt(0)}
                        </div>
                        <button className="absolute -bottom-1 -right-1 size-8 rounded-lg bg-white border-2 border-primary/20 flex items-center justify-center active:scale-90 transition-all">
                            <Camera className="size-4 text-primary" />
                        </button>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                            <div className="flex-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full bg-white/50 rounded-lg px-2 py-1 text-2xl font-black tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 mb-1"
                                    />
                                ) : (
                                    <h2 className="text-2xl font-black tracking-tight">{profile.name}</h2>
                                )}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.designation}
                                        onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                                        className="w-full bg-white/50 rounded-lg px-2 py-1 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                ) : (
                                    <p className="text-sm font-bold text-slate-600">
                                        {profile.designation}
                                    </p>
                                )}
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="size-10 rounded-xl bg-white/50 flex items-center justify-center active:scale-90 transition-all ml-2"
                                >
                                    <Edit2 className="size-5 text-primary" />
                                </button>
                            )}
                        </div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mt-2">
                            <span className="text-[8px] font-black uppercase tracking-widest text-primary">
                                Investment Seeker
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/50 rounded-xl p-3 text-center">
                        <p className="text-lg font-black text-primary">{profile.activeRequests}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-0.5">
                            Requests
                        </p>
                    </div>
                    <div className="bg-white/50 rounded-xl p-3 text-center">
                        <p className="text-lg font-black text-emerald-600">{profile.fundingRaised}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-0.5">
                            Raised
                        </p>
                    </div>
                    <div className="bg-white/50 rounded-xl p-3 text-center">
                        <p className="text-lg font-black text-blue-600">{profile.experience}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-0.5">
                            Experience
                        </p>
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black tracking-tight">Basic Information</h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-xs font-black text-primary uppercase tracking-widest active:scale-95 transition-transform"
                        >
                            Edit
                        </button>
                    )}
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                        <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                            <Mail className="size-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                Email
                            </p>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full bg-transparent text-sm font-bold focus:outline-none"
                                />
                            ) : (
                                <p className="text-sm font-bold truncate">{profile.email}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                        <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <Phone className="size-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                Phone
                            </p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    className="w-full bg-transparent text-sm font-bold focus:outline-none"
                                />
                            ) : (
                                <p className="text-sm font-bold">{profile.phone}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                        <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                            <MapPin className="size-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                Location
                            </p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.location}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                    className="w-full bg-transparent text-sm font-bold focus:outline-none"
                                />
                            ) : (
                                <p className="text-sm font-bold">{profile.location}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                        <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                            <Building2 className="size-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                                Company Name
                            </p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.organization}
                                    onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                                    className="w-full bg-transparent text-sm font-bold focus:outline-none"
                                />
                            ) : (
                                <p className="text-sm font-bold">{profile.organization}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Funding Requirements */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black tracking-tight">Funding Requirements</h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-xs font-black text-primary uppercase tracking-widest active:scale-95 transition-transform"
                        >
                            Edit
                        </button>
                    )}
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="size-5 text-emerald-600" />
                            <p className="text-sm font-black">Target Funding</p>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profile.fundingGoal}
                                onChange={(e) => setProfile({ ...profile, fundingGoal: e.target.value })}
                                className="w-full bg-slate-50 rounded-xl px-4 py-2 text-lg font-black text-emerald-600 focus:outline-none ml-7"
                            />
                        ) : (
                            <p className="text-lg font-black text-emerald-600 ml-7">{profile.fundingGoal}</p>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="size-5 text-blue-600" />
                            <p className="text-sm font-black">Equity Offered</p>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profile.equityOffered}
                                onChange={(e) => setProfile({ ...profile, equityOffered: e.target.value })}
                                className="w-full bg-slate-50 rounded-xl px-4 py-2 text-lg font-black text-blue-600 focus:outline-none ml-7"
                            />
                        ) : (
                            <p className="text-lg font-black text-blue-600 ml-7">{profile.equityOffered}</p>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="size-5 text-purple-600" />
                            <p className="text-sm font-black">Sectors</p>
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
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black tracking-tight">Business Bio</h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-xs font-black text-primary uppercase tracking-widest active:scale-95 transition-transform"
                        >
                            Edit
                        </button>
                    )}
                </div>
                {isEditing ? (
                    <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full h-32 bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed focus:outline-none"
                    />
                ) : (
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {profile.bio}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
                {isEditing ? (
                    <>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="py-4 rounded-[1.5rem] bg-slate-100 text-slate-600 font-black text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <X className="size-4" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="py-4 rounded-[1.5rem] bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Save className="size-4" />
                            )}
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                    </>
                ) : (
                    <>
                        <button className="py-4 rounded-[1.5rem] bg-slate-100 text-slate-600 font-black text-sm uppercase tracking-widest active:scale-95 transition-all">
                            View Pitch Deck
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="py-4 rounded-[1.5rem] bg-gradient-to-r from-primary to-primary/80 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            Edit Profile
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SeekProfile;
