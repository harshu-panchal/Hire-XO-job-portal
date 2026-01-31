import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, Plus, Edit2, Trash2, X, MapPin, Phone, Mail, DollarSign, TrendingUp, HandCoins } from "lucide-react";

interface InvestorItem {
    id: string;
    name: string;
    description: string;
    location: string;
    contact: string;
    email: string;
    budget: string;
    status: "Active" | "Inactive";
}

interface SeekerItem {
    id: string;
    name: string;
    title: string;
    description: string;
    location: string;
    contact: string;
    email: string;
    amountNeeded: string;
    status: "Active" | "Funded" | "Pending";
}

const readyToInvestData: InvestorItem[] = [
    { id: "1", name: "Capital Ventures", description: "Early stage tech investor", location: "Mumbai, MH", contact: "+91 98765 43210", email: "contact@capital.com", budget: "₹5 Cr - ₹10 Cr", status: "Active" },
    { id: "2", name: "Growth Equity", description: "Focused on manufacturing startups", location: "Delhi, NCR", contact: "+91 87654 32109", email: "info@growth.com", budget: "₹10 Cr+", status: "Active" },
    { id: "3", name: "Angel Network", description: "Group of private angel investors", location: "Bangalore, KA", contact: "+91 76543 21098", email: "angels@network.com", budget: "₹50 L - ₹2 Cr", status: "Inactive" },
];

const needInvestmentData: SeekerItem[] = [
    { id: "1", name: "TechStart Sol", title: "AI Driven Recruitment", description: "Seed funding for AI platform expansion", location: "Pune, MH", contact: "+91 99887 76655", email: "founder@techstart.com", amountNeeded: "₹2 Cr", status: "Pending" },
    { id: "2", name: "BuildInfra", title: "Sustainable Construction", description: "Series A for green materials unit", location: "Hyderabad, TS", contact: "+91 88776 65544", email: "ceo@buildinfra.com", amountNeeded: "₹15 Cr", status: "Active" },
    { id: "3", name: "AgriTech One", title: "Smart Farming", description: "Pre-seed for drone technology", location: "Nagpur, MH", contact: "+91 77665 54433", email: "info@agritech.com", amountNeeded: "₹75 L", status: "Funded" },
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

export default function Investors() {
    const [activeTab, setActiveTab] = useState<"invest" | "seek">("invest");
    const [investors, setInvestors] = useState(readyToInvestData);
    const [seekers, setSeekers] = useState(needInvestmentData);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Form States
    const [investForm, setInvestForm] = useState<Partial<InvestorItem>>({});
    const [seekForm, setSeekForm] = useState<Partial<SeekerItem>>({});

    // Filter Logic
    const filteredInvestors = investors.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSeekers = seekers.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = activeTab === "invest"
        ? investors.filter(i => i.status === "Active").length
        : seekers.filter(i => i.status === "Active").length;

    const totalCount = activeTab === "invest" ? investors.length : seekers.length;

    const handleSave = () => {
        if (activeTab === "invest") {
            if (!investForm.name || !investForm.budget) return alert("Name and Budget are required");
            const newItem: InvestorItem = {
                id: Date.now().toString(),
                name: investForm.name,
                description: investForm.description || "",
                location: investForm.location || "",
                contact: investForm.contact || "",
                email: investForm.email || "",
                budget: investForm.budget,
                status: "Active"
            };
            setInvestors([...investors, newItem]);
        } else {
            if (!seekForm.name || !seekForm.title || !seekForm.amountNeeded) return alert("Startup Name, Title and Amount are required");
            const newItem: SeekerItem = {
                id: Date.now().toString(),
                name: seekForm.name,
                title: seekForm.title,
                description: seekForm.description || "",
                location: seekForm.location || "",
                contact: seekForm.contact || "",
                email: seekForm.email || "",
                amountNeeded: seekForm.amountNeeded,
                status: "Pending" // Default status for new requests
            };
            setSeekers([...seekers, newItem]);
        }
        setShowModal(false);
        setInvestForm({});
        setSeekForm({});
    };

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
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Investment</h1>
                    <p className="text-slate-500 dark:text-white/60 mt-1">Manage investment opportunities</p>
                </div>
                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-white/10">
                    <button
                        onClick={() => setActiveTab("invest")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "invest"
                            ? "bg-primary text-white shadow-sm"
                            : "text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5"
                            }`}
                    >
                        Ready to Invest
                    </button>
                    <button
                        onClick={() => setActiveTab("seek")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "seek"
                            ? "bg-primary text-white shadow-sm"
                            : "text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5"
                            }`}
                    >
                        Need Investment
                    </button>
                </div>
            </motion.div>

            {/* Sub-Header Actions */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={activeTab === "invest" ? "Search investment..." : "Search funding requests..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <button
                    onClick={() => {
                        setInvestForm({});
                        setSeekForm({});
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    {activeTab === "invest" ? "Add Investment" : "Post Request"}
                </button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            {activeTab === "invest" ? <HandCoins className="w-5 h-5 text-primary" /> : <TrendingUp className="w-5 h-5 text-primary" />}
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCount}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Total {activeTab === "invest" ? "Investment" : "Requests"}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">Active</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-5">
                    <p className="text-2xl font-bold text-slate-400">{totalCount - activeCount}</p>
                    <p className="text-sm text-slate-500 dark:text-white/50 mt-1">{activeTab === "invest" ? "Inactive" : "Closed/Pending"}</p>
                </div>
            </motion.div>

            {/* Content Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === "invest" ? filteredInvestors : filteredSeekers).map((item: any) => (
                    <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <DollarSign className="w-6 h-6 text-primary" />
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'Active' || item.status === 'Funded'
                                ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                                : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/50'
                                }`}>
                                {item.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            {activeTab === "invest" ? item.name : item.title}
                        </h3>
                        {activeTab === "seek" && (
                            <p className="text-xs font-medium text-primary mb-2">{item.name}</p>
                        )}
                        <p className="text-sm text-slate-500 dark:text-white/50 mb-4 line-clamp-2">{item.description}</p>

                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-white/60">
                                <DollarSign className="w-4 h-4 text-slate-400" />
                                <span className="font-semibold">{activeTab === "invest" ? item.budget : item.amountNeeded}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-white/60">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {item.location}
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-white/60">
                                <Phone className="w-4 h-4 text-slate-400" />
                                {item.contact}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                            <button className="px-3 py-2 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Empty State */}
            {((activeTab === "invest" ? filteredInvestors : filteredSeekers).length === 0) && (
                <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10">
                    <DollarSign className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-white/50">No results found</p>
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
                                    {activeTab === "invest" ? "Add New Investment" : "Post Funding Request"}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {activeTab === "invest" ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Investor Name</label>
                                        <input
                                            type="text"
                                            value={investForm.name || ""}
                                            onChange={e => setInvestForm({ ...investForm, name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="e.g. Venture Capital Ltd."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Budget Range</label>
                                            <input
                                                type="text"
                                                value={investForm.budget || ""}
                                                onChange={e => setInvestForm({ ...investForm, budget: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                placeholder="e.g. ₹5 Cr - ₹10 Cr"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Location</label>
                                            <input
                                                type="text"
                                                value={investForm.location || ""}
                                                onChange={e => setInvestForm({ ...investForm, location: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                placeholder="City, State"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Contact</label>
                                            <input
                                                type="tel"
                                                value={investForm.contact || ""}
                                                onChange={e => setInvestForm({ ...investForm, contact: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Email</label>
                                            <input
                                                type="email"
                                                value={investForm.email || ""}
                                                onChange={e => setInvestForm({ ...investForm, email: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Description / Interests</label>
                                        <textarea
                                            rows={3}
                                            value={investForm.description || ""}
                                            onChange={e => setInvestForm({ ...investForm, description: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                            placeholder="Describe investment focus..."
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Project Title</label>
                                        <input
                                            type="text"
                                            value={seekForm.title || ""}
                                            onChange={e => setSeekForm({ ...seekForm, title: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="e.g. AI Powered recruitment"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Startup Name</label>
                                            <input
                                                type="text"
                                                value={seekForm.name || ""}
                                                onChange={e => setSeekForm({ ...seekForm, name: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Amount Needed</label>
                                            <input
                                                type="text"
                                                value={seekForm.amountNeeded || ""}
                                                onChange={e => setSeekForm({ ...seekForm, amountNeeded: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                placeholder="e.g. ₹50 Lakhs"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Location</label>
                                            <input
                                                type="text"
                                                value={seekForm.location || ""}
                                                onChange={e => setSeekForm({ ...seekForm, location: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Contact</label>
                                            <input
                                                type="tel"
                                                value={seekForm.contact || ""}
                                                onChange={e => setSeekForm({ ...seekForm, contact: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-white/70 mb-1.5">Description / Pitch</label>
                                        <textarea
                                            rows={3}
                                            value={seekForm.description || ""}
                                            onChange={e => setSeekForm({ ...seekForm, description: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                            placeholder="Detail your funding requirements..."
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </motion.div>
    );
}
