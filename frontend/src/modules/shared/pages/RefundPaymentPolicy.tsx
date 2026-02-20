import { useNavigate } from "react-router-dom";
import {
    ChevronLeft,
    ShieldCheck,
    CreditCard,
    RefreshCcw,
    AlertCircle,
    Clock,
    Mail,
    CheckCircle2,
    XCircle,
} from "lucide-react";

const sections = [
    {
        icon: CreditCard,
        color: "text-blue-600",
        bg: "bg-blue-500/10",
        title: "Payment Policy",
        items: [
            {
                heading: "Accepted Payment Methods",
                body: "We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI, Net Banking, and wallets (Paytm, PhonePe, Google Pay) via our secure payment gateway.",
            },
            {
                heading: "Subscription Billing",
                body: "Subscription plans are billed at the start of each billing cycle. You will receive an invoice via email on every successful payment.",
            },
            {
                heading: "Taxes",
                body: "All prices are exclusive of applicable GST (18%). The final amount including GST will be shown at checkout before payment.",
            },
            {
                heading: "Failed Payments",
                body: "If a payment fails, your plan will not be activated. Please retry or contact support. No amount is charged for failed transactions.",
            },
        ],
    },
    {
        icon: RefreshCcw,
        color: "text-emerald-600",
        bg: "bg-emerald-500/10",
        title: "Refund Policy",
        items: [
            {
                heading: "Eligibility for Refund",
                body: "Refund requests must be raised within 7 days of the payment date. Requests raised after 7 days will not be eligible for a refund.",
            },
            {
                heading: "Non-Refundable Plans",
                body: "Once a subscription plan is activated and services have been accessed (e.g. job applications submitted, resume views consumed, contact unlocks used), no refund will be issued.",
            },
            {
                heading: "Partial Refunds",
                body: "Partial refunds may be granted at HireXO's discretion if the service was significantly unavailable or disrupted during the subscription period.",
            },
            {
                heading: "Processing Time",
                body: "Approved refunds are processed in 5–7 business days and credited back to the original payment method.",
            },
        ],
    },
    {
        icon: CheckCircle2,
        color: "text-primary",
        bg: "bg-primary/10",
        title: "What is Refundable",
        items: [
            {
                heading: "Duplicate Payments",
                body: "If you were charged more than once for the same plan due to a technical error, the extra charge will be fully refunded.",
            },
            {
                heading: "Plan Not Activated",
                body: "If payment was deducted but the plan was never activated within 24 hours, a full refund will be issued.",
            },
            {
                heading: "Service Outage",
                body: "If our platform experienced a critical outage lasting more than 48 continuous hours during your active subscription, you may request a prorated refund.",
            },
        ],
    },
    {
        icon: XCircle,
        color: "text-red-500",
        bg: "bg-red-500/10",
        title: "What is Not Refundable",
        items: [
            {
                heading: "Used Services",
                body: "Any plan where services such as contact unlocks, job boosts, interview sessions, or application submissions have been used is non-refundable.",
            },
            {
                heading: "Change of Mind",
                body: "Refunds are not provided for change of mind or if you simply decide not to use the platform after purchase.",
            },
            {
                heading: "Promotional Plans",
                body: "Plans purchased at discounted or promotional rates are non-refundable.",
            },
        ],
    },
    {
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-500/10",
        title: "Cancellation Policy",
        items: [
            {
                heading: "Cancel Anytime",
                body: "You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing cycle.",
            },
            {
                heading: "No Carry-Over",
                body: "Unused credits or subscription benefits do not carry over after cancellation or expiry.",
            },
            {
                heading: "Auto-Renewal",
                body: "Subscriptions auto-renew unless cancelled before the renewal date. You will be notified via email 3 days before renewal.",
            },
        ],
    },
];

const RefundPaymentPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="size-10 flex items-center justify-center rounded-2xl bg-slate-100 active:scale-90 transition-all"
                >
                    <ChevronLeft className="size-5 text-slate-700" />
                </button>
                <div>
                    <h1 className="text-sm font-black uppercase tracking-widest text-slate-900">
                        Refund & Payment Policy
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Last updated: February 2026
                    </p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-5 pt-8 space-y-6">
                {/* Hero Banner */}
                <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-[2.5rem] p-8 text-white overflow-hidden shadow-2xl shadow-primary/30">
                    <div className="absolute top-0 right-0 size-48 bg-white/5 rounded-full -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 size-32 bg-black/10 rounded-full -ml-12 -mb-12" />
                    <div className="relative z-10">
                        <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                            <ShieldCheck className="size-7 text-white" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight leading-tight mb-2">
                            Transparent &amp; Fair Policies
                        </h2>
                        <p className="text-white/70 text-sm font-medium leading-relaxed">
                            We are committed to transparent billing and fair refund practices.
                            Please read our policies carefully before making a purchase.
                        </p>
                    </div>
                </div>

                {/* Important Notice */}
                <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-2xl border border-amber-200">
                    <div className="size-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertCircle className="size-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-amber-700 mb-1">
                            Important Notice
                        </p>
                        <p className="text-sm text-amber-800 font-medium leading-relaxed">
                            By completing a purchase on HireXO, you agree to the terms of
                            this Refund &amp; Payment Policy. We recommend reading this page
                            before subscribing to any plan.
                        </p>
                    </div>
                </div>

                {/* Policy Sections */}
                {sections.map((section, si) => (
                    <div
                        key={si}
                        className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm"
                    >
                        {/* Section Header */}
                        <div className="flex items-center gap-4 p-6 border-b border-slate-50">
                            <div
                                className={`size-12 rounded-2xl ${section.bg} flex items-center justify-center shrink-0`}
                            >
                                <section.icon className={`size-6 ${section.color}`} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                                {section.title}
                            </h3>
                        </div>

                        {/* Section Items */}
                        <div className="divide-y divide-slate-50">
                            {section.items.map((item, ii) => (
                                <div key={ii} className="p-6">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                                        {item.heading}
                                    </p>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                        {item.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Contact Support */}
                <div className="bg-slate-900 text-white rounded-[2rem] p-6 space-y-4 shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-white/10 flex items-center justify-center">
                            <Mail className="size-5 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Need Help?
                            </p>
                            <p className="text-sm font-black">Contact Support</p>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        For refund requests or payment issues, contact us at{" "}
                        <a
                            href="mailto:support@hirexo.in"
                            className="text-primary font-black hover:underline"
                        >
                            support@hirexo.in
                        </a>{" "}
                        with your registered email and order/transaction ID. Our team
                        responds within 1–2 business days.
                    </p>
                    <div className="pt-2 border-t border-white/10">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                            HireXO reserves the right to update this policy at any time.
                            Continued use of the platform constitutes acceptance of the
                            revised policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPaymentPolicy;
