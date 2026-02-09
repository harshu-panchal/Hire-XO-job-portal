import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Plus, Edit2, Trash2, X, Check, CreditCard, Users, Star, Loader2 } from "lucide-react";
import { adminService } from "../../../services/adminService";
import type { SubscriptionPlan } from "../../../types";
import { toast } from "sonner";
import apiClient, { getErrorMessage } from "../../../lib/apiConfig";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
} as const;

export default function EmployerPlans() {
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
  });

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getPlans('employer');
      setPlans(data);
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
      });
    } else {
      setFormData({
        name: "",
        price: "",
        durationDays: "30",
        description: "",
        features: "",
      });
    }
  }, [editingPlan, showModal]);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await adminService.deletePlan(id);
        toast.success("Plan deleted successfully");
        setPlans(plans.filter((p) => p._id !== id));
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
    const planData: Partial<SubscriptionPlan> = {
      name: formData.name,
      price: parseFloat(formData.price),
      durationDays: parseInt(formData.durationDays),
      description: formData.description,
      features: featuresArray,
      type: 'employer'
    };

    try {
      if (editingPlan && editingPlan._id) {
        const result = await adminService.updatePlan(editingPlan._id, planData);
        setPlans(plans.map((p) => (p._id === editingPlan._id ? result.plan : p)));
        toast.success("Plan updated successfully");
      } else {
        const result = await adminService.createPlan(planData);
        setPlans([...plans, result.plan]);
        toast.success("Plan created successfully");
      }
      setShowModal(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Employer Plans</h1>
          <p className="text-slate-500 mt-1">
            Manage subscription plans for employers/recruiters
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
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{plans.length}</p>
          <p className="text-sm text-slate-500 mt-1">Active Plans</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 opacity-50">
          <p className="text-sm text-slate-500">Stats coming soon</p>
        </div>
      </motion.div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`bg-white rounded-xl border p-6 relative border-slate-200`}
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1 h-10 overflow-hidden">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900">
                    ₹{plan.price}
                  </span>
                  <span className="text-slate-500">/{plan.durationDays} days</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.slice(0, 5).map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-sm text-slate-600"
                  >
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {plan.features.length > 5 && (
                  <li className="text-xs text-slate-400 pl-7">+{plan.features.length - 5} more</li>
                )}
              </ul>

              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="px-4 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingPlan ? "Edit Plan" : "Add New Plan"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g. Corporate Plan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Short description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Features (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Feature 1&#10;Feature 2"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingPlan ? "Save Changes" : "Create Plan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
