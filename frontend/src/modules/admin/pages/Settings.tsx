import { useState, useRef, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  ChevronRight,
  Upload,
  Check,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuthStore } from "../../../store/useAuthStore";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
} as const;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "general", label: "General", icon: Globe },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-white/60 mt-1">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <motion.div variants={itemVariants} className="lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div variants={itemVariants} className="flex-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-6">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "appearance" && <AppearanceSettings />}
            {activeTab === "general" && <GeneralSettings />}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProfileSettings() {
  const { user, updateUser } = useAuthStore();
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profile?.profilePhoto || null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || "Admin User",
    username: user?.username || "admin_hirexo",
    email: user?.email || "admin@hirexo.com",
    phone: user?.profile?.phoneNumber || "+91 98765 43210",
    role: user?.role || "Administrator",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    updateUser({
      name: formData.fullName,
      username: formData.username,
      email: formData.email,
      profile: {
        ...user!.profile,
        phoneNumber: formData.phone,
        profilePhoto: profileImage || user!.profile.profilePhoto,
      },
    });

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
          Profile Information
        </h3>
        <p className="text-sm text-slate-500 dark:text-white/50">Update your personal details</p>
      </div>

      <div className="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold overflow-hidden">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            "A"
          )}
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={triggerFileInput}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Change Photo
          </button>
          <p className="text-xs text-slate-500 dark:text-white/50 mt-2">JPG, PNG or GIF. Max 2MB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">
            Role
          </label>
          <input
            type="text"
            value={formData.role}
            disabled
            className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-500 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 gap-3 items-center">
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-green-500 text-sm font-medium flex items-center gap-1"
          >
            <Check className="w-4 h-4" /> Changes saved!
          </motion.span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailUpdates: true,
    pushNotifications: true,
    weeklyReport: false,
    newUsers: true,
    payments: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleSetting = async (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);

    setIsSaving(true);
    // Simulate auto-save
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Notification Preferences
          </h3>
          <p className="text-sm text-slate-500 dark:text-white/50">
            Choose what notifications you receive
          </p>
        </div>
        {saved && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-500 text-xs font-medium flex items-center gap-1"
          >
            <Check className="w-3 h-3" /> Auto-saved
          </motion.span>
        )}
      </div>

      <div className="space-y-4">
        {[
          {
            key: "emailUpdates",
            label: "Email Updates",
            desc: "Receive important updates via email",
          },
          {
            key: "pushNotifications",
            label: "Push Notifications",
            desc: "Get instant push notifications",
          },
          { key: "weeklyReport", label: "Weekly Report", desc: "Receive weekly summary report" },
          {
            key: "newUsers",
            label: "New User Alerts",
            desc: "Get notified when new users register",
          },
          {
            key: "payments",
            label: "Payment Notifications",
            desc: "Receive payment confirmations",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-white/5 last:border-0"
          >
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
              <p className="text-sm text-slate-500 dark:text-white/50">{item.desc}</p>
            </div>
            <button
              onClick={() => toggleSetting(item.key as keyof typeof settings)}
              disabled={isSaving}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${settings[item.key as keyof typeof settings]
                  ? "bg-primary"
                  : "bg-slate-200 dark:bg-white/20"
                }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${settings[item.key as keyof typeof settings] ? "translate-x-6" : "translate-x-0"
                  }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowPasswordForm(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
          Security Settings
        </h3>
        <p className="text-sm text-slate-500 dark:text-white/50">
          Manage your security preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="w-full flex items-center justify-between group"
          >
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-white">Change Password</p>
              <p className="text-sm text-slate-500 dark:text-white/50">
                Update your password regularly
              </p>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-slate-400 transition-transform ${showPasswordForm ? "rotate-90" : ""}`}
            />
          </button>

          {showPasswordForm && (
            <form
              onSubmit={handlePasswordChange}
              className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      className="w-full pl-10 pr-10 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords((p) => ({ ...p, current: !p.current }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      className="w-full pl-10 pr-10 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 items-center">
                {saved && (
                  <span className="text-green-500 text-sm font-medium">Password updated!</span>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-slate-500 dark:text-white/50">
                Add an extra layer of security
              </p>
            </div>
            <button className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full border border-green-200 dark:border-green-500/30">
              Enabled
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Active Sessions</p>
              <p className="text-sm text-slate-500 dark:text-white/50">
                Manage your active sessions
              </p>
            </div>
            <button className="text-sm text-primary font-semibold hover:underline">
              2 devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
    { id: "system", label: "System" },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Appearance</h3>
        <p className="text-sm text-slate-500 dark:text-white/50">Customize the look and feel</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-3">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${theme === t.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-slate-100 dark:border-white/5 hover:border-primary/30"
                }`}
            >
              <span
                className={`font-semibold text-sm ${theme === t.id ? "text-primary" : "text-slate-600 dark:text-white/60"}`}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  const [preferences, setPreferences] = useState({
    language: "English (US)",
    timezone: "Asia/Kolkata (IST)",
    dateFormat: "DD/MM/YYYY",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
          General Settings
        </h3>
        <p className="text-sm text-slate-500 dark:text-white/50">Configure general preferences</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option>English (US)</option>
            <option>Hindi</option>
            <option>Gujarati</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">
            Timezone
          </label>
          <select
            value={preferences.timezone}
            onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option>Asia/Kolkata (IST)</option>
            <option>UTC</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">
            Date Format
          </label>
          <select
            value={preferences.dateFormat}
            onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-4 gap-3 items-center">
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-green-500 text-sm font-medium flex items-center gap-1"
          >
            <Check className="w-4 h-4" /> Preferences saved!
          </motion.span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
