import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Upload, Plus, Trash2, ChevronRight, FileText, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { uploadService } from "@/services/uploadService";
import { toast } from "sonner";
import type { ResourceCategory } from "@/types";

const PostTender = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const isEditMode = location.state?.tender ? true : false;
  const existingTender = location.state?.tender;

  const [formData, setFormData] = useState({
    title: "",
    category: "Civil Works",
    type: "Open Tender",
    tenderValue: "",
    deadline: "",
    releaseDate: new Date().toISOString().split("T")[0],
    description: "",
    requirements: [""],
  });

  const [files, setFiles] = useState<File[]>([]);
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);

  useEffect(() => {
    if (existingTender) {
      setFormData({
        title: existingTender.title || "",
        category: existingTender.tenderCategory?.[0] || existingTender.category || "Civil Works",
        type: existingTender.type || "Open Tender",
        tenderValue: existingTender.tenderValue || existingTender.budget || "",
        deadline: existingTender.deadline
          ? new Date(existingTender.deadline).toISOString().split("T")[0]
          : "",
        releaseDate: existingTender.postedAt
          ? new Date(existingTender.postedAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        description: existingTender.description || "",
        requirements:
          existingTender.requirements && existingTender.requirements.length > 0
            ? existingTender.requirements
            : [""],
      });
      if (existingTender.documents) {
        setDocumentUrls(existingTender.documents);
      }
    }
  }, [existingTender]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ""] });
  };

  const removeRequirement = (index: number) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
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

  const removeExistingUrl = (index: number) => {
    setDocumentUrls(documentUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.tenderValue || !formData.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Upload new files if any
      const newUploadedUrls = [];
      if (files.length > 0) {
        const toastId = toast.loading("Uploading documents...");
        try {
          for (const file of files) {
            const res = await uploadService.uploadTenderDocument(file);
            newUploadedUrls.push(res.url);
          }
        } finally {
          toast.dismiss(toastId);
        }
      }

      const finalDocuments = [...documentUrls, ...newUploadedUrls];

      const payload = {
        title: formData.title,
        category: "Tenders" as ResourceCategory, // Use consistent category for the model
        tenderCategory: [formData.category], // Store sub-category here
        type: formData.type,
        tenderValue: formData.tenderValue,
        deadline: formData.deadline,
        description: formData.description,
        requirements: formData.requirements.filter((r) => r.trim() !== ""),
        documents: finalDocuments,
        status: "Active",
        location: "India", // Required by schema
        compensation: formData.tenderValue, // Required by schema
      };

      if (isEditMode && (existingTender._id || existingTender.id)) {
        await resourceService.update("tenders", existingTender._id || existingTender.id, payload);
        toast.success("Tender updated successfully!");
      } else {
        await resourceService.create("tenders", payload);
        toast.success("Tender published successfully!");
      }
      navigate("/tenders/provide/dashboard");
    } catch (error: any) {
      console.error("Failed to save tender", error);
      toast.error(error.message || "Failed to save tender");
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
              className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? "w-8 bg-indigo-600" : "w-1.5 bg-slate-200"}`}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight">
          {isEditMode ? "Update Tender" : "Post New Tender"}
        </h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
          Step {step} of 3:{" "}
          {step === 1
            ? "Basic Information"
            : step === 2
              ? "Specifications & Eligibility"
              : "Documents & Publish"}
        </p>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Title & Org */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Tender Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Smart City Infrastructure Phase 2"
                  className="w-full px-5 py-4 rounded-3xl bg-white border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                    className="w-full px-5 py-4 rounded-3xl bg-white border border-slate-200 font-bold focus:outline-none appearance-none"
                  >
                    <option>Civil Works</option>
                    <option>IT Services</option>
                    <option>Healthcare</option>
                    <option>Logistics</option>
                    <option>Electrical</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Tender Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-3xl bg-white border border-slate-200 font-bold focus:outline-none appearance-none"
                  >
                    <option>Open Tender</option>
                    <option>Limited Tender</option>
                    <option>Global Tender</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Value & Dates */}
            <div className="bg-indigo-50 rounded-[2.5rem] p-6 space-y-6 border border-indigo-100">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 ml-1">
                  Estimated Tender Value (₹)
                </label>
                <input
                  name="tenderValue"
                  value={formData.tenderValue}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. 25,00,00,000"
                  className="w-full px-5 py-4 rounded-3xl bg-white border-none font-black text-indigo-600 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 ml-1">
                    Release Date
                  </label>
                  <input
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                    type="date"
                    className="w-full px-5 py-4 rounded-3xl bg-white border-none font-bold text-sm shadow-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 ml-1">
                    Closing Date
                  </label>
                  <input
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    type="date"
                    className="w-full px-5 py-4 rounded-3xl bg-white border-none font-bold text-sm shadow-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Project Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Provide detailed information about the tender scope..."
                className="w-full px-5 py-4 rounded-[2rem] bg-white border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              ></textarea>
            </div>

            {/* Eligibility */}
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Eligibility Requirements
                </label>
                <button
                  onClick={addRequirement}
                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-indigo-600"
                >
                  <Plus className="size-3" /> Add More
                </button>
              </div>
              <div className="space-y-3">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      placeholder="Requirement details..."
                      className="flex-1 px-5 py-3.5 rounded-2xl bg-white border border-slate-100 font-bold text-sm"
                    />
                    <button
                      onClick={() => removeRequirement(index)}
                      className="size-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                    >
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
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-indigo-200 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 bg-indigo-50/30 cursor-pointer hover:bg-indigo-50/50 transition-colors"
            >
              <div className="size-16 rounded-[2rem] bg-white shadow-xl flex items-center justify-center">
                <Upload className="size-8 text-indigo-600" />
              </div>
              <div className="space-y-1">
                <p className="font-black tracking-tight">Upload Tender Documents</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  PDF, Word, Excel, ZIP (Max 10MB each)
                </p>
              </div>
              <div className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform">
                Select Files
              </div>
            </div>

            {(files.length > 0 || documentUrls.length > 0) && (
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Selected Documents
                </label>
                {documentUrls.map((url, index) => (
                  <div
                    key={`url-${index}`}
                    className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl"
                  >
                    <FileText className="size-5 text-emerald-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">Existing Document {index + 1}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                        Attached
                      </p>
                    </div>
                    <button
                      onClick={() => removeExistingUrl(index)}
                      className="size-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
                {files.map((file, index) => (
                  <div
                    key={`file-${index}`}
                    className="flex items-center gap-3 p-4 bg-white border border-indigo-200/50 rounded-2xl"
                  >
                    <FileText className="size-5 text-indigo-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{file.name}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="size-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Confirmation Checkbox */}
            <div className="p-6 bg-slate-50 rounded-[2rem] flex gap-4">
              <div className="mt-1">
                <input type="checkbox" required className="size-5 accent-indigo-600 rounded-lg" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                I verify that all the information provided is accurate and I have the authority to
                publish this tender on behalf of the organization.
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
              className="bg-white text-slate-900 border border-slate-200 px-8 font-black text-sm uppercase tracking-widest py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl"
            >
              Back
            </button>
          )}
          <button
            onClick={() => (step < 3 ? setStep(step + 1) : handleSubmit())}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-black text-sm uppercase tracking-[0.2em] py-5 rounded-[2rem] shadow-2xl shadow-indigo-500/40 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Publishing..."
              : step === 3
                ? isEditMode
                  ? "Update Tender"
                  : "Publish Tender"
                : "Next Step"}{" "}
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostTender;
