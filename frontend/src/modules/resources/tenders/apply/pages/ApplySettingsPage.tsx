import { useState, useEffect } from "react";
import {
  Bell,
  Shield,
  Eye,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
  Mail,
  ArrowLeft,
  Lock,
  Key,
  CheckCircle2,
  Laptop,
  Tablet,
  Phone,
  ExternalLink,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "@/services/subscriptionService";
import { authService } from "@/services/authService";
import { toast } from "sonner";

// Use local interface to avoid Vite re-export issues
interface SettingsWallet {
  balance: number;
}

const SettingItem = ({ icon: Icon, label, description, action, onClick }: any) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm group ${onClick ? "cursor-pointer active:scale-[0.98] transition-all" : ""}`}
  >
    <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-violet-50 dark:group-hover:bg-violet-950/30 transition-colors">
      <Icon className="size-6 text-slate-600 dark:text-slate-400 group-hover:text-violet-600" />
    </div>
    <div className="flex-1 space-y-0.5">
      <h3 className="text-sm font-black tracking-tight">{label}</h3>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {description}
      </p>
    </div>
    <div>
      {action || (
        <ChevronRight className="size-5 text-slate-300 group-hover:text-violet-600 transition-colors" />
      )}
    </div>
  </div>
);

const ApplySettingsPage = () => {
  const navigate = useNavigate();
  const { logout, user, updateProfile } = useAuthStore();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Local state for preferences synced with user profile
  const [tenderAlerts, setTenderAlerts] = useState(
    user?.profile?.preferences?.notifications ?? true
  );
  const [visibilityPrefs, setVisibilityPrefs] = useState({
    showInSearch: user?.profile?.preferences?.tenderApplyShowInSearch ?? true,
    publicProfile: user?.profile?.preferences?.tenderApplyPublicProfile ?? true,
    showSuccessRate: user?.profile?.preferences?.tenderApplyShowSuccessRate ?? false,
  });
  const [wallet, setWallet] = useState<SettingsWallet | null>(null);

  // Sync state when user loads
  useEffect(() => {
    if (user?.profile?.preferences) {
      setTenderAlerts(user.profile.preferences.notifications ?? true);
      setVisibilityPrefs({
        showInSearch: user.profile.preferences.tenderApplyShowInSearch ?? true,
        publicProfile: user.profile.preferences.tenderApplyPublicProfile ?? true,
        showSuccessRate: user.profile.preferences.tenderApplyShowSuccessRate ?? false,
      });
    }
  }, [user]);

  // Password state
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (activeSection === "Subscription") {
      loadWallet();
    }
  }, [activeSection]);

  const loadWallet = async () => {
    try {
      const data = await subscriptionService.getWalletBalance();
      setWallet(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTenderAlertsToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !tenderAlerts;
    setTenderAlerts(newState);

    try {
      await updateProfile({
        profile: {
          ...user?.profile,
          preferences: {
            ...user?.profile?.preferences,
            notifications: newState,
          },
        },
      });
      toast.success(`Tender alerts ${newState ? "enabled" : "disabled"}`);
    } catch (error: any) {
      setTenderAlerts(!newState); // Rollback
      toast.error(error.message || "Failed to update notification settings");
    }
  };

  const persistVisibility = async (
    key: "tenderApplyShowInSearch" | "tenderApplyPublicProfile" | "tenderApplyShowSuccessRate",
    value: boolean
  ) => {
    try {
      await updateProfile({
        profile: {
          ...user?.profile,
          preferences: {
            ...user?.profile?.preferences,
            [key]: value,
          },
        },
      });
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update visibility setting");
      return false;
    }
  };

  const handleVisibilityToggle = async (
    key: "showInSearch" | "publicProfile" | "showSuccessRate"
  ) => {
    const next = !visibilityPrefs[key];
    setVisibilityPrefs((prev) => ({ ...prev, [key]: next }));

    const map: Record<"showInSearch" | "publicProfile" | "showSuccessRate", "tenderApplyShowInSearch" | "tenderApplyPublicProfile" | "tenderApplyShowSuccessRate"> = {
      showInSearch: "tenderApplyShowInSearch",
      publicProfile: "tenderApplyPublicProfile",
      showSuccessRate: "tenderApplyShowSuccessRate",
    };

    const ok = await persistVisibility(map[key], next);
    if (!ok) {
      setVisibilityPrefs((prev) => ({ ...prev, [key]: !next }));
    }
  };



  const handleLogout = () => {
    toast.promise(
      async () => {
        await logout();
        navigate("/");
      },
      {
        loading: "Signing out...",
        success: "Signed out successfully",
        error: "Failed to sign out",
      }
    );
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.old || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setUpdatingPassword(true);
    try {
      await authService.changePassword(passwords.old, passwords.new);
      toast.success("Password updated successfully!");
      setPasswords({ old: "", new: "", confirm: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Sub-Section Components
  const SecuritySection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-6 bg-violet-600 rounded-[2.5rem] text-white space-y-4">
        <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center">
          <Shield className="size-6" />
        </div>
        <div>
          <h3 className="text-lg font-black tracking-tight">Protect Your Account</h3>
          <p className="text-xs text-violet-100 font-bold opacity-80">Connected as {user?.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Current Password
          </label>
          <input
            type="password"
            value={passwords.old}
            onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
            placeholder="••••••••"
            className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            New Password
          </label>
          <input
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            placeholder="Min 6 characters"
            className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            placeholder="Repeat new password"
            className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold"
          />
        </div>
        <button
          onClick={handlePasswordUpdate}
          disabled={updatingPassword}
          className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-3xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all mt-2 disabled:opacity-50"
        >
          {updatingPassword ? "Updating..." : "Update Password"}
        </button>
      </div>

      <div className="p-5 rounded-[2rem] border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center gap-4">
        <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center">
          <Smartphone className="size-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-black">Two-Factor Auth</p>
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
            Not enabled
          </p>
        </div>
        <button
          onClick={() => toast.info("Device-based 2FA activation coming in next update")}
          className="text-[10px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 dark:bg-violet-950/20 px-4 py-2 rounded-xl"
        >
          Enable
        </button>
      </div>
    </div>
  );

  const VisibilitySection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-6 bg-slate-900 dark:bg-white rounded-[2.5rem] text-white dark:text-slate-900">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">
          Display Settings
        </p>
        <h3 className="text-xl font-black tracking-tight">Profile Visibility</h3>
        <p className="text-xs mt-2 opacity-80 font-bold">
          Control how your organization profile appears to other users.
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            key: "showInSearch" as const,
            label: "Show in Search",
            desc: "Allow vendors to find your tenders via search",
          },
          {
            key: "publicProfile" as const,
            label: "Public Profile",
            desc: "Anyone with your link can view company details",
          },
          {
            key: "showSuccessRate" as const,
            label: "Show Success Rate",
            desc: "Display your tender completion percentage",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5"
          >
            <div className="flex-1">
              <p className="text-sm font-black">{item.label}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                {item.desc}
              </p>
            </div>
            <button
              onClick={() => handleVisibilityToggle(item.key)}
              className={`w-10 h-5 rounded-full relative transition-colors ${visibilityPrefs[item.key] ? "bg-emerald-500" : "bg-slate-200"}`}
            >
              <div
                className={`absolute top-0.5 size-4 bg-white rounded-full transition-all ${visibilityPrefs[item.key] ? "left-5.5" : "left-0.5"}`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-5 rounded-[2rem] flex gap-4">
        <AlertCircle className="size-5 text-amber-600 shrink-0" />
        <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest leading-relaxed">
          Setting your profile to private will prevent you from receiving direct bids from verified
          vendors.
        </p>
      </div>
    </div>
  );

  const SubscriptionSection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="p-8 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
            Wallet Balance
          </p>
          <h3 className="text-4xl font-black tracking-tight">₹{wallet?.balance || 0}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => toast.info("Redirecting to payment gateway...")}
              className="flex-1 bg-white text-slate-900 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
            >
              Recharge
            </button>
            <button className="flex-1 bg-black/20 text-white backdrop-blur-md py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
              History
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          Current Plan
        </h4>
        <div className="p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div>
            <h5 className="text-lg font-black text-violet-600">Enterprise Pro</h5>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Renewal Date: 24 Oct 2026
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black">₹4,999</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
              Per Month
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          Included in your plan
        </h4>
        {[
          "Unlimited Tender Postings",
          "AI Vendor Matching",
          "Priority Verification",
          "Dedicated Support Account Manager",
        ].map((perk, i) => (
          <div key={i} className="flex items-center gap-3 px-1">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span className="text-[11px] font-bold">{perk}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const DevicesSection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        {[
          {
            icon: Laptop,
            name: "MacBook Pro M2",
            location: "Mumbai, India",
            status: "Active Now",
            current: true,
          },
          {
            icon: Smartphone,
            name: "iPhone 15 Pro",
            location: "Pune, India",
            status: "Last active 2 hrs ago",
            current: false,
          },
          {
            icon: Tablet,
            name: "iPad Air Gen 5",
            location: "Pune, India",
            status: "Last active 1 day ago",
            current: false,
          },
        ].map((device, i) => (
          <div
            key={i}
            className={`p-5 rounded-[2rem] bg-white dark:bg-slate-900 border ${device.current ? "border-violet-200 dark:border-violet-900/40 bg-violet-50/20" : "border-slate-100 dark:border-white/5"} flex items-center gap-4`}
          >
            <div
              className={`size-12 rounded-2xl flex items-center justify-center ${device.current ? "bg-violet-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}
            >
              <device.icon className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black truncate">{device.name}</h4>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                {device.location} • {device.status}
              </p>
            </div>
            {!device.current && (
              <button className="text-[9px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 transition-colors">
                Logout
              </button>
            )}
          </div>
        ))}
      </div>

      <button className="w-full p-4 rounded-2xl border border-rose-200 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-colors">
        Logout from all other devices
      </button>
    </div>
  );

  const SupportSection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() => toast.success("Connecting to a live agent...")}
          className="p-6 rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-center space-y-2 cursor-pointer active:scale-95 transition-all"
        >
          <HelpCircle className="size-8 mx-auto text-indigo-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Live Chat</p>
          <p className="text-[8px] opacity-60 font-bold">2 min wait</p>
        </div>
        <div
          onClick={() => toast.success("Opening email client...")}
          className="p-6 rounded-[2.5rem] bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 text-center space-y-2 cursor-pointer active:scale-95 transition-all"
        >
          <Mail className="size-8 mx-auto text-violet-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Email Us</p>
          <p className="text-[8px] opacity-60 font-bold">24h response</p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          Common Questions
        </h4>
        {[
          "How to verify my organization?",
          "Processing time for security deposit",
          "Accepting multiple bids for a tender",
          "Refund policy for canceled tenders",
        ].map((q, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-violet-200 transition-all"
          >
            <span className="text-xs font-bold">{q}</span>
            <ChevronRight className="size-4 text-slate-300 group-hover:text-violet-600" />
          </div>
        ))}
      </div>

      <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] space-y-4">
        <h3 className="text-xl font-black tracking-tight leading-tight">
          Can't find what you're looking for?
        </h3>
        <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
          Submit a Ticket
        </button>
      </div>
    </div>
  );

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Action Bar */}
      {activeSection && (
        <button
          onClick={() => {
            setActiveSection(null);
            setPasswords({ old: "", new: "", confirm: "" });
          }}
          className="flex items-center gap-2 text-slate-500 font-black text-xs uppercase tracking-widest active:scale-95 transition-transform"
        >
          <ArrowLeft className="size-4" /> Back to Settings
        </button>
      )}

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight">
          {activeSection ? activeSection : "App Settings"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
          {activeSection
            ? `Configure your ${activeSection.toLowerCase()} preferences`
            : "Manage your preferences and security"}
        </p>
      </div>

      {/* Main Level */}
      {!activeSection ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="space-y-4">
            <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-violet-600">
              Preferences
            </h2>
            <div className="space-y-3">
              <SettingItem
                icon={Bell}
                label="Tender Alerts"
                description="New tenders matching your profile"
                action={
                  <button
                    onClick={handleTenderAlertsToggle}
                    className={`w-12 h-6 rounded-full transition-colors relative ${tenderAlerts ? "bg-violet-600" : "bg-slate-200"}`}
                  >
                    <div
                      className={`absolute top-1 size-4 bg-white rounded-full transition-all ${tenderAlerts ? "left-7" : "left-1"}`}
                    />
                  </button>
                }
              />

            </div>
          </div>

          <div className="space-y-4">
            <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Security & Privacy
            </h2>
            <div className="space-y-3">
              <SettingItem
                icon={Shield}
                label="Account Security"
                description="Password and 2FA settings"
                onClick={() => setActiveSection("Account Security")}
              />
              <SettingItem
                icon={Eye}
                label="Visibility"
                description="Manage profile discoverability"
                onClick={() => setActiveSection("Visibility")}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Account
            </h2>
            <div className="space-y-3">
              <SettingItem
                icon={CreditCard}
                label="Subscription"
                description="View and manage your plan"
                onClick={() => setActiveSection("Subscription")}
              />
              <SettingItem
                icon={Smartphone}
                label="Connected Devices"
                description="Manage your active sessions"
                onClick={() => setActiveSection("Connected Devices")}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Help & Support
            </h2>
            <div className="space-y-3">
              <SettingItem
                icon={HelpCircle}
                label="Help Center"
                description="FAQs and documentation"
                onClick={() => setActiveSection("Help Center")}
              />
              <SettingItem
                icon={Mail}
                label="Contact Support"
                description="Get in touch with our team"
                onClick={() => setActiveSection("Support")}
              />
            </div>
          </div>

          <div className="pt-4 pb-8">
            <button
              onClick={handleLogout}
              className="w-full p-5 rounded-[2rem] bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all border border-rose-100 dark:border-rose-900/30 shadow-lg shadow-rose-500/5"
            >
              <LogOut className="size-5" /> Sign Out from Account
            </button>
          </div>
        </div>
      ) : (
        <div className="pb-12">
          {activeSection === "Account Security" && <SecuritySection />}
          {activeSection === "Visibility" && <VisibilitySection />}
          {activeSection === "Subscription" && <SubscriptionSection />}
          {activeSection === "Connected Devices" && <DevicesSection />}
          {activeSection === "Help Center" && <SupportSection />}
          {activeSection === "Support" && <SupportSection />}
        </div>
      )}
    </div>
  );
};

export default ApplySettingsPage;
