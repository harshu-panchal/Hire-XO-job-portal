import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Home, User, CreditCard, HelpCircle, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";

const FAQ = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const faqs = [
        {
            question: "How do I apply for jobs?",
            answer: "You can apply for jobs by navigating to the 'Jobs' tab, clicking on a job that interests you, and pressing the 'Apply Now' button.",
        },
        {
            question: "Is this platform free to use?",
            answer: "Yes! Job seeking features are completely free for candidates. We also offer premium plans with advanced features like profile highlighting and direct messaging.",
        },
        {
            question: "How can I update my profile?",
            answer: "Go to the 'Me' tab in the bottom navigation to access your profile. Click 'Edit Profile' to update your skills, experience, and personal details.",
        },
        {
            question: "What is the 'Resources' section?",
            answer: "The Resources section connects you with services like Equipment Rentals, Tender Opportunities, and Specialized Consultants tailored for your industry needs.",
        },
        {
            question: "How do I contact support?",
            answer: "If you need assistance, you can email our support team at support@hirexo.com or use the 'Contact Us' form in the Settings menu.",
        },
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const navItems = [
        { id: "home", label: "Home", icon: Home, path: "/" },
        { id: "profile", label: "Profile", icon: User, path: "/profile" },
        { id: "payment", label: "Payment", icon: CreditCard, path: "/subscriptions" },
        { id: "faq", label: "FAQ", icon: HelpCircle, path: "/faq" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-32 animate-in fade-in duration-700">
            <div className="bg-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-sm mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">FAQ</h1>
                    <p className="text-slate-500 font-medium mt-1">Frequently Asked Questions</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <ArrowLeft className="size-5" />
                </button>
            </div>

            <div className="px-5 space-y-3">
                {faqs.map((faq, index) => (
                    <Card
                        key={index}
                        className={`border-slate-200 overflow-hidden transition-all duration-300 ${openIndex === index ? "ring-2 ring-primary/10 shadow-md" : "hover:border-slate-300"
                            }`}
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-5 text-left"
                        >
                            <span className="font-bold text-slate-900 text-sm pr-4">{faq.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            )}
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out px-5 overflow-hidden ${openIndex === index ? "max-h-40 opacity-100 pb-5" : "max-h-0 opacity-0"
                                }`}
                        >
                            <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-3">
                                {faq.answer}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modern Bottom Navigation */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[400px] z-50">
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] p-2 flex items-center justify-between">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${isActive ? "text-primary bg-primary/10 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                <Icon className={`size-5 ${isActive ? "animate-bounce-short" : ""}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                {isActive && (
                                    <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
