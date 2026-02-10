import { useState, useRef } from "react";
import {
  User,
  Bell,
  Shield,
  Save,
  Upload,
  Check,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Database,
  Terminal,
  Server,
  Activity,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { toast } from "sonner";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Admin Profile", icon: User },
    { id: "platform", label: "Platform Config", icon: Globe },
    { id: "notifications", label: "System Alerts", icon: Bell },
    { id: "security", label: "Security & Access", icon: Shield },
    { id: "system", label: "System Health", icon: Server },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Admin Settings</h1>
        <p className="text-slate-500 mt-1">
          Configure your administrative account and global platform parameters
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm sticky top-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all ${activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`} />
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm min-h-[500px]">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "platform" && <PlatformSettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "system" && <SystemHealth />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  const { user, updateUser } = useAuthStore();
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profilePhoto || null
  );
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    organization: (user?.profile as any)?.organizationName || "HireXO Headquarters",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API update
      await new Promise(r => setTimeout(r, 1000));
      updateUser({ ...formData, profilePhoto: profileImage || undefined });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
        <p className="text-sm text-slate-500">Manage your admin identity on the platform</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-slate-100">
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border-4 border-white shadow-lg">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setProfileImage(reader.result as string);
              reader.readAsDataURL(file);
            }
          }} />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h4 className="font-bold text-slate-900">{formData.name || "Administrator"}</h4>
          <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mt-1 text-primary">System Administrator</p>
          <p className="text-xs text-slate-400 mt-2">Maximum file size: 2MB. Recommended: 400x400px</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Display Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Official Email</label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Contact Number</label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Organization / Branch</label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? "Updating Identity..." : "Commit Changes"}
        </button>
      </div>
    </div>
  );
}

function PlatformSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({
    siteName: "HireXO",
    maintenanceMode: false,
    allowRegistrations: true,
    requireVerification: true,
    defaultCurrency: "INR",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success("Platform configuration updated");
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Platform Configuration</h3>
        <p className="text-sm text-slate-500">Global parameters that define site behavior</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Site Title</label>
          <input
            type="text"
            value={config.siteName}
            onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Active Currency</label>
          <select
            value={config.defaultCurrency}
            onChange={(e) => setConfig({ ...config, defaultCurrency: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Toggles</h4>
        <div className="space-y-1">
          <Toggle
            label="Maintenance Mode"
            description="Disable public access for scheduled maintenance"
            enabled={config.maintenanceMode}
            onToggle={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
          />
          <Toggle
            label="User Registration"
            description="Allow new users to create accounts"
            enabled={config.allowRegistrations}
            onToggle={() => setConfig({ ...config, allowRegistrations: !config.allowRegistrations })}
          />
          <Toggle
            label="Require Email Verification"
            description="Mandatory verification before using basic platform features"
            enabled={config.requireVerification}
            onToggle={() => setConfig({ ...config, requireVerification: !config.requireVerification })}
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {isSaving ? "Saving Config..." : "Deploy Configuration"}
        </button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    systemAlerts: true,
    revenueAlerts: true,
    newRegistrationAlerts: false,
    securityAlerts: true,
    weeklyReport: true,
  });

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-slate-900">System Alerts</h3>
        <p className="text-sm text-slate-500">Configure administrative notifications and reporting</p>
      </div>

      <div className="space-y-2">
        <Toggle
          label="Critical System Failures"
          description="Instant alerts for server downtime or database connectivity issues"
          enabled={settings.systemAlerts}
          onToggle={() => setSettings({ ...settings, systemAlerts: !settings.systemAlerts })}
        />
        <Toggle
          label="Revenue Notifications"
          description="Get notified when subscription payments are successfully processed"
          enabled={settings.revenueAlerts}
          onToggle={() => setSettings({ ...settings, revenueAlerts: !settings.revenueAlerts })}
        />
        <Toggle
          label="User Signup Monitoring"
          description="Alerts for every new employer or job seeker registration"
          enabled={settings.newRegistrationAlerts}
          onToggle={() => setSettings({ ...settings, newRegistrationAlerts: !settings.newRegistrationAlerts })}
        />
        <Toggle
          label="Security Events"
          description="Notifications for multiple failed login attempts or password resets"
          enabled={settings.securityAlerts}
          onToggle={() => setSettings({ ...settings, securityAlerts: !settings.securityAlerts })}
        />
        <Toggle
          label="Weekly Business Digest"
          description="Monday morning summary of platform performance and KPIs"
          enabled={settings.weeklyReport}
          onToggle={() => setSettings({ ...settings, weeklyReport: !settings.weeklyReport })}
        />
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false });
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSaving(false);
    toast.success("Security credentials updated");
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Access Control</h3>
        <p className="text-sm text-slate-500">Manage your administrative credentials and access security</p>
      </div>

      <form onSubmit={handleUpdate} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6">
        <h4 className="font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" />
          Password Management
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl pr-12 focus:ring-2 focus:ring-primary/20 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">New Secure Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl pr-12 focus:ring-2 focus:ring-primary/20 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 disabled:opacity-50">
            {isSaving ? "Updating Strategy..." : "Update Security Token"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-slate-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">2FA Authorization</p>
              <p className="text-xs text-slate-500">Enhanced login protection</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
        </div>
        <div className="p-4 border border-slate-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Admin Privileges</p>
              <p className="text-xs text-slate-500">Root level access granted</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">Master</span>
        </div>
      </div>
    </div>
  );
}

function SystemHealth() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Infrastructure Insight</h3>
          <p className="text-sm text-slate-500">Real-time status of backend services and database</p>
        </div>
        <button
          onClick={() => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 1000); }}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <RefreshCw className={`w-5 h-5 text-slate-400 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <HealthCard label="API Engine" status="online" value="v1.4.2" icon={Terminal} />
        <HealthCard label="Database" status="online" value="Replica Set" icon={Database} />
        <HealthCard label="Storage" status="online" value="S3 Primary" icon={Server} />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Resource Usage</h4>
        <div className="space-y-4">
          <UsageMetric label="Backend CPU" value={24} />
          <UsageMetric label="Memory Consumption" value={68} />
          <UsageMetric label="Cache Efficiency" value={92} />
        </div>
      </div>
    </div>
  );
}

function HealthCard({ label, status, value, icon: Icon }: any) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase font-bold text-emerald-600">{status}</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-sm font-bold text-slate-900 mt-0.5">{value}</p>
    </div>
  );
}

function UsageMetric({ label, value }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-900">{value}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${value > 80 ? 'bg-rose-500' : 'bg-primary'}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Toggle({ label, description, enabled, onToggle }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 transition-all group">
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-primary' : 'bg-slate-200'}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}
