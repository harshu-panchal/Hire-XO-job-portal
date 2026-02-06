import { useState } from "react";
import {
  Building2,
  MapPin,
  Globe,
  Award,
  ShieldCheck,
  Briefcase,
  ChevronRight,
  Edit3,
  FileCheck,
  User,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const ApplyProfile = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data with safe defaults
  const [formData, setFormData] = useState({
    company: user?.profile?.company || user?.name || "",
    bio: user?.profile?.bio || "",
    location: user?.profile?.location || "",
    website: user?.profile?.website || "",
    founded: user?.profile?.founded || "",
    projectsWon: user?.profile?.projectsWon || 0,
    experience: Array.isArray(user?.profile?.experience) ? "" : user?.profile?.experience || "",
    skills: user?.profile?.skills?.join(", ") || "", // Comma separated for input
  });

  if (!user) {
    return <div className="p-10 text-center font-black">Please log in to view your profile.</div>;
  }

  const companyData = {
    name: user.profile?.company || user.name || "Organization Name",
    bio: user.profile?.bio || "No bio available. Please edit your profile to add a description.",
    location: user.profile?.location || "Location not set",
    website: user.profile?.website || "Website not set",
    founded: user.profile?.founded || "N/A",
    projectsWon: user.profile?.projectsWon || 0,
    experience: Array.isArray(user.profile?.experience) ? "N/A" : user.profile?.experience || "N/A",
    expertises: user.profile?.skills || ["General"],
    regDetails: [
      { label: "Email", value: user.email },
      { label: "Phone", value: user.phoneNumber || "N/A" },
      { label: "Role", value: user.role },
    ],
  };

  const handleEditClick = () => {
    setFormData({
      company: user.profile?.company || user.name || "",
      bio: user.profile?.bio || "",
      location: user.profile?.location || "",
      website: user.profile?.website || "",
      founded: user.profile?.founded || "",
      projectsWon: user.profile?.projectsWon || 0,
      experience: Array.isArray(user.profile?.experience) ? "" : user.profile?.experience || "",
      skills: user.profile?.skills?.join(", ") || "",
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Convert comma separated skills back to array
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await updateProfile({
        profile: {
          ...user.profile,
          company: formData.company,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          founded: formData.founded,
          projectsWon: Number(formData.projectsWon),
          experience: formData.experience,
          skills: skillsArray,
        },
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-8 select-none relative">
      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black tracking-tight">Edit Organization Profile</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="size-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-500/20 outline-none font-bold text-sm"
                  placeholder="Enter company name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-500/20 outline-none font-bold text-sm"
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                    Website
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-500/20 outline-none font-bold text-sm"
                    placeholder="www.example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                    Projects Won
                  </label>
                  <input
                    type="number"
                    value={formData.projectsWon}
                    onChange={(e) =>
                      setFormData({ ...formData, projectsWon: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-500/20 outline-none font-bold text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-500/20 outline-none font-bold text-sm"
                    placeholder="e.g. 10+ Years"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                  Key Sectors (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-500/20 outline-none font-bold text-sm"
                  placeholder="Civil, Electrical, Smart City"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                  Organization Bio
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-500/20 outline-none font-bold text-sm resize-none"
                  placeholder="Brief description of your organization..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-xs border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl bg-violet-600 text-white font-black uppercase tracking-widest text-xs hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="relative pt-4">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-violet-500/30 overflow-hidden relative">
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="size-24 rounded-[2rem] bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center p-1 overflow-hidden">
              {user.profile?.profilePhoto || user.profilePhoto ? (
                <img
                  src={user.profile?.profilePhoto || user.profilePhoto}
                  alt={companyData.name}
                  className="size-full rounded-[1.8rem] object-cover"
                />
              ) : (
                <Building2 className="size-12 text-white" />
              )}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight">{companyData.name}</h1>
              <div className="flex items-center justify-center gap-2 opacity-70">
                <MapPin className="size-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {companyData.location}
                </p>
              </div>
            </div>
            <button
              onClick={handleEditClick}
              className="bg-white text-violet-600 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-black/10 hover:bg-slate-50"
            >
              <Edit3 className="size-3" /> Edit Profile
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-24 -mt-24" />
          <div className="absolute bottom-0 left-0 size-32 bg-black/5 rounded-full -ml-16 -mb-16" />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col items-center text-center space-y-2 shadow-sm">
          <div className="size-10 rounded-2xl bg-violet-100 flex items-center justify-center">
            <Award className="size-5 text-violet-600" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight">{companyData.projectsWon}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Won</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col items-center text-center space-y-2 shadow-sm">
          <div className="size-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <Briefcase className="size-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight">{companyData.experience}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Exp</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col items-center text-center space-y-2 shadow-sm">
          <div className="size-10 rounded-2xl bg-blue-100 flex items-center justify-center">
            <FileCheck className="size-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight">Active</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Status</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="space-y-4">
        <h2 className="px-1 text-lg font-black tracking-tight flex items-center gap-2">
          <ShieldCheck className="size-5 text-violet-600" /> Organization Bio
        </h2>
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
          <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
            "{companyData.bio}"
          </p>
          {companyData.website !== "Website not set" && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4">
              <a
                href={
                  companyData.website.startsWith("http")
                    ? companyData.website
                    : `https://${companyData.website}`
                }
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-violet-600"
              >
                <Globe className="size-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Visit Website
                </span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Expertise Chips */}
      <div className="space-y-4">
        <h2 className="px-1 text-lg font-black tracking-tight uppercase tracking-widest text-slate-400 text-[10px]">
          Prime Sectors
        </h2>
        <div className="flex flex-wrap gap-2">
          {companyData.expertises?.length > 0 ? (
            companyData.expertises.map((exp: string) => (
              <span
                key={exp}
                className="px-5 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-widest"
              >
                {exp}
              </span>
            ))
          ) : (
            <span className="px-5 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-widest">
              No sectors listed
            </span>
          )}
        </div>
      </div>

      {/* Registration Details */}
      <div className="space-y-4 pb-4">
        <h2 className="px-1 text-lg font-black tracking-tight">Contact & Verification</h2>
        <div className="space-y-3">
          {companyData.regDetails.map((reg) => (
            <div
              key={reg.label}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between group"
            >
              <div className="space-y-0.5">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                  {reg.label}
                </p>
                <p className="text-sm font-black tracking-tight">{reg.value}</p>
              </div>
              <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-violet-50 transition-colors">
                <ChevronRight className="size-4 text-slate-400 group-hover:text-violet-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplyProfile;
