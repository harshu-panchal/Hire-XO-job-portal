import { 
  User, 
  Building2, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  ChevronRight,
  CreditCard,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecruiterSettings = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Account",
      items: [
        { label: "Profile Information", icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Company Details", icon: Building2, color: "text-primary", bg: "bg-primary/10" },
        { label: "Subscription Plan", icon: CreditCard, color: "text-amber-500", bg: "bg-amber-500/10" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { label: "Notifications", icon: Bell, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Security & Privacy", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Language", icon: Globe, color: "text-slate-500", bg: "bg-slate-500/10", value: "English" },
      ]
    }
  ];

  return (
    <div className="py-6 space-y-8 select-none pb-24">
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-black tracking-tighter">Recruiter <br /><span className="text-primary">Settings</span></h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Manage your profile and company</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/10 flex items-center gap-5">
        <div className="size-20 rounded-[2rem] bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Recruiter" 
            alt="Recruiter"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-black tracking-tight">John Wick</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiring Manager @ Continental</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">{section.title}</h3>
            <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden">
              {section.items.map((item, i) => (
                <button 
                  key={i}
                  className={`w-full p-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-white/5 transition-all ${
                    i !== section.items.length - 1 ? "border-b border-slate-100 dark:border-white/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-2xl ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`size-6 ${item.color}`} />
                    </div>
                    <span className="text-sm font-black tracking-tight">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.value && (
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.value}</span>
                    )}
                    <ChevronRight className="size-4 text-slate-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button 
        onClick={() => navigate("/")}
        className="w-full h-16 rounded-[2rem] bg-red-500/10 text-red-600 flex items-center justify-center gap-3 active:scale-95 transition-all border border-red-500/20"
      >
        <LogOut className="size-5" />
        <span className="text-[10px] font-black uppercase tracking-widest">Switch to Job Seeker</span>
      </button>

      <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] pt-4">
        Hire XO v1.0.4
      </p>
    </div>
  );
};

export default RecruiterSettings;