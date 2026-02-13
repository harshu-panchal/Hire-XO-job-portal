import { useState } from "react";
import {
  Bell,
  Lock,
  Smartphone,
  Globe,
  LogOut,
  ChevronRight,
  X,
  Check,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Device {
  id: number;
  name: string;
  driver: string;
  lastActive: string;
  status: "Active" | "Inactive";
}

const ProvideSettings = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [leadAlerts, setLeadAlerts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isPubliclyListed, setIsPubliclyListed] = useState(true);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [devices, setDevices] = useState<Device[]>([
    {
      id: 1,
      name: "Truck 01 - MH12AB1234",
      driver: "Rajesh Kumar",
      lastActive: "2 mins ago",
      status: "Active",
    },
    {
      id: 2,
      name: "Truck 02 - MH12CD5678",
      driver: "Amit Sharma",
      lastActive: "15 mins ago",
      status: "Active",
    },
    {
      id: 3,
      name: "Truck 03 - MH12EF9012",
      driver: "Suresh Patil",
      lastActive: "1 hour ago",
      status: "Active",
    },
    {
      id: 4,
      name: "Truck 04 - MH12GH3456",
      driver: "Vijay Singh",
      lastActive: "3 hours ago",
      status: "Active",
    },
    {
      id: 5,
      name: "Truck 05 - MH12IJ7890",
      driver: "Prakash Yadav",
      lastActive: "5 hours ago",
      status: "Active",
    },
    {
      id: 6,
      name: "Truck 06 - MH12KL2345",
      driver: "Ramesh Gupta",
      lastActive: "1 day ago",
      status: "Inactive",
    },
    {
      id: 7,
      name: "Truck 07 - MH12MN6789",
      driver: "Anil Desai",
      lastActive: "2 days ago",
      status: "Inactive",
    },
    {
      id: 8,
      name: "Truck 08 - MH12OP0123",
      driver: "Manoj Verma",
      lastActive: "3 days ago",
      status: "Inactive",
    },
  ]);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }

    toast.success("Password changed successfully!");
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleRemoveDevice = (deviceId: number) => {
    if (confirm("Are you sure you want to remove this device?")) {
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
      toast.success("Device removed successfully!");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const activeDevicesCount = devices.filter((d) => d.status === "Active").length;

  return (
    <div className="py-6 space-y-10 select-none">
      {/* Header */}
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-black tracking-tighter skew-x-[-4deg]">Settings</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] px-1">
          Logistics Admin Console
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {/* Communication Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-2 italic">
            Engagement
          </h3>
          <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              <button
                onClick={() => setShowNotificationModal(true)}
                className="w-full flex items-center justify-between p-7 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center border border-orange-500/10">
                    <Bell className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-[11px] uppercase tracking-widest">Lead Alerts</p>
                    <p className="text-[9px] font-medium text-slate-400 mt-0.5">Push & Email</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest italic">
                    {leadAlerts ? "Always" : "Off"}
                  </span>
                  <ChevronRight className="size-5 text-slate-300 group-hover:text-orange-600 transition-colors" />
                </div>
              </button>

              <button
                onClick={() => setShowVisibilityModal(true)}
                className="w-full flex items-center justify-between p-7 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/10">
                    <Globe className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-[11px] uppercase tracking-widest">Visibility</p>
                    <p className="text-[9px] font-medium text-slate-400 mt-0.5">Public Listing</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">
                    {isPubliclyListed ? "Listed" : "Hidden"}
                  </span>
                  <ChevronRight className="size-5 text-slate-300 group-hover:text-orange-600 transition-colors" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Access */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-2 italic">
            Access
          </h3>
          <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between p-7 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/10">
                    <Lock className="size-5" />
                  </div>
                  <p className="font-black text-[11px] uppercase tracking-widest text-left">
                    Admin Password
                  </p>
                </div>
                <ChevronRight className="size-5 text-slate-300 group-hover:text-orange-600 transition-colors" />
              </button>

              <button
                onClick={() => setShowDevicesModal(true)}
                className="w-full flex items-center justify-between p-7 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-2xl bg-slate-500/10 text-slate-600 flex items-center justify-center border border-slate-500/10">
                    <Smartphone className="size-5" />
                  </div>
                  <p className="font-black text-[11px] uppercase tracking-widest text-left">
                    Fleet Devices
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
                    {activeDevicesCount.toString().padStart(2, "0")} Active
                  </span>
                  <ChevronRight className="size-5 text-slate-300 group-hover:text-orange-600 transition-colors" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full h-20 rounded-[3rem] bg-orange-600/5 text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all border border-slate-200 hover:bg-red-500 hover:text-white hover:border-red-500 group"
          >
            <LogOut className="size-5 group-hover:-translate-x-1 transition-transform" />
            Exit Admin Console
          </button>
        </div>
      </div>

      <div className="text-center pb-8 opacity-40">
        <p className="text-[10px] font-black uppercase tracking-widest">App ID: LOG_PRO_V1</p>
      </div>

      {/* Notification Settings Modal */}
      {showNotificationModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNotificationModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black">Lead Alert Settings</h3>
                <p className="text-xs text-slate-500 mt-1">Manage your notification preferences</p>
              </div>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="size-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="text-sm font-black">Lead Alerts</p>
                  <p className="text-xs text-slate-500 mt-0.5">Get notified for new leads</p>
                </div>
                <button
                  onClick={() => setLeadAlerts(!leadAlerts)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${leadAlerts ? "bg-orange-600" : "bg-slate-300"}`}
                >
                  <div
                    className={`absolute top-1 left-1 size-5 rounded-full bg-white transition-transform ${leadAlerts ? "translate-x-7" : ""}`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="text-sm font-black">Email Notifications</p>
                  <p className="text-xs text-slate-500 mt-0.5">Receive updates via email</p>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${emailNotifications ? "bg-orange-600" : "bg-slate-300"}`}
                >
                  <div
                    className={`absolute top-1 left-1 size-5 rounded-full bg-white transition-transform ${emailNotifications ? "translate-x-7" : ""}`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="text-sm font-black">Push Notifications</p>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time mobile alerts</p>
                </div>
                <button
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${pushNotifications ? "bg-orange-600" : "bg-slate-300"}`}
                >
                  <div
                    className={`absolute top-1 left-1 size-5 rounded-full bg-white transition-transform ${pushNotifications ? "translate-x-7" : ""}`}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowNotificationModal(false)}
              className="w-full mt-6 px-4 py-3 rounded-xl bg-orange-600 text-white font-black text-sm uppercase tracking-widest hover:bg-orange-700 active:scale-95 transition-all shadow-lg shadow-orange-600/20"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Visibility Modal */}
      {showVisibilityModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowVisibilityModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black">Public Visibility</h3>
                <p className="text-xs text-slate-500 mt-1">Control your listing visibility</p>
              </div>
              <button
                onClick={() => setShowVisibilityModal(false)}
                className="size-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="size-5 text-emerald-600" />
                  <p className="text-sm font-black text-emerald-900">
                    Public Listing Status
                  </p>
                </div>
                <p className="text-xs text-emerald-700">
                  {isPubliclyListed
                    ? "Your logistics services are visible to all potential clients on the platform."
                    : "Your profile is hidden from public search. Only direct links will work."}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="text-sm font-black">Show in Public Directory</p>
                  <p className="text-xs text-slate-500 mt-0.5">Make your services discoverable</p>
                </div>
                <button
                  onClick={() => setIsPubliclyListed(!isPubliclyListed)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${isPubliclyListed ? "bg-emerald-600" : "bg-slate-300"}`}
                >
                  <div
                    className={`absolute top-1 left-1 size-5 rounded-full bg-white transition-transform ${isPubliclyListed ? "translate-x-7" : ""}`}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowVisibilityModal(false)}
              className="w-full mt-6 px-4 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black">Change Password</h3>
                <p className="text-xs text-slate-500 mt-1">Update your admin password</p>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="size-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-600/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-600/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-600/20 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-black text-sm uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-amber-600 text-white font-black text-sm uppercase tracking-widest hover:bg-amber-700 active:scale-95 transition-all shadow-lg shadow-amber-600/20"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fleet Devices Modal */}
      {showDevicesModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDevicesModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black">Fleet Devices</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {activeDevicesCount} active • {devices.length - activeDevicesCount} inactive
                </p>
              </div>
              <button
                onClick={() => setShowDevicesModal(false)}
                className="size-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`size-12 rounded-xl flex items-center justify-center ${device.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-300/10 text-slate-400"}`}
                    >
                      <Smartphone className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black">{device.name}</p>
                      <p className="text-xs text-slate-500">{device.driver}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Last active: {device.lastActive}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${device.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-300/10 text-slate-500"}`}
                    >
                      {device.status}
                    </span>
                    <button
                      onClick={() => handleRemoveDevice(device.id)}
                      className="size-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowDevicesModal(false)}
              className="w-full mt-6 px-4 py-3 rounded-xl bg-slate-600 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-700 active:scale-95 transition-all shadow-lg shadow-slate-600/20"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="size-8 text-red-600" />
              </div>
              <h3 className="text-xl font-black mb-2">Exit Admin Console?</h3>
              <p className="text-sm text-slate-600">
                You will be logged out and redirected to the home page.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-black text-sm uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-black text-sm uppercase tracking-widest hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvideSettings;
