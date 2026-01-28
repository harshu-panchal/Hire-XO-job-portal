import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Phone, Mail, GraduationCap, Calendar, Briefcase, Building2, Upload, Eye, EyeOff, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import type { JobSeekerSignupData } from "@/types";

const JobSeekerSignup = () => {
    const navigate = useNavigate();
    const { signup, isLoading } = useAuthStore();

    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState<Partial<JobSeekerSignupData> & { confirmPassword: string }>({
        name: "",
        phoneNumber: "",
        email: "",
        education: "",
        age: 0,
        experience: 0,
        interestedCompanies: [],
        password: "",
        confirmPassword: "",
    });

    const [companyInput, setCompanyInput] = useState("");
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const totalSteps = 3;

    const handleNext = () => {
        setError("");

        // Validation for each step
        if (currentStep === 1) {
            if (!formData.name || !formData.phoneNumber || !formData.email) {
                setError("Please fill in all required fields");
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                setError("Please enter a valid email address");
                return;
            }
        } else if (currentStep === 2) {
            if (!formData.education || !formData.age || !formData.experience) {
                setError("Please fill in all required fields");
                return;
            }
            if (formData.age < 18 || formData.age > 100) {
                setError("Please enter a valid age (18-100)");
                return;
            }
        }

        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        setError("");
        setCurrentStep(currentStep - 1);
    };

    const handleAddCompany = () => {
        if (companyInput.trim()) {
            setFormData({
                ...formData,
                interestedCompanies: [...(formData.interestedCompanies || []), companyInput.trim()],
            });
            setCompanyInput("");
        }
    };

    const handleRemoveCompany = (index: number) => {
        setFormData({
            ...formData,
            interestedCompanies: formData.interestedCompanies?.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.password || formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const signupData: JobSeekerSignupData = {
                name: formData.name!,
                phoneNumber: formData.phoneNumber!,
                email: formData.email!,
                education: formData.education!,
                age: formData.age!,
                experience: formData.experience!,
                interestedCompanies: formData.interestedCompanies || [],
                cv: cvFile || undefined,
                profilePhoto: photoFile || undefined,
                password: formData.password!,
            };

            await signup(signupData, "job-seeker");
            navigate("/jobs");
        } catch (err) {
            setError("Failed to create account. Please try again.");
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-background flex flex-col justify-center p-6">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-violet-500/10 to-transparent rounded-b-[4rem] -z-10" />
            <div className="absolute top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />

            <div className="w-full max-w-[400px] mx-auto space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => currentStep === 1 ? navigate("/login/job-seeker") : handleBack()}
                    className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                    <div className="size-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
                        <ArrowLeft className="size-4" />
                    </div>
                    <span className="text-sm font-semibold">Back</span>
                </button>

                {/* Header */}
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Create Account
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Step {currentStep} of {totalSteps} • <span className="text-primary font-bold">{
                            currentStep === 1 ? "Basic Details" :
                                currentStep === 2 ? "Experience" : "Security"
                        }</span>
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-2">
                    {[1, 2, 3].map((step) => (
                        <div
                            key={step}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step <= currentStep
                                ? "bg-gradient-to-r from-primary to-purple-600 shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                                : "bg-slate-200 dark:bg-slate-800"
                                }`}
                        />
                    ))}
                </div>

                {/* Form Card */}
                <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards delay-100">
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Professional Info */}
                        {currentStep === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Education</label>
                                    <div className="relative group">
                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="text"
                                            placeholder="Degree / Major"
                                            value={formData.education}
                                            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Age</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                type="number"
                                                placeholder="25"
                                                value={formData.age || ""}
                                                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                                                className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                                min="18"
                                                max="100"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Exp (Yrs)</label>
                                        <div className="relative group">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                type="number"
                                                placeholder="3"
                                                value={formData.experience || ""}
                                                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                                                className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                                min="0"
                                                max="50"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Target Companies</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1 group">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                type="text"
                                                placeholder="Google, Microsoft..."
                                                value={companyInput}
                                                onChange={(e) => setCompanyInput(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCompany())}
                                                className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                            />
                                        </div>
                                        <Button type="button" onClick={handleAddCompany} className="h-14 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90">
                                            Add
                                        </Button>
                                    </div>
                                    {formData.interestedCompanies && formData.interestedCompanies.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.interestedCompanies.map((company, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-bold uppercase tracking-wider animate-in zoom-in-50"
                                                >
                                                    {company}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveCompany(index)}
                                                        className="hover:text-red-500 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Files & Password */}
                        {currentStep === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Upload CV (Optional)</label>
                                    <div className="relative group">
                                        <Upload className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                            className="pl-12 h-14 pt-3.5 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm text-slate-500 file:mr-4 file:py-0 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                        />
                                    </div>
                                    {cvFile && <p className="text-xs text-green-600 font-bold ml-1 flex items-center gap-1"><Check className="size-3" /> {cvFile.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Profile Photo (Optional)</label>
                                    <div className="relative group">
                                        <Upload className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                                            className="pl-12 h-14 pt-3.5 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm text-slate-500 file:mr-4 file:py-0 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                        />
                                    </div>
                                    {photoFile && <p className="text-xs text-green-600 font-bold ml-1 flex items-center gap-1"><Check className="size-3" /> {photoFile.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Create Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Eye className="size-5" />
                                        </div>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Min. 6 characters"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="pl-12 pr-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Eye className="size-5" />
                                        </div>
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="pl-12 pr-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-5 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in zoom-in-95 duration-200">
                                <p className="text-sm text-red-600 dark:text-red-400 font-bold text-center">{error}</p>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-8 flex gap-3">
                            {currentStep < totalSteps ? (
                                <Button type="button" onClick={handleNext} className="w-full h-14 rounded-2xl text-base font-bold tracking-wide bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]">
                                    Next Step
                                </Button>
                            ) : (
                                <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl text-base font-bold tracking-wide bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]">
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating Account...
                                        </span>
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>
                            )}
                        </div>

                        {/* Login Link */}
                        <div className="text-center pt-2 mt-4">
                            <p className="text-sm font-medium text-slate-500">
                                Already have an account?{" "}
                                <Link to="/login/job-seeker" className="text-primary font-bold hover:underline">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default JobSeekerSignup;
