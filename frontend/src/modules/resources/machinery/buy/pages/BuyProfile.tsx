import { useState } from "react";
import {
  MapPin,
  Building2,
  ShieldCheck,
  Mail,
  Phone,
  Globe,
  Package,
  Award,
  CreditCard,
  Edit3,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const BuyProfile = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const profileAny: any = user?.profile || {};

  const [formData, setFormData] = useState({
    company: profileAny.company || user?.name || "",
    type: profileAny.jobTitle || "Industrial Buyer",
    location: profileAny.location || "",
    website: profileAny.website || "",
    totalSpent: profileAny.totalSpent || "",
    machinesOwned: profileAny.machinesOwned ? String(profileAny.machinesOwned) : "",
    ordersCompleted: profileAny.ordersCompleted ? String(profileAny.ordersCompleted) : "",
  });

  if (!user) {
    return <div className="p-10 text-center font-black">Please log in to view your profile.</div>;
  }

  const buyerData = {
    name: profileAny.company || user.name || "Buyer Organization",
    type: profileAny.jobTitle || "Industrial Buyer",
    location: profileAny.location || "Location not set",
    email: user.email,
    phone: user.phoneNumber || "N/A",
    website: profileAny.website || "Not set",
    totalSpent: profileAny.totalSpent || "N/A",
    machinesOwned: profileAny.machinesOwned || 0,
    ordersCompleted: profileAny.ordersCompleted || 0,
    rating: profileAny.rating || 4.8,
    verifications: ["Enterprise Account", "Tax Compliant", "Identity Verified"],
    tier: profileAny.tier || "Platinum Buyer",
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
          totalSpent: formData.totalSpent,
          machinesOwned: Number(formData.machinesOwned) || 0,
          ordersCompleted: Number(formData.ordersCompleted) || 0,
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
              <h2 className="text-lg font-black tracking-tight">Edit Buyer Profile</h2>
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
                placeholder="Organization type"
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
                value={formData.totalSpent}
                onChange={(e) => setFormData({ ...formData, totalSpent: e.target.value })}
                placeholder="Total procurement value"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={formData.machinesOwned}
                  onChange={(e) => setFormData({ ...formData, machinesOwned: e.target.value })}
                  placeholder="Machines owned"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
                />
                <input
                  type="number"
                  value={formData.ordersCompleted}
                  onChange={(e) => setFormData({ ...formData, ordersCompleted: e.target.value })}
                  placeholder="Orders completed"
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
                  className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-black uppercase tracking-widest text-xs hover:bg-amber-700 flex items-center justify-center gap-2 disabled:opacity-50"
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
        <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-amber-500/30 overflow-hidden relative text-center">
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className="size-24 rounded-[2.2rem] bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center p-4">
              <Building2 className="size-full text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight leading-none uppercase italic">
                {buyerData.name}
              </h1>
              <div className="flex items-center justify-center gap-2 opacity-70">
                <MapPin className="size-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">{buyerData.location}</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full border border-white/30 flex items-center gap-2">
              <Award className="size-4 text-amber-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{buyerData.tier}</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white text-amber-700 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-black/10"
            >
              <Edit3 className="size-3" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 space-y-3 shadow-sm text-center">
          <div className="size-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto text-amber-600">
            <CreditCard className="size-6" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight leading-none italic">{buyerData.totalSpent}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
              Total Procurement
            </p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 space-y-3 shadow-sm text-center">
          <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-slate-600">
            <Package className="size-6" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight leading-none italic">{buyerData.machinesOwned}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
              Acquired Assets
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-amber-600 italic">
          Procurement Profile
        </h2>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                Organization Type
              </p>
              <p className="text-xs font-black tracking-tight uppercase leading-none">{buyerData.type}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                Market Trust
              </p>
              <p className="text-xs font-black tracking-tight italic">{buyerData.rating} Rating</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex flex-wrap gap-2">
              {buyerData.verifications.map((v: string) => (
                <span
                  key={v}
                  className="px-5 py-2.5 rounded-full bg-slate-50 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-slate-100"
                >
                  <ShieldCheck className="size-3.5 text-emerald-500" /> {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 text-white rounded-[2.5rem] p-8 shadow-xl space-y-6">
        <h2 className="text-lg font-black tracking-tight flex items-center gap-3 italic">
          <Globe className="size-6 text-amber-500" /> Procurement Desk
        </h2>
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
              <Mail className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Business Email</p>
              <p className="text-sm font-black truncate">{buyerData.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
              <Phone className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Contact Line</p>
              <p className="text-sm font-black truncate">{buyerData.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
              <Globe className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">
                Enterprise Portal
              </p>
              <p className="text-sm font-black truncate">{buyerData.website}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
};

export default BuyProfile;
