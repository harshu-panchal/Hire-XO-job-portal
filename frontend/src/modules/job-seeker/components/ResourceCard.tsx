import {
    MapPin,
    Clock,
    Briefcase,
    Building2,
    Bookmark,
    DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Resource } from "@/types";
import { useResourceStore } from "@/store/useResourceStore";

interface ResourceCardProps {
    resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
    const { bookmarkedResources, toggleBookmark } = useResourceStore();
    const isBookmarked = bookmarkedResources.includes(resource.id);

    // Category-specific colors
    const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
        Tenders: { bg: "bg-purple-500/10", text: "text-purple-600", border: "border-purple-500/10" },
        Logistics: { bg: "bg-orange-500/10", text: "text-orange-600", border: "border-orange-500/10" },
        Equipments: { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/10" },
        Vehicles: { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/10" },
        PMC: { bg: "bg-indigo-500/10", text: "text-indigo-600", border: "border-indigo-500/10" },
        CSM: { bg: "bg-rose-500/10", text: "text-rose-600", border: "border-rose-500/10" },
    };

    const colors = categoryColors[resource.category] || categoryColors.Tenders;

    return (
        <Link
            to={`/resources/${resource.id}`}
            className="flex flex-col h-full group relative bg-white dark:bg-slate-900/50 rounded-[2rem] p-4 border border-slate-200 dark:border-white/10 shadow-sm active:shadow-md active:scale-[0.98] active:border-primary/20 transition-all"
        >
            <div className="flex-1">
                {/* Top row: Company & Bookmark */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden">
                            {resource.companyLogo ? (
                                <img
                                    src={resource.companyLogo}
                                    alt={resource.company}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Building2 className="size-5 text-primary/60" />
                            )}
                        </div>
                        <div>
                            <p className="text-primary font-black uppercase tracking-widest text-[9px]">
                                {resource.company}
                            </p>
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-md ${colors.bg} ${colors.border} border mt-0.5`}>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${colors.text}`}>
                                    {resource.category}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            toggleBookmark(resource.id);
                        }}
                        className="size-9 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center active:scale-90 transition-transform border border-slate-100 dark:border-white/10"
                    >
                        <Bookmark
                            className={`size-4 ${isBookmarked ? "fill-primary text-primary" : "text-slate-300"}`}
                        />
                    </button>
                </div>

                {/* Middle row: Resource Title & Compensation */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="space-y-2 flex-1">
                        <h3 className="font-black text-xl tracking-tight group-active:text-primary transition-colors leading-tight">
                            {resource.title}
                        </h3>
                        {resource.duration && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="size-3 text-slate-400" />
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                                    {resource.duration}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="shrink-0 px-3 py-1.5 rounded-xl bg-green-500/10 text-green-600 border border-green-500/10">
                        <span className="text-xs font-black uppercase tracking-wider whitespace-nowrap">
                            {resource.compensation}
                        </span>
                    </div>
                </div>

            </div>
            {/* Bottom row: Info Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <MapPin className="size-3 mr-1.5 text-primary/60" />
                    {resource.location}
                </div>
                <div className="size-1 rounded-full bg-slate-200 dark:bg-white/10" />
                <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <Briefcase className="size-3 mr-1.5 text-primary/60" />
                    {resource.type}
                </div>
                {resource.urgency && (
                    <>
                        <div className="size-1 rounded-full bg-slate-200 dark:bg-white/10" />
                        <div className={`flex items-center text-[9px] font-black uppercase tracking-widest ${resource.urgency === "Immediate" ? "text-red-500" : "text-slate-400"
                            }`}>
                            <DollarSign className="size-3 mr-1.5" />
                            {resource.urgency}
                        </div>
                    </>
                )}
                <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-400 ml-auto">
                    <Clock className="size-3 mr-1.5 text-primary/60" />
                    {resource.postedAt}
                </div>
            </div>
        </Link>
    );
};

export default ResourceCard;
