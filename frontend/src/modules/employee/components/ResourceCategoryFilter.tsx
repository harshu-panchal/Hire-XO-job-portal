import { Package, Truck, Wrench, Car, Building, HardHat, TrendingUp, Cog } from "lucide-react";
import type { ResourceCategory } from "@/types";

interface ResourceCategoryFilterProps {
    activeCategory: ResourceCategory | "all";
    onCategoryChange: (category: ResourceCategory | "all") => void;
}

const ResourceCategoryFilter = ({ activeCategory, onCategoryChange }: ResourceCategoryFilterProps) => {
    const categories: Array<{ id: ResourceCategory | "all"; label: string; icon: typeof Package }> = [
        { id: "all", label: "All", icon: Package },
        { id: "Investor", label: "Investor", icon: TrendingUp },
        { id: "Tenders", label: "Tenders", icon: Package },
        { id: "Equipments", label: "Equipments", icon: Wrench },
        { id: "Machinery", label: "Machinery", icon: Cog },
        { id: "PMC", label: "PMC", icon: Building },
        { id: "CSM", label: "CSM", icon: HardHat },
        { id: "Logistics", label: "Logistics", icon: Truck },
        { id: "Vehicles", label: "Vehicles", icon: Car },
    ];

    // Category-specific colors
    const categoryColors: Record<string, string> = {
        all: "bg-primary text-white shadow-lg shadow-primary/20",
        Investor: "bg-amber-500 text-white shadow-lg shadow-amber-500/20",
        Tenders: "bg-purple-500 text-white shadow-lg shadow-purple-500/20",
        Equipments: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20",
        Machinery: "bg-slate-500 text-white shadow-lg shadow-slate-500/20",
        PMC: "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
        CSM: "bg-rose-500 text-white shadow-lg shadow-rose-500/20",
        Logistics: "bg-orange-500 text-white shadow-lg shadow-orange-500/20",
        Vehicles: "bg-blue-500 text-white shadow-lg shadow-blue-500/20",
    };

    return (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-5 px-5">
            {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;

                return (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id)}
                        className={`whitespace-nowrap px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-90 flex items-center gap-2 ${isActive
                            ? categoryColors[cat.id]
                            : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-400"
                            }`}
                    >
                        <Icon className="size-4" />
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
};

export default ResourceCategoryFilter;
