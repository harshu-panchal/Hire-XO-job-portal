import { useState, useRef } from "react";
import {
  Upload,
  X,
  DollarSign,
  Calendar,
  Percent,
  FileText,
  Building2,
  MapPin,
  Loader2,
  Camera,
  Plus,
} from "lucide-react";
import { resourceService } from "@/services/resourceService";
import { uploadService } from "@/services/uploadService";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { ResourceCategory } from "@/types";

const PostFundingNeed = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

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

  const [documents, setDocuments] = useState<{ name: string; url: string }[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      setIsUploading(true);
      const response = await uploadService.uploadTenderDocument(file);
      setDocuments((prev) => [...prev, { name: file.name, url: response.url }]);
      toast.success("Document uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImageFiles([...imageFiles, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to post a funding need");
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload images if any
      const imageUrls = [];
      if (imageFiles.length > 0) {
        setIsUploadingImages(true);
        const toastId = toast.loading("Uploading project images...");
        try {
          for (const file of imageFiles) {
            const res = await uploadService.uploadInvestorImage(file);
            imageUrls.push(res.url);
          }
        } finally {
          toast.dismiss(toastId);
          setIsUploadingImages(false);
        }
      }

      const payload = {
        title: `${formData.businessName} - Funding Request`,
        company: formData.businessName,
        category: "Investor" as ResourceCategory,
        location: formData.location,
        compensation: formData.amount,
        type: "seeking-investment",
        description: formData.description,
        investorType: "want-investment",
        investmentAmount: formData.amount,
        investmentSector: [formData.sector],
        duration: formData.duration,
        images: imageUrls,
        details: {
          useOfFunds: formData.useOfFunds,
          revenueModel: formData.revenueModel,
          currentRevenue: formData.currentRevenue,
          teamSize: formData.teamSize,
          equity: formData.equity,
          documents: documents,
        },
        status: "active",
      };

      await resourceService.create("investors", payload);

      toast.success("Funding request posted successfully!");
      navigate("/investor/seek/my-requests");
    } catch (error: any) {
      toast.error(error.message || "Failed to post funding request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 space-y-6 select-none mb-24">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-3xl font-black tracking-tight">
          Post Funding <span className="text-primary">Need</span>
        </h1>
        <p className="text-slate-500 font-black text-xs uppercase tracking-widest mt-1">
          Share your funding requirements with investors
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200">
          <h2 className="text-xl font-black tracking-tight mb-4 uppercase italic">
            Basic Information
          </h2>
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
                  className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-200 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                className="w-full px-4 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
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
                  className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-200 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Funding Details */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200">
          <h2 className="text-xl font-black tracking-tight mb-4 uppercase italic">
            Funding Details
          </h2>
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
                    className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-emerald-50 border border-emerald-200 text-sm font-bold placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
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
                    className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-blue-50 border border-blue-200 text-sm font-bold placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                  className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-purple-50 border border-purple-200 text-sm font-bold placeholder:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200">
          <h2 className="text-xl font-black tracking-tight mb-4 uppercase italic">
            Business Details
          </h2>
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
                className="w-full px-4 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-200 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
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
                className="w-full px-4 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-200 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
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
                  className="w-full px-4 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-200 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                  className="w-full px-4 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-200 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                className="w-full px-4 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-200 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Project Images */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200">
          <h2 className="text-xl font-black tracking-tight mb-4 uppercase italic">Project Media</h2>
          <div className="space-y-4">
            <input
              type="file"
              multiple
              ref={imageInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <div
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-[1.5rem] p-8 text-center cursor-pointer hover:bg-slate-50 transition-all"
            >
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Camera className="size-8 text-primary" />
              </div>
              <p className="text-sm font-black mb-1 italic uppercase tracking-widest">
                Add Project Photos
              </p>
              <p className="text-[10px] text-slate-500 mb-4 uppercase font-black tracking-widest">
                PNG, JPG upto 5MB
              </p>
            </div>

            {imageFiles.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {imageFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 size-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200">
          <h2 className="text-xl font-black tracking-tight mb-4 uppercase italic">
            Supporting Documents
          </h2>
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed border-slate-200 rounded-[1.5rem] p-8 text-center cursor-pointer hover:bg-slate-50 transition-all ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
              />
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                {isUploading ? (
                  <Loader2 className="size-8 text-primary animate-spin" />
                ) : (
                  <Upload className="size-8 text-primary" />
                )}
              </div>
              <p className="text-sm font-black mb-1 italic uppercase tracking-widest">
                {isUploading ? "Uploading..." : "Upload Documents"}
              </p>
              <p className="text-[10px] text-slate-500 mb-4 uppercase font-black tracking-widest">
                Business plan, pitch deck (PDF, max 10MB)
              </p>
              <button
                type="button"
                className="px-6 py-3 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
              >
                {isUploading ? "Please wait" : "Choose Files"}
              </button>
            </div>

            {documents.length > 0 && (
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-5 text-blue-600" />
                      <span className="text-sm font-bold">{doc.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="size-8 rounded-lg bg-red-50 flex items-center justify-center active:scale-90 transition-all"
                    >
                      <X className="size-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="grid grid-cols-2 gap-4 pb-12">
          <button
            type="button"
            onClick={() => toast.info("Drafts feature coming soon!")}
            className="py-5 rounded-[1.5rem] bg-slate-100 text-slate-600 font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-5 rounded-[1.5rem] bg-gradient-to-r from-primary to-primary/80 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {isSubmitting ? "Posting..." : "Post Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostFundingNeed;
