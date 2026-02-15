import { useEffect, useMemo, useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Loader2, Megaphone, Star } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiConfig";
import { promotionPlanService, type PromotionPlan } from "@/services/promotionPlanService";

type PromotionPlanForm = {
  name: string;
  price: string;
  duration: string;
  estimatedReachMin: string;
  estimatedReachMax: string;
  priority: string;
  features: string;
  isMostPopular: boolean;
  isActive: boolean;
};

const defaultForm: PromotionPlanForm = {
  name: "",
  price: "",
  duration: "7",
  estimatedReachMin: "",
  estimatedReachMax: "",
  priority: "1",
  features: "",
  isMostPopular: false,
  isActive: true,
};

export default function PromotionPlans() {
  const [plans, setPlans] = useState<PromotionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PromotionPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<PromotionPlanForm>(defaultForm);

  const stats = useMemo(() => {
    const active = plans.filter((p) => p.isActive).length;
    const inactive = plans.length - active;
    return { total: plans.length, active, inactive };
  }, [plans]);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await promotionPlanService.getAllPlans(false);
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    if (!showModal) return;
    if (!editingPlan) {
      setForm(defaultForm);
      return;
    }
    setForm({
      name: editingPlan.name,
      price: String(editingPlan.price),
      duration: String(editingPlan.duration),
      estimatedReachMin: String(editingPlan.estimatedReachMin),
      estimatedReachMax: String(editingPlan.estimatedReachMax),
      priority: String(editingPlan.priority),
      features: (editingPlan.features || []).join("\n"),
      isMostPopular: !!editingPlan.isMostPopular,
      isActive: !!editingPlan.isActive,
    });
  }, [editingPlan, showModal]);

  const handleEdit = (plan: PromotionPlan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleDelete = async (plan: PromotionPlan) => {
    if (!window.confirm(`Disable "${plan.name}" plan?`)) return;
    try {
      await promotionPlanService.deletePlan(plan._id);
      toast.success("Promotion plan disabled");
      loadPlans();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.duration || !form.estimatedReachMin || !form.estimatedReachMax || !form.priority) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      duration: Number(form.duration),
      estimatedReachMin: Number(form.estimatedReachMin),
      estimatedReachMax: Number(form.estimatedReachMax),
      priority: Number(form.priority),
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
      isMostPopular: form.isMostPopular,
      isActive: form.isActive,
    };

    if (payload.estimatedReachMin > payload.estimatedReachMax) {
      toast.error("Min reach cannot be greater than max reach");
      return;
    }

    setIsSaving(true);
    try {
      if (editingPlan) {
        await promotionPlanService.updatePlan(editingPlan._id, payload);
        toast.success("Promotion plan updated");
      } else {
        await promotionPlanService.createPlan(payload as Omit<PromotionPlan, "_id" | "isActive">);
        toast.success("Promotion plan created");
      }
      setShowModal(false);
      setEditingPlan(null);
      loadPlans();
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
          <h1 className="text-2xl font-semibold text-slate-900">Promotion Plans</h1>
          <p className="text-slate-500 mt-1">Manage plans used by employer Promote section</p>
        </div>
        <button
          onClick={() => {
            setEditingPlan(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Promotion Plan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-sm text-slate-500 mt-1">Total Plans</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-slate-500 mt-1">Active Plans</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-2xl font-bold text-amber-600">{stats.inactive}</p>
          <p className="text-sm text-slate-500 mt-1">Inactive Plans</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{plan.duration} days • Priority {plan.priority}</p>
                </div>
                <div className="flex gap-1">
                  {plan.isMostPopular && (
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 inline-flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Popular
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${plan.isActive ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-end gap-1">
                <span className="text-3xl font-bold text-slate-900">Rs {plan.price}</span>
              </div>
              <p className="mt-2 text-xs font-medium text-slate-500">
                Reach: {plan.estimatedReachMin} - {plan.estimatedReachMax}
              </p>

              <ul className="mt-4 space-y-2 min-h-[84px]">
                {(plan.features || []).slice(0, 3).map((feature, index) => (
                  <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2 pt-4 border-t border-slate-100 mt-4">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan)}
                  className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {plans.length === 0 && (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No promotion plans found.</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingPlan ? "Edit Promotion Plan" : "Add Promotion Plan"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Plan Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (Rs)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (days)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={form.duration}
                    onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Reach Min</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={form.estimatedReachMin}
                    onChange={(e) => setForm((p) => ({ ...p, estimatedReachMin: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Reach Max</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={form.estimatedReachMax}
                    onChange={(e) => setForm((p) => ({ ...p, estimatedReachMax: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={form.priority}
                    onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Features (one per line)</label>
                <textarea
                  rows={4}
                  value={form.features}
                  onChange={(e) => setForm((p) => ({ ...p, features: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isMostPopular}
                    onChange={(e) => setForm((p) => ({ ...p, isMostPopular: e.target.checked }))}
                  />
                  Mark as Most Popular
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  />
                  Plan Active
                </label>
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
                  {editingPlan ? "Save Changes" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

