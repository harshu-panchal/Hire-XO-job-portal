import { useState } from "react";
import { ArrowLeft, Upload, Plus, Trash2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostTender = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        title: "",
        organization: "",
        category: "Civil Works",
        type: "Open Tender",
        value: "",
        deadline: "",
        location: "",
        description: "",
        eligibility: [""],
        keyDates: [
            { label: "Pre-bid Meeting", date: "" },
            { label: "Submission Deadline", date: "" }
        ]
    });

    const addEligibility = () => {
        setFormData({ ...formData, eligibility: [...formData.eligibility, ""] });
    };

    const removeEligibility = (index: number) => {
        const newEligibility = formData.eligibility.filter((_, i) => i !== index);
        setFormData({ ...formData, eligibility: newEligibility });
    };

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Action Bar */}
            <div className="flex items-center justify-between px-1">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 font-black text-xs uppercase tracking-widest active:scale-95 transition-transform"
                >
                    <ArrowLeft className="size-4" /> Cancel
                </button>
                <div className="flex gap-1">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? "w-8 bg-indigo-600" : "w-1.5 bg-slate-200"}`} />
                    ))}
                </div>
            </div>

            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight">Post New Tender</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                    Step {step} of 3: {step === 1 ? "Basic Information" : step === 2 ? "Specifications & Eligibility" : "Documents & Publish"}
                </p>
            </div>

            <div className="space-y-6">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Title & Org */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tender Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Smart City Infrastructure Phase 2"
                                    className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                    <select className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold focus:outline-none appearance-none">
                                        <option>Civil Works</option>
                                        <option>IT Services</option>
                                        <option>Healthcare</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tender Type</label>
                                    <select className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold focus:outline-none appearance-none">
                                        <option>Open Tender</option>
                                        <option>Limited Tender</option>
                                        <option>Global Tender</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Value & Dates */}
                        <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-[2.5rem] p-6 space-y-6 border border-indigo-100 dark:border-indigo-900/30">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 ml-1">Estimated Tender Value (₹)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 25,00,00,000"
                                    className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border-none font-black text-indigo-600 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 ml-1">Release Date</label>
                                    <input type="date" className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border-none font-bold text-sm shadow-sm focus:outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 ml-1">Closing Date</label>
                                    <input type="date" className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border-none font-bold text-sm shadow-sm focus:outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Project Description</label>
                            <textarea
                                rows={4}
                                placeholder="Provide detailed information about the tender scope..."
                                className="w-full px-5 py-4 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                            ></textarea>
                        </div>

                        {/* Eligibility */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Eligibility Requirements</label>
                                <button onClick={addEligibility} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                                    <Plus className="size-3" /> Add More
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.eligibility.map((_, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Requirement details..."
                                            className="flex-1 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 font-bold text-sm"
                                        />
                                        <button onClick={() => removeEligibility(index)} className="size-11 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center shrink-0 active:scale-90 transition-transform">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Document Upload */}
                        <div className="p-8 border-2 border-dashed border-indigo-200 dark:border-indigo-900/40 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 bg-indigo-50/30 dark:bg-indigo-950/5">
                            <div className="size-16 rounded-[2rem] bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center">
                                <Upload className="size-8 text-indigo-600" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-black tracking-tight">Upload Tender Documents</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">PDF, XLS, ZIP (Max 25MB each)</p>
                            </div>
                            <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform">
                                Select Files
                            </button>
                        </div>

                        {/* Confirmation Checkbox */}
                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex gap-4">
                            <div className="mt-1">
                                <input type="checkbox" className="size-5 accent-indigo-600 rounded-lg" />
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                                I verify that all the information provided is accurate and I have the authority to publish this tender on behalf of the organization.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-40 pointer-events-none">
                <div className="w-full max-w-[430px] flex gap-3 pointer-events-auto">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/5 px-8 font-black text-sm uppercase tracking-widest py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={() => step < 3 ? setStep(step + 1) : navigate("/tenders/provide/dashboard")}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-black text-sm uppercase tracking-[0.2em] py-5 rounded-[2rem] shadow-2xl shadow-indigo-500/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {step === 3 ? "Publish Tender" : "Next Step"} <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            <div className="h-16" />
        </div>
    );
};

export default PostTender;
