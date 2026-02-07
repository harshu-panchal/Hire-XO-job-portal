import { useState, useRef } from "react";
import { ArrowLeft, Truck, FileText, Camera, Plus, X, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { uploadService } from "@/services/uploadService";
import { toast } from "sonner";

const PostLogisticsService = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    compensation: "", // Using this for fleet size or cost per km? The model expects string.
    type: "Service Provider",
    description: "",
    category: "Logistics",
    logisticsType: "provide-logistics",
    serviceArea: "Pan-India",
    urgency: "Immediate",
  });

  const [logisticsCategory, setLogisticsCategory] = useState("Heavy Haulage");
  const [files, setFiles] = useState<File[]>([]);

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

  const handleSubmit = async () => {
    if (!formData.title || !formData.company || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Upload images if any
      const imageUrls = [];
      if (files.length > 0) {
        const toastId = toast.loading("Uploading fleet photos...");
        try {
          for (const file of files) {
            const res = await uploadService.uploadLogisticsImage(file);
            imageUrls.push(res.url);
          }
        } finally {
          toast.dismiss(toastId);
        }
      }

      const payload = {
        ...formData,
        category: "Logistics" as any,
        requirements: [logisticsCategory], // Store sub-category
        images: imageUrls,
        postedAt: new Date().toISOString(),
      };

      await resourceService.create("logistics", payload);
      toast.success("Logistics service listed successfully!");
      navigate("/logistics/provide/dashboard");
    } catch (error: any) {
      console.error("Failed to save logistics service", error);
      toast.error(error.message || "Failed to save logistics service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-8 select-none mb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => navigate(-1)}
          className="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center active:scale-90 transition-transform shadow-sm"
        >
          <ArrowLeft className="size-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-black tracking-tight uppercase italic">Post Logistics Service</h1>
        <div className="size-12 opacity-0" />
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 rounded-lg bg-orange-600/10 flex items-center justify-center text-orange-600">
              <Truck className="size-4" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest italic">Fleet Profile</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                Service Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text"
                placeholder="e.g. Pan-India Heavy Duty Transport"
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600 transition-all font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                Company Name
              </label>
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                type="text"
                placeholder="e.g. SpeedX Logistics"
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600 transition-all font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                Category
              </label>
              <select
                value={logisticsCategory}
                onChange={(e) => setLogisticsCategory(e.target.value)}
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600 transition-all font-sans appearance-none"
              >
                <option>Heavy Haulage</option>
                <option>Last Mile Delivery</option>
                <option>Inter-City Freight</option>
                <option>Cold Storage Chain</option>
                <option>Bulk Cargo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Details & Experience */}
        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-600">
              <FileText className="size-4" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest italic">Service Specs</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your fleet, routes, and specialized services..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600 transition-all font-sans resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                  Fleet Size / Capacity
                </label>
                <input
                  name="compensation"
                  value={formData.compensation}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. 50 Trucks"
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600 transition-all font-sans"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                  Primary Base
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Mumbai, MH"
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600 transition-all font-sans"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 rounded-lg bg-amber-600/10 flex items-center justify-center text-amber-600">
              <Camera className="size-4" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest italic">Fleet Media</h2>
          </div>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />

          <div className="grid grid-cols-3 gap-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
              >
                <img
                  src={URL.createObjectURL(file)}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 size-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors group"
            >
              <Plus className="size-5 text-slate-400 group-hover:text-orange-600 transition-colors" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                Add Fleet Photo
              </span>
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-20 rounded-[2.5rem] bg-orange-600 text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-orange-600/25 mt-4 disabled:opacity-70"
        >
          {loading ? "Listing..." : "List Logistics Service"}
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default PostLogisticsService;
