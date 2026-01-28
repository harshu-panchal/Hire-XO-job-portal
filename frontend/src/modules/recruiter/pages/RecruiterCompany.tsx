import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ChevronLeft, Building2, MapPin, Globe, FileText, Upload } from "lucide-react";

const RecruiterCompany = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    // Local state for form
    const [formData, setFormData] = useState({
        company: user?.profile.company || "",
        location: "Bengaluru, India", // Placeholder
        website: "https://example.com", // Placeholder
        about: "Leading technology company focused on innovation.", // Placeholder
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        updateUser({
            profile: {
                ...user!.profile,
                company: formData.company,
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
                <h2 className="text-sm font-black uppercase tracking-widest">Company Details</h2>
                <div className="size-11" />
            </div>

            <div className="mt-6 space-y-8">
                {/* Logo Upload */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="size-32 rounded-[2.5rem] bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                            {user?.profile.companyLogo ? (
                                <img
                                    src={user.profile.companyLogo}
                                    alt="Company Logo"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Building2 className="size-12 text-primary" />
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 size-10 rounded-xl bg-slate-900 text-white flex items-center justify-center border-4 border-white dark:border-slate-800 active:scale-90 transition-all">
                            <Upload className="size-4" />
                        </button>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Company Logo</p>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Building2 className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Company Name"
                                required
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <MapPin className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="HQ Location"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Globe className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="url"
                                placeholder="Website"
                                value={formData.website}
                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">About Company</label>
                            <div className="relative group">
                                <div className="absolute top-5 left-5 pointer-events-none">
                                    <FileText className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <textarea
                                    placeholder="Tell us about your company..."
                                    rows={4}
                                    value={formData.about}
                                    onChange={e => setFormData({ ...formData, about: e.target.value })}
                                    className="w-full p-5 pl-14 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black resize-none"
                                />
                            </div>
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

export default RecruiterCompany;
