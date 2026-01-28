import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Building2, Phone, Mail, Briefcase, Upload, Eye, EyeOff, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import type { RecruiterSignupData } from "@/types";

const RecruiterSignup = () => {
    const navigate = useNavigate();
    const { signup, isLoading } = useAuthStore();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        company: "",
        phoneNumber: "",
        email: "",
        experience: 0,
        password: "",
        confirmPassword: "",
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.name || !formData.company || !formData.phoneNumber || !formData.email) {
            setError("Please fill in all required fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!logoFile) {
            setError("Company logo is required");
            return;
        }

        if (!formData.password || formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const signupData: RecruiterSignupData = {
                name: formData.name,
                company: formData.company,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                companyLogo: logoFile,
                experience: formData.experience,
                password: formData.password,
            };

            await signup(signupData, "recruiter");
            navigate("/recruiter");
        } catch (err) {
            setError("Failed to create account. Please try again.");
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-background flex flex-col justify-center p-6">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-full h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent rounded-bl-[4rem] -z-10" />
            <div className="absolute bottom-20 -left-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />

            <div className="w-full max-w-[430px] mx-auto space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/login/recruiter")}
                    className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                    <div className="size-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
                        <ArrowLeft className="size-4" />
                    </div>
                    <span className="text-sm font-semibold">Back</span>
                </button>

                {/* Header */}
                <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-4 transform hover:scale-105 transition-transform duration-300">
                        <Building2 className="size-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Recruiter Signup
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
                        Create your corporate account to start hiring top talent
                    </p>
                </div>

                {/* Form Card */}
                <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards delay-100">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {/* Company */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Company Name</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="Tech Solutions Inc."
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Phone */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        type="tel"
                                        placeholder="+91 987..."
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Experience */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Experience (Yrs)</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        type="number"
                                        placeholder="5"
                                        value={formData.experience || ""}
                                        onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                                        className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                        min="0"
                                        max="50"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="recruiter@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {/* Company Logo */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Company Logo</label>
                            <div className="relative group">
                                <Upload className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                                    className="pl-12 h-14 pt-3.5 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm text-slate-500 file:mr-4 file:py-0 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                                    required
                                />
                            </div>
                            {logoFile && (
                                <p className="text-xs text-green-600 dark:text-green-400 font-bold ml-1 flex items-center gap-1">
                                    <Check className="size-3" /> {logoFile.name}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Eye className="size-5" />
                                </div>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 6 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pl-12 pr-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                    autoComplete="new-password"
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

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Eye className="size-5" />
                                </div>
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="pl-12 pr-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    required
                                    autoComplete="new-password"
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

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in zoom-in-95 duration-200">
                                <p className="text-sm text-red-600 dark:text-red-400 font-bold text-center">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 mt-4 rounded-2xl text-base font-bold tracking-wide bg-gradient-to-r from-blue-500 to-cyan-600 hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating Account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        {/* Login Link */}
                        <div className="text-center pt-2 mt-4">
                            <p className="text-sm font-medium text-slate-500">
                                Already have an account?{" "}
                                <Link to="/login/recruiter" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
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

export default RecruiterSignup;
