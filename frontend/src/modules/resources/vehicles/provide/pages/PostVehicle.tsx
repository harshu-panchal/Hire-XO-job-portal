import { ArrowLeft, Car, FileText, Camera, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostVehicle = () => {
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
                <h1 className="text-xl font-black tracking-tight">Post Vehicle Rental</h1>
                <div className="size-12 opacity-0" />
            </div>

            {/* Form */}
            <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="size-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600">
                            <Car className="size-4" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest italic">Vehicle Profile</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Vehicle Name</label>
                            <input
                                type="text"
                                placeholder="e.g. 2023 Tesla Model 3"
                                className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-sans"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Category</label>
                            <select className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-sans appearance-none">
                                <option>Commercial (Trucks/Vans)</option>
                                <option>Sedan</option>
                                <option>SUV</option>
                                <option>Luxury</option>
                                <option>Electric</option>
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
                        <h2 className="text-sm font-black uppercase tracking-widest italic">Specifications</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Description</label>
                            <textarea
                                rows={4}
                                placeholder="Describe the vehicle condition, features, and rental terms..."
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-sans resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Rent / Day (₹)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 2500"
                                    className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-sans"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. New Delhi"
                                    className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-sans"
                                />
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
                        <h2 className="text-sm font-black uppercase tracking-widest italic">Vehicle Photos</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <button className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                            <Plus className="size-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Add Photo</span>
                        </button>
                    </div>
                </div>

                <button className="w-full h-20 rounded-[2.5rem] bg-blue-600 text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-blue-600/25 mt-4">
                    List Vehicle for Rent
                </button>
            </div>
        </div>
    );
};

export default PostVehicle;
