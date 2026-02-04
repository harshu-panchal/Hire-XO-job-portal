import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, Plus, Users, Mail, Calendar, MoreHorizontal, Edit2, Trash2, X } from "lucide-react";

interface Employer {
    id: string;
    name: string;
    company: string;
    email: string;
    status: "Active" | "Inactive";
    joinedDate: string;
    jobsPosted: number;
}

const employersData: Employer[] = [
    { id: "R001", name: "Rahul Sharma", company: "TechCorp India", email: "rahul@techcorp.in", status: "Active", joinedDate: "Jan 15, 2024", jobsPosted: 12 },
    { id: "R002", name: "Priya Patel", company: "InnovateTech", email: "priya@innovate.com", status: "Active", joinedDate: "Feb 20, 2024", jobsPosted: 8 },
    { id: "R003", name: "Amit Kumar", company: "StartupHub", email: "amit@startuphub.io", status: "Inactive", joinedDate: "Mar 10, 2024", jobsPosted: 3 },
    { id: "R004", name: "Sneha Gupta", company: "GlobalHR Solutions", email: "sneha@globalhr.com", status: "Active", joinedDate: "Apr 5, 2024", jobsPosted: 15 },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
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

export default function Employers() {
    const [employers, setEmployers] = useState(employersData);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [editingEmployer, setEditingEmployer] = useState<Employer | null>(null);
    const [formData, setFormData] = useState<Partial<Employer>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const filteredEmployers = employers.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "" || r.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this employer?")) {
            setEmployers(employers.filter(r => r.id !== id));
        }
    };

    const handleOpenModal = (employer?: Employer) => {
        if (employer) {
            setEditingEmployer(employer);
            setFormData(employer);
        } else {
            setEditingEmployer(null);
            setFormData({ status: "Active" });
        }
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        if (editingEmployer) {
            setEmployers(employers.map(r => r.id === editingEmployer.id ? { ...r, ...formData } as Employer : r));
        } else {
            const newEmployer: Employer = {
                id: `R${String(employers.length + 1).padStart(3, '0')}`,
                name: formData.name || "",
                company: formData.company || "",
                email: formData.email || "",
                status: (formData.status as "Active" | "Inactive") || "Active",
                joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                jobsPosted: 0
            };
            setEmployers([newEmployer, ...employers]);
        }

        setIsSaving(false);
        setShowModal(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Employers</h1>
                    <p className="text-slate-500 dark:text-white/60 mt-1">Manage all registered employers</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Employer
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search employers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/10 p-4">
                    <p className="text-sm text-slate-500 dark:text-white/50">Total Employers</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{employers.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/10 p-4">
                    <p className="text-sm text-slate-500 dark:text-white/50">Active</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{employers.filter(r => r.status === "Active").length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/10 p-4">
                    <p className="text-sm text-slate-500 dark:text-white/50">Inactive</p>
                    <p className="text-2xl font-bold text-slate-400 mt-1">{employers.filter(r => r.status === "Inactive").length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/10 p-4">
                    <p className="text-sm text-slate-500 dark:text-white/50">Total Jobs Posted</p>
                    <p className="text-2xl font-bold text-primary mt-1">{employers.reduce((acc, r) => acc + r.jobsPosted, 0)}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-white/10">
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Employer</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Company</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Joined</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Jobs</th>
                                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredEmployers.map((employer) => (
                                    <motion.tr
                                        key={employer.id}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="show"
                                        exit={{ opacity: 0, x: -20 }}
                                        className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                                    {employer.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{employer.name}</p>
                                                    <p className="text-sm text-slate-500 dark:text-white/50">{employer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-white/70">{employer.company}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${employer.status === 'Active'
                                                ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                                                : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/50'
                                                }`}>
                                                {employer.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-white/70">{employer.joinedDate}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{employer.jobsPosted}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(employer)}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4 text-slate-500 dark:text-white/50" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(employer.id)}
                                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredEmployers.length === 0 && (
                    <div className="py-12 text-center">
                        <Users className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-white/50">No employers found</p>
                    </div>
                )}
            </div>

            {/* Add Employer Modal */}
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
                                    {editingEmployer ? "Edit Employer" : "Add New Employer"}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name || ""}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Company</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.company || ""}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email || ""}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        {editingEmployer ? "Save Changes" : "Add Employer"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
