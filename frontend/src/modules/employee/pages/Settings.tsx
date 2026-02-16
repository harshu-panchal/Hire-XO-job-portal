import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Camera,
  User,
  Mail,
  Link as LinkIcon,
  Bell,
  Shield,
  Plus,
  Trash2,
  Loader2,
  Scale,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect, useRef } from "react";
import { userService } from "@/services/userService";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const { user: userProfile, updateProfile, updateUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state for preferences
  const [pushEnabled, setPushEnabled] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  const [form, setForm] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    linkedinUrl: userProfile?.profile?.linkedinUrl || "",
    bio: userProfile?.profile?.bio || "",
    skills: userProfile?.profile?.skills?.join(", ") || "",
    experience: Array.isArray(userProfile?.profile?.experience)
      ? userProfile.profile.experience
      : [],
    education: Array.isArray(userProfile?.profile?.education)
      ? userProfile.profile.education
      : [],
  });

  // Sync form when user profile loads
  useEffect(() => {
    if (userProfile) {
      setForm({
        name: userProfile.name || "",
        email: userProfile.email || "",
        linkedinUrl: userProfile.profile?.linkedinUrl || "",
        bio: userProfile.profile?.bio || "",
        skills: userProfile.profile?.skills?.join(", ") || "",
        experience: Array.isArray(userProfile.profile?.experience)
          ? userProfile.profile.experience
          : [],
        education: Array.isArray(userProfile.profile?.education)
          ? userProfile.profile.education
          : [],
      });

      const prefs = userProfile.profile?.preferences;
      if (prefs) {
        setPushEnabled(prefs.notifications ?? true);

      }
    }
  }, [userProfile]);



  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response: any = await userService.updateProfilePhoto(file);
      const newPhotoUrl = response.url || response.photoUrl;

      if (newPhotoUrl && userProfile?.profile) {
        updateUser({
          profilePhoto: newPhotoUrl,
          profile: {
            ...userProfile.profile,
            profilePhoto: newPhotoUrl,
          },
        });
        toast.success("Profile photo updated!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const parsedSkills = form.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      const updatedProfile = {
        name: form.name,
        email: form.email,
        bio: form.bio,
        linkedinUrl: form.linkedinUrl,
        skills: parsedSkills,
        experience: form.experience,
        education: form.education,
        preferences: {
          notifications: pushEnabled,
        },
        profile: {
          ...userProfile?.profile,
          bio: form.bio,
          linkedinUrl: form.linkedinUrl,
          skills: parsedSkills,
          experience: form.experience,
          education: form.education,
          preferences: {
            notifications: pushEnabled,
          },
        },
      };
      await updateProfile(updatedProfile);
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleAddExperience = () => {
    setForm((f) => ({
      ...f,
      experience: [...f.experience, { company: "", role: "", period: "" }],
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setForm((f) => ({
      ...f,
      experience: f.experience.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    setForm((f) => ({
      ...f,
      experience: f.experience.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }));
  };

  const handleAddEducation = () => {
    setForm((f) => ({
      ...f,
      education: [...f.education, { school: "", degree: "", period: "" }],
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setForm((f) => ({
      ...f,
      education: f.education.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setForm((f) => ({
      ...f,
      education: f.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }));
  };

  return (
    <div className="pb-32 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 px-4 sm:px-5 py-5 sm:py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all shadow-sm"
          >
            <ChevronLeft className="size-6" />
          </button>
          <h1 className="text-xl font-black tracking-tight">Account Settings</h1>
        </div>
      </div>

      <div className="px-4 sm:px-5 space-y-8 w-full max-w-3xl mx-auto">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
              <img
                src={
                  userProfile?.profilePhoto ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.name}`
                }
                alt="Profile"
                className={`w-full h-full object-cover transition-opacity ${isUploading ? "opacity-50" : "opacity-100"}`}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="size-8 text-primary animate-spin" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 size-9 bg-primary text-white rounded-xl flex items-center justify-center border-4 border-white shadow-lg active:scale-90 transition-all cursor-pointer disabled:opacity-50"
            >
              <Camera className="size-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>

        {/* Profile Info Form */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">
            Personal Information
          </h2>
          <div className="bg-white rounded-[2rem] border border-slate-200 p-5 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Full Name
              </label>
              <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-primary/50 transition-all">
                <User className="size-5 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Email Address
              </label>
              <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-60">
                <Mail className="size-5 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="flex-1 bg-transparent text-sm font-bold focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                LinkedIn URL
              </label>
              <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-primary/50 transition-all">
                <LinkIcon className="size-5 text-slate-400" />
                <input
                  type="url"
                  value={form.linkedinUrl}
                  onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                  className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Professional Info */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">
            Professional Background
          </h2>
          <div className="bg-white rounded-[2rem] border border-slate-200 p-5 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Professional Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Describe your experience and goals..."
                className="w-full min-h-[120px] p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 focus:outline-none transition-all text-sm font-bold resize-none shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Top Skills (comma separated)
              </label>
              <input
                type="text"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="React, TypeScript, UI/UX..."
                className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 focus:outline-none transition-all text-sm font-bold shadow-inner"
              />
            </div>

            {/* Experience Array Editor */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Work Experience
                </label>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest active:scale-95 transition-all"
                >
                  <Plus className="size-3" />
                  Add New
                </button>
              </div>
              {Array.isArray(form.experience) &&
                form.experience.map((exp: any, index: number) => (
                  <div
                    key={index}
                    className="relative group p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="absolute -top-2 -right-2 size-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg active:scale-90"
                    >
                      <Trash2 className="size-3" />
                    </button>
                    <input
                      type="text"
                      value={exp.role}
                      placeholder="Job Role"
                      onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
                      className="w-full bg-transparent text-sm font-black focus:outline-none placeholder:text-slate-400"
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <input
                        type="text"
                        value={exp.company}
                        placeholder="Company"
                        onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                        className="flex-1 bg-transparent text-[11px] font-bold text-primary focus:outline-none uppercase tracking-widest placeholder:text-slate-400"
                      />
                      <input
                        type="text"
                        value={exp.period}
                        placeholder="Period"
                        onChange={(e) => handleExperienceChange(index, "period", e.target.value)}
                        className="w-full sm:w-24 bg-transparent text-[11px] font-bold text-slate-400 focus:outline-none text-left sm:text-right uppercase tracking-widest placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                ))}
            </div>

            {/* Education Array Editor */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Education
                </label>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest active:scale-95 transition-all"
                >
                  <Plus className="size-3" />
                  Add New
                </button>
              </div>
              {Array.isArray(form.education) &&
                form.education.map((edu: any, index: number) => (
                  <div
                    key={index}
                    className="relative group p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="absolute -top-2 -right-2 size-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg active:scale-90"
                    >
                      <Trash2 className="size-3" />
                    </button>
                    <input
                      type="text"
                      value={edu.degree}
                      placeholder="Degree / Major"
                      onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                      className="w-full bg-transparent text-sm font-black focus:outline-none placeholder:text-slate-400"
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <input
                        type="text"
                        value={edu.school}
                        placeholder="School / University"
                        onChange={(e) => handleEducationChange(index, "school", e.target.value)}
                        className="flex-1 bg-transparent text-[11px] font-bold text-primary focus:outline-none uppercase tracking-widest placeholder:text-slate-400"
                      />
                      <input
                        type="text"
                        value={edu.period}
                        placeholder="Year"
                        onChange={(e) => handleEducationChange(index, "period", e.target.value)}
                        className="w-full sm:w-24 bg-transparent text-[11px] font-bold text-slate-400 focus:outline-none text-left sm:text-right uppercase tracking-widest placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">
            Preferences
          </h2>
          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden">
            {/* Notification Toggle */}
            <button
              type="button"
              onClick={() => setPushEnabled(!pushEnabled)}
              className="w-full p-5 flex items-center justify-between active:bg-slate-50 transition-all border-b border-slate-100"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Bell className="size-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black">Notifications</p>
                  <p className="text-[10px] font-bold text-slate-400">Manage alerts</p>
                </div>
              </div>
              <div
                className={`w-12 h-7 rounded-full transition-all relative ${pushEnabled ? "bg-primary" : "bg-slate-200"}`}
              >
                <div
                  className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all ${pushEnabled ? "left-6" : "left-1"}`}
                />
              </div>
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">
            Security
          </h2>
          <div className="bg-white rounded-[2rem] border border-slate-200 p-5 space-y-4">
            <div className="flex items-center gap-4 pb-1">
              <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                <Shield className="size-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black">Change Password</p>
                <p className="text-[10px] font-bold text-slate-400">Update your account password</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 focus:outline-none transition-all text-sm font-bold shadow-inner"
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 focus:outline-none transition-all text-sm font-bold shadow-inner"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                className="w-full h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 focus:outline-none transition-all text-sm font-bold shadow-inner"
                placeholder="Re-enter new password"
              />
            </div>

            <button
              type="button"
              onClick={handleChangePassword}
              disabled={isUpdatingPassword}
              className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">
            Legal & About
          </h2>
          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden divide-y divide-slate-100">
            <button
              onClick={() => navigate("/terms")}
              className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <Scale className="size-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black">Terms of Service</p>
                  <p className="text-[10px] font-bold text-slate-400">Read our platform rules</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-slate-300" />
            </button>
            <button
              onClick={() => navigate("/privacy")}
              className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <Shield className="size-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black">Privacy Policy</p>
                  <p className="text-[10px] font-bold text-slate-400">Data protection policy</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-slate-300" />
            </button>
          </div>
        </section>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
