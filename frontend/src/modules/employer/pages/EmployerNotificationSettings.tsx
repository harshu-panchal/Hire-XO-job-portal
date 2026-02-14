import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Mail } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const EmployerNotificationSettings = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);

  useEffect(() => {
    const prefs = user?.profile?.preferences;
    const savedSettings = prefs?.notificationSettings as any;

    setNotificationsEnabled(prefs?.notifications ?? true);
    setEmailAlertsEnabled(
      savedSettings?.emailAlerts ??
        savedSettings?.email?.weeklyDigest ??
        true
    );
  }, [user]);

  const saveSettings = async (nextNotifications: boolean, nextEmailAlerts: boolean) => {
    try {
      const currentPreferences = user?.profile?.preferences || {};
      await updateProfile({
        preferences: {
          ...currentPreferences,
          notifications: nextNotifications,
          notificationSettings: {
            ...(currentPreferences.notificationSettings || {}),
            emailAlerts: nextEmailAlerts,
          },
        },
      });
      toast.success("Notification settings updated");
    } catch (error) {
      toast.error("Failed to update notification settings");
      throw error;
    }
  };

  const toggleNotifications = async () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    try {
      await saveSettings(next, emailAlertsEnabled);
    } catch {
      setNotificationsEnabled(!next);
    }
  };

  const toggleEmailAlerts = async () => {
    const next = !emailAlertsEnabled;
    setEmailAlertsEnabled(next);
    try {
      await saveSettings(notificationsEnabled, next);
    } catch {
      setEmailAlertsEnabled(!next);
    }
  };

  return (
    <div className="pb-24 min-h-screen select-none px-4 sm:px-5 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between py-5 sm:py-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-20">
        <button
          onClick={() => navigate(-1)}
          className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all"
        >
          <ChevronLeft className="size-6" />
        </button>
        <h2 className="text-sm font-black uppercase tracking-widest">Notifications</h2>
        <div className="size-11" />
      </div>

      <div className="mt-6 space-y-4">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Bell className="size-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-black tracking-tight">Enable Notifications</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Master toggle for app alerts
                </p>
              </div>
            </div>
            <button
              onClick={toggleNotifications}
              className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${notificationsEnabled ? "bg-primary" : "bg-slate-200"}`}
            >
              <div
                className={`size-4 bg-white rounded-full transition-all duration-300 ${notificationsEnabled ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </div>

          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Mail className="size-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-black tracking-tight">Email Alerts</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Receive important updates by email
                </p>
              </div>
            </div>
            <button
              onClick={toggleEmailAlerts}
              className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${emailAlertsEnabled ? "bg-primary" : "bg-slate-200"}`}
            >
              <div
                className={`size-4 bg-white rounded-full transition-all duration-300 ${emailAlertsEnabled ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-8 h-14 w-full rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
      >
        Back to Settings
      </button>
    </div>
  );
};

export default EmployerNotificationSettings;
