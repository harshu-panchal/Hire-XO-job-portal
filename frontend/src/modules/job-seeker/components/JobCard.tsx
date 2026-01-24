import {
    MapPin,
    Clock,
    Briefcase,
    Building2,
    Bookmark,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Job } from "@/types";

interface JobCardProps {
    job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
    return (
        <Link
            to={`/jobs/${job.id}`}
            className="block group relative bg-white dark:bg-slate-900/50 rounded-[2rem] p-4 border border-slate-200 dark:border-white/10 shadow-sm active:shadow-md active:scale-[0.98] active:border-primary/20 transition-all"
        >
            {/* Top row: Company & Bookmark */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden">
                        {job.companyLogo ? (
                            <img
                                src={job.companyLogo}
                                alt={job.company}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Building2 className="size-5 text-primary/60" />
                        )}
                    </div>
                    <div>
                        <p className="text-primary font-black uppercase tracking-widest text-[9px]">
                            {job.company}
                        </p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            {job.category}
                        </p>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                    className="size-9 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center active:scale-90 transition-transform border border-slate-100 dark:border-white/10"
                >
                    <Bookmark className="size-4 text-slate-300" />
                </button>
            </div>

            {/* Middle row: Job Title & Salary */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="space-y-2">
                    <h3 className="font-black text-xl tracking-tight group-active:text-primary transition-colors leading-tight">
                        {job.title}
                    </h3>
                    {job.requirements && job.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {job.requirements.slice(0, 2).map((req, i) => (
                                <span
                                    key={i}
                                    className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500"
                                >
                                    {req.split(" ").slice(0, 2).join(" ")}
                                </span>
                            ))}
                            {job.requirements.length > 2 && (
                                <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-400">
                                    +{job.requirements.length - 2} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="shrink-0 px-3 py-1.5 rounded-xl bg-green-500/10 text-green-600 border border-green-500/10">
                    <span className="text-xs font-black uppercase tracking-wider whitespace-nowrap">
                        {job.salary}
                    </span>
                </div>
            </div>

            {/* Bottom row: Info Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <MapPin className="size-3 mr-1.5 text-primary/60" />
                    {job.location}
                </div>
                <div className="size-1 rounded-full bg-slate-200 dark:bg-white/10" />
                <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <Briefcase className="size-3 mr-1.5 text-primary/60" />
                    {job.type}
                </div>
                <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-400 ml-auto">
                    <Clock className="size-3 mr-1.5 text-primary/60" />
                    {job.postedAt}
                </div>
            </div>
        </Link>
    );
};

export default JobCard;
