import { useState } from "react";
import { Bell, Lock, Smartphone, Globe, LogOut, ChevronRight, X, Eye, EyeOff, AlertCircle, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

interface Device {
    id: number;
    name: string;
    type: string;
    lastActive: string;
    status: "Active" | "Inactive";
}

const ProvideSettings = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    // State for modals
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showVisibilityModal, setShowVisibilityModal] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [showDevicesModal, setShowDevicesModal] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // State for settings
    const [bookingAlerts, setBookingAlerts] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [isOnline, setIsOnline] = useState(true);

    // PIN state
    const [pinData, setPinData] = useState({
        currentPin: "",
        newPin: "",
        confirmPin: ""
    });
    const [showCurrentPin, setShowCurrentPin] = useState(false);
    const [showNewPin, setShowNewPin] = useState(false);
    const [showConfirmPin, setShowConfirmPin] = useState(false);

    // Devices state
    const [devices, setDevices] = useState<Device[]>([
        { id: 1, name: "iPhone 14 Pro", type: "Mobile", lastActive: "2 mins ago", status: "Active" },
        { id: 2, name: "MacBook Pro", type: "Desktop", lastActive: "5 mins ago", status: "Active" },
        { id: 3, name: "iPad Air", type: "Tablet", lastActive: "1 hour ago", status: "Active" },
        { id: 4, name: "Samsung Galaxy", type: "Mobile", lastActive: "2 days ago", status: "Inactive" },
        { id: 5, name: "Windows PC", type: "Desktop", lastActive: "1 week ago", status: "Inactive" }
    ]);

    const handlePinChange = () => {
        if (pinData.newPin !== pinData.confirmPin) {
            alert("New PIN and confirmation don't match!");
            return;
        }
        if (pinData.newPin.length < 4) {
            alert("PIN must be at least 4 digits!");
            return;
        }
        alert("Security PIN updated successfully!");
        setShowPinModal(false);
        setPinData({ currentPin: "", newPin: "", confirmPin: "" });
    };

    const handleRemoveDevice = (deviceId: number) => {
        if (confirm("Are you sure you want to remove this device?")) {
            setDevices(devices.filter(d => d.id !== deviceId));
            alert("Device removed successfully!");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const activeDeviceCount = devices.filter(d => d.status === "Active").length;

    return (
        <div className="py-6 space-y-10 select-none">
            {/* Header */}
            <div className="space-y-1 px-1">
                <h1 className="text-3xl font-black tracking-tighter skew-x-[-4deg]">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] px-1">
                    Vehicle Provider Console
                </p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-8">
                {/* Communication Section */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-2 italic">Engagement</h3>
                    <div className="bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            <button
                                onClick={() => setShowNotificationModal(true)}
                                className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/10">
                                        <Bell className="size-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-[11px] uppercase tracking-widest">Booking Alerts</p>
                                        <p className="text-[9px] font-medium text-slate-400 mt-0.5">Push & Email</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest italic">
                                        {bookingAlerts ? "Always" : "Off"}
                                    </span>
                                    <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </button>

                            <button
                                onClick={() => setShowVisibilityModal(true)}
                                className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/10">
                                        <Globe className="size-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-[11px] uppercase tracking-widest">Marketplace</p>
                                        <p className="text-[9px] font-medium text-slate-400 mt-0.5">Visibility Status</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">
                                        {isOnline ? "Online" : "Offline"}
                                    </span>
                                    <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Privacy & Access */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-2 italic">Access</h3>
                    <div className="bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            <button
                                onClick={() => setShowPinModal(true)}
                                className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/10">
                                        <Lock className="size-5" />
                                    </div>
                                    <p className="font-black text-[11px] uppercase tracking-widest text-left">Security Pin</p>
                                </div>
                                <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                            </button>

                            <button
                                onClick={() => setShowDevicesModal(true)}
                                className="w-full flex items-center justify-between p-7 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-2xl bg-slate-500/10 text-slate-600 flex items-center justify-center border border-slate-500/10">
                                        <Smartphone className="size-5" />
                                    </div>
                                    <p className="font-black text-[11px] uppercase tracking-widest text-left">Linked Devices</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
                                        {activeDeviceCount.toString().padStart(2, '0')} Active
                                    </span>
                                    <ChevronRight className="size-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-4">
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full h-20 rounded-[3rem] bg-blue-600/5 text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all border border-slate-200 dark:border-white/10 hover:bg-red-500 hover:text-white hover:border-red-500 group"
                    >
                        <LogOut className="size-5 group-hover:-translate-x-1 transition-transform" />
                        Exit Admin Console
                    </button>
                </div>
            </div>

            <div className="text-center pb-8 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-widest">App ID: VEH_PRO_V1</p>
            </div>

            {/* Notification Settings Modal */}
            {showNotificationModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNotificationModal(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black">Booking Alert Settings</h3>
                                <p className="text-xs text-slate-500 mt-1">Manage your notification preferences</p>
                            </div>
                            <button
                                onClick={() => setShowNotificationModal(false)}
                                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <div>
                                    <p className="text-sm font-black">Booking Alerts</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Get notified for new bookings</p>
                                </div>
                                <button
                                    onClick={() => setBookingAlerts(!bookingAlerts)}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${bookingAlerts ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}
                                >
                                    <div className={`absolute top-1 left-1 size-6 bg-white rounded-full transition-transform ${bookingAlerts ? "translate-x-6" : ""}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <div>
                                    <p className="text-sm font-black">Email Notifications</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Receive updates via email</p>
                                </div>
                                <button
                                    onClick={() => setEmailNotifications(!emailNotifications)}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${emailNotifications ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}
                                >
                                    <div className={`absolute top-1 left-1 size-6 bg-white rounded-full transition-transform ${emailNotifications ? "translate-x-6" : ""}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <div>
                                    <p className="text-sm font-black">Push Notifications</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Real-time mobile alerts</p>
                                </div>
                                <button
                                    onClick={() => setPushNotifications(!pushNotifications)}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${pushNotifications ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}
                                >
                                    <div className={`absolute top-1 left-1 size-6 bg-white rounded-full transition-transform ${pushNotifications ? "translate-x-6" : ""}`} />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setShowNotificationModal(false);
                                alert("Notification settings saved!");
                            }}
                            className="w-full mt-6 px-4 py-3 rounded-xl bg-blue-600 text-white font-black text-sm uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Visibility Modal */}
            {showVisibilityModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowVisibilityModal(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black">Marketplace Visibility</h3>
                                <p className="text-xs text-slate-500 mt-1">Control your online presence</p>
                            </div>
                            <button
                                onClick={() => setShowVisibilityModal(false)}
                                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className={`p-4 rounded-2xl mb-6 ${isOnline ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900" : "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10"}`}>
                            <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isOnline ? "text-emerald-600" : "text-slate-500"}`}>
                                {isOnline ? "Currently Online" : "Currently Offline"}
                            </p>
                            <p className={`text-sm ${isOnline ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}>
                                {isOnline
                                    ? "Your vehicles are visible to customers in the marketplace."
                                    : "Your vehicles are hidden from the marketplace."}
                            </p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-6">
                            <div>
                                <p className="text-sm font-black">Marketplace Status</p>
                                <p className="text-xs text-slate-500 mt-0.5">Show vehicles to customers</p>
                            </div>
                            <button
                                onClick={() => setIsOnline(!isOnline)}
                                className={`relative w-14 h-8 rounded-full transition-colors ${isOnline ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-600"}`}
                            >
                                <div className={`absolute top-1 left-1 size-6 bg-white rounded-full transition-transform ${isOnline ? "translate-x-6" : ""}`} />
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                setShowVisibilityModal(false);
                                alert("Visibility settings saved!");
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Security PIN Modal */}
            {showPinModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPinModal(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black">Change Security PIN</h3>
                                <p className="text-xs text-slate-500 mt-1">Update your account security PIN</p>
                            </div>
                            <button
                                onClick={() => setShowPinModal(false)}
                                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Current PIN</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPin ? "text" : "password"}
                                        value={pinData.currentPin}
                                        onChange={(e) => setPinData({ ...pinData, currentPin: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-blue-600 transition-all"
                                        placeholder="Enter current PIN"
                                    />
                                    <button
                                        onClick={() => setShowCurrentPin(!showCurrentPin)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showCurrentPin ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">New PIN</label>
                                <div className="relative">
                                    <input
                                        type={showNewPin ? "text" : "password"}
                                        value={pinData.newPin}
                                        onChange={(e) => setPinData({ ...pinData, newPin: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-blue-600 transition-all"
                                        placeholder="Enter new PIN"
                                    />
                                    <button
                                        onClick={() => setShowNewPin(!showNewPin)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showNewPin ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Confirm New PIN</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPin ? "text" : "password"}
                                        value={pinData.confirmPin}
                                        onChange={(e) => setPinData({ ...pinData, confirmPin: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-blue-600 transition-all"
                                        placeholder="Confirm new PIN"
                                    />
                                    <button
                                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPin ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowPinModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePinChange}
                                className="flex-1 px-4 py-3 rounded-xl bg-amber-600 text-white font-black text-sm uppercase tracking-widest hover:bg-amber-700 active:scale-95 transition-all shadow-lg shadow-amber-600/20"
                            >
                                Update PIN
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Linked Devices Modal */}
            {showDevicesModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDevicesModal(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black">Linked Devices</h3>
                                <p className="text-xs text-slate-500 mt-1">{activeDeviceCount} active • {devices.length - activeDeviceCount} inactive</p>
                            </div>
                            <button
                                onClick={() => setShowDevicesModal(false)}
                                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {devices.map((device) => (
                                <div key={device.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 rounded-xl flex items-center justify-center ${device.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-200 dark:bg-slate-700 text-slate-400"}`}>
                                            <Smartphone className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black">{device.name}</p>
                                            <p className="text-xs text-slate-500">{device.type} • {device.lastActive}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${device.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
                                            {device.status}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveDevice(device.id)}
                                            className="size-8 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center hover:bg-red-500/20 active:scale-95 transition-all"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowDevicesModal(false)}
                            className="w-full mt-6 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLogoutConfirm(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="size-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-black mb-2">Exit Admin Console?</h3>
                            <p className="text-sm text-slate-500">You will be logged out and redirected to the home page.</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-black text-sm uppercase tracking-widest hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-600/20"
                            >
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
