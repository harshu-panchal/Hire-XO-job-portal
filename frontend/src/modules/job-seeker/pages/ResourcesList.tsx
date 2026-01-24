import { Search, Package, TrendingUp, CheckCircle2 } from "lucide-react";
import { useResourceStore } from "@/store/useResourceStore";
import { useEffect } from "react";
import ResourceCard from "@/modules/job-seeker/components/ResourceCard";
import ResourceCategoryFilter from "@/modules/job-seeker/components/ResourceCategoryFilter";

const ResourcesList = () => {
    const { resources, filters, setSearch, setCategory, fetchResources } = useResourceStore();

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const filteredResources = resources.filter((resource) => {
        const matchesSearch =
            resource.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            resource.company.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory = filters.category === "all" || resource.category === filters.category;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="py-6 space-y-8 select-none">
            {/* Header */}
            <div className="space-y-4">
                <div className="space-y-1 px-1">
                    <h1 className="text-4xl font-black tracking-tighter leading-tight">
                        Quick <br />
                        <span className="text-primary">Resources</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">
                        {filteredResources.length} opportunities available
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 py-2">
                    <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-6 flex items-center justify-between active:scale-95 transition-transform duration-200">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="size-7 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-0.5">
                                    Active Tenders
                                </p>
                                <p className="text-2xl font-black tracking-tight">{resources.filter(r => r.category === "Tenders").length}+</p>
                            </div>
                        </div>
                        <div className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">
                            Open to All
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                                <Package className="size-6 text-purple-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                Categories
                            </p>
                            <p className="text-xl font-black tracking-tight">6</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-purple-500/60 mt-2">
                                All Available
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-5 active:scale-95 transition-transform duration-200">
                            <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                <TrendingUp className="size-6 text-emerald-500" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                This Week
                            </p>
                            <p className="text-xl font-black tracking-tight">{resources.length}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">
                                New Listings
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search resources or companies..."
                        value={filters.search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-16 pl-14 pr-6 rounded-[2rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 focus:border-primary/30 focus:ring-0 transition-all text-sm font-black placeholder:text-slate-400 placeholder:font-black"
                    />
                </div>

                {/* Category Filter */}
                <ResourceCategoryFilter
                    activeCategory={filters.category}
                    onCategoryChange={setCategory}
                />
            </div>

            {/* Resources List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <div className="size-20 rounded-[2rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                            <Package className="size-10 text-slate-300" />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="text-xl font-black tracking-tight">No Resources Found</h3>
                            <p className="text-sm font-black text-slate-400">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourcesList;
