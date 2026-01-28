import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Bookmark,
    Share2,
    MapPin,
    Calendar,
    TrendingUp,
    Users,
    CheckCircle2,
    Mail,
    Phone,
} from "lucide-react";

const OpportunityDetails = () => {
    useParams();

    // Mock data - in real app, fetch based on id
    const opportunity = {
        id: 1,
        company: "TechVenture Solutions",
        logo: "T",
        logoGradient: "from-blue-500 to-cyan-600",
        sector: "Technology",
        title: "AI-Powered SaaS Platform Expansion",
        description:
            "We are seeking strategic investment to scale our AI-driven customer analytics platform across Asian markets. Our platform helps businesses understand customer behavior through advanced machine learning algorithms and predictive analytics.",
        amount: "₹5 Crore",
        equity: "15%",
        duration: "24 months",
        roi: "25-30%",
        location: "Bangalore, Karnataka, India",
        founded: "2019",
        employees: "45-50",
        revenue: "₹12 Cr (FY 2023-24)",
        bookmarked: false,
        details: {
            useOfFunds: [
                { item: "Product Development & R&D", percentage: 40, amount: "₹2 Cr" },
                { item: "Market Expansion (Asia Pacific)", percentage: 30, amount: "₹1.5 Cr" },
                { item: "Team Expansion & Hiring", percentage: 20, amount: "₹1 Cr" },
                { item: "Marketing & Sales", percentage: 10, amount: "₹0.5 Cr" },
            ],
            highlights: [
                "200+ enterprise clients across 15 countries",
                "95% customer retention rate",
                "3x YoY revenue growth for past 3 years",
                "Partnerships with AWS, Google Cloud, Microsoft Azure",
                "ISO 27001 certified for data security",
            ],
            requirements: [
                "Strategic investor with experience in SaaS/Technology sector",
                "Network in Asian markets preferred",
                "Long-term investment horizon (minimum 2 years)",
                "Active involvement in strategic decisions",
            ],
            milestones: [
                { quarter: "Q1 2025", goal: "Launch in Singapore & Malaysia" },
                { quarter: "Q2 2025", goal: "Acquire 50 new enterprise clients" },
                { quarter: "Q3 2025", goal: "Expand to Thailand & Vietnam" },
                { quarter: "Q4 2025", goal: "Achieve ₹20 Cr ARR" },
            ],
        },
        contact: {
            name: "Rajesh Kumar",
            designation: "CEO & Founder",
            email: "rajesh@techventure.com",
            phone: "+91 98765 43210",
        },
    };

    return (
        <div className="py-6 space-y-6 select-none">
            {/* Back Button */}
            <Link
                to="/investor/browse/opportunities"
                className="inline-flex items-center gap-2 text-sm font-black text-slate-600 dark:text-slate-300 active:scale-95 transition-transform"
            >
                <ArrowLeft className="size-4" />
                <span>Back to Opportunities</span>
            </Link>

            {/* Header Card */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                        <div
                            className={`size-16 rounded-2xl bg-gradient-to-br ${opportunity.logoGradient} flex items-center justify-center text-white font-black text-2xl shrink-0`}
                        >
                            {opportunity.logo}
                        </div>
                        <div>
                            <p className="text-primary font-black uppercase tracking-widest text-[9px] mb-1">
                                {opportunity.company}
                            </p>
                            <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/10 mb-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">
                                    {opportunity.sector}
                                </span>
                            </div>
                            <h1 className="text-2xl font-black tracking-tight">{opportunity.title}</h1>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="size-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-all">
                            <Bookmark className="size-5 text-slate-400" />
                        </button>
                        <button className="size-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-all">
                            <Share2 className="size-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-900">
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                            Investment Needed
                        </p>
                        <p className="text-2xl font-black text-emerald-700 dark:text-emerald-500">{opportunity.amount}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-200 dark:border-blue-900">
                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">Equity Offered</p>
                        <p className="text-2xl font-black text-blue-700 dark:text-blue-500">{opportunity.equity}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-4 border border-purple-200 dark:border-purple-900">
                        <p className="text-[9px] font-black uppercase tracking-widest text-purple-600 mb-1">Expected ROI</p>
                        <p className="text-2xl font-black text-purple-700 dark:text-purple-500">{opportunity.roi}</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-900">
                        <p className="text-[9px] font-black uppercase tracking-widest text-amber-600 mb-1">Duration</p>
                        <p className="text-2xl font-black text-amber-700 dark:text-amber-500">{opportunity.duration}</p>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-black tracking-tight mb-4">About the Opportunity</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{opportunity.description}</p>
            </div>

            {/* Company Info */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-black tracking-tight mb-4">Company Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <MapPin className="size-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Location</p>
                            <p className="text-sm font-bold">{opportunity.location}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <Calendar className="size-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Founded</p>
                            <p className="text-sm font-bold">{opportunity.founded}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <Users className="size-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Team Size</p>
                            <p className="text-sm font-bold">{opportunity.employees}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <TrendingUp className="size-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Revenue</p>
                            <p className="text-sm font-bold">{opportunity.revenue}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Use of Funds */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-black tracking-tight mb-4">Use of Funds</h2>
                <div className="space-y-3">
                    {opportunity.details.useOfFunds.map((fund, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold">{fund.item}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-emerald-600">{fund.amount}</span>
                                    <span className="text-xs font-black text-slate-400">({fund.percentage}%)</span>
                                </div>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                                    style={{ width: `${fund.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Highlights */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-black tracking-tight mb-4">Key Highlights</h2>
                <div className="space-y-3">
                    {opportunity.details.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">{highlight}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Milestones */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-black tracking-tight mb-4">Growth Milestones</h2>
                <div className="space-y-3">
                    {opportunity.details.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-xs font-black text-primary">{milestone.quarter}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold">{milestone.goal}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Requirements */}
            <div className="bg-white dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-black tracking-tight mb-4">Investor Requirements</h2>
                <div className="space-y-3">
                    {opportunity.details.requirements.map((req, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className="size-6 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs font-black text-blue-600">{index + 1}</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{req}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-[2rem] p-6 border border-primary/20">
                <h2 className="text-xl font-black tracking-tight mb-4">Contact Person</h2>
                <div className="flex items-start gap-4 mb-4">
                    <div className="size-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-xl">
                        {opportunity.contact.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-black text-lg">{opportunity.contact.name}</p>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{opportunity.contact.designation}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <a
                        href={`mailto:${opportunity.contact.email}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-900/50 active:scale-95 transition-all"
                    >
                        <Mail className="size-5 text-primary" />
                        <span className="text-sm font-bold">{opportunity.contact.email}</span>
                    </a>
                    <a
                        href={`tel:${opportunity.contact.phone}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-900/50 active:scale-95 transition-all"
                    >
                        <Phone className="size-5 text-primary" />
                        <span className="text-sm font-bold">{opportunity.contact.phone}</span>
                    </a>
                </div>
            </div>

            {/* CTA Button */}
            <button className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-primary to-primary/80 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">
                Express Interest
            </button>
        </div>
    );
};

export default OpportunityDetails;
