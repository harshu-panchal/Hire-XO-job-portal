import { useState } from "react";
import {
  User,
  Building2,
  Bell,
  ShieldCheck,
  LogOut,
  ChevronRight,
  CreditCard,
  Globe,
  Wallet,
  Award,
  Check,
  X,
  Scale,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "react-i18next";

const EmployerSettings = () => {
  const navigate = useNavigate();
  const { logout, user, checkSubscription } = useAuthStore();
  const isSubscribed = checkSubscription();
  const { t, i18n } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("app-language") || "English");

  const languages = [
    { name: "English", code: "en", native: "English" },
    { name: "Hindi", code: "hi", native: "Hindi" },
  ];

  const handleLanguageSelect = (langName: string, langCode: string) => {
    setLanguage(langName);
    localStorage.setItem("app-language", langName);
    i18n.changeLanguage(langCode);
    setShowLanguageModal(false);
  };

  const sections = [
    {
      title: t("employer.settings.sections.account.title"),
      items: [
        {
          label: t("employer.settings.sections.account.items.profile_information"),
          icon: User,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          routeKey: "Profile Information",
        },
        {
          label: t("employer.settings.sections.account.items.company_details"),
          icon: Building2,
          color: "text-primary",
          bg: "bg-primary/10",
          routeKey: "Company Details",
        },
        {
          label: t("employer.settings.sections.account.items.wallet_balance"),
          icon: Wallet,
          color: "text-green-500",
          bg: "bg-green-500/10",
          value: `Rs ${user?.walletBalance || user?.profile?.walletBalance || 0}`,
          routeKey: "Wallet Balance",
        },
        {
          label: t("employer.settings.sections.account.items.subscription_plan"),
          icon: CreditCard,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          value: isSubscribed ? "PRO" : "FREE",
          routeKey: "Subscription Plan",
        },
        {
          label: "Certificates",
          icon: Award,
          color: "text-indigo-500",
          bg: "bg-indigo-500/10",
          routeKey: "Certificates",
        },
      ],
    },
    {
      title: t("employer.settings.sections.preferences.title"),
      items: [
        {
          label: t("employer.settings.sections.preferences.items.notifications"),
          icon: Bell,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          routeKey: "Notifications",
        },
        {
          label: t("employer.settings.sections.preferences.items.security_privacy"),
          icon: ShieldCheck,
          color: "text-green-500",
          bg: "bg-green-500/10",
          routeKey: "Security & Privacy",
        },
        {
          label: t("employer.settings.sections.preferences.items.language"),
          icon: Globe,
          color: "text-slate-500",
          bg: "bg-slate-500/10",
          value: language,
          isLanguage: true,
        },
      ],
    },
    {
      title: "Legal & Support",
      items: [
        {
          label: "Terms of Service",
          icon: Scale,
          color: "text-slate-500",
          bg: "bg-slate-500/10",
          routeKey: "Terms",
        },
        {
          label: "Privacy Policy",
          icon: Shield,
          color: "text-slate-500",
          bg: "bg-slate-500/10",
          routeKey: "Privacy",
        },
      ],
    },
  ];

  return (
    <div className="py-6 space-y-8 select-none pb-24 relative px-4 sm:px-5 w-full max-w-3xl mx-auto">
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-black tracking-tighter">
          {t("employer.settings.role_title")} <br />
          <span className="text-primary">{t("employer.settings.page_title")}</span>
        </h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
          {t("employer.settings.subtitle")}
        </p>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-[2.5rem] border border-slate-200 flex items-center gap-4 sm:gap-5">
        <div className="size-16 sm:size-20 rounded-[2rem] bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl shrink-0">
          <img
            src={
              user?.profile?.profilePhoto ||
              user?.profilePhoto ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`
            }
            alt={user?.name || "User"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-black tracking-tight truncate">{user?.name}</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
            {user?.profile?.jobTitle || user?.role} {user?.profile?.company ? `@ ${user.profile.company}` : ""}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
              {section.title}
            </h3>
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if ((item as any).isLanguage) {
                      setShowLanguageModal(true);
                      return;
                    }

                    const routes: { [key: string]: string } = {
                      "Profile Information": "/employer/profile",
                      "Company Details": "/employer/company",
                      "Wallet Balance": "/employer/wallet",
                      "Subscription Plan": "/employer/subscription",
                      Certificates: "/employer/certificates",
                      Notifications: "/employer/settings/notifications",
                      "Security & Privacy": "/employer/security",
                      Terms: "/terms",
                      Privacy: "/privacy",
                    };

                    const key = (item as any).routeKey || item.label;
                    if (routes[key]) navigate(routes[key]);
                  }}
                  className={`w-full p-4 sm:p-5 flex items-center justify-between active:bg-slate-50 transition-all ${i !== section.items.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className={`size-10 sm:size-12 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}>
                      <item.icon className={`size-5 sm:size-6 ${item.color}`} />
                    </div>
                    <span className="text-sm font-black tracking-tight truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {item.value && (
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.value}
                      </span>
                    )}
                    <ChevronRight className="size-4 text-slate-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="w-full h-14 sm:h-16 rounded-[2rem] bg-red-500/10 text-red-600 flex items-center justify-center gap-3 active:scale-95 transition-all border border-red-500/20"
      >
        <LogOut className="size-5" />
        <span className="text-[10px] font-black uppercase tracking-widest">
          {t("employer.settings.logout")}
        </span>
      </button>

      <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] pt-2">
        {t("employer.settings.footer")}
      </p>

      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowLanguageModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-400 active:scale-90 transition-all"
            >
              <X className="size-5" />
            </button>
            <div className="mb-6">
              <h3 className="text-xl font-black tracking-tight mb-1">
                {t("employer.settings.modal.title")}
              </h3>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                {t("employer.settings.modal.subtitle")}
              </p>
            </div>

            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.name}
                  onClick={() => handleLanguageSelect(lang.name, lang.code)}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${language === lang.name ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-slate-50 hover:bg-slate-100"}`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-black">{lang.name}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${language === lang.name ? "text-white/70" : "text-slate-400"}`}>
                      {lang.native}
                    </span>
                  </div>
                  {language === lang.name && <Check className="size-5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerSettings;
