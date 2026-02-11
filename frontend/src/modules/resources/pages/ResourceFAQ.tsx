import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Home, User, CreditCard, HelpCircle, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const ResourceFAQ = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuthStore();

    const faqs = [
        {
            question: "What types of resources can I list?",
            answer: "You can list a wide range of resources including Investors, Tenders, Specialized Equipment, Machinery, PMC services, CSM services, Logistics support, and Vehicles tailored for project needs.",
        },
        {
            question: "How long will my listing be active?",
            answer: "The duration of your listing depends on your chosen subscription plan. Standard listings typically stay active for 30 days, while premium plans offer extended visibility.",
        },
        {
            question: "How do interested parties contact me?",
            answer: "Interested parties can send inquiries directly through the platform. You will receive notifications for new bids, rental requests, or consultation inquiries in your dashboard.",
        },
        {
            question: "Can I edit my listing after posting?",
            answer: "Yes, you can edit your listings at any time from your 'My Listings' or category-specific dashboard. Updates are reflected instantly to potential partners.",
        },
        {
            question: "What documents do I need to upload?",
            answer: "The required documents vary by category. For example, Tenders may require RFP documents, while Vehicles or Machinery might need registration or fitness certificates for verification.",
        },
        {
            question: "Is there a limit to how many resources I can list?",
            answer: "Posting is generally free, allowing you to list multiple resources. However, advanced visibility features and detailed lead data are accessible through our Resource Subscription plans.",
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const navItems = [
        { id: "home", label: "Home", icon: Home, path: "/" },
        { id: "profile", label: "Profile", icon: User, path: "/profile" },
        { id: "payment", label: "Payment", icon: CreditCard, path: "/resource-plans" },
        { id: "faq", label: "FAQ", icon: HelpCircle, path: "/resource-plans/faq" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-32 animate-in fade-in duration-700">
            <div className="bg-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-sm mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Resource FAQ</h1>
                    <p className="text-slate-500 font-medium mt-1">Resource Module Questions</p>
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
                                onClick={() => {
                                    if (!isAuthenticated && item.path === "/profile") {
                                        navigate("/login/resource");
                                    } else {
                                        navigate(item.path);
                                    }
                                }}
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

export default ResourceFAQ;
