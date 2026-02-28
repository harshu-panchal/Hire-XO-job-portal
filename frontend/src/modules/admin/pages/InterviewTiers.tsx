import { useEffect, useState } from "react";
import { Check, CreditCard, Edit2, Loader2, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiConfig";
import { interviewTierService } from "@/services/interviewTierService";
import type { SubscriptionPlan } from "@/types";

export default function InterviewTiers() {
  const [tiers, setTiers] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTier, setEditingTier] = useState<SubscriptionPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationDays: "30",
    maxScheduleDays: "",
    description: "",
    features: "",
    razorpayPlanId: "",
  });

  const getTierPresentation = (tier: SubscriptionPlan) => {
    const days = Number(tier.maxScheduleDays || 0);
    if (days <= 7) {
      return {
        label: "UP TO 7 DAYS",
        accent: "border-amber-200 bg-amber-50",
        stripe: "bg-amber-500",
        text: "text-amber-600",
      };
    }
    if (days <= 15) {
      return {
        label: "7-15 DAYS",
        accent: "border-blue-200 bg-blue-50/40",
        stripe: "bg-blue-500",
        text: "text-blue-600",
      };
    }
    return {
      label: "15-30 DAYS",
      accent: "border-violet-200 bg-violet-50/40",
      stripe: "bg-violet-500",
      text: "text-violet-600",
    };
  };

  const fetchTiers = async () => {
    setIsLoading(true);
    try {
      const data = await interviewTierService.getAdminTiers();
      setTiers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const bootstrapDefaults = async (silent = false) => {
    setIsBootstrapping(true);
    try {
      const result = await interviewTierService.bootstrapDefaults();
      if (!silent) {
        toast.success(result.message || "Interview tiers bootstrapped");
      }
    } catch (error) {
      if (!silent) {
        toast.error(getErrorMessage(error));
      }
    } finally {
      setIsBootstrapping(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        let data = await interviewTierService.getAdminTiers();
        if (!Array.isArray(data) || data.length === 0) {
          await bootstrapDefaults(true);
          data = await interviewTierService.getAdminTiers();
        }
        setTiers(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!showModal) return;
    if (!editingTier) {
      setFormData({
        name: "",
        price: "",
        durationDays: "30",
        maxScheduleDays: "",
        description: "",
        features: "",
        razorpayPlanId: "",
      });
      return;
    }

    setFormData({
      name: editingTier.name,
      price: String(editingTier.price),
      durationDays: String(editingTier.durationDays),
      maxScheduleDays: String(editingTier.maxScheduleDays || ""),
      description: editingTier.description,
      features: (editingTier.features || []).join("\n"),
      razorpayPlanId: editingTier.razorpayPlanId || "",
    });
  }, [editingTier, showModal]);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this interview tier?")) return;
    try {
      await interviewTierService.deleteTier(id);
      toast.success("Interview tier deleted");
      fetchTiers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.durationDays || !formData.maxScheduleDays || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    const maxScheduleDays = Number(formData.maxScheduleDays);
    if (!Number.isFinite(maxScheduleDays) || maxScheduleDays <= 0) {
      toast.error("SLA window must be greater than 0");
      return;
    }

    setIsSaving(true);
    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      durationDays: Number(formData.durationDays),
      maxScheduleDays,
      description: formData.description.trim(),
      features: formData.features.split("\n").map((f) => f.trim()).filter(Boolean),
      type: "job-seeker" as const,
      razorpayPlanId: formData.razorpayPlanId.trim() || undefined,
    };

    try {
      if (editingTier && (editingTier._id || editingTier.id)) {
        await interviewTierService.updateTier((editingTier._id || editingTier.id)!, payload);
        toast.success("Interview tier updated");
      } else {
        await interviewTierService.createTier(payload);
        toast.success("Interview tier created");
      }
      setShowModal(false);
      setEditingTier(null);
      fetchTiers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Interview Tiers</h1>
          <p className="text-slate-500 mt-1">Verification pricing tiers for interview SLA timeline</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              await bootstrapDefaults();
              await fetchTiers();
            }}
            disabled={isBootstrapping}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            {isBootstrapping ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Load Default Tiers
          </button>
          <button
            onClick={() => {
              setEditingTier(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Tier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{tiers.length}</p>
          <p className="text-sm text-slate-500 mt-1">Configured Paid Tiers</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm">
            <div className="absolute top-0 left-0 h-full w-1 bg-emerald-500" />
            <h4 className="text-2xl font-black text-slate-900 leading-none">Free Tier</h4>
            <div className="mt-3 text-4xl font-black leading-none text-slate-900">Rs0</div>
            <p className="mt-2 text-[10px] uppercase tracking-widest font-black text-slate-400">1 MONTH+</p>
            <p className="mt-3 text-xs text-slate-600">Default behavior without paid tier: employer interview scheduling starts only after 30 days from application date.</p>
          </div>

          {tiers.map((tier) => {
            const view = getTierPresentation(tier);
            return (
              <div
                key={tier._id || tier.id}
                className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${view.accent}`}
              >
                <div className={`absolute top-0 left-0 h-full w-1 ${view.stripe}`} />
                <h3 className="text-2xl font-black text-slate-900 leading-none">{tier.name}</h3>
                <div className="mt-3 text-4xl font-black leading-none text-slate-900">Rs{tier.price}</div>
                <p className={`mt-2 text-[10px] uppercase tracking-widest font-black ${view.text}`}>{view.label}</p>
                <p className="mt-3 text-xs text-slate-600">{tier.description}</p>

                <ul className="space-y-2 my-4">
                  {(tier.features || []).slice(0, 2).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingTier(tier);
                      setShowModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium bg-white/80 hover:bg-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tier._id || tier.id)}
                    className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium bg-white/80 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {tiers.length === 0 && (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">No interview tiers found. Use "Load Default Tiers".</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">{editingTier ? "Edit Interview Tier" : "Add Interview Tier"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tier Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Price</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (days)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.durationDays}
                    onChange={(e) => setFormData((prev) => ({ ...prev, durationDays: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">SLA (days)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.maxScheduleDays}
                    onChange={(e) => setFormData((prev) => ({ ...prev, maxScheduleDays: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Features (one per line)</label>
                <textarea
                  rows={4}
                  value={formData.features}
                  onChange={(e) => setFormData((prev) => ({ ...prev, features: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Plan ID</label>
                <input
                  type="text"
                  value={formData.razorpayPlanId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, razorpayPlanId: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  placeholder="e.g. plan_Nxxx"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingTier ? "Save Changes" : "Create Tier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
