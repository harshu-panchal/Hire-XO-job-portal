import { useState, useEffect } from "react";
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
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const EmployerSettings = () => {
  const navigate = useNavigate();
  const { logout, user, updateProfile } = useAuthStore();
  const { t, i18n } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("app-language") || "English");

  const languages = [
    { name: "English", code: "en", native: "English" },
    { name: "Hindi", code: "hi", native: "हिंदी" },
    { name: "Spanish", code: "es", native: "Español" },
    { name: "French", code: "fr", native: "Français" },
    { name: "German", code: "de", native: "Deutsch" },
    { name: "Chinese", code: "zh", native: "中文" },
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
          value: `₹${user?.profile?.walletBalance || 0}`,
          routeKey: "Wallet Balance",
        },
        {
          label: t("employer.settings.sections.account.items.subscription_plan"),
          icon: CreditCard,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          routeKey: "Subscription Plan",
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
  ];

  return (
    <div className="py-6 space-y-8 select-none pb-24 relative">
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-black tracking-tighter">
          {t("employer.settings.role_title")} <br />
          <span className="text-primary">{t("employer.settings.page_title")}</span>
        </h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
          {t("employer.settings.subtitle")}
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/10 flex items-center gap-5">
        <div className="size-20 rounded-[2rem] bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
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
          <h2 className="text-xl font-black tracking-tight">{user?.name}</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {user?.profile?.jobTitle || user?.role}{" "}
            {user?.profile?.company && `@ ${user.profile.company}`}
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
              {section.title}
            </h3>
            <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden">
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
                      Notifications: "/employer/settings/notifications",
                      "Security & Privacy": "/employer/security",
                    };

                    const key = (item as any).routeKey || item.label;

                    if (routes[key]) {
                      navigate(routes[key]);
                    }
                  }}
                  className={`w-full p-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-white/5 transition-all ${i !== section.items.length - 1
                    ? "border-b border-slate-100 dark:border-white/5"
                    : ""
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`size-12 rounded-2xl ${item.bg} flex items-center justify-center`}
                    >
                      <item.icon className={`size-6 ${item.color}`} />
                    </div>
                    <span className="text-sm font-black tracking-tight">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
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

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="w-full h-16 rounded-[2rem] bg-red-500/10 text-red-600 flex items-center justify-center gap-3 active:scale-95 transition-all border border-red-500/20"
      >
        <LogOut className="size-5" />
        <span className="text-[10px] font-black uppercase tracking-widest">
          {t("employer.settings.logout")}
        </span>
      </button>

      <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] pt-4">
        {t("employer.settings.footer")}
      </p>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowLanguageModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 active:scale-90 transition-all"
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

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {languages.map((lang) => (
                <button
                  key={lang.name}
                  onClick={() => handleLanguageSelect(lang.name, lang.code)}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${language === lang.name
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10"
                    }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-black">{lang.name}</span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${language === lang.name ? "text-white/70" : "text-slate-400"
                        }`}
                    >
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
