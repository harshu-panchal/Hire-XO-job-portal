import { useState, useEffect } from "react";
import { Calendar, Clock, Video, MapPin, CheckCircle, XCircle, AlertCircle, Search, ShieldCheck, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { interviewService, type Interview } from "@/services/interviewService";

import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Interviews = () => {
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const isEmployer = user?.role === "employer";

    const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'history' | 'verification'>('upcoming');
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const data = await interviewService.getMyInterviews();
                setInterviews(data);
            } catch (error) {
                console.error("Failed to fetch interviews:", error);
                toast.error("Failed to load interviews");
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "scheduled":
                return "text-blue-600 bg-blue-50 border-blue-200";
            case "pending":
                return "text-amber-600 bg-amber-50 border-amber-200";
            case "completed":
                return "text-green-600 bg-green-50 border-green-200";
            case "cancelled":
                return "text-red-600 bg-red-50 border-red-200";
            default:
                return "text-slate-600 bg-slate-50 border-slate-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "scheduled":
                return <Clock className="w-4 h-4" />;
            case "pending":
                return <AlertCircle className="w-4 h-4" />;
            case "completed":
                return <CheckCircle className="w-4 h-4" />;
            case "cancelled":
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const handleAction = (interview: any) => {
        if (interview.type === 'Remote') {
            if (interview.link) {
                window.open(interview.link, "_blank");
            } else {
                toast.info("Meeting link not available yet");
            }
        } else {
            if (interview.location) {
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(interview.location)}`, "_blank");
            } else {
                toast.info("Location details not available");
            }
        }
    };

    const handleVerify = (tierName: string, price: number) => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
            loading: 'Processing verification request...',
            success: `Successfully subscribed to ${tierName}! Verification pending.`,
            error: 'Failed to subscribe'
        });
    };

    const filteredInterviews = interviews.filter(interview => {
        const matchesSearch = (interview.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (interview.jobId?.company?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (interview.applicantId?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeTab === 'upcoming') return interview.status === 'scheduled';
        if (activeTab === 'pending') return interview.status === 'pending';
        if (activeTab === 'history') return ['completed', 'cancelled'].includes(interview.status);
        if (activeTab === 'verification') return true; // Show nothing or handle separately
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-5 space-y-4">
                <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    Loading interviews...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-700">
            <div className="bg-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-sm mb-6 sticky top-0 z-10">
                <h1 className="text-2xl font-black text-slate-900 mb-1">My Interviews</h1>
                <p className="text-slate-500 font-medium mb-6">Manage your upcoming and past interviews</p>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-2xl mb-4 overflow-x-auto no-scrollbar">
                    {(['upcoming', 'pending', 'history', 'verification'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search */}
                {activeTab !== 'verification' && (
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                        <input
                            type="text"
                            placeholder="Search interviews..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                )}
            </div>

            <div className="px-5 space-y-4">
                {activeTab === 'verification' ? (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2 mb-6">
                            <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-2" />
                            <h2 className="text-xl font-black text-slate-900">Verification Pricing Tiers</h2>
                            <p className="text-xs font-medium text-slate-500">Choose the tier that matches your verification timeline</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Free Tier */}
                            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer" onClick={() => handleVerify('Free Tier', 0)}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-green-400" />
                                <h3 className="text-sm font-black text-slate-900">Free Tier</h3>
                                <div className="text-2xl font-black text-slate-900 mt-2">₹0</div>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mt-1">1 Month+</p>
                            </div>

                            {/* Tier 2 */}
                            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer" onClick={() => handleVerify('Tier 2', 99)}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-400" />
                                <h3 className="text-sm font-black text-slate-900">Tier 2</h3>
                                <div className="text-2xl font-black text-slate-900 mt-2">₹99</div>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mt-1">15-30 Days</p>
                            </div>

                            {/* Tier 3 */}
                            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer" onClick={() => handleVerify('Tier 3', 149)}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-400" />
                                <h3 className="text-sm font-black text-slate-900">Tier 3</h3>
                                <div className="text-2xl font-black text-slate-900 mt-2">₹149</div>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mt-1">7-15 Days</p>
                            </div>

                            {/* Tier 4 */}
                            <div className="bg-amber-50 p-4 rounded-3xl border border-amber-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer" onClick={() => handleVerify('Tier 4', 199)}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                                <div className="absolute top-3 right-3 text-amber-500">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900">Tier 4</h3>
                                <div className="text-2xl font-black text-slate-900 mt-2">₹199</div>
                                <p className="text-[10px] uppercase font-black text-amber-600/70 tracking-wider mt-1">Up to 7 Days</p>
                            </div>
                        </div>

                        <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100">
                            <h4 className="font-black text-slate-900 text-sm mb-3">Stage 1 Clearance</h4>
                            <div className="flex items-start gap-3">
                                <div className="size-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                    <Check className="size-3 text-amber-600" />
                                </div>
                                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                    Verified for urgent / immediate requirement (up to 7 days). Prioritized profile visibility for recruiters.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : filteredInterviews.length > 0 ? (
                    filteredInterviews.map((interview) => (
                        <Card key={interview._id} className="p-5 border-slate-200 hover:shadow-md transition-all rounded-[2rem]">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-black text-lg text-slate-900 truncate max-w-[200px]">
                                        {isEmployer
                                            ? interview.applicantId?.name || "Candidate"
                                            : interview.jobId?.company || interview.resourceType || "Organization"}
                                    </h3>
                                    <p className="text-primary font-black text-[10px] uppercase tracking-widest">
                                        {interview.title || interview.jobId?.title || "Interview"}
                                    </p>
                                </div>
                                <div
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(
                                        interview.status
                                    )}`}
                                >
                                    {getStatusIcon(interview.status)}
                                    <span>{interview.status}</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-5">
                                <div className="flex items-center gap-3 text-slate-600 text-xs font-bold">
                                    <div className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Calendar className="size-4" />
                                    </div>
                                    <span>{new Date(interview.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 text-xs font-bold">
                                    <div className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Clock className="size-4" />
                                    </div>
                                    <span>{interview.time}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 text-xs font-bold">
                                    <div className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        {interview.type === "Remote" ? <Video className="size-4" /> : <MapPin className="size-4" />}
                                    </div>
                                    <span className="truncate">{interview.location || interview.type}</span>
                                </div>
                            </div>

                            {interview.status === "scheduled" && (
                                <Button
                                    onClick={() => handleAction(interview)}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest rounded-2xl h-14 shadow-lg shadow-primary/20 transition-all active:scale-95"
                                >
                                    {interview.type === "Remote" ? "Join Meeting" : "View Location"}
                                </Button>
                            )}

                            {interview.status === "pending" && (
                                <Button
                                    variant="outline"
                                    className="w-full border-slate-200 font-black text-xs uppercase tracking-widest rounded-2xl h-14 text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Awaiting Confirmation
                                </Button>
                            )}
                        </Card>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="size-24 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-center">
                            <Video className="size-10 text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black text-xl text-slate-900 tracking-tight">No {activeTab} interviews</h3>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest max-w-[250px] mx-auto">
                                {activeTab === 'upcoming'
                                    ? "You have no upcoming interviews scheduled."
                                    : activeTab === 'pending'
                                        ? "No pending interview requests."
                                        : "No interview history found."}
                            </p>
                        </div>
                        {activeTab === 'upcoming' && (
                            <Button
                                onClick={() => navigate(isEmployer ? '/employer/applications' : '/jobs')}
                                className="bg-primary text-white font-black px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                            >
                                {isEmployer ? "Manage Applications" : "Browse Jobs"}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Interviews;
