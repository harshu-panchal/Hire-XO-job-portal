import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Check, CreditCard, Loader2 } from "lucide-react";
import { adminService } from "../../../services/adminService";
import type { SubscriptionPlan } from "../../../types";
import { toast } from "sonner";
import { getErrorMessage } from "../../../lib/apiConfig";

export default function EmployeePlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationDays: "30",
    description: "",
    features: "",
    razorpayPlanId: "",
  });

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getPlans("job-seeker");
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      toast.error("Failed to fetch plans");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (editingPlan) {
      setFormData({
        name: editingPlan.name,
        price: editingPlan.price.toString(),
        durationDays: editingPlan.durationDays.toString(),
        description: editingPlan.description,
        features: editingPlan.features.join("\n"),
        razorpayPlanId: editingPlan.razorpayPlanId || "",
      });
    } else {
      setFormData({
        name: "",
        price: "",
        durationDays: "30",
        description: "",
        features: "",
        razorpayPlanId: "",
      });
    }
  }, [editingPlan, showModal]);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await adminService.deletePlan(id);
        toast.success("Plan deleted successfully");
        fetchPlans();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    }
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.features || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSaving(true);
    const featuresArray = formData.features.split("\n").filter((f) => f.trim() !== "");
    const planData: any = {
      name: formData.name,
      price: parseFloat(formData.price),
      durationDays: parseInt(formData.durationDays),
      description: formData.description,
      features: featuresArray,
      razorpayPlanId: formData.razorpayPlanId,
      type: 'job-seeker'
    };

    try {
      if (editingPlan && (editingPlan._id || editingPlan.id)) {
        await adminService.updatePlan((editingPlan._id || editingPlan.id)!, planData);
        toast.success("Plan updated successfully");
      } else {
        await adminService.createPlan(planData);
        toast.success("Plan created successfully");
      }
      setShowModal(false);
      fetchPlans();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Employee Plans</h1>
          <p className="text-slate-500 mt-1">
            Manage subscription plans for employees
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPlan(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{plans.length}</p>
          <p className="text-sm text-slate-500 mt-1">Active Plans</p>
        </div>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id || plan.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1 min-h-[40px]">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900">₹{plan.price}</span>
                  <span className="text-slate-500">/{plan.durationDays} days</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                {plan.features?.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan._id || plan.id)}
                  className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">No plans found. Create one to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingPlan ? "Edit Plan" : "Add New Plan"}
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Premium Plan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Short description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Features (one per line)</label>
                <textarea
                  rows={4}
                  required
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Feature 1&#10;Feature 2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Razorpay Plan ID</label>
                <input
                  type="text"
                  value={formData.razorpayPlanId}
                  onChange={(e) => setFormData({ ...formData, razorpayPlanId: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. plan_Nxxx"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
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
