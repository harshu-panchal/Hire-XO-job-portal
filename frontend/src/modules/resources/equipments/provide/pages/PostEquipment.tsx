import { useState, useRef } from "react";
import { ArrowLeft, Upload, Plus, ChevronRight, MapPin, Trash2, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { uploadService } from "@/services/uploadService";
import { toast } from "sonner";

const PostEquipment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingEquipment = (location.state as any)?.equipment;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: existingEquipment?.title || "",
    category:
      existingEquipment?.equipmentTypes?.[0] ||
      existingEquipment?.category ||
      "Excavators",
    location: existingEquipment?.location || "",
    description: existingEquipment?.description || "",
    compensation: existingEquipment?.compensation || "",
    type: existingEquipment?.type || "Rental",
    equipmentType: existingEquipment?.equipmentType || "rent-out-equipment",
    duration: existingEquipment?.duration || "Per Day",
    urgency: existingEquipment?.urgency || "Immediate",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    existingEquipment?.images || []
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.location || !formData.compensation) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Upload images if any
      const imageUrls = [];
      if (files.length > 0) {
        const toastId = toast.loading("Uploading images...");
        try {
          for (const file of files) {
            const res = await uploadService.uploadEquipmentImage(file);
            imageUrls.push(res.url);
          }
        } finally {
          toast.dismiss(toastId);
        }
      }

      const payload = {
        ...formData,
        category: "Equipments" as any,
        equipmentType: formData.equipmentType,
        equipmentTypes: [formData.category],
        images: [...existingImages, ...imageUrls],
        postedAt: new Date().toISOString(),
      };

      if (existingEquipment?.id || existingEquipment?._id) {
        await resourceService.update("equipments", existingEquipment.id || existingEquipment._id, payload);
        toast.success("Equipment updated successfully!");
      } else {
        await resourceService.create("equipments", payload);
        toast.success("Equipment listed successfully!");
      }
      navigate("/equipments/provide/dashboard");
    } catch (error: any) {
      console.error("Failed to save equipment", error);
      toast.error(error.message || "Failed to save equipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-8 select-none mb-24">
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
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? "w-8 bg-blue-600" : "w-1.5 bg-slate-200"}`}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">List New Gear</h1>
        <p className="text-slate-500 font-black text-[9px] uppercase tracking-[0.3em]">
          Step {step} of 3:{" "}
          {step === 1 ? "Product Identity" : step === 2 ? "Tech & Pricing" : "Confirmation"}
        </p>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Equipment Name/Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Caterpillar 320 GC Excavator"
                  className="w-full px-5 py-4 rounded-3xl bg-white border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-3xl bg-white border border-slate-200 font-bold focus:outline-none appearance-none cursor-pointer"
                  >
                    <option>Excavators</option>
                    <option>Cranes</option>
                    <option>Generators</option>
                    <option>Wheel Loaders</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Urgency
                  </label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-3xl bg-white border border-slate-200 font-bold focus:outline-none appearance-none cursor-pointer"
                  >
                    <option>Immediate</option>
                    <option>Within Week</option>
                    <option>Flexible</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-blue-50 rounded-[2.5rem] p-6 space-y-4 border border-blue-100">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-600/60 ml-1">
                  Current Base Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-blue-600" />
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    type="text"
                    placeholder="City, State"
                    className="w-full pl-11 pr-5 py-4 rounded-2xl bg-white border-none font-bold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
              <h2 className="px-1 text-xs font-black uppercase tracking-widest text-blue-600 italic">
                Rental Rates (₹)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Rate Amount
                  </label>
                  <input
                    name="compensation"
                    value={formData.compensation}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. 2,500"
                    className="w-full px-5 py-4 rounded-3xl bg-white border border-slate-100 font-black text-blue-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Unit
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-3xl bg-white border border-slate-100 font-bold text-blue-600 focus:outline-none appearance-none"
                  >
                    <option>Per Hour</option>
                    <option>Per Day</option>
                    <option>Per Month</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Machine Condition & Scope
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe performance, maintenance history..."
                className="w-full px-5 py-4 rounded-[2rem] bg-white border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              ></textarea>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Photo Upload */}
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-blue-200 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 bg-blue-50/30 cursor-pointer"
            >
              <div className="size-16 rounded-[2rem] bg-white shadow-xl flex items-center justify-center">
                <Upload className="size-8 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="font-black tracking-tight leading-none uppercase italic">
                  Upload Photos
                </p>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-2">
                  Front, Side, Cabin, Serial Number
                </p>
              </div>
              <div className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
                Select Images
              </div>
            </div>

            {existingImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {existingImages.map((image, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100"
                  >
                    <img
                      src={image}
                      className="w-full h-full object-cover"
                      alt="existing"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExistingImage(index);
                      }}
                      className="absolute top-2 right-2 size-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {files.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="absolute top-2 right-2 size-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Certification Verification */}
            <div className="p-6 bg-slate-50 rounded-[2.5rem] flex gap-4 border border-slate-100">
              <div className="mt-1">
                <input type="checkbox" required className="size-5 accent-blue-600 rounded-lg" />
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                I confirm that this equipment has valid pollution and fitness certificates. Rental
                includes insurance and my business holds full liability for the operator.
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
              className="bg-white text-slate-900 border border-slate-200 px-8 font-black text-[10px] uppercase tracking-widest py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl"
            >
              Back
            </button>
          )}
          <button
            onClick={() => (step < 3 ? setStep(step + 1) : handleSubmit())}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-[10px] uppercase tracking-[0.2em] py-5 rounded-[2rem] shadow-2xl shadow-blue-500/40 active:scale-95 transition-all flex items-center justify-center gap-2 italic disabled:opacity-70"
          >
            {loading
              ? "Listing..."
              : step === 3
                ? "Launch Listing"
                : "Continue"}{" "}
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostEquipment;
