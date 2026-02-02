import { useState } from "react";
import { FileText, Users, Clock, CheckCircle2, MoreVertical, Edit2, Archive, Eye, Plus, X, Copy, Calendar, MapPin, DollarSign, AlertCircle, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Tender {
    id: number;
    title: string;
    refNo: string;
    bids: number;
    closingDate: string;
    status: string;
    statusColor: string;
    statusBg: string;
    description?: string;
    budget?: string;
    location?: string;
    category?: string;
    publishedDate?: string;
}

const MyTenders = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("All");
    const [showViewModal, setShowViewModal] = useState(false);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
    const [tenders, setTenders] = useState<Tender[]>([
        {
            id: 1,
            title: "Smart City Infrastructure Phase 2",
            refNo: "MMC/INFRA/2024/082",
            bids: 42,
            closingDate: "15 Oct 2024",
            status: "Evaluation",
            statusColor: "text-amber-600",
            statusBg: "bg-amber-100 dark:bg-amber-950/30",
            description: "Development of smart city infrastructure including IoT sensors, traffic management systems, and public Wi-Fi networks across the city.",
            budget: "₹50 Cr",
            location: "Mumbai Metropolitan Region",
            category: "Infrastructure",
            publishedDate: "01 Sep 2024"
        },
        {
            id: 2,
            title: "Solar Power Plant Installation",
            refNo: "SEB/SLR/2024/015",
            bids: 28,
            closingDate: "20 Oct 2024",
            status: "Active",
            statusColor: "text-emerald-600",
            statusBg: "bg-emerald-100 dark:bg-emerald-950/30",
            description: "Installation of 100 MW solar power plant with battery storage system and grid integration.",
            budget: "₹25 Cr",
            location: "Pune District",
            category: "Energy",
            publishedDate: "10 Sep 2024"
        },
        {
            id: 3,
            title: "E-Governance Software Solution",
            refNo: "ITD/SFT/2024/042",
            bids: 15,
            closingDate: "10 Oct 2024",
            status: "Published",
            statusColor: "text-blue-600",
            statusBg: "bg-blue-100 dark:bg-blue-950/30",
            description: "Cloud-based e-governance platform for citizen services, document management, and inter-departmental coordination.",
            budget: "₹12 Cr",
            location: "Karnataka State",
            category: "IT & Software",
            publishedDate: "25 Aug 2024"
        },
        {
            id: 4,
            title: "Metro Extension Phase 3",
            refNo: "MRC/MET/2024/003",
            bids: 0,
            closingDate: "30 Nov 2024",
            status: "Draft",
            statusColor: "text-slate-600",
            statusBg: "bg-slate-100 dark:bg-slate-800",
            description: "Extension of metro rail network covering 25 km with 15 new stations and depot facilities.",
            budget: "₹180 Cr",
            location: "Delhi NCR",
            category: "Transportation",
            publishedDate: "Not Published"
        }
    ]);

    const stats = [
        { label: "Active", value: "8", icon: FileText, color: "text-indigo-600", bgColor: "bg-indigo-100 dark:bg-indigo-950/30" },
        { label: "Bids Recv.", value: "142", icon: Users, color: "text-violet-600", bgColor: "bg-violet-100 dark:bg-violet-950/30" },
        { label: "Awarded", value: "24", icon: CheckCircle2, color: "text-emerald-600", bgColor: "bg-emerald-100 dark:bg-emerald-950/30" },
    ];

    const tabs = ["All", "Active", "Evaluation", "Drafts"];

    const filteredTenders = tenders.filter(tender => {
        if (activeTab === "All") return true;
        if (activeTab === "Active") return tender.status === "Active" || tender.status === "Published";
        if (activeTab === "Evaluation") return tender.status === "Evaluation";
        if (activeTab === "Drafts") return tender.status === "Draft";
        return true;
    });

    const handleView = (tender: Tender) => {
        setSelectedTender(tender);
        setShowViewModal(true);
    };

    const handleEdit = (tender: Tender) => {
        // Navigate to edit page with tender data
        navigate('/tenders/provide/post', { state: { tender } });
    };

    const handleArchive = (tenderId: number) => {
        if (confirm("Are you sure you want to archive this tender?")) {
            setTenders(tenders.filter(t => t.id !== tenderId));
            alert("Tender archived successfully!");
        }
    };

    const handleMenu = (tender: Tender) => {
        setSelectedTender(tender);
        setShowMenuModal(true);
    };

    const copyRefNo = (refNo: string) => {
        navigator.clipboard.writeText(refNo);
        alert("Reference number copied to clipboard!");
    };

    const handleDelete = (tenderId: number) => {
        if (confirm("Are you sure you want to delete this tender? This action cannot be undone.")) {
            setTenders(tenders.filter(t => t.id !== tenderId));
            setShowMenuModal(false);
            alert("Tender deleted successfully!");
        }
    };

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="flex items-center justify-between px-1">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight">Tender Portfolio</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                        Manage your published opportunities
                    </p>
                </div>
                <Link to="/tenders/provide/post" className="size-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                    <Plus className="size-6" />
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-4 flex flex-col items-center text-center space-y-2 group shadow-sm">
                        <div className={`size-10 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                            <stat.icon className={`size-5 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xl font-black tracking-tight">{stat.value}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeTab === tab
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/20"
                            : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-white/10 hover:border-indigo-400"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tenders List */}
            <div className="space-y-5">
                {filteredTenders.map((tender) => (
                    <div key={tender.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="flex items-start justify-between mb-4">
                            <div className="space-y-1.5 flex-1 pr-12">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{tender.refNo}</p>
                                <h3 className="text-base font-black tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">{tender.title}</h3>
                            </div>
                            <button
                                onClick={() => handleMenu(tender)}
                                className="size-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-95 transition-all"
                            >
                                <MoreVertical className="size-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <Link to="/tenders/provide/bids" className="bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl p-3 flex items-center justify-between group/bid">
                                <div className="space-y-0.5">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Total Bids</p>
                                    <p className="text-base font-black tracking-tight text-indigo-600">{tender.bids}</p>
                                </div>
                                <div className="size-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center group-hover/bid:scale-110 transition-transform">
                                    <Users className="size-4 text-indigo-600" />
                                </div>
                            </Link>
                            <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-3 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Ends On</p>
                                    <p className="text-sm font-black tracking-tight">{tender.closingDate}</p>
                                </div>
                                <Clock className="size-4 text-slate-400" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                            <div className={`px-4 py-1.5 rounded-full ${tender.statusBg} ${tender.statusColor} text-[8px] font-black uppercase tracking-widest border border-current opacity-80`}>
                                {tender.status}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(tender)}
                                    className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 active:scale-95 transition-all"
                                >
                                    <Edit2 className="size-4" />
                                </button>
                                <button
                                    onClick={() => handleView(tender)}
                                    className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 active:scale-95 transition-all"
                                >
                                    <Eye className="size-4" />
                                </button>
                                <button
                                    onClick={() => handleArchive(tender.id)}
                                    className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 active:scale-95 transition-all"
                                >
                                    <Archive className="size-4" />
                                </button>
                            </div>
                        </div>

                        {/* Background Highlight */}
                        <div className="absolute top-0 right-0 size-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
                    </div>
                ))}

                {filteredTenders.length === 0 && (
                    <div className="text-center py-20 opacity-50 space-y-4">
                        <FileText className="size-16 mx-auto text-slate-300" />
                        <p className="text-xs font-black uppercase tracking-widest">No tenders found in this category</p>
                    </div>
                )}
            </div>

            {/* Spacer */}
            <div className="h-4" />

            {/* View Tender Modal */}
            {showViewModal && selectedTender && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black">Tender Details</h3>
                                <p className="text-xs text-slate-500 mt-1">{selectedTender.refNo}</p>
                            </div>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Status Badge */}
                        <div className="mb-6">
                            <div className={`inline-flex px-4 py-2 rounded-full ${selectedTender.statusBg} ${selectedTender.statusColor} text-xs font-black uppercase tracking-widest border border-current`}>
                                {selectedTender.status}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="mb-6">
                            <h4 className="text-2xl font-black mb-2">{selectedTender.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{selectedTender.description}</p>
                        </div>

                        {/* Key Info Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="size-4 text-indigo-600" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Budget</p>
                                </div>
                                <p className="text-xl font-black text-indigo-600">{selectedTender.budget}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="size-4 text-slate-500" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Bids Received</p>
                                </div>
                                <p className="text-xl font-black">{selectedTender.bids}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="size-4 text-slate-500" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Closing Date</p>
                                </div>
                                <p className="text-sm font-black">{selectedTender.closingDate}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="size-4 text-slate-500" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Location</p>
                                </div>
                                <p className="text-sm font-black">{selectedTender.location}</p>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-3 mb-6">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Category</p>
                                <p className="text-sm font-bold">{selectedTender.category}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Published Date</p>
                                <p className="text-sm font-bold">{selectedTender.publishedDate}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    handleEdit(selectedTender);
                                    setShowViewModal(false);
                                }}
                                className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                            >
                                <Edit2 className="size-4" />
                                Edit Tender
                            </button>
                            <button
                                onClick={() => copyRefNo(selectedTender.refNo)}
                                className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Copy className="size-4" />
                                Copy Ref
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Menu Modal */}
            {showMenuModal && selectedTender && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black">Tender Actions</h3>
                                <p className="text-xs text-slate-500 mt-1">{selectedTender.title}</p>
                            </div>
                            <button
                                onClick={() => setShowMenuModal(false)}
                                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    handleView(selectedTender);
                                    setShowMenuModal(false);
                                }}
                                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all group"
                            >
                                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/30 transition-all">
                                    <Eye className="size-5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-black">View Details</p>
                                    <p className="text-xs text-slate-500">See complete tender information</p>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    handleEdit(selectedTender);
                                    setShowMenuModal(false);
                                }}
                                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all group"
                            >
                                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/30 transition-all">
                                    <Edit2 className="size-5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-black">Edit Tender</p>
                                    <p className="text-xs text-slate-500">Modify tender details</p>
                                </div>
                            </button>

                            <button
                                onClick={() => copyRefNo(selectedTender.refNo)}
                                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all group"
                            >
                                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-950/30 transition-all">
                                    <Copy className="size-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-black">Copy Reference</p>
                                    <p className="text-xs text-slate-500">Copy tender reference number</p>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    handleArchive(selectedTender.id);
                                    setShowMenuModal(false);
                                }}
                                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all group"
                            >
                                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-950/30 transition-all">
                                    <Archive className="size-5 text-slate-600 dark:text-slate-400 group-hover:text-amber-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-black">Archive</p>
                                    <p className="text-xs text-slate-500">Move to archived tenders</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handleDelete(selectedTender.id)}
                                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/30 transition-all group border border-rose-200 dark:border-rose-900"
                            >
                                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center group-hover:bg-rose-100 dark:group-hover:bg-rose-950/40 transition-all">
                                    <Trash2 className="size-5 text-rose-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-black text-rose-600">Delete Tender</p>
                                    <p className="text-xs text-rose-500">Permanently remove this tender</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTenders;
