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
    setNotifications(prefs.vehicleBrowseNotifications ?? true);
    setIs2faEnabled(prefs.vehicleBrowse2FA ?? true);
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
    const ok = await persistSettings({ vehicleBrowseNotifications: next });
    if (!ok) setNotifications(!next);
  };

  const handle2faToggle = async () => {
    const next = !is2faEnabled;
    setIs2faEnabled(next);
    const ok = await persistSettings({ vehicleBrowse2FA: next });
    if (!ok) setIs2faEnabled(!next);
  };

  return (
    <div className="py-6 space-y-10 select-none">
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-black tracking-tighter">Settings</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
          Vehicle Rental Prefs & Security
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-1 italic">
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
                  <span className="font-black text-[12px] uppercase tracking-widest">Alerts & Hooks</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    {notifications ? "On" : "Off"}
                  </span>
                  <ChevronRight className="size-5 text-slate-300" />
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Moon className="size-5" />
                  </div>
                  <span className="font-black text-[12px] uppercase tracking-widest">Visual Theme</span>
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
                  <span className="font-black text-[12px] uppercase tracking-widest">Locale</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase">EN-IN</span>
                  <ChevronRight className="size-5 text-slate-300" />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-1 italic">
            Privacy
          </h3>
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Lock className="size-5" />
                  </div>
                  <span className="font-black text-[12px] uppercase tracking-widest">Access Key</span>
                </div>
                <ChevronRight className="size-5 text-slate-300" />
              </button>

              <button
                onClick={handle2faToggle}
                disabled={isSaving}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
                    <Smartphone className="size-5" />
                  </div>
                  <span className="font-black text-[12px] uppercase tracking-widest">Device Mgmt</span>
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

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-1 italic">
            Support
          </h3>
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="size-11 rounded-xl bg-slate-500/10 text-slate-500 flex items-center justify-center">
                  <HelpCircle className="size-5" />
                </div>
                <span className="font-black text-[12px] uppercase tracking-widest">Rental Support</span>
              </div>
              <ChevronRight className="size-5 text-slate-300" />
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full h-16 rounded-[2.5rem] bg-cyan-600/5 text-cyan-600 font-black text-[12px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-transform border border-cyan-600/10 px-1 hover:bg-cyan-600 hover:text-white group shadow-sm shadow-cyan-600/5"
        >
          <LogOut className="size-5 group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>

      <div className="text-center pb-8 opacity-40">
        <p className="text-[10px] font-black uppercase tracking-widest">Version 1.0.0 (VEHICLES)</p>
      </div>
    </div>
  );
};

export default BrowseSettings;
