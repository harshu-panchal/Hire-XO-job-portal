import { useEffect, useState } from "react";
import {
  MapPin,
  Building2,
  ShieldCheck,
  Mail,
  Globe,
  Star,
  Edit3,
  Award,
  Users,
  Clock,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const ProvideProfile = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const profileAny: any = user?.profile || {};

  const [formData, setFormData] = useState({
    company: profileAny.company || user?.name || "",
    type: profileAny.jobTitle || "Rental Authority",
    location: profileAny.location || "",
    website: profileAny.website || "",
    experience: Array.isArray(profileAny.experience) ? "" : profileAny.experience || "",
    fleetSize: profileAny.fleetSize ? String(profileAny.fleetSize) : "",
    totalRentals: profileAny.totalRentals ? String(profileAny.totalRentals) : "",
  });

  useEffect(() => {
    setFormData({
      company: profileAny.company || user?.name || "",
      type: profileAny.jobTitle || "Rental Authority",
      location: profileAny.location || "",
      website: profileAny.website || "",
      experience: Array.isArray(profileAny.experience) ? "" : profileAny.experience || "",
      fleetSize: profileAny.fleetSize ? String(profileAny.fleetSize) : "",
      totalRentals: profileAny.totalRentals ? String(profileAny.totalRentals) : "",
    });
  }, [user?.name, profileAny.company, profileAny.jobTitle, profileAny.location, profileAny.website, profileAny.experience, profileAny.fleetSize, profileAny.totalRentals]);

  if (!user) {
    return <div className="p-10 text-center font-black">Please log in to view your profile.</div>;
  }

  const providerData = {
    name: profileAny.company || user.name || "Equipment Provider",
    type: profileAny.jobTitle || "Rental Authority",
    location: profileAny.location || "Location not set",
    email: user.email,
    website: profileAny.website || "Not set",
    fleetSize: profileAny.fleetSize || 0,
    experience: Array.isArray(profileAny.experience) ? "N/A" : profileAny.experience || "N/A",
    rating: profileAny.rating || 4.8,
    totalRentals: profileAny.totalRentals || 0,
    verifications: ["Verified Business", "Quality Assured", "Safe Handler"],
    recentAwards: ["Best Vendor 2023", "Fleet Excellence"],
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        profile: {
          ...user.profile,
          company: formData.company,
          jobTitle: formData.type,
          location: formData.location,
          website: formData.website,
          experience: formData.experience,
          fleetSize: Number(formData.fleetSize) || 0,
          totalRentals: Number(formData.totalRentals) || 0,
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
                className="size-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Organization name"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
              />
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="Provider type"
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
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Market experience"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={formData.fleetSize}
                  onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                  placeholder="Fleet size"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
                />
                <input
                  type="number"
                  value={formData.totalRentals}
                  onChange={(e) => setFormData({ ...formData, totalRentals: e.target.value })}
                  placeholder="Total rentals"
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

      <div className="relative pt-4">
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-500/30 overflow-hidden relative text-center">
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className="size-24 rounded-[2.2rem] bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center p-4">
              <Building2 className="size-full text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tighter italic leading-none">
                {providerData.name}
              </h1>
              <div className="flex items-center justify-center gap-2 opacity-70">
                <MapPin className="size-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {providerData.location}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white text-blue-700 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-black/10"
            >
              <Edit3 className="size-3" /> Edit Profile
            </button>
          </div>

          <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-24 -mt-24" />
          <div className="absolute bottom-4 left-4 size-12 bg-white/10 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 text-center space-y-2 shadow-sm">
          <p className="text-2xl font-black tracking-tight leading-none italic text-blue-600">
            {providerData.fleetSize}
          </p>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Machines</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 text-center space-y-2 shadow-sm">
          <p className="text-2xl font-black tracking-tight leading-none italic text-indigo-600">
            {providerData.rating}
          </p>
          <div className="flex items-center justify-center gap-1 text-amber-500">
            <Star className="size-2.5 fill-current" />
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Lender Rating
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-blue-600 italic">
          Organization Stats
        </h2>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <Users className="size-2.5" /> Industry
              </p>
              <p className="text-xs font-black tracking-tight">{providerData.type}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-end gap-1">
                <Clock className="size-2.5" /> Market Exp
              </p>
              <p className="text-xs font-black tracking-tight">{providerData.experience}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex flex-wrap gap-2">
              {providerData.recentAwards.map((award: string) => (
                <span
                  key={award}
                  className="px-4 py-2 rounded-full bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-amber-100"
                >
                  <Award className="size-3" /> {award}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100 space-y-4">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] px-1">
          Compliance & Verifications
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {providerData.verifications.map((v: string) => (
            <div
              key={v}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{v}</span>
              <ShieldCheck className="size-5 text-blue-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-[2.5rem] p-7 shadow-xl space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="size-11 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40 leading-none mb-1 text-white">
                Support Inquiry
              </p>
              <p className="text-sm font-black truncate">{providerData.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="size-11 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Globe className="size-5" />
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40 leading-none mb-1 text-white">
                Fleet Portal
              </p>
              <p className="text-sm font-black truncate">{providerData.website}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
};

export default ProvideProfile;
