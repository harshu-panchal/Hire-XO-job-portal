import { useState } from "react";
import { Building2, Globe, ChevronRight, Camera, ShieldCheck, FileText, Edit3, X, Save, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const ProvideProfile = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const profileAny: any = user?.profile || {};

  const [formData, setFormData] = useState({
    company: profileAny.company || user?.name || "",
    location: profileAny.location || "",
    website: profileAny.website || "",
    businessId: profileAny.businessId || "",
    rating: profileAny.rating ? String(profileAny.rating) : "",
    rentals: profileAny.rentals ? String(profileAny.rentals) : "",
  });

  if (!user) {
    return <div className="p-10 text-center font-black">Please log in to view your profile.</div>;
  }

  const initial = (profileAny.company || user.name || "V").charAt(0).toUpperCase();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        profile: {
          ...user.profile,
          company: formData.company,
          location: formData.location,
          website: formData.website,
          businessId: formData.businessId,
          rating: Number(formData.rating) || 0,
          rentals: Number(formData.rentals) || 0,
        },
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-6 space-y-8 select-none">
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black tracking-tight">Edit Provider Profile</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="size-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company name"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
              />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Location"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
              />
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="Website"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
              />
              <input
                type="text"
                value={formData.businessId}
                onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                placeholder="Business ID"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="Rating"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
                />
                <input
                  type="number"
                  value={formData.rentals}
                  onChange={(e) => setFormData({ ...formData, rentals: e.target.value })}
                  placeholder="Rentals"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-xs border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-black tracking-tighter">Vehicle Provider</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
          Service Provider Profile
        </p>
      </div>

      <div className="relative pt-12">
        <div className="bg-white rounded-[3rem] p-8 pt-16 border border-slate-200 text-center shadow-sm">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0">
            <div className="relative">
              <div className="size-24 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-xl border-4 border-slate-50 italic">
                {initial}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-1 -right-1 size-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              >
                <Camera className="size-4" />
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-black tracking-tight leading-tight">{profileAny.company || user.name}</h2>
          <p className="text-blue-600 font-black uppercase tracking-widest text-[9px] mb-6 italic">
            Premium Fleet Partner - {profileAny.location || "Gurgaon"}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-3xl text-center border border-slate-100">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Rating</p>
              <p className="text-base font-black italic">{profileAny.rating || 0}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-3xl text-center border border-slate-100">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Rentals</p>
              <p className="text-base font-black italic">{profileAny.rentals || 0}</p>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-400">
                <Globe className="size-5" />
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Headquarters</p>
                <p className="text-[11px] font-black capitalize">{profileAny.location || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-400">
                <FileText className="size-5" />
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Business ID</p>
                <p className="text-[11px] font-black uppercase tracking-tighter">{profileAny.businessId || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-black tracking-tight px-1 italic">Administration</h3>
        <div className="grid gap-3">
          <button className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-200 active:scale-[0.98] transition-all group shadow-sm">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="size-6" />
              </div>
              <span className="font-black text-xs uppercase tracking-widest">KYC Verified</span>
            </div>
            <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-200 active:scale-[0.98] transition-all group shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Building2 className="size-6" />
              </div>
              <span className="font-black text-xs uppercase tracking-widest">Insurance Docs</span>
            </div>
            <Edit3 className="size-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProvideProfile;
