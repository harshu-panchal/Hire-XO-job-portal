import { useState } from "react";
import {
  MapPin,
  Building2,
  ShieldCheck,
  Mail,
  Phone,
  Globe,
  Star,
  Package,
  Edit3,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const RentProfile = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const profileAny: any = user?.profile || {};

  const [formData, setFormData] = useState({
    company: profileAny.company || user?.name || "",
    location: profileAny.location || "",
    website: profileAny.website || "",
    about: profileAny.about || "",
    experience: Array.isArray(profileAny.experience) ? "" : profileAny.experience || "",
    skills: Array.isArray(profileAny.skills) ? profileAny.skills.join(", ") : "",
  });

  if (!user) {
    return <div className="p-10 text-center font-black">Please log in to view your profile.</div>;
  }

  const profile = {
    name: profileAny.company || user.name || "Organization",
    type: profileAny.jobTitle || "Contractor",
    location: profileAny.location || "Location not set",
    email: user.email,
    phone: user.phoneNumber || "N/A",
    website: profileAny.website || "Not set",
    rentalsCompleted: profileAny.projectsWon || 0,
    experience: Array.isArray(profileAny.experience) ? "N/A" : profileAny.experience || "N/A",
    rating: profileAny.rating || 4.8,
    verifications: ["GST Verified", "Identity Verified", "Bank Verified"],
  };

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
          about: formData.about,
          experience: formData.experience,
          skills: formData.skills
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
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
              <h2 className="text-lg font-black tracking-tight">Edit Rental Profile</h2>
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
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Experience"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
              />
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Skills (comma separated)"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
              />
              <textarea
                rows={4}
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                placeholder="About your organization"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm resize-none"
              />

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
                  className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black uppercase tracking-widest text-xs hover:bg-emerald-700 flex items-center justify-center gap-2 disabled:opacity-50"
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
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-500/30 overflow-hidden relative text-center">
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className="size-24 rounded-[2.2rem] bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center p-4">
              <Building2 className="size-full text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight leading-none">{profile.name}</h1>
              <div className="flex items-center justify-center gap-2 opacity-70">
                <MapPin className="size-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">{profile.location}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white text-emerald-700 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-black/10"
            >
              <Edit3 className="size-3" /> Edit Profile
            </button>
          </div>

          <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-24 -mt-24" />
          <div className="absolute bottom-0 left-0 size-32 bg-black/5 rounded-full -ml-16 -mb-16" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 space-y-3 shadow-sm text-center">
          <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600">
            <Star className="size-6 fill-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight leading-none italic">{profile.rating}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
              Tenant Rating
            </p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 space-y-3 shadow-sm text-center">
          <div className="size-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto text-amber-600">
            <Package className="size-6" />
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight leading-none italic">
              {profile.rentalsCompleted}
            </p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
              Total Rentals
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
          Organization Details
        </h2>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Industry</p>
              <p className="text-xs font-black tracking-tight">{profile.type}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                Experience
              </p>
              <p className="text-xs font-black tracking-tight">{profile.experience}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex flex-wrap gap-2">
              {profile.verifications.map((v: string) => (
                <span
                  key={v}
                  className="px-4 py-2 rounded-full bg-slate-100 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors hover:bg-emerald-50"
                >
                  <ShieldCheck className="size-3 text-emerald-600" /> {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-[2.5rem] p-7 shadow-xl space-y-6">
        <h2 className="text-lg font-black tracking-tight flex items-center gap-2 opacity-80">
          <Globe className="size-5" /> Online Presence
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="size-11 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">
                Business Email
              </p>
              <p className="text-sm font-black truncate">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="size-11 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <Phone className="size-5" />
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">
                Verification OTP Phone
              </p>
              <p className="text-sm font-black truncate">{profile.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="size-11 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <Globe className="size-5" />
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">
                Company Website
              </p>
              <p className="text-sm font-black truncate">{profile.website}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
};

export default RentProfile;
