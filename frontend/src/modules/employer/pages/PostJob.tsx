import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ChevronLeft,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  MapPin,
  DollarSign,
  Type,
} from "lucide-react";
import { jobService } from "@/services/jobService";


const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1); // 1 = Form, 3 = Success
  const [formData, setFormData] = useState({
    title: "",
    category: "Development",
    type: "Full-time",
    location: "",
    minSalary: "",
    maxSalary: "",
    experience: "",
    vacancies: "",
    description: "",
    requirements: ["", ""], // Required Skills
  });

  const handleAddField = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const handleRemoveField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newArr = [...formData.requirements];
    newArr[index] = value;
    setFormData((prev) => ({ ...prev, requirements: newArr }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const title = formData.title.trim();
      const category = formData.category.trim();
      const location = formData.location.trim();
      const description = formData.description.trim();
      const requirements = formData.requirements.map((r) => r.trim()).filter((r) => r !== "");

      const minSalary = Number(formData.minSalary);
      const maxSalary = Number(formData.maxSalary);
      const experience = Number(formData.experience);
      const vacancies = Number(formData.vacancies);

      if (description.length < 10) {
        alert("Job description must be at least 10 characters.");
        return;
      }
      if (requirements.length < 1) {
        alert("Please add at least one required skill.");
        return;
      }
      if (!Number.isFinite(minSalary) || !Number.isFinite(maxSalary)) {
        alert("Please enter valid salary values.");
        return;
      }
      if (minSalary > maxSalary) {
        alert("Minimum salary cannot be greater than maximum salary.");
        return;
      }
      if (!Number.isFinite(experience) || experience < 0) {
        alert("Please enter valid required experience.");
        return;
      }
      if (!Number.isFinite(vacancies) || vacancies < 1) {
        alert("Please enter at least 1 vacancy.");
        return;
      }

      const min = `${minSalary}`;
      const max = `${maxSalary}`;
      const salaryString = `${min} - ${max} LPA`;

      await jobService.createJob({
        title,
        category,
        type: formData.type as any,
        location,
        salary: salaryString, // Backward compatibility
        minSalary,
        maxSalary,
        experience,
        vacancies,
        description,
        requirements,
        responsibilities: [], // Removed as not requested
      });
      setStep(3); // Success step
    } catch (error: any) {
      console.error("Failed to post job", error);
      alert(error?.message || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };




  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-5 text-center select-none">
        <div className="size-32 rounded-[3rem] bg-primary/10 flex items-center justify-center animate-bounce-subtle mb-8">
          <CheckCircle2 className="size-16 text-primary" />
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-3">Job Posted!</h1>
        <p className="text-slate-500 text-sm font-black leading-relaxed max-w-[280px] mx-auto mb-10">
          Your job listing for <span className="text-primary">{formData.title}</span> is now live.{" "}
          <br />
          <span className="text-xs text-green-500 mt-2 block">Posted for Free!</span>
        </p>
        <button
          onClick={() => navigate("/employer")}
          className="mt-6 h-16 w-full rounded-3xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="pb-40 select-none">
      {/* Header */}
      <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 -mx-5 px-5">
        <button
          onClick={() => navigate(-1)}
          className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all"
        >
          <ChevronLeft className="size-6" />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-black uppercase tracking-widest">Post a New Job</h2>
        </div>
        <div className="size-11" /> {/* Spacer */}
      </div>



      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        <div className="space-y-6">

          {/* Job Title */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Type className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Job Title (e.g. Senior React Dev)"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white border-2 border-slate-100 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
            />
          </div>

          {/* Category, Experience, Vacancies */}
          <div className="grid grid-cols-1 gap-4">
            <div className="relative group">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 mb-1.5 block">Job Category</label>
              <input
                type="text"
                placeholder="e.g. Development, Design, Marketing..."
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-16 px-6 rounded-2xl bg-white border-2 border-slate-100 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 mb-1.5 block">Req. Experience (Yrs)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 2"
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full h-16 px-6 rounded-2xl bg-white border-2 border-slate-100 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 mb-1.5 block">No. of Vacancies</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 1"
                  required
                  value={formData.vacancies}
                  onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                  className="w-full h-16 px-6 rounded-2xl bg-white border-2 border-slate-100 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
                />
              </div>
            </div>
          </div>

          {/* Heading: Compensation and Location */}
          <div className="pt-4 pb-1 border-b border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Compensation and Location</h3>
          </div>

          {/* Min/Max Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <DollarSign className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="number"
                placeholder="Min Salary (LPA)"
                required
                value={formData.minSalary}
                onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                className="w-full h-16 pl-12 pr-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <DollarSign className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="number"
                placeholder="Max Salary (LPA)"
                required
                value={formData.maxSalary}
                onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
                className="w-full h-16 pl-12 pr-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
              />
            </div>
          </div>

          {/* Job Location */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <MapPin className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Job Location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white border-2 border-slate-100 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
            />
          </div>

          {/* Heading: Requirement */}
          <div className="pt-4 pb-1 border-b border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Requirement</h3>
          </div>

          {/* Required Skills */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                Required Skills
              </label>
              <button
                type="button"
                onClick={handleAddField}
                className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center active:scale-90 transition-all"
              >
                <Plus className="size-4" />
              </button>
            </div>
            {formData.requirements.map((req, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Skill #${i + 1}`}
                  required
                  value={req}
                  onChange={(e) => handleRequirementChange(i, e.target.value)}
                  className="flex-1 h-14 px-5 rounded-xl bg-white border-2 border-slate-100 focus:border-primary/30 focus:ring-0 transition-all text-xs font-black"
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField(i)}
                    className="size-14 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 active:scale-90 transition-all"
                  >
                    <Trash2 className="size-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">
              Job Description
            </label>
            <textarea
              placeholder="Describe the role and your company..."
              required
              rows={8}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-6 rounded-3xl bg-white border-2 border-slate-100 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black resize-none"
            />
          </div>

        </div>

        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 z-40">
          <button
            type="submit"
            disabled={loading}
            className="mt-8 h-16 w-full rounded-3xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? "Posting..." : "Post Job Now"}
            {!loading && <ArrowRight className="size-4" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
