import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, Plus, Shield, Edit2, Trash2, X, CheckCircle, Upload, Download, Eye } from "lucide-react";

interface Certificate {
    id: string;
    name: string;
    issuer: string;
    issuedTo: string;
    issueDate: string;
    expiryDate: string;
    status: "Active" | "Expired" | "Revoked";
}

const certificatesData: Certificate[] = [
    { id: "CERT001", name: "Verified Recruiter", issuer: "Hire-XO", issuedTo: "TechCorp India", issueDate: "Jan 15, 2024", expiryDate: "Jan 15, 2025", status: "Active" },
    { id: "CERT002", name: "Premium Partner", issuer: "Hire-XO", issuedTo: "InnovateTech", issueDate: "Dec 10, 2023", expiryDate: "Dec 10, 2024", status: "Active" },
    { id: "CERT003", name: "Trusted Employer", issuer: "Hire-XO", issuedTo: "GlobalHR Solutions", issueDate: "Jun 20, 2023", expiryDate: "Jun 20, 2024", status: "Expired" },
    { id: "CERT004", name: "Verified Recruiter", issuer: "Hire-XO", issuedTo: "StartupHub", issueDate: "Mar 05, 2024", expiryDate: "Mar 05, 2025", status: "Active" },
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

export default function Certificates() {
    const [certificates, setCertificates] = useState(certificatesData);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);

    const filteredCertificates = certificates.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.issuedTo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this certificate?")) {
            setCertificates(certificates.filter(c => c.id !== id));
        }
    };

    const activeCount = certificates.filter(c => c.status === "Active").length;
    const expiredCount = certificates.filter(c => c.status === "Expired").length;

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
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Certificates</h1>
                    <p className="text-slate-500 dark:text-white/60 mt-1">Manage verification certificates</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Issue Certificate
                </button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{certificates.length}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Total Certificates</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-500/20">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Active</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-500/20">
                            <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{expiredCount}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Expired</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20">
                            <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">1,240</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Downloads</p>
                </div>
            </motion.div>

            {/* Search */}
            <motion.div variants={itemVariants} className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search certificates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </motion.div>

            {/* Certificates Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map((cert) => (
                    <div key={cert.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cert.status === 'Active'
                                    ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                                    : cert.status === 'Expired'
                                        ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                                        : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                                }`}>
                                {cert.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{cert.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-white/50 mb-4">Issued to: {cert.issuedTo}</p>

                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-white/50">Certificate ID</span>
                                <span className="font-mono text-slate-900 dark:text-white">{cert.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-white/50">Issue Date</span>
                                <span className="text-slate-900 dark:text-white">{cert.issueDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-white/50">Expiry Date</span>
                                <span className="text-slate-900 dark:text-white">{cert.expiryDate}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <Eye className="w-4 h-4" />
                                View
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                            <button
                                onClick={() => handleDelete(cert.id)}
                                className="px-3 py-2 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </motion.div>

            {filteredCertificates.length === 0 && (
                <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10">
                    <Shield className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-white/50">No certificates found</p>
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
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 shadow-xl z-50 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Issue New Certificate</h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Certificate Type</label>
                                    <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                                        <option>Verified Recruiter</option>
                                        <option>Premium Partner</option>
                                        <option>Trusted Employer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Issue To (Company)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Issue Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Expiry Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                                    Issue Certificate
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
