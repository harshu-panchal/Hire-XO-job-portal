import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Lock } from "lucide-react";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const EmployerSecurity = () => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsUpdating(true);
    try {
      await authService.changePassword(form.currentPassword, form.newPassword);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="pb-32 min-h-screen">
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 px-4 sm:px-5 py-5 sm:py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all shadow-sm"
          >
            <ChevronLeft className="size-6" />
          </button>
          <h1 className="text-xl font-black tracking-tight">Security</h1>
        </div>
      </div>

      <div className="px-4 sm:px-5 space-y-8 w-full max-w-3xl mx-auto">
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">
            Change Password
          </h2>
          <div className="bg-white rounded-[2rem] border border-slate-200 p-5 space-y-4">
            <div className="flex items-center gap-4 pb-1">
              <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                <ShieldCheck className="size-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black">Account Password</p>
                <p className="text-[10px] font-bold text-slate-400">Keep your account protected</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Current Password
              </label>
              <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-primary/50 transition-all">
                <Lock className="size-5 text-slate-400" />
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                New Password
              </label>
              <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-primary/50 transition-all">
                <Lock className="size-5 text-slate-400" />
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Confirm New Password
              </label>
              <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-primary/50 transition-all">
                <Lock className="size-5 text-slate-400" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleUpdatePassword}
              disabled={isUpdating}
              className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Update Password"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployerSecurity;
