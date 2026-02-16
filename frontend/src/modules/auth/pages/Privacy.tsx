import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, Eye, Database, Share2, ClipboardCheck, MessageSquare } from "lucide-react";
import logo from "@/assets/logo.png";

const Privacy = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "1. Information We Collect",
            icon: Database,
            content: "We collect information you provide directly to us when you create an account, build your profile, apply for jobs, or communicate with us. This may include your name, email address, phone number, resume, and professional background.",
        },
        {
            title: "2. How We Use Information",
            icon: Eye,
            content: "We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you technical notices and support messages, and to connect job seekers with potential employers.",
        },
        {
            title: "3. Information Sharing",
            icon: Share2,
            content: "We do not share your personal information with third parties except as described in this policy. We may share information with employers (when you apply), service providers who perform work for us, or to comply with legal obligations.",
        },
        {
            title: "4. Data Security",
            icon: Lock,
            content: "We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no data transmission over the internet can be guaranteed as 100% secure.",
        },
        {
            title: "5. Your Choices",
            icon: ClipboardCheck,
            content: "You may update, correct, or delete your account information at any time by logging into your account or by contacting us. You can also opt-out of receiving promotional communications from us by following the instructions in those messages.",
        },
        {
            title: "6. Changes to this Policy",
            icon: MessageSquare,
            content: "We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors"
                    >
                        <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-active:scale-90 transition-all">
                            <ChevronLeft className="size-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Back</span>
                    </button>
                    <img src={logo} alt="HireXO" className="h-8 w-auto object-contain" />
                    <div className="w-20" /> {/* Spacer for symmetry */}
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 skew-x-[-2deg]">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                        Last Updated: February 16, 2026
                    </p>
                    <div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid gap-8">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <section
                                key={index}
                                className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                    <Icon className="size-32" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Icon className="size-6" />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                            {section.title}
                                        </h2>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {section.content}
                                    </p>
                                </div>
                            </section>
                        );
                    })}
                </div>

                <footer className="mt-20 text-center space-y-4 pb-12">
                    <p className="text-slate-400 text-sm font-medium">
                        © 2026 HireXO Portal. All rights reserved.
                    </p>
                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={() => navigate("/terms")}
                            className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors"
                        >
                            Terms of Service
                        </button>
                        <span className="size-1 rounded-full bg-slate-300" />
                        <a
                            href="mailto:privacy@hirexo.in"
                            className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors"
                        >
                            Privacy Support
                        </a>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Privacy;
