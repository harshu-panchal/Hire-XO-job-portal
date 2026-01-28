import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ChevronLeft, User, Camera, Mail, Phone, Briefcase } from "lucide-react";

const RecruiterProfile = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    // Local state for form
    const [formData, setFormData] = useState({
        name: user?.profile.name || "",
        email: user?.profile.email || "",
        phoneNumber: user?.profile.phoneNumber || "",
        role: "Hiring Manager" // Placeholder as it's not in base profile clearly
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        updateUser({
            profile: {
                ...user!.profile,
                name: formData.name,
                phoneNumber: formData.phoneNumber
            }
        });

        setIsLoading(false);
        navigate(-1);
    };

    return (
        <div className="pb-40 select-none">
            {/* Header */}
            <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 -mx-5 px-5">
                <button
                    onClick={() => navigate(-1)}
                    className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all"
                >
                    <ChevronLeft className="size-6" />
                </button>
                <h2 className="text-sm font-black uppercase tracking-widest">Profile</h2>
                <div className="size-11" />
            </div>

            <div className="mt-6 space-y-8">
                {/* Photo Upload */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="size-32 rounded-[2.5rem] bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                            <img
                                src={user?.profile.profilePhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=Recruiter"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 size-10 rounded-xl bg-slate-900 text-white flex items-center justify-center border-4 border-white dark:border-slate-800 active:scale-90 transition-all">
                            <Camera className="size-4" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Personal Info</label>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <User className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
                            />
                        </div>

                        <div className="relative group opacity-60">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Mail className="size-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                disabled
                                value={formData.email}
                                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-slate-100 dark:bg-white/5 border-2 border-transparent text-sm font-black"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Phone className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
                            />
                        </div>

                        {/* Role Field - Display only or editable if desired */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Briefcase className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Job Role"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
                            />
                        </div>
                    </div>

                    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 z-50">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="h-16 w-full rounded-3xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecruiterProfile;
