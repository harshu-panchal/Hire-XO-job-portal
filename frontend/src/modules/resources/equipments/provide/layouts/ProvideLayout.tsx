import { Outlet } from "react-router-dom";
import ProvideNavbar from "../components/ProvideNavbar";
import { Bell } from "lucide-react";

const ProvideLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white pb-24">
            <div className="max-w-[430px] mx-auto min-h-screen bg-white dark:bg-slate-950 shadow-2xl relative border-x border-slate-100 dark:border-white/5">
                {/* Sticky Header */}
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <span className="font-black text-lg italic">XO</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 leading-none">Equipments</p>
                            <h2 className="text-xs font-black tracking-tight leading-none mt-0.5 uppercase">Lender Portal</h2>
                        </div>
                    </div>
                    <button className="size-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 relative">
                        <Bell className="size-5" />
                        <span className="absolute top-2.5 right-2.5 size-2 bg-blue-500 rounded-full border-2 border-white dark:border-slate-950"></span>
                    </button>
                </header>

                {/* Content Area */}
                <main className="px-6 relative">
                    <Outlet />
                </main>

                {/* Nav Bar */}
                <ProvideNavbar />
            </div>
        </div>
    );
};

export default ProvideLayout;
