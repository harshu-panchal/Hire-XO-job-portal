import { ArrowLeft, Building2, FileText, Camera, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostService = () => {
    const navigate = useNavigate();

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="flex items-center justify-between px-1">
                <button
                    onClick={() => navigate(-1)}
                    className="size-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center active:scale-90 transition-transform"
                >
                    <ArrowLeft className="size-6" />
                </button>
                <h1 className="text-xl font-black tracking-tight">Post CSM service</h1>
                <div className="size-12 opacity-0" />
            </div>

            {/* Form */}
            <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="size-8 rounded-lg bg-rose-600/10 flex items-center justify-center text-rose-600">
                            <Building2 className="size-4" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest italic">Expert Profile</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Service Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Structural Safety & Site Supervision"
                                className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-rose-600/10 focus:border-rose-600 transition-all font-sans"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Specialty Area</label>
                            <select className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-rose-600/10 focus:border-rose-600 transition-all font-sans appearance-none">
                                <option>Structural Audit</option>
                                <option>Quality Control</option>
                                <option>Safety Compliance</option>
                                <option>MEP Supervision</option>
                                <option>General Site Oversight</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Details & Experience */}
                <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="size-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                            <FileText className="size-4" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest italic">Experience & Specs</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Detailed Description</label>
                            <textarea
                                rows={4}
                                placeholder="Describe your supervision process and safety standards..."
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-rose-600/10 focus:border-rose-600 transition-all font-sans resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Min Exp (Yrs)</label>
                                <input
                                    type="number"
                                    placeholder="5"
                                    className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-rose-600/10 focus:border-rose-600 transition-all font-sans"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Certification</label>
                                <select className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-rose-600/10 focus:border-rose-600 transition-all font-sans appearance-none">
                                    <option>Structural Engineer</option>
                                    <option>ISO 45001 (Safety)</option>
                                    <option>B.Tech / M.Tech Civil</option>
                                    <option>Govt. Licensed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attachments */}
                <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="size-8 rounded-lg bg-amber-600/10 flex items-center justify-center text-amber-600">
                            <Camera className="size-4" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest italic">Portfolio & Docs</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <button className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                            <Plus className="size-5 text-slate-400 group-hover:text-rose-600 transition-colors" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Add Image</span>
                        </button>
                    </div>
                </div>

                <button className="w-full h-20 rounded-[2.5rem] bg-rose-600 text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-rose-600/25 mt-4">
                    List CSM Service
                </button>
            </div>
        </div>
    );
};

export default PostService;
