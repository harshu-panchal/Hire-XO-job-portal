import {
  Bell,
  Lock,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Shield,
  CreditCard,
  Eye,
  X,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const SeekSettings = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  // Notification settings
  const [newInquiries, setNewInquiries] = useState(true);
  const [requestViews, setRequestViews] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [tipsRecommendations, setTipsRecommendations] = useState(true);

  // Privacy settings
  const [publicProfile, setPublicProfile] = useState(true);

  // Modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Language
  const [selectedLanguage, setSelectedLanguage] = useState("English (India)");

  // 2FA
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);


  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }
    // Simulate password change
    alert("Password changed successfully!");
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const toggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
    setShow2FAModal(false);
    alert(is2FAEnabled ? "2FA disabled successfully!" : "2FA enabled successfully!");
  };

  return (
    <div className="py-6 space-y-6 select-none">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-3xl font-black tracking-tight">
          Settings <span className="text-primary">&</span> Preferences
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest mt-1">
          Manage your account settings
        </p>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
        <h2 className="text-xl font-black tracking-tight mb-4">Notifications</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Bell className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-black">New Investor Inquiries</p>
                <p className="text-xs text-slate-500">Get notified when investors contact you</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={newInquiries}
                onChange={(e) => setNewInquiries(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Eye className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-black">Request Views</p>
                <p className="text-xs text-slate-500">Track when investors view your requests</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={requestViews}
                onChange={(e) => setRequestViews(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Bell className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-black">Email Notifications</p>
                <p className="text-xs text-slate-500">Receive email updates</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Bell className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-black">Tips & Recommendations</p>
                <p className="text-xs text-slate-500">Get tips to improve your requests</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={tipsRecommendations}
                onChange={(e) => setTipsRecommendations(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>


      {/* Account & Security */}
      <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
        <h2 className="text-xl font-black tracking-tight mb-4">Account & Security</h2>
        <div className="space-y-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Lock className="size-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black">Change Password</p>
                <p className="text-xs text-slate-500">Update your password</p>
              </div>
            </div>
            <ChevronRight className="size-5 text-slate-400" />
          </button>
          <button
            onClick={() => setShow2FAModal(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Shield className="size-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Add extra security</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {is2FAEnabled && (
                <div className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black">
                  ENABLED
                </div>
              )}
              <ChevronRight className="size-5 text-slate-400" />
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <CreditCard className="size-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black">Payment Methods</p>
                <p className="text-xs text-slate-500">Manage payment options</p>
              </div>
            </div>
            <ChevronRight className="size-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
        <h2 className="text-xl font-black tracking-tight mb-4">Privacy</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Eye className="size-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm font-black">Public Profile</p>
                <p className="text-xs text-slate-500">Make your profile visible to investors</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={publicProfile}
                onChange={(e) => setPublicProfile(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
        <h2 className="text-xl font-black tracking-tight mb-4">Preferences</h2>
        <button
          onClick={() => setShowLanguageModal(true)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Globe className="size-5 text-amber-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black">Language & Region</p>
              <p className="text-xs text-slate-500">{selectedLanguage}</p>
            </div>
          </div>
          <ChevronRight className="size-5 text-slate-400" />
        </button>
      </div>

      {/* Support */}
      <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
        <h2 className="text-xl font-black tracking-tight mb-4">Support</h2>
        <button
          onClick={() => setShowHelpModal(true)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <HelpCircle className="size-5 text-cyan-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black">Help & Support</p>
              <p className="text-xs text-slate-500">Get help or contact us</p>
            </div>
          </div>
          <ChevronRight className="size-5 text-slate-400" />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          if (confirm("Are you sure you want to logout?")) {
            logout();
            navigate("/");
          }
        }}
        className="w-full flex items-center justify-center gap-3 py-5 rounded-[1.5rem] bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-600 font-black text-sm uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-950/30 active:scale-95 transition-all"
      >
        <LogOut className="size-5" />
        <span>Logout</span>
      </button>

      {/* Version */}
      <div className="text-center">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Version 1.0.0</p>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">Two-Factor Authentication</h3>
              <button
                onClick={() => setShow2FAModal(false)}
                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mb-6">
              <div className="size-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="size-8 text-emerald-600" />
              </div>
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                {is2FAEnabled
                  ? "Two-factor authentication is currently enabled. Disable it to reduce security."
                  : "Add an extra layer of security to your account by enabling two-factor authentication."}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShow2FAModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={toggle2FA}
                className={`flex-1 px-4 py-3 rounded-xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all ${is2FAEnabled
                    ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                  }`}
              >
                {is2FAEnabled ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">Language & Region</h3>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-2 mb-6">
              {["English (India)", "English (US)", "Hindi", "Spanish", "French"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedLanguage === lang
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                >
                  <span className="text-sm font-black">{lang}</span>
                  {selectedLanguage === lang && <Check className="size-5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">Help & Support</h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900">
                <p className="text-sm font-black mb-1">Email Support</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">support@hirexo.com</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                <p className="text-sm font-black mb-1">Phone Support</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">+91 1800-123-4567</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-2xl border border-purple-200 dark:border-purple-900">
                <p className="text-sm font-black mb-1">Help Center</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Visit our comprehensive help center for FAQs and guides
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full mt-6 px-4 py-3 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekSettings;
