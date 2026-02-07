import { useState, useEffect } from "react";
import { Calendar, Clock, Video, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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

    const handleJoin = (link?: string) => {
        if (link) {
            window.open(link, "_blank");
        } else {
            toast.info("Meeting link not available yet");
        }
    };

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
            <div className="bg-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-sm mb-6">
                <h1 className="text-2xl font-black text-slate-900">My Interviews</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your upcoming and past interviews</p>
            </div>

            <div className="px-5 space-y-4">
                {interviews.length > 0 ? (
                    interviews.map((interview) => (
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
                                    onClick={() => handleJoin(interview.link)}
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
                            <h3 className="font-black text-xl text-slate-900 tracking-tight">No interviews yet</h3>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest max-w-[250px] mx-auto">
                                {isEmployer
                                    ? "Review applications to schedule interviews with candidates."
                                    : "Apply to more jobs to start coordinating with employers!"}
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate(isEmployer ? '/employer/applications' : '/jobs')}
                            className="bg-primary text-white font-black px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            {isEmployer ? "Manage Applications" : "Browse Jobs"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Interviews;
