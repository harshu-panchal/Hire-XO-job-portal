import { Calendar, Clock, Video, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Interviews = () => {
    const interviews = [
        {
            id: 1,
            company: "Tech Corp Solutions",
            role: "Senior Frontend Developer",
            date: "2026-02-15",
            time: "10:00 AM",
            type: "Remote (Video)",
            status: "scheduled",
            link: "https://meet.google.com/abc-defg-hij",
        },
        {
            id: 2,
            company: "InnovateX",
            role: "Full Stack Engineer",
            date: "2026-02-18",
            time: "02:30 PM",
            type: "On-site",
            location: "Building A, Tech Park, Bangalore",
            status: "pending",
        },
        {
            id: 3,
            company: "Design Studio",
            role: "UI/UX Designer",
            date: "2026-02-10",
            time: "11:00 AM",
            type: "Remote (Video)",
            status: "completed",
        },
    ];

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

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-700">
            <div className="bg-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-sm mb-6">
                <h1 className="text-2xl font-black text-slate-900">My Interviews</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your upcoming and past interviews</p>
            </div>

            <div className="px-5 space-y-4">
                {interviews.map((interview) => (
                    <Card key={interview.id} className="p-5 border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{interview.company}</h3>
                                <p className="text-slate-500 font-medium text-sm">{interview.role}</p>
                            </div>
                            <div
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold capitalize ${getStatusColor(
                                    interview.status
                                )}`}
                            >
                                {getStatusIcon(interview.status)}
                                <span>{interview.status}</span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>{new Date(interview.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span>{interview.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                {interview.type.includes("Remote") ? (
                                    <Video className="w-4 h-4 text-slate-400" />
                                ) : (
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                )}
                                <span>{interview.location || interview.type}</span>
                            </div>
                        </div>

                        {interview.status === "scheduled" && interview.link && (
                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl h-11">
                                Join Interview
                            </Button>
                        )}

                        {interview.status === "pending" && (
                            <Button variant="outline" className="w-full border-slate-200 font-bold rounded-xl h-11 text-slate-600">
                                Reschedule
                            </Button>
                        )}
                    </Card>
                ))}

                {interviews.length === 0 && (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Video className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="font-bold text-slate-900">No interviews scheduled</h3>
                        <p className="text-slate-500 text-sm mt-1">
                            Apply to jobs to start getting interview calls!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Interviews;
