import { useState } from "react";
import { Upload, X, DollarSign, Calendar, Percent, FileText, Building2, MapPin } from "lucide-react";

const PostFundingNeed = () => {
    const [formData, setFormData] = useState({
        businessName: "",
        sector: "",
        amount: "",
        equity: "",
        duration: "",
        location: "",
        description: "",
        useOfFunds: "",
        revenueModel: "",
        currentRevenue: "",
        teamSize: "",
    });

    const [documents] = useState<string[]>([]);

    const sectors = [
        "Technology",
        "Healthcare",
        "Renewable Energy",
        "Manufacturing",
        "Real Estate",
        "E-commerce",
        "Education",
        "Agriculture",
        "Other",
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Header */}
            <div className="px-1">
                <h1 className="text-3xl font-black tracking-tight">
                    Post Funding <span className="text-primary">Need</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest mt-1">
                    Share your funding requirements with investors
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                    <h2 className="text-xl font-black tracking-tight mb-4">Basic Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                Business/Project Name *
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    placeholder="Enter your business name"
                                    className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                Sector *
                            </label>
                            <select
                                required
                                value={formData.sector}
                                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                className="w-full px-4 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                                <option value="">Select sector</option>
                                {sectors.map((sector) => (
                                    <option key={sector} value={sector}>
                                        {sector}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                Location *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="City, State"
                                    className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Funding Details */}
                <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                    <h2 className="text-xl font-black tracking-tight mb-4">Funding Details</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                    Amount Needed *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-emerald-600" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="₹5 Cr"
                                        className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-sm font-bold placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                    Equity Offered *
                                </label>
                                <div className="relative">
                                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-blue-600" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.equity}
                                        onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
                                        placeholder="15%"
                                        className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-sm font-bold placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                Investment Duration *
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-purple-600" />
                                <input
                                    type="text"
                                    required
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="24 months"
                                    className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 text-sm font-bold placeholder:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Details */}
                <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                    <h2 className="text-xl font-black tracking-tight mb-4">Business Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                Project Description *
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your business, project goals, market opportunity, and why investors should invest..."
                                className="w-full px-4 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                Use of Funds *
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={formData.useOfFunds}
                                onChange={(e) => setFormData({ ...formData, useOfFunds: e.target.value })}
                                placeholder="Explain how you plan to use the investment (e.g., Product Development: 40%, Marketing: 30%, etc.)"
                                className="w-full px-4 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                    Current Revenue
                                </label>
                                <input
                                    type="text"
                                    value={formData.currentRevenue}
                                    onChange={(e) => setFormData({ ...formData, currentRevenue: e.target.value })}
                                    placeholder="₹12 Cr (FY 2023-24)"
                                    className="w-full px-4 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                    Team Size
                                </label>
                                <input
                                    type="text"
                                    value={formData.teamSize}
                                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                                    placeholder="45-50 employees"
                                    className="w-full px-4 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                Revenue Model
                            </label>
                            <textarea
                                rows={3}
                                value={formData.revenueModel}
                                onChange={(e) => setFormData({ ...formData, revenueModel: e.target.value })}
                                placeholder="Describe how your business generates revenue..."
                                className="w-full px-4 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Documents */}
                <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                    <h2 className="text-xl font-black tracking-tight mb-4">Supporting Documents</h2>
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[1.5rem] p-8 text-center">
                            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <Upload className="size-8 text-primary" />
                            </div>
                            <p className="text-sm font-black mb-1">Upload Documents</p>
                            <p className="text-xs text-slate-500 mb-4">Business plan, financial projections, pitch deck (PDF, max 10MB)</p>
                            <button
                                type="button"
                                className="px-6 py-3 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                            >
                                Choose Files
                            </button>
                        </div>

                        {documents.length > 0 && (
                            <div className="space-y-2">
                                {documents.map((doc, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="size-5 text-blue-600" />
                                            <span className="text-sm font-bold">{doc}</span>
                                        </div>
                                        <button type="button" className="size-8 rounded-lg bg-red-50 dark:bg-red-950/20 flex items-center justify-center active:scale-90 transition-all">
                                            <X className="size-4 text-red-600" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        className="py-5 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
                    >
                        Save Draft
                    </button>
                    <button
                        type="submit"
                        className="py-5 rounded-[1.5rem] bg-gradient-to-r from-primary to-primary/80 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                        Post Request
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostFundingNeed;
