import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ComingSoon = ({ title }: { title: string }) => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
                <p className="text-slate-500 max-w-xs mx-auto">
                    We are working hard to bring you this feature. Stay tuned for updates!
                </p>
            </div>

            <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Jobs</span>
            </Link>
        </div>
    );
};

export default ComingSoon;
