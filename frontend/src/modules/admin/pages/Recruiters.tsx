import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, Plus, Users, Mail, Calendar, MoreHorizontal, Edit2, Trash2, X } from "lucide-react";

interface Recruiter {
    id: string;
    name: string;
    company: string;
    email: string;
    status: "Active" | "Inactive";
    joinedDate: string;
    jobsPosted: number;
}

const recruitersData: Recruiter[] = [
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

export default function Recruiters() {
    const [recruiters, setRecruiters] = useState(recruitersData);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);

    const filteredRecruiters = recruiters.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this recruiter?")) {
            setRecruiters(recruiters.filter(r => r.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Recruiters</h1>
                    <p className="text-slate-500 dark:text-white/60 mt-1">Manage all registered recruiters</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Recruiter
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search recruiters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <select className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/10 p-4">
                    <p className="text-sm text-slate-500 dark:text-white/50">Total Recruiters</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{recruiters.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/10 p-4">
                    <p className="text-sm text-slate-500 dark:text-white/50">Active</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{recruiters.filter(r => r.status === "Active").length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/10 p-4">
                    <p className="text-sm text-slate-500 dark:text-white/50">Inactive</p>
                    <p className="text-2xl font-bold text-slate-400 mt-1">{recruiters.filter(r => r.status === "Inactive").length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/10 p-4">
                    <p className="text-sm text-slate-500 dark:text-white/50">Total Jobs Posted</p>
                    <p className="text-2xl font-bold text-primary mt-1">{recruiters.reduce((acc, r) => acc + r.jobsPosted, 0)}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-white/10">
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Recruiter</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Company</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Joined</th>
                                <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Jobs</th>
                                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredRecruiters.map((recruiter) => (
                                    <motion.tr
                                        key={recruiter.id}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="show"
                                        exit={{ opacity: 0, x: -20 }}
                                        className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                                    {recruiter.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{recruiter.name}</p>
                                                    <p className="text-sm text-slate-500 dark:text-white/50">{recruiter.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-white/70">{recruiter.company}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${recruiter.status === 'Active'
                                                    ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                                                    : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/50'
                                                }`}>
                                                {recruiter.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-white/70">{recruiter.joinedDate}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{recruiter.jobsPosted}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4 text-slate-500 dark:text-white/50" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(recruiter.id)}
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

                {filteredRecruiters.length === 0 && (
                    <div className="py-12 text-center">
                        <Users className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-white/50">No recruiters found</p>
                    </div>
                )}
            </div>

            {/* Add Recruiter Modal */}
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
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add New Recruiter</h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Full Name</label>
                                    <input type="text" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Company</label>
                                    <input type="text" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Email</label>
                                    <input type="email" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                                    Add Recruiter
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
