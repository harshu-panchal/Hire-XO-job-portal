import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, Plus, Edit2, Trash2, X, MapPin, Phone, Mail, ExternalLink } from "lucide-react";

interface ResourceItem {
    id: string;
    name: string;
    description: string;
    location: string;
    contact: string;
    email: string;
    status: "Active" | "Inactive";
}

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

interface ResourcePageProps {
    title: string;
    icon: React.ElementType;
}

export default function ResourcePage({ title, icon: Icon }: ResourcePageProps) {
    const [items, setItems] = useState<ResourceItem[]>([
        { id: "1", name: `${title.slice(0, -1)} Alpha`, description: "Premium service provider with extensive experience", location: "Mumbai, Maharashtra", contact: "+91 98765 43210", email: "contact@alpha.com", status: "Active" },
        { id: "2", name: `${title.slice(0, -1)} Beta`, description: "Trusted partner for enterprise solutions", location: "Delhi NCR", contact: "+91 87654 32109", email: "contact@beta.com", status: "Active" },
        { id: "3", name: `${title.slice(0, -1)} Gamma`, description: "Specializing in innovative approaches", location: "Bangalore, Karnataka", contact: "+91 76543 21098", email: "contact@gamma.com", status: "Inactive" },
    ]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (window.confirm(`Are you sure you want to delete this ${title.slice(0, -1).toLowerCase()}?`)) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleEdit = (item: ResourceItem) => {
        setEditingItem(item);
        setShowModal(true);
    };

    const activeCount = items.filter(i => i.status === "Active").length;

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
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-white/60 mt-1">Manage all {title.toLowerCase()}</p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add {title.slice(0, -1)}
                </button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{items.length}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Total {title}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Active</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <p className="text-2xl font-bold text-slate-400">{items.length - activeCount}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Inactive</p>
                </div>
            </motion.div>

            {/* Search */}
            <motion.div variants={itemVariants} className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder={`Search ${title.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </motion.div>

            {/* Items Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'Active'
                                    ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                                    : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/50'
                                }`}>
                                {item.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-white/50 mb-4 line-clamp-2">{item.description}</p>

                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-white/60">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {item.location}
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-white/60">
                                <Phone className="w-4 h-4 text-slate-400" />
                                {item.contact}
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-white/60">
                                <Mail className="w-4 h-4 text-slate-400" />
                                {item.email}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                            <button
                                onClick={() => handleEdit(item)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="px-3 py-2 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </motion.div>

            {filteredItems.length === 0 && (
                <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10">
                    <Icon className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-white/50">No {title.toLowerCase()} found</p>
                </div>
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
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 shadow-xl z-50 p-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {editingItem ? `Edit ${title.slice(0, -1)}` : `Add New ${title.slice(0, -1)}`}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Name</label>
                                    <input
                                        type="text"
                                        defaultValue={editingItem?.name}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Description</label>
                                    <textarea
                                        rows={3}
                                        defaultValue={editingItem?.description}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Location</label>
                                    <input
                                        type="text"
                                        defaultValue={editingItem?.location}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Contact</label>
                                        <input
                                            type="tel"
                                            defaultValue={editingItem?.contact}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            defaultValue={editingItem?.email}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Status</label>
                                    <select
                                        defaultValue={editingItem?.status || "Active"}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                                    {editingItem ? 'Save Changes' : `Add ${title.slice(0, -1)}`}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
