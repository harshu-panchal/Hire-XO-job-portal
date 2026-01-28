import { useState } from "react";
import { ArrowLeft, Upload, CheckCircle2, ChevronRight, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostMachine = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    return (
        <div className="py-6 space-y-8 select-none bg-slate-50 min-h-screen text-slate-900">
            {/* Nav Bar */}
            <div className="flex items-center justify-between px-1">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-transform"
                >
                    <ArrowLeft className="size-3" /> Discard
                </button>
                <div className="flex gap-1.5">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-1 rounded-full transition-all duration-700 ${step === s ? "w-8 bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)]" : "w-2 bg-slate-200"}`} />
                    ))}
                </div>
            </div>

            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Listing Studio</h1>
                <p className="text-indigo-600 font-black text-[8px] uppercase tracking-[0.4em]">
                    Release {step} of 3: {step === 1 ? "Asset Identity" : step === 2 ? "Tech Data & Value" : "Final Review"}
                </p>
            </div>

            <div className="space-y-6">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 leading-none">Primary Asset Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Schwing Stetter CP30 Concrete Mixer"
                                    className="w-full px-6 py-4 rounded-[1.8rem] bg-white border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-sm placeholder:text-slate-300 shadow-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 leading-none">Category</label>
                                    <div className="relative">
                                        <select className="w-full px-6 py-4 rounded-[1.8rem] bg-white border border-slate-200 font-bold focus:outline-none appearance-none cursor-pointer text-xs shadow-sm">
                                            <option>Concrete Mixers</option>
                                            <option>Generators</option>
                                            <option>Excavators</option>
                                            <option>Earth Movers</option>
                                        </select>
                                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-slate-300 rotate-90" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 leading-none">Brand / OEM</label>
                                    <input type="text" placeholder="e.g. Kirloskar" className="w-full px-6 py-4 rounded-[1.8rem] bg-white border border-slate-200 font-bold focus:outline-none text-xs shadow-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white flex flex-col items-center text-center space-y-4 shadow-sm">
                            <div className="size-16 rounded-[2rem] bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                <Upload className="size-8 text-indigo-600" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xs font-black uppercase tracking-widest italic leading-none">Primary Media</h3>
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Min 4 Hi-Res photos required</p>
                            </div>
                            <button className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest active:scale-95 transition-transform shadow-lg">
                                Attach Assets
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 leading-none">Manufacture Year</label>
                                    <input type="number" placeholder="2022" className="w-full px-6 py-4 rounded-[1.8rem] bg-white border border-slate-200 font-bold focus:outline-none text-xs shadow-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 leading-none">Hours Used</label>
                                    <input type="text" placeholder="e.g. 1200h" className="w-full px-6 py-4 rounded-[1.8rem] bg-white border border-slate-200 font-bold focus:outline-none text-xs shadow-sm" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 ml-1 leading-none italic">Target Selling Price (₹)</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center text-indigo-600">
                                        <DollarSign className="size-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white border border-indigo-200 font-black text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-slate-900 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 leading-none">Brief History / Condition</label>
                                <textarea
                                    className="w-full px-6 py-4 rounded-[2rem] bg-white border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-xs shadow-sm resize-none"
                                    rows={4}
                                    placeholder="Explain recent servicing, upgrades and current status..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-4">
                        <div className="size-24 rounded-[3rem] bg-emerald-50 flex items-center justify-center mx-auto border border-emerald-100 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                            <CheckCircle2 className="size-10 text-emerald-500" />
                        </div>
                        <div className="space-y-3 px-4">
                            <h2 className="text-xl font-black uppercase tracking-tighter italic">Ready for Launch</h2>
                            <p className="text-xs text-slate-400 font-bold leading-relaxed">
                                By listing this asset, you confirm that you have legal ownership or authorization to sell. All listings are reviewed within 4 hours.
                            </p>
                        </div>

                        <div className="p-6 bg-white rounded-[2.5rem] mt-8 text-left space-y-4 border border-slate-200 shadow-sm">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">Seller Commitment</p>
                            <div className="flex gap-3">
                                <div className="mt-0.5">
                                    <input type="checkbox" className="size-4 accent-indigo-600 border-slate-200 rounded-md" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 leading-tight">I agree to the Hire XO Marketplace Seller terms and will provide accurate documentation upon inquiry.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-40 pointer-events-none">
                <div className="w-full max-w-[430px] flex gap-3 pointer-events-auto">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="bg-white text-slate-400 border border-slate-200 px-8 font-black text-[10px] uppercase tracking-widest py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl shadow-black/5"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={() => step < 3 ? setStep(step + 1) : navigate("/machinery/sell/dashboard")}
                        className="flex-1 bg-slate-900 text-white font-black text-[12px] uppercase tracking-[0.2em] py-5 rounded-[2rem] shadow-2xl shadow-indigo-500/10 active:scale-95 transition-all flex items-center justify-center gap-3 italic"
                    >
                        {step === 3 ? "Process Listing" : "Continue"} <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            <div className="h-20" />
        </div>
    );
};

export default PostMachine;
