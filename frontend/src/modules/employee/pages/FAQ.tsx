import { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const FAQ = () => {
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

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-700">
            <div className="bg-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-sm mb-6">
                <h1 className="text-2xl font-black text-slate-900">FAQ</h1>
                <p className="text-slate-500 font-medium mt-1">Frequently Asked Questions</p>
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
        </div>
    );
};

export default FAQ;
