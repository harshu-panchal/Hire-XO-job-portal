import { useState, useEffect } from "react";
import {
  Bell,
  Shield,
  Palette,
  CreditCard,
  LifeBuoy,
  LogOut,
  ChevronRight,
  Key,
  Users,
  Clock,
  X,
  Copy,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DEFAULT_API_KEYS = [
  { id: 1, name: "Production API", key: "sk_live_abc123xyz789def456", created: "Jan 15, 2026" },
  { id: 2, name: "Development API", key: "sk_test_xyz789abc123ghi456", created: "Jan 10, 2026" },
];

const DEFAULT_PERSONNEL = [
  { id: 1, name: "John Doe", email: "john@company.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@company.com", role: "Manager", status: "Active" },
];

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

interface SettingItemProps {
  icon: any;
  label: string;
  description: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

const SettingItem = ({ icon: Icon, label, description, action, onClick }: SettingItemProps) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm group ${onClick ? "cursor-pointer hover:shadow-md" : ""} transition-all`}
  >
    <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/30 transition-colors">
      <Icon className="size-6 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600" />
    </div>
    <div className="flex-1 space-y-0.5">
      <h3 className="text-sm font-black tracking-tight">{label}</h3>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {description}
      </p>
    </div>
    <div>
      {action || (
        <ChevronRight className="size-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
      )}
    </div>
  </div>
);

const ProvideSettings = () => {
  const navigate = useNavigate();
  const { logout, user, updateProfile } = useAuthStore();

  // Toggles
  const [bidAlerts, setBidAlerts] = useState(true);
  const [extensionEnabled, setExtensionEnabled] = useState(false);

  // Modals
  const [showAPIModal, setShowAPIModal] = useState(false);
  const [showPersonnelModal, setShowPersonnelModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // API Keys
  const [apiKeys, setApiKeys] = useState(() =>
    loadFromStorage("tenders_provide_api_keys_v1", DEFAULT_API_KEYS)
  );
  const [copiedKey, setCopiedKey] = useState<number | null>(null);

  // Personnel
  const [personnel, setPersonnel] = useState(() =>
    loadFromStorage("tenders_provide_personnel_v1", DEFAULT_PERSONNEL)
  );

  // Security
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  // Theme
  const [selectedTheme, setSelectedTheme] = useState("Default");

  useEffect(() => {
    const prefs = user?.profile?.preferences || {};
    setBidAlerts(prefs.tendersProvideBidAlerts ?? true);
    setExtensionEnabled(prefs.tendersProvideAutoExtension ?? false);
    setIs2FAEnabled(Boolean(prefs.tendersProvide2FAEnabled));
    setSelectedTheme(prefs.tendersProvideTheme || "Default");
  }, [user?.profile?.preferences]);

  useEffect(() => {
    localStorage.setItem("tenders_provide_api_keys_v1", JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem("tenders_provide_personnel_v1", JSON.stringify(personnel));
  }, [personnel]);

  const persistPreferences = async (nextPrefs: Record<string, any>) => {
    setIsSavingPrefs(true);
    try {
      await updateProfile({
        profile: {
          ...user?.profile,
          preferences: {
            ...(user?.profile?.preferences || {}),
            ...nextPrefs,
          },
        },
      });
      return true;
    } catch (error: any) {
      toast.error(error?.message || "Failed to save settings");
      return false;
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleToggleBidAlerts = async () => {
    const next = !bidAlerts;
    setBidAlerts(next);
    const ok = await persistPreferences({ tendersProvideBidAlerts: next });
    if (!ok) setBidAlerts(!next);
  };

  const handleToggleAutoExtension = async () => {
    const next = !extensionEnabled;
    setExtensionEnabled(next);
    const ok = await persistPreferences({ tendersProvideAutoExtension: next });
    if (!ok) setExtensionEnabled(!next);
  };

  const handleToggle2FA = async () => {
    const next = !is2FAEnabled;
    setIs2FAEnabled(next);
    const ok = await persistPreferences({ tendersProvide2FAEnabled: next });
    if (!ok) setIs2FAEnabled(!next);
  };


  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight">Management Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
          Configure your provider experience and security
        </p>
      </div>

      {/* Notification & Operations */}
      <div className="space-y-4">
        <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
          Operational Preferences
        </h2>
        <div className="space-y-3">
          <SettingItem
            icon={Bell}
            label="Bid Alerts"
            description="Instant notified on new bid submissions"
            action={
              <button
                onClick={handleToggleBidAlerts}
                disabled={isSavingPrefs}
                className={`w-12 h-6 rounded-full transition-colors relative ${bidAlerts ? "bg-indigo-600" : "bg-slate-200"}`}
              >
                <div
                  className={`absolute top-1 size-4 bg-white rounded-full transition-all ${bidAlerts ? "left-7" : "left-1"}`}
                />
              </button>
            }
          />
          <SettingItem
            icon={Clock}
            label="Auto-Extension"
            description="Extend deadline on last-minute bids"
            action={
              <button
                onClick={handleToggleAutoExtension}
                disabled={isSavingPrefs}
                className={`w-12 h-6 rounded-full transition-colors relative ${extensionEnabled ? "bg-indigo-600" : "bg-slate-200"}`}
              >
                <div
                  className={`absolute top-1 size-4 bg-white rounded-full transition-all ${extensionEnabled ? "left-7" : "left-1"}`}
                />
              </button>
            }
          />
        </div>
      </div>

      {/* Security Section */}
      <div className="space-y-4">
        <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          Security & Access
        </h2>
        <div className="space-y-3">
          <SettingItem
            icon={Key}
            label="API Keys"
            description="Access credentials for integration"
            onClick={() => setShowAPIModal(true)}
          />
          <SettingItem
            icon={Users}
            label="Authorized Personnel"
            description="Manage sub-accounts and permissions"
            onClick={() => setShowPersonnelModal(true)}
          />
          <SettingItem
            icon={Shield}
            label="Account Security"
            description="Authentication and 2FA settings"
            onClick={() => setShowSecurityModal(true)}
          />
        </div>
      </div>


      {/* Support & Billing */}
      <div className="space-y-4">
        <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          Support
        </h2>
        <div className="space-y-3">
          <SettingItem
            icon={CreditCard}
            label="Billing & Plan"
            description="Manage your organization subscription"
            onClick={() => setShowBillingModal(true)}
          />
          <SettingItem
            icon={LifeBuoy}
            label="Help & Resources"
            description="Documentation and support tickets"
            onClick={() => setShowHelpModal(true)}
          />
        </div>
      </div>

      {/* Sign Out */}
      <div className="pt-4 pb-8">
        <button
          onClick={() => {
            if (confirm("Are you sure you want to sign out?")) {
              logout();
              navigate("/");
            }
          }}
          className="w-full p-5 rounded-[2rem] bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-rose-100 dark:hover:bg-rose-950/30 active:scale-95 transition-all border border-rose-100 dark:border-rose-900/30 shadow-lg shadow-rose-500/5"
        >
          <LogOut className="size-5" /> Sign Out from Authority Account
        </button>
        <div className="flex items-center justify-center gap-2 mt-6 opacity-30">
          <div className="size-1 rounded-full bg-slate-400" />
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
            Authority Panel v2.4.0
          </p>
          <div className="size-1 rounded-full bg-slate-400" />
        </div>
      </div>

      {/* API Keys Modal */}
      {showAPIModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black">API Keys</h3>
                <p className="text-xs text-slate-500 mt-1">Manage your integration credentials</p>
              </div>
              <button
                onClick={() => setShowAPIModal(false)}
                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-black">{key.name}</p>
                      <p className="text-xs text-slate-500">Created: {key.created}</p>
                    </div>
                    <button
                      onClick={() => setApiKeys(apiKeys.filter((k) => k.id !== key.id))}
                      className="size-8 rounded-lg bg-red-50 dark:bg-red-950/20 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-950/30 transition-all"
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg text-xs font-mono border border-slate-200 dark:border-white/10">
                      {key.key}
                    </code>
                    <button
                      onClick={() => copyToClipboard(key.key, key.id)}
                      className="size-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-950/30 transition-all"
                    >
                      {copiedKey === key.id ? (
                        <Check className="size-4 text-emerald-600" />
                      ) : (
                        <Copy className="size-4 text-indigo-600" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const newKey = {
                  id: apiKeys.length + 1,
                  name: `API Key ${apiKeys.length + 1}`,
                  key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
                  created: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                };
                setApiKeys([...apiKeys, newKey]);
              }}
              className="w-full mt-4 px-4 py-3 rounded-xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <Plus className="size-4" />
              Generate New Key
            </button>
          </div>
        </div>
      )}

      {/* Personnel Modal */}
      {showPersonnelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black">Authorized Personnel</h3>
                <p className="text-xs text-slate-500 mt-1">Manage team members and permissions</p>
              </div>
              <button
                onClick={() => setShowPersonnelModal(false)}
                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-3">
              {personnel.map((person) => (
                <div
                  key={person.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                        <span className="text-sm font-black text-indigo-600">
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-black">{person.name}</p>
                        <p className="text-xs text-slate-500">{person.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 text-xs font-black">
                        {person.role}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 text-xs font-black">
                        {person.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-3 rounded-xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
              <Plus className="size-4" />
              Add Team Member
            </button>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">Account Security</h3>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-black">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500">Add extra security layer</p>
                  </div>
                  <button
                    onClick={handleToggle2FA}
                    disabled={isSavingPrefs}
                    className={`w-12 h-6 rounded-full transition-colors relative ${is2FAEnabled ? "bg-emerald-600" : "bg-slate-200"}`}
                  >
                    <div
                      className={`absolute top-1 size-4 bg-white rounded-full transition-all ${is2FAEnabled ? "left-7" : "left-1"}`}
                    />
                  </button>
                </div>
                {is2FAEnabled && (
                  <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-500">
                      2FA is currently enabled
                    </p>
                  </div>
                )}
              </div>
              <button className="w-full px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 font-black text-sm uppercase tracking-widest hover:bg-blue-100 dark:hover:bg-blue-950/30 active:scale-95 transition-all">
                Change Password
              </button>
              <button className="w-full px-4 py-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 font-black text-sm uppercase tracking-widest hover:bg-purple-100 dark:hover:bg-purple-950/30 active:scale-95 transition-all">
                View Login History
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Billing Modal */}
      {showBillingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">Billing & Plan</h3>
              <button
                onClick={() => setShowBillingModal(false)}
                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-2xl border border-indigo-200 dark:border-indigo-900">
                <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">
                  Current Plan
                </p>
                <p className="text-2xl font-black mb-1">Enterprise</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  $299/month • Unlimited tenders
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Next Billing Date
                </p>
                <p className="text-sm font-bold">March 1, 2026</p>
              </div>
              <button className="w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20">
                Manage Subscription
              </button>
              <button className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all">
                View Invoices
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">Help & Resources</h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900">
                <p className="text-sm font-black mb-1">Documentation</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Complete guides and API references
                </p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                <p className="text-sm font-black mb-1">Email Support</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">support@tenders.gov.in</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-2xl border border-purple-200 dark:border-purple-900">
                <p className="text-sm font-black mb-1">Phone Support</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">1800-XXX-XXXX (24/7)</p>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full mt-4 px-4 py-3 rounded-xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvideSettings;
