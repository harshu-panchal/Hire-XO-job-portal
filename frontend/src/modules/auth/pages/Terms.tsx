import { useNavigate } from "react-router-dom";
import { ChevronLeft, Scale, Shield, FileText, Globe, MessageSquare } from "lucide-react";
import logo from "@/assets/logo.png";

const Terms = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "1. Acceptance of Terms",
            icon: Scale,
            content: "By accessing or using the HireXO platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
        },
        {
            title: "2. User Accounts",
            icon: Shield,
            content: "To access certain features of the platform, you may be required to register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        },
        {
            title: "3. Platform Usage",
            icon: Globe,
            content: "HireXO provides a marketplace for job seekers, employers, and resource partners. You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the platform.",
        },
        {
            title: "4. Intellectual Property",
            icon: FileText,
            content: "All content, features, and functionality on the HireXO platform, including but not limited to text, graphics, logos, and software, are the exclusive property of HireXO and are protected by international copyright, trademark, and other intellectual property laws.",
        },
        {
            title: "5. Limitation of Liability",
            icon: Scale,
            content: "HireXO shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the platform.",
        },
        {
            title: "6. Contact Us",
            icon: MessageSquare,
            content: "If you have any questions about these Terms, please contact us at support@hirexo.in.",
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
                        Terms of Service
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
                            onClick={() => navigate("/privacy")}
                            className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors"
                        >
                            Privacy Policy
                        </button>
                        <span className="size-1 rounded-full bg-slate-300" />
                        <a
                            href="mailto:legal@hirexo.in"
                            className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors"
                        >
                            Contact Legal
                        </a>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Terms;
