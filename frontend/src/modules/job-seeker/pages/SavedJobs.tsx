import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useJobSeekerStore } from "@/store/useJobSeekerStore";
import { useEffect } from "react";
import JobCard from "@/modules/job-seeker/components/JobCard";

const SavedJobs = () => {
    const navigate = useNavigate();
    const { jobs, fetchJobs } = useJobSeekerStore();

    useEffect(() => {
        if (jobs.length === 0) {
            fetchJobs();
        }
    }, [jobs.length, fetchJobs]);

    // Simulate saved jobs by taking a few from the store or filtering (mock logic)
    // In a real app, this would be a separate API call or a filtered list
    const savedJobs = jobs.slice(0, 3);

    return (
        <div className="pb-32 min-h-screen">
            {/* Header */}
            <div className="sticky top-0 bg-slate-50/80 dark:bg-background/80 backdrop-blur-md z-20 px-5 py-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 active:scale-90 transition-all shadow-sm"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">Saved Jobs</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {savedJobs.length} Saved
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 space-y-4">
                {/* Search */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search className="size-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search saved..."
                            className="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <button className="size-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center active:scale-95 transition-all text-slate-400">
                        <SlidersHorizontal className="size-6" />
                    </button>
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                    {savedJobs.map((job) => (
                        <div key={job.id} className="relative group">
                            <JobCard job={job} />
                            <button
                                className="absolute top-4 right-4 size-10 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-white/10 flex items-center justify-center text-red-500 active:scale-90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Handle remove
                                }}
                            >
                                <Trash2 className="size-5" />
                            </button>
                        </div>
                    ))}

                    {savedJobs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="size-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                <Trash2 className="size-10 text-slate-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">No Saved Jobs</h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">Jobs you bookmark will appear here.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavedJobs;
