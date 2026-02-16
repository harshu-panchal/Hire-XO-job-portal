import { useState } from "react";
import {
  MapPin,
  ShieldCheck,
  Globe,
  Star,
  Clock,
  Edit3,
  Award,
  TrendingUp,
  DollarSign,
  Briefcase,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const SellProfile = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const profileAny: any = user?.profile || {};

  const [formData, setFormData] = useState({
    company: profileAny.company || user?.name || "",
    type: profileAny.jobTitle || "Machinery Seller",
    location: profileAny.location || "",
    website: profileAny.website || "",
    totalSales: profileAny.totalSales || "",
    salesCompleted: profileAny.salesCompleted ? String(profileAny.salesCompleted) : "",
    listingsActive: profileAny.listingsActive ? String(profileAny.listingsActive) : "",
    memberSince: profileAny.memberSince || "",
  });

  if (!user) {
    return <div className="p-10 text-center font-black">Please log in to view your profile.</div>;
  }

  const sellerData = {
    name: profileAny.company || user.name || "Machinery Seller",
    type: profileAny.jobTitle || "Machinery Seller",
    location: profileAny.location || "Location not set",
    website: profileAny.website || "Not set",
    totalSales: profileAny.totalSales || "N/A",
    listingsActive: profileAny.listingsActive || 0,
    salesCompleted: profileAny.salesCompleted || 0,
    rating: profileAny.rating || 4.8,
    verifications: ["Verified OEM Seller", "Tax Compliant", "Bank Verified"],
    memberSince: profileAny.memberSince || "N/A",
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
          totalSales: formData.totalSales,
          salesCompleted: Number(formData.salesCompleted) || 0,
          listingsActive: Number(formData.listingsActive) || 0,
          memberSince: formData.memberSince,
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
    <div className="py-6 space-y-8 select-none bg-slate-50 min-h-screen text-slate-900">
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black tracking-tight">Edit Seller Profile</h2>
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
                placeholder="Seller type"
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
                value={formData.totalSales}
                onChange={(e) => setFormData({ ...formData, totalSales: e.target.value })}
                placeholder="Total sales"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={formData.salesCompleted}
                  onChange={(e) => setFormData({ ...formData, salesCompleted: e.target.value })}
                  placeholder="Sales completed"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
                />
                <input
                  type="number"
                  value={formData.listingsActive}
                  onChange={(e) => setFormData({ ...formData, listingsActive: e.target.value })}
                  placeholder="Listings active"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-sm"
                />
              </div>
              <input
                type="text"
                value={formData.memberSince}
                onChange={(e) => setFormData({ ...formData, memberSince: e.target.value })}
                placeholder="Member since"
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
        <div className="bg-white rounded-[3rem] p-10 border border-slate-200 text-center relative overflow-hidden group shadow-sm">
          <div className="relative z-10 flex flex-col items-center space-y-5">
            <div className="size-24 rounded-[2.5rem] bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center p-5 shadow-[0_0_40px_rgba(79,70,229,0.05)]">
              <Briefcase className="size-full text-indigo-600" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">{sellerData.name}</h1>
              <div className="flex items-center justify-center gap-2 opacity-100">
                <MapPin className="size-3 text-indigo-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{sellerData.location}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 flex items-center gap-2">
                <Award className="size-4 text-indigo-600" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">
                  Prime Merchant
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-black text-xs text-amber-600">
                <Star className="size-3 fill-current" />
                {sellerData.rating}
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 size-full opacity-5 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-indigo-500 blur-[100px] rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 space-y-3 shadow-sm text-center group active:scale-[0.98] transition-all">
          <div className="size-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
            <DollarSign className="size-6" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tighter italic leading-none">{sellerData.totalSales}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">GTV Generated</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 space-y-3 shadow-sm text-center group active:scale-[0.98] transition-all">
          <div className="size-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
            <TrendingUp className="size-6" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tighter italic leading-none">{sellerData.salesCompleted}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Successful Exits</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="px-2 text-[9px] font-black uppercase tracking-[0.4em] text-indigo-600 italic">Merchant Trust Assets</h2>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
          <div className="flex flex-col gap-4">
            {sellerData.verifications.map((v: string) => (
              <div key={v} className="flex items-center gap-4 group">
                <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-500">
                  <ShieldCheck className="size-5 text-emerald-500" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors">
                  {v}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between opacity-60">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="size-3" />
              <span className="text-[8px] font-black uppercase tracking-widest">Seller Tenure</span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest font-bold">{sellerData.memberSince}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-4 flex gap-2 shadow-sm">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 py-5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg"
        >
          <Edit3 className="size-4" /> Edit Profile
        </button>
        <button className="size-[60px] rounded-2xl bg-indigo-600 text-white flex items-center justify-center active:scale-95 transition-all shadow-xl shadow-indigo-500/10">
          <Globe className="size-6" />
        </button>
      </div>

      <div className="h-4" />
    </div>
  );
};

export default SellProfile;
