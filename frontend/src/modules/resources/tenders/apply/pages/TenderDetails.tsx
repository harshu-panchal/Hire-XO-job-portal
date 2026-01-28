import { ArrowLeft, Building2, Calendar, Clock, Download, FileText, CheckCircle2, Phone, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TenderDetails = () => {
    const navigate = useNavigate();

    const tenderData = {
        id: 1,
        title: "Smart City Infrastructure Project Phase 2",
        organization: "Mumbai Municipal Corporation",
        refNo: "MMC/INFRA/2024/082",
        value: "₹25 Cr",
        deadline: "15 Oct 2024",
        category: "Civil Works",
        type: "Open Tender",
        location: "Mumbai, Maharashtra",
        postedDate: "10 Sep 2024",
        description: "Comprehensive infrastructure development for the Smart City initiative, including road expansion, drainage systems, and street lighting installations in the South Mumbai district. The project aims to modernize existing public facilities while ensuring minimum disruption to city traffic.",
        eligibility: [
            "Minimum 10 years experience in large-scale civil works",
            "Annual turnover of at least ₹50 Cr in the last 3 financial years",
            "Successful completion of 3 similar 'Smart City' projects in India",
            "Valid ISO 9001:2015 certification for quality management"
        ],
        documents: [
            { name: "Technical Specifications.pdf", size: "2.4 MB" },
            { name: "Financial Proposal Template.xlsx", size: "1.1 MB" },
            { name: "General Terms & Conditions.pdf", size: "1.8 MB" },
            { name: "Site Layout Drawings.zip", size: "15 MB" }
        ],
        dates: [
            { label: "Tender Release", date: "10 Sep 2024" },
            { label: "Pre-bid Meeting", date: "25 Sep 2024" },
            { label: "Submission Deadline", date: "15 Oct 2024" },
            { label: "Bid Opening Date", date: "16 Oct 2024" }
        ],
        contact: {
            person: "Er. Arvind Kulkarni",
            designation: "Chief Infrastructure Officer",
            phone: "+91 22 2345 6789",
            email: "tenders@mmc.gov.in",
            website: "www.mmc.gov.in/tenders"
        }
    };

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Action Bar */}
            <div className="flex items-center justify-between px-1">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 font-black text-xs uppercase tracking-widest active:scale-95 transition-transform"
                >
                    <ArrowLeft className="size-4" /> Back to List
                </button>
                <div className="flex gap-2">
                    <button className="size-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-600 active:scale-95 transition-transform">
                        <Download className="size-5" />
                    </button>
                </div>
            </div>

            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="size-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-violet-500/20">
                        <Building2 className="size-9" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-violet-600 font-black text-[10px] uppercase tracking-[0.2em]">{tenderData.organization}</p>
                        <h1 className="text-2xl font-black tracking-tight leading-tight">{tenderData.title}</h1>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-[8px] font-black uppercase tracking-widest text-slate-500">
                        REF: {tenderData.refNo}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900 text-[8px] font-black uppercase tracking-widest text-violet-600">
                        {tenderData.type}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-[8px] font-black uppercase tracking-widest text-emerald-600">
                        {tenderData.category}
                    </span>
                </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-5 space-y-1 shadow-sm">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Tender Value</p>
                    <p className="text-2xl font-black text-emerald-600 tracking-tight">{tenderData.value}</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic pt-1">Estimated Budget</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-5 space-y-1 shadow-sm">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Submission Ends</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{tenderData.deadline}</p>
                    <div className="flex items-center gap-1 pt-1">
                        <Clock className="size-3 text-amber-500" />
                        <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">12 Days Left</span>
                    </div>
                </div>
            </div>

            {/* Content Tabs-like Sections */}
            <div className="space-y-6">
                {/* Description */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm">
                    <h2 className="text-lg font-black tracking-tight mb-3 flex items-center gap-2">
                        <FileText className="size-5 text-violet-600" /> Tender Description
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-bold">
                        {tenderData.description}
                    </p>
                </div>

                {/* Eligibility */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm">
                    <h2 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
                        <ShieldCheck className="size-5 text-violet-600" /> Eligibility Criteria
                    </h2>
                    <div className="space-y-3">
                        {tenderData.eligibility.map((item, index) => (
                            <div key={index} className="flex gap-3">
                                <div className="mt-1">
                                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                                </div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Dates */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm">
                    <h2 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
                        <Calendar className="size-5 text-violet-600" /> Key Schedule
                    </h2>
                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-violet-500 before:via-slate-200 before:to-transparent">
                        {tenderData.dates.map((item, index) => (
                            <div key={index} className="relative flex items-center gap-6 group">
                                <div className="absolute left-0 size-8 rounded-full bg-white dark:bg-slate-900 border-2 border-violet-500 flex items-center justify-center shrink-0 z-10 group-first:scale-125 transition-transform shadow-lg shadow-violet-500/20">
                                    <div className="size-2 rounded-full bg-violet-600" />
                                </div>
                                <div className="ml-10 space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                                    <p className="text-sm font-black tracking-tight">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] p-6 shadow-xl">
                    <h2 className="text-lg font-black tracking-tight mb-4 uppercase tracking-widest opacity-80">Authority Contact</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-white/10 dark:bg-slate-950/10 flex items-center justify-center">
                                <User className="size-6 opacity-60" />
                            </div>
                            <div>
                                <p className="text-sm font-black">{tenderData.contact.person}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{tenderData.contact.designation}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <a href={`tel:${tenderData.contact.phone}`} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 dark:bg-slate-950/5 hover:bg-white/10 transition-colors">
                                <Phone className="size-4 opacity-60" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
                            </a>
                            <a href={`mailto:${tenderData.contact.email}`} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 dark:bg-slate-950/5 hover:bg-white/10 transition-colors">
                                <Mail className="size-4 opacity-60" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Email</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bid Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-40 pointer-events-none">
                <div className="w-full max-w-[430px] flex gap-3 pointer-events-auto">
                    <button className="flex-1 bg-gradient-to-r from-violet-600 to-purple-700 text-white font-black text-sm uppercase tracking-[0.2em] py-5 rounded-[2rem] shadow-2xl shadow-violet-500/40 active:scale-95 transition-all">
                        Initiate Bid Now
                    </button>
                </div>
            </div>

            {/* Spacer for sticky footer */}
            <div className="h-12" />
        </div>
    );
};

// Internal icon for user since it wasn't imported
const User = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

export default TenderDetails;
