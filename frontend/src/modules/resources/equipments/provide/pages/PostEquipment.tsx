import { useState } from "react";
import { ArrowLeft, Upload, Plus, ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostEquipment = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: "",
        category: "Excavators",
        brand: "",
        model: "",
        year: "",
        hourlyRate: "",
        dailyRate: "",
        location: "",
        description: "",
        specs: [{ label: "", value: "" }],
        features: [""]
    });

    const addSpec = () => {
        setFormData({ ...formData, specs: [...formData.specs, { label: "", value: "" }] });
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
                        <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? "w-8 bg-blue-600" : "w-1.5 bg-slate-200"}`} />
                    ))}
                </div>
            </div>

            {/* Header */}
            <div className="space-y-1 text-center">
                <h1 className="text-2xl font-black tracking-tighter uppercase italic">List New Gear</h1>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[9px] uppercase tracking-[0.3em]">
                    Step {step} of 3: {step === 1 ? "Product Identity" : step === 2 ? "Tech & Pricing" : "Confirmation"}
                </p>
            </div>

            <div className="space-y-6">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Equipment Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Caterpillar 320 GC Excavator"
                                    className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                    <select className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold focus:outline-none appearance-none cursor-pointer">
                                        <option>Excavators</option>
                                        <option>Cranes</option>
                                        <option>Generators</option>
                                        <option>Wheel Loaders</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Availability</label>
                                    <select className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold focus:outline-none appearance-none cursor-pointer">
                                        <option>Available Now</option>
                                        <option>In 7 Days</option>
                                        <option>In 30 Days</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-[2.5rem] p-6 space-y-4 border border-blue-100 dark:border-blue-900/30">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-600/60 ml-1">Current Base Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-blue-600" />
                                    <input
                                        type="text"
                                        placeholder="City, State"
                                        className="w-full pl-11 pr-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border-none font-bold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Pricing */}
                        <div className="space-y-4">
                            <h2 className="px-1 text-xs font-black uppercase tracking-widest text-blue-600 italic">Rental Rates (₹)</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rate / Hour</label>
                                    <input type="text" placeholder="e.g. 2,500" className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 font-black text-blue-600 focus:outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rate / Day</label>
                                    <input type="text" placeholder="e.g. 18,000" className="w-full px-5 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 font-black text-blue-600 focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Machine Condition & Scope</label>
                            <textarea
                                rows={4}
                                placeholder="Describe performance, maintenance history, and what's included in the rent (e.g. operator, fuel)..."
                                className="w-full px-5 py-4 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                            ></textarea>
                        </div>

                        {/* Dynamic Specs */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Technical Specs</label>
                                <button onClick={addSpec} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-600">
                                    <Plus className="size-3" /> Add Spec
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.specs.map((_, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Label (e.g. Cap)"
                                            className="w-1/3 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 font-bold text-[10px] uppercase"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Value (e.g. 20T)"
                                            className="flex-1 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 font-bold text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Photo Upload */}
                        <div className="p-8 border-2 border-dashed border-blue-200 dark:border-blue-900/40 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 bg-blue-50/30 dark:bg-blue-950/5">
                            <div className="size-16 rounded-[2rem] bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center">
                                <Upload className="size-8 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-black tracking-tight leading-none uppercase italic">Upload Photos</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-2">Front, Side, Cabin, Serial Number</p>
                            </div>
                            <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
                                Open Gallery
                            </button>
                        </div>

                        {/* Certification Verification */}
                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] flex gap-4 border border-slate-100 dark:border-white/5">
                            <div className="mt-1">
                                <input type="checkbox" className="size-5 accent-blue-600 rounded-lg" />
                            </div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                                I confirm that this equipment has valid pollution and fitness certificates. Rental includes insurance and my business holds full liability for the operator.
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
                            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/5 px-8 font-black text-xs uppercase tracking-widest py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={() => step < 3 ? setStep(step + 1) : navigate("/equipments/provide/dashboard")}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-[2rem] shadow-2xl shadow-blue-500/40 active:scale-95 transition-all flex items-center justify-center gap-2 italic"
                    >
                        {step === 3 ? "Launch Listing" : "Continue"} <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            <div className="h-16" />
        </div>
    );
};

export default PostEquipment;
