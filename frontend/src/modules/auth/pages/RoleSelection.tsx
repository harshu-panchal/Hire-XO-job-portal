import { useNavigate } from "react-router-dom";
import { Briefcase, Building2, Package, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const RoleSelection = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: "job-seeker",
            title: "Job Seeker",
            description: "Find your potential",
            icon: Briefcase,
            gradient: "from-violet-500 to-purple-600",
            bgGradient: "from-violet-500/10 to-purple-600/10",
            iconColor: "text-violet-600 dark:text-violet-400",
            path: "/login/job-seeker",
            delay: "0ms"
        },
        {
            id: "recruiter",
            title: "Recruiter",
            description: "Hire top talent",
            icon: Building2,
            gradient: "from-blue-500 to-cyan-600",
            bgGradient: "from-blue-500/10 to-cyan-600/10",
            iconColor: "text-blue-600 dark:text-blue-400",
            path: "/login/recruiter",
            delay: "100ms"
        },
        {
            id: "resources",
            title: "Resources",
            description: "Business partnerships",
            icon: Package,
            gradient: "from-emerald-500 to-teal-600",
            bgGradient: "from-emerald-500/10 to-teal-600/10",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            path: "/login/resource",
            delay: "200ms"
        },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-background flex flex-col justify-center p-6">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent rounded-b-[4rem] -z-10" />
            <div className="absolute top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="w-full max-w-[400px] mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center justify-center p-1 rounded-3xl bg-gradient-to-br from-slate-200 to-white dark:from-slate-800 dark:to-slate-900 shadow-xl mb-4">
                        <div className="size-20 bg-gradient-to-br from-primary to-purple-600 rounded-[1.4rem] flex items-center justify-center shadow-inner">
                            <span className="text-white font-black text-4xl tracking-tighter italic">H</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                            Hire <span className="text-primary">XO</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                            The future of hiring is here.
                        </p>
                    </div>
                </div>

                {/* Cards */}
                <div className="space-y-4">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                            <button
                                key={role.id}
                                onClick={() => navigate(role.path)}
                                className="w-full group relative animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
                                style={{ animationDelay: role.delay }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10" />

                                <Card className="relative overflow-hidden border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 p-1">
                                    <div className="p-4 flex items-center gap-5">
                                        <div className={`size-14 rounded-2xl bg-gradient-to-br ${role.bgGradient} flex items-center justify-center shrink-0`}>
                                            <Icon className={`size-7 ${role.iconColor}`} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                                {role.title}
                                            </h3>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {role.description}
                                            </p>
                                        </div>
                                        <div className="size-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <ArrowRight className="size-4" />
                                        </div>
                                    </div>

                                    {/* Bottom Gradient Line */}
                                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                </Card>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <p className="text-center text-xs font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                    v1.0.4 • Terms & Privacy
                </p>
            </div>
        </div>
    );
};

export default RoleSelection;
