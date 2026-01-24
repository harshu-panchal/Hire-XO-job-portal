import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  MapPin,
  DollarSign,
  Type
} from "lucide-react";

const PostJob = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "Development",
    type: "Full-time",
    location: "",
    salary: "",
    description: "",
    requirements: ["", ""],
    responsibilities: ["", ""],
  });

  const handleAddField = (field: 'requirements' | 'responsibilities') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const handleRemoveField = (field: 'requirements' | 'responsibilities', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (field: 'requirements' | 'responsibilities', index: number, value: string) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArr }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Success step
  };

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-5 text-center select-none">
        <div className="size-32 rounded-[3rem] bg-primary/10 flex items-center justify-center animate-bounce-subtle mb-8">
          <CheckCircle2 className="size-16 text-primary" />
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-3">Job Posted!</h1>
        <p className="text-slate-500 text-sm font-black leading-relaxed max-w-[280px] mx-auto mb-10">
          Your job listing for <span className="text-primary">{formData.title}</span> is now live and visible to candidates.
        </p>
        <button
          onClick={() => navigate("/recruiter")}
          className="h-16 w-full rounded-3xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32 select-none">
      {/* Header */}
      <div className="flex items-center justify-between py-6 sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 -mx-5 px-5">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all"
        >
          <ChevronLeft className="size-6" />
        </button>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step {step} of 2</p>
          <h2 className="text-sm font-black uppercase tracking-widest">Post a New Job</h2>
        </div>
        <div className="size-11" /> {/* Spacer */}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {step === 1 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Basic Information</label>

              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Type className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Job Title (e.g. Senior React Dev)"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-16 px-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black appearance-none"
                  >
                    <option>Development</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                  </select>
                </div>
                <div className="relative group">
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-16 px-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black appearance-none"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                  </select>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <MapPin className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Location (e.g. Remote, Bangalore)"
                  required
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <DollarSign className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Salary Range (e.g. ₹15L - ₹25L)"
                  required
                  value={formData.salary}
                  onChange={e => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Job Description</label>
              <textarea
                placeholder="Describe the role and your company..."
                required
                rows={5}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Requirements</label>
                <button
                  type="button"
                  onClick={() => handleAddField('requirements')}
                  className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center active:scale-90 transition-all"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <div className="space-y-3">
                {formData.requirements.map((req, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Requirement #${i + 1}`}
                      required
                      value={req}
                      onChange={e => handleInputChange('requirements', i, e.target.value)}
                      className="flex-1 h-14 px-5 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-xs font-black"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField('requirements', i)}
                        className="size-14 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 active:scale-90 transition-all"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Responsibilities</label>
                <button
                  type="button"
                  onClick={() => handleAddField('responsibilities')}
                  className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center active:scale-90 transition-all"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <div className="space-y-3">
                {formData.responsibilities.map((resp, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Responsibility #${i + 1}`}
                      required
                      value={resp}
                      onChange={e => handleInputChange('responsibilities', i, e.target.value)}
                      className="flex-1 h-14 px-5 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-xs font-black"
                    />
                    {formData.responsibilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField('responsibilities', i)}
                        className="size-14 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 active:scale-90 transition-all"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 z-40">
          <button
            type={step === 2 ? "submit" : "button"}
            onClick={() => step === 1 && setStep(2)}
            className="h-16 w-full rounded-3xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {step === 2 ? "Post Job Listing" : "Continue to Details"}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;