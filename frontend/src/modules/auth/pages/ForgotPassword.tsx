import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col justify-center p-6 text-slate-900 dark:text-white">
        <div className="w-full max-w-[400px] mx-auto space-y-6">
          <Card className="border-0 bg-white dark:bg-slate-900 shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="size-16 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="size-8" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              We have sent a password reset link to{" "}
              <span className="font-semibold text-slate-900 dark:text-white">{email}</span>
            </p>

            <Link to="/login/employee">
              <Button className="w-full h-12 rounded-xl font-bold">Return to Login</Button>
            </Link>

            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 text-sm text-slate-500 hover:text-primary font-medium"
            >
              Try another email
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col justify-center p-6 text-slate-900 dark:text-white">
      <div className="w-full max-w-[400px] mx-auto space-y-6">
        {/* Back Link */}
        <Link
          to="/login/employee"
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <div className="size-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
            <ArrowLeft className="size-4" />
          </div>
          <span className="text-sm font-semibold">Back to Login</span>
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Forgot Password?</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Enter your email to reset your password
          </p>
        </div>

        {/* Form */}
        <Card className="border-0 bg-white dark:bg-slate-900 shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="size-5" />
                </div>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in zoom-in-95 duration-200">
                <p className="text-sm text-red-600 dark:text-red-400 font-bold text-center">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl text-base font-bold tracking-wide bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Reset Link <ChevronRight className="size-5" />
                </span>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
