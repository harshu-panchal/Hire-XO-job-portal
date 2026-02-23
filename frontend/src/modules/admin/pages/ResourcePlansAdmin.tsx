import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Check, CreditCard, Loader2, Package } from "lucide-react";
import { adminService } from "../../../services/adminService";
import type { SubscriptionPlan } from "../../../types";
import { toast } from "sonner";
import { getErrorMessage } from "../../../lib/apiConfig";

export default function ResourcePlansAdmin() {
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
            const data = await adminService.getPlans('resource');
            setPlans(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch resource plans:", error);
            toast.error("Failed to fetch resource plans");
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
        if (window.confirm("Are you sure you want to delete this resource plan?")) {
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
            type: 'resource'
        };

        try {
            if (editingPlan && (editingPlan._id || editingPlan.id)) {
                await adminService.updatePlan((editingPlan._id || editingPlan.id)!, planData);
                toast.success("Resource plan updated successfully");
            } else {
                await adminService.createPlan(planData);
                toast.success("Resource plan created successfully");
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
                    <h1 className="text-2xl font-semibold text-slate-900">Resource Plans</h1>
                    <p className="text-slate-500 mt-1">
                        Manage dynamic subscription plans for the resource section
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
                    Add Resource Plan
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-purple-100">
                            <Package className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{plans.length}</p>
                    <p className="text-sm text-slate-500 mt-1">Total Resource Plans</p>
                </div>
            </div>

            {/* Plans Grid */}
            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                    {plans.map((plan) => (
                        <div
                            key={plan._id || plan.id}
                            className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm border border-primary/10">Type: Resource</div>
                            </div>

                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                                <p className="text-sm text-slate-500 mt-1 min-h-[40px] text-left line-clamp-2">{plan.description}</p>
                                <div className="mt-4 flex items-center justify-center gap-1">
                                    <span className="text-3xl font-bold text-slate-900">₹{plan.price}</span>
                                    <span className="text-slate-400 text-sm font-medium">/{plan.durationDays} Days</span>
                                </div>
                            </div>

                            <ul className="space-y-2.5 mb-6 flex-grow">
                                {plan.features?.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3 text-xs text-slate-600 leading-snug">
                                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex gap-2 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => handleEdit(plan)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(plan._id || plan.id)}
                                    className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {plans.length === 0 && (
                        <div className="col-span-full py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No resource plans found.</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="mt-4 text-primary font-bold text-sm hover:underline"
                            >
                                Create your first plan
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                    {editingPlan ? "Edit Resource Plan" : "Add New Resource Plan"}
                                </h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Plan Configuration</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Plan Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                                    placeholder="e.g. Tender Access Plan"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Description</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                                    placeholder="What does this plan offer?"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Duration (Days)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.durationDays}
                                        onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Features (one per line)</label>
                                <textarea
                                    rows={4}
                                    required
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm resize-none"
                                    placeholder="Full Tender Access&#10;Verified Badge&#10;5 Free Contacts"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Razorpay Plan ID</label>
                                <input
                                    type="text"
                                    value={formData.razorpayPlanId}
                                    onChange={(e) => setFormData({ ...formData, razorpayPlanId: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                                    placeholder="e.g. plan_Nxxx"
                                />
                            </div>
                            <div className="flex gap-4 mt-10">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-4 border-2 border-slate-100 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                    {editingPlan ? "Update Plan" : "Create Plan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
