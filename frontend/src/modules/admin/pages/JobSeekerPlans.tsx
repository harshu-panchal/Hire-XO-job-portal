import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Plus, Edit2, Trash2, X, Check, CreditCard, Users, Star } from "lucide-react";

interface Plan {
    id: string;
    name: string;
    price: number;
    duration: string;
    features: string[];
    isPopular: boolean;
    subscribers: number;
}

const initialPlans: Plan[] = [
    {
        id: "1",
        name: "Basic",
        price: 299,
        duration: "month",
        features: ["5 Job Applications", "Basic Profile", "Email Support"],
        isPopular: false,
        subscribers: 1250
    },
    {
        id: "2",
        name: "Professional",
        price: 599,
        duration: "month",
        features: ["Unlimited Applications", "Featured Profile", "Priority Support", "Resume Builder"],
        isPopular: true,
        subscribers: 3420
    },
    {
        id: "3",
        name: "Premium",
        price: 999,
        duration: "month",
        features: ["Everything in Pro", "Career Coaching", "Interview Prep", "Salary Insights"],
        isPopular: false,
        subscribers: 890
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
} as const;

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    }
} as const;

export default function JobSeekerPlans() {
    const [plans, setPlans] = useState(initialPlans);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        duration: "month",
        features: ""
    });

    useEffect(() => {
        if (editingPlan) {
            setFormData({
                name: editingPlan.name,
                price: editingPlan.price.toString(),
                duration: editingPlan.duration,
                features: editingPlan.features.join('\n')
            });
        } else {
            setFormData({
                name: "",
                price: "",
                duration: "month",
                features: ""
            });
        }
    }, [editingPlan, showModal]);

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this plan?")) {
            setPlans(plans.filter(p => p.id !== id));
        }
    };

    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.price || !formData.features) {
            alert("Please fill in all fields");
            return;
        }

        const featuresArray = formData.features.split('\n').filter(f => f.trim() !== "");

        if (editingPlan) {
            setPlans(plans.map(p => p.id === editingPlan.id ? {
                ...p,
                name: formData.name,
                price: parseFloat(formData.price),
                duration: formData.duration,
                features: featuresArray
            } : p));
        } else {
            const newPlan: Plan = {
                id: Date.now().toString(),
                name: formData.name,
                price: parseFloat(formData.price),
                duration: formData.duration,
                features: featuresArray,
                isPopular: false,
                subscribers: 0
            };
            setPlans([...plans, newPlan]);
        }
        setShowModal(false);
    };

    const totalSubscribers = plans.reduce((acc, p) => acc + p.subscribers, 0);
    const totalRevenue = plans.reduce((acc, p) => acc + (p.price * p.subscribers), 0);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Job Seeker Plans</h1>
                    <p className="text-slate-500 dark:text-white/60 mt-1">Manage subscription plans for job seekers</p>
                </div>
                <button
                    onClick={() => { setEditingPlan(null); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Plan
                </button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{plans.length}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Active Plans</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-500/20">
                            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSubscribers.toLocaleString()}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Total Subscribers</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20">
                            <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Monthly Revenue</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-500/20">
                            <CreditCard className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{totalSubscribers > 0 ? Math.round(totalRevenue / totalSubscribers) : 0}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Avg. Revenue/User</p>
                </div>
            </motion.div>

            {/* Plans Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`bg-white dark:bg-slate-900 rounded-xl border p-6 relative ${plan.isPopular
                                ? 'border-primary ring-2 ring-primary/20'
                                : 'border-slate-200 dark:border-white/10'
                            }`}
                    >
                        {plan.isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                                Most Popular
                            </div>
                        )}

                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">₹{plan.price}</span>
                                <span className="text-slate-500 dark:text-white/50">/{plan.duration}</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-white/50 mt-2">
                                {plan.subscribers.toLocaleString()} subscribers
                            </p>
                        </div>

                        <ul className="space-y-3 mb-6">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3 text-sm text-slate-600 dark:text-white/70">
                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                            <button
                                onClick={() => handleEdit(plan)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(plan.id)}
                                className="px-4 py-2.5 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </motion.div>

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
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 shadow-xl z-50 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {editingPlan ? 'Edit Plan' : 'Add New Plan'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Plan Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Price (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Duration</label>
                                        <select
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            <option value="month">month</option>
                                            <option value="year">year</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Features (one per line)</label>
                                    <textarea
                                        rows={4}
                                        value={formData.features}
                                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    {editingPlan ? 'Save Changes' : 'Create Plan'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
