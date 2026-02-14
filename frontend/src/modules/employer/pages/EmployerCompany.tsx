import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ChevronLeft, Building2, MapPin, Globe, FileText } from "lucide-react";
import { toast } from "sonner";

const EmployerCompany = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    company: user?.profile?.company || "",
    location: user?.profile?.location || "",
    website: user?.profile?.website || "",
    about: user?.profile?.about || "",
  });

  useEffect(() => {
    if (!user) return;
    setFormData({
      company: user.profile?.company || "",
      location: user.profile?.location || "",
      website: user.profile?.website || "",
      about: user.profile?.about || "",
    });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({
        profile: {
          ...user?.profile,
          company: formData.company,
          location: formData.location,
          website: formData.website,
          about: formData.about,
        },
      });
      toast.success("Company details updated successfully");
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || "Failed to update company details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-32 min-h-screen">
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 px-4 sm:px-5 py-5 sm:py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all shadow-sm"
          >
            <ChevronLeft className="size-6" />
          </button>
          <h1 className="text-xl font-black tracking-tight">Company Details</h1>
        </div>
      </div>

      <div className="px-4 sm:px-5 space-y-8 w-full max-w-3xl mx-auto">
        <div className="flex flex-col items-center gap-3">
          <div className="size-24 rounded-[2rem] bg-primary/10 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
            {user?.profile?.companyLogo ? (
              <img src={user.profile.companyLogo} alt="Company Logo" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="size-10 text-primary" />
            )}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Company logo managed by admin/profile setup
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-5 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Company Name
              </label>
              <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-primary/50 transition-all">
                <Building2 className="size-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                HQ Location
              </label>
              <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-primary/50 transition-all">
                <MapPin className="size-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Website
              </label>
              <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-primary/50 transition-all">
                <Globe className="size-5 text-slate-400" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                  placeholder="https://your-company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                About Company
              </label>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-primary/50 transition-all p-4">
                <div className="flex items-start gap-3">
                  <FileText className="size-5 text-slate-400 mt-1 shrink-0" />
                  <textarea
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    rows={4}
                    className="w-full bg-transparent text-sm font-bold focus:outline-none resize-none"
                    placeholder="Tell candidates about your company, culture, and mission..."
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployerCompany;
