import {
  Bell,
  Lock,
  Smartphone,
  Globe,
  Moon,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BrowseSettings = () => {
  const navigate = useNavigate();
  const { logout, user, updateProfile } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [is2faEnabled, setIs2faEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const prefs = user?.profile?.preferences || {};
    setNotifications(prefs.csmBrowseNotifications ?? true);
    setIs2faEnabled(prefs.csmBrowse2FA ?? true);
  }, [user?.profile?.preferences]);

  const persistSettings = async (nextPrefs: Record<string, boolean>) => {
    setIsSaving(true);
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
      setIsSaving(false);
    }
  };

  const handleNotificationsToggle = async () => {
    const next = !notifications;
    setNotifications(next);
    const ok = await persistSettings({ csmBrowseNotifications: next });
    if (!ok) setNotifications(!next);
  };

  const handle2faToggle = async () => {
    const next = !is2faEnabled;
    setIs2faEnabled(next);
    const ok = await persistSettings({ csmBrowse2FA: next });
    if (!ok) setIs2faEnabled(!next);
  };
  return (
    <div className="py-6 space-y-10 select-none">
      {/* Header */}
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-black tracking-tighter">Settings</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
          CSM Prefs & Security
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {/* Account Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-1">
            General
          </h3>
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              <button
                onClick={handleNotificationsToggle}
                disabled={isSaving}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Bell className="size-5" />
                  </div>
                  <span className="font-black text-[12px] uppercase tracking-widest">
                    Notifications
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    {notifications ? "On" : "Off"}
                  </span>
                  <ChevronRight className="size-5 text-slate-300" />
                </div>
              </button>

              <button
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Moon className="size-5" />
                  </div>
                  <span className="font-black text-[12px] uppercase tracking-widest">
                    Appearance
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase">System</span>
                  <ChevronRight className="size-5 text-slate-300" />
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Globe className="size-5" />
                  </div>
                  <span className="font-black text-[12px] uppercase tracking-widest">Language</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase">English</span>
                  <ChevronRight className="size-5 text-slate-300" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-1">
            Security
          </h3>
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Lock className="size-5" />
                  </div>
                  <span className="font-black text-[12px] uppercase tracking-widest">Password</span>
                </div>
                <ChevronRight className="size-5 text-slate-300" />
              </button>

              <button
                onClick={handle2faToggle}
                disabled={isSaving}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                    <Smartphone className="size-5" />
                  </div>
                  <span className="font-black text-[12px] uppercase tracking-widest">2FA Auth</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-emerald-600 uppercase">
                    {is2faEnabled ? "Active" : "Off"}
                  </span>
                  <ChevronRight className="size-5 text-slate-300" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-1">
            Support
          </h3>
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-xl bg-slate-500/10 text-slate-500 flex items-center justify-center">
                  <HelpCircle className="size-5" />
                </div>
                <span className="font-black text-[12px] uppercase tracking-widest">
                  Help Center
                </span>
              </div>
              <ChevronRight className="size-5 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full h-16 rounded-[2.5rem] bg-red-500/10 text-red-600 font-black text-[12px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-transform border border-red-500/10 px-1 hover:bg-red-500 hover:text-white group"
        >
          <LogOut className="size-5 group-hover:-translate-x-1 transition-transform" />
          Sign Out Account
        </button>
      </div>

      <div className="text-center pb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Version 2.4.0 (CSM)
        </p>
      </div>
    </div>
  );
};

export default BrowseSettings;
