import { useState } from "react";
import { Mail, Phone, ShieldCheck, CreditCard, ChevronRight, Camera, Edit3, X, Save, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const BrowseProfile = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const profileAny: any = user?.profile || {};

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
    location: profileAny.location || "",
    company: profileAny.company || "",
  });

  if (!user) {
    return <div className="p-10 text-center font-black">Please log in to view your profile.</div>;
  }

  const initials =
    (user.name || "User")
      .split(" ")
      .slice(0, 2)
      .map((x: string) => x[0])
      .join("")
      .toUpperCase() || "U";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        profile: {
          ...user.profile,
          location: formData.location,
          company: formData.company,
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
              <h2 className="text-lg font-black tracking-tight">Edit Client Profile</h2>
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
              />
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Phone number"
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
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
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
                  className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-black uppercase tracking-widest text-xs hover:bg-rose-700 flex items-center justify-center gap-2 disabled:opacity-50"
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
        <h1 className="text-3xl font-black tracking-tighter">My Profile</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">CSM Client Overview</p>
      </div>

      <div className="relative pt-12">
        <div className="bg-white rounded-[3rem] p-8 pt-16 border border-slate-200 text-center shadow-sm">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0">
            <div className="relative">
              <div className="size-24 rounded-[2rem] bg-rose-600 flex items-center justify-center text-white text-3xl font-black shadow-xl border-4 border-slate-50">
                {initials}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-1 -right-1 size-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              >
                <Camera className="size-4" />
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-black tracking-tight">{user.name || "Client"}</h2>
          <p className="text-rose-600 font-black uppercase tracking-widest text-[10px] mb-6">CSM Premium Client</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-3xl text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Projects</p>
              <p className="text-base font-black italic">{profileAny.projectsCount || 0}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-3xl text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Spent</p>
              <p className="text-base font-black italic">{profileAny.totalSpent || "N/A"}</p>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-400">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Email Address</p>
                <p className="text-[11px] font-black">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-400">
                <Phone className="size-5" />
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Registered Phone</p>
                <p className="text-[11px] font-black">{user.phoneNumber || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-black tracking-tight px-1">Quick Management</h3>
        <div className="grid gap-3">
          <button className="flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-200 active:scale-[0.98] transition-all group">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="size-6" />
              </div>
              <span className="font-black text-sm uppercase tracking-widest">Verification Status</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
              <ChevronRight className="size-5 text-slate-300 group-hover:text-rose-600 transition-colors" />
            </div>
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-200 active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <CreditCard className="size-6" />
              </div>
              <span className="font-black text-sm uppercase tracking-widest">Profile Details</span>
            </div>
            <Edit3 className="size-5 text-slate-300 group-hover:text-rose-600 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrowseProfile;
