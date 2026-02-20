import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Globe,
  ShieldCheck,
  FileCheck,
  Edit3,
  BarChart3,
  Mail,
  Phone,
  CheckCircle2,
  X,
  Save,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const ProvideProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const profileAny: any = user?.profile || {};

  const [formData, setFormData] = useState({
    company: profileAny.company || user?.name || "",
    location: profileAny.location || "",
    website: profileAny.website || "",
    bio: profileAny.bio || "",
    experience: Array.isArray(profileAny.experience) ? "" : profileAny.experience || "",
    sectors: profileAny.skills?.join(", ") || "",
    tenderValue: profileAny.tenderValue || "",
  });

  if (!user) {
    return <div className="p-10 text-center font-black">Please log in to view your profile.</div>;
  }

  const profile = {
    name: profileAny.company || user.name || "Organization",
    location: profileAny.location || "Location not set",
    website: profileAny.website || "Not set",
    bio: profileAny.bio || "No organization description added yet.",
    sectors: profileAny.skills || ["General"],
    tendersPublished: profileAny.projectsWon || 0,
    totalValueDistributed: profileAny.tenderValue || "N/A",
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const skills = formData.sectors
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      await updateProfile({
        profile: {
          ...user.profile,
          company: formData.company,
          location: formData.location,
          website: formData.website,
          bio: formData.bio,
          experience: formData.experience,
          skills,
          tenderValue: formData.tenderValue,
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
              <h2 className="text-lg font-black tracking-tight">Edit Authority Profile</h2>
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
                value={formData.tenderValue}
                onChange={(e) => setFormData({ ...formData, tenderValue: e.target.value })}
                placeholder="Total awarded value"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
              />
              <input
                type="text"
                value={formData.sectors}
                onChange={(e) => setFormData({ ...formData, sectors: e.target.value })}
                placeholder="Sectors (comma separated)"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
              />
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Organization bio"
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
                  className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-black uppercase tracking-widest text-xs hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-50"
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
        <div className="bg-gradient-to-br from-indigo-700 to-violet-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/30 overflow-hidden relative text-center">
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className="size-24 rounded-[2rem] bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center p-4">
              <Building2 className="size-full text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight">{profile.name}</h1>
              <div className="flex items-center justify-center gap-2 opacity-70">
                <MapPin className="size-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">{profile.location}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white text-indigo-700 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-black/10"
            >
              <Edit3 className="size-3" /> Edit Authority
            </button>
          </div>

          <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-24 -mt-24" />
          <div className="absolute bottom-0 left-0 size-32 bg-black/5 rounded-full -ml-16 -mb-16" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 flex flex-col items-center text-center space-y-2 shadow-sm">
          <div className="size-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <FileCheck className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight">{profile.tendersPublished}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tenders Published</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 flex flex-col items-center text-center space-y-2 shadow-sm">
          <div className="size-12 rounded-2xl bg-violet-100 flex items-center justify-center">
            <BarChart3 className="size-6 text-violet-600" />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight">{profile.totalValueDistributed}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Awarded Value</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Active Sectors</h2>
        <div className="flex flex-wrap gap-2">
          {profile.sectors.map((sector: string) => (
            <span
              key={sector}
              className="px-5 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              <div className="size-1.5 rounded-full bg-indigo-500" /> {sector}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
          <ShieldCheck className="size-5 text-indigo-600" /> Authority Verifications
        </h2>
        <div className="space-y-4">
          {[
            { label: "Email", value: user.email },
            { label: "Phone", value: user.phoneNumber || "N/A" },
            { label: "Role", value: user.role },
          ].map((reg) => (
            <div
              key={reg.label}
              className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{reg.label}</p>
                <p className="text-sm font-black tracking-tight">{reg.value}</p>
              </div>
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 shadow-xl space-y-6">
        <h2 className="text-lg font-black tracking-tight uppercase tracking-widest opacity-80">Official Channels</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Globe className="size-6 opacity-60" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Official Portal</p>
              <p className="text-sm font-black truncate">{profile.website}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 space-y-1">
              <Mail className="size-4 opacity-40" />
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Gov Mail</p>
              <p className="text-[10px] font-black truncate">{user.email}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 space-y-1">
              <Phone className="size-4 opacity-40" />
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Helpline</p>
              <p className="text-[10px] font-black">{user.phoneNumber || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4" />

      {/* Refund & Payment Policy */}
      <button
        onClick={() => navigate("/refund-policy")}
        className="w-full flex items-center justify-between p-5 bg-white rounded-[2rem] border border-slate-200 shadow-sm active:scale-95 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <RefreshCcw className="size-6 text-emerald-600" />
          </div>
          <span className="text-sm font-black tracking-tight">Refund &amp; Payment Policy</span>
        </div>
        <div className="size-8 rounded-xl bg-slate-100 flex items-center justify-center">
          <MapPin className="size-4 text-slate-400 rotate-[-90deg]" />
        </div>
      </button>

      <div className="h-4" />
    </div>
  );
};

export default ProvideProfile;
