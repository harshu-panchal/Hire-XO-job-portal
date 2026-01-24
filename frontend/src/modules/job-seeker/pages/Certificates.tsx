import { Award, Calendar, Clock, Download, Plus, Trophy } from "lucide-react";

import { useJobSeekerStore } from "@/store/useJobSeekerStore";
import { generateCertificate } from "@/lib/certificate-utils";

const Certificates = () => {
  const { userProfile, certificates, addCertificate } = useJobSeekerStore();
  const userSuccessRate = userProfile?.interviewSuccessRate || 0;

  const handleClaimCertificate = () => {
    if (userSuccessRate >= 50) {
      const newCert = generateCertificate("Frontend Mastery Certificate", userSuccessRate);
      addCertificate(newCert);
    }
  };

  return (
    <div className="py-8 space-y-10 select-none">
      <div className="space-y-3 px-1">
        <h1 className="text-4xl font-black tracking-tight leading-tight">Certifications</h1>
        <p className="text-slate-500 dark:text-slate-400 font-black text-sm uppercase tracking-widest">
          Verified achievements
        </p>
      </div>

      {/* Performance Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl shadow-primary/20 border border-white/10 active:scale-[0.98] transition-transform duration-200">
        <div className="absolute top-0 right-0 w-full h-full opacity-40 bg-[radial-gradient(circle_at_top_right,var(--color-primary),transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <Trophy className="size-5 text-primary-light" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-light">
                Global Ranking
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black tracking-tighter">{userSuccessRate}%</span>
              <span className="text-primary-light font-black uppercase tracking-widest text-[10px]">
                Success Rate
              </span>
            </div>
            <p className="text-white/60 text-sm font-black tracking-wide max-w-xs leading-relaxed">
              {userSuccessRate >= 50
                ? "Excellent! You have unlocked premium certifications. Claim them now to boost your profile."
                : `Keep going! You need ${50 - userSuccessRate}% more success to unlock your first certificate.`}
            </p>
          </div>
          {userSuccessRate >= 50 && (
            <button
              onClick={handleClaimCertificate}
              className="bg-white text-slate-900 h-14 px-8 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-90 transition-all shrink-0"
            >
              Claim Now
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black tracking-tight">My Collection</h2>
          <button className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-400 active:scale-90 active:bg-slate-50 dark:active:bg-white/5 transition-all">
            <Plus className="size-5" />
          </button>
        </div>

        {certificates.length > 0 ? (
          <div className="grid gap-5">
            {certificates.map((cert) => {
              const expired = cert.status === "Expired";
              return (
                <div
                  key={cert.id}
                  className={`relative overflow-hidden rounded-3xl p-6 border transition-all active:scale-[0.98] active:shadow-md ${expired
                      ? "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 opacity-60"
                      : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 shadow-sm active:border-primary/20"
                    }`}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={`size-16 rounded-2xl shrink-0 flex items-center justify-center border transition-colors ${expired
                          ? "bg-slate-200 dark:bg-white/10 border-transparent text-slate-400"
                          : "bg-primary/5 border-primary/10 text-primary"
                        }`}
                    >
                      <Award className="h-8 w-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-black text-lg truncate tracking-tight">{cert.name}</h3>
                        <div
                          className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${expired
                              ? "border-slate-200 dark:border-white/10 text-slate-400"
                              : "border-primary/20 text-primary bg-primary/5"
                            }`}
                        >
                          {cert.status}
                        </div>
                      </div>
                      <p className="text-sm font-black text-slate-400 dark:text-slate-500 mb-5">
                        Issued on{" "}
                        {new Date(cert.issueDate).toLocaleDateString(undefined, {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>

                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                          <Calendar className="h-4 w-4 mr-2 text-primary/60" />
                          Valid till{" "}
                          {new Date(cert.expiryDate).toLocaleDateString(undefined, {
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div
                          className={`flex items-center text-[11px] font-black uppercase tracking-widest ${expired ? "text-red-500" : "text-green-500"}`}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          {expired ? "Expired" : "Active"}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!expired && (
                    <button className="absolute bottom-6 right-6 size-11 flex items-center justify-center rounded-xl bg-primary/5 text-primary active:scale-90 transition-all">
                      <Download className="h-5 w-5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 rounded-[2.5rem] border-4 border-dashed border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
            <div className="size-20 rounded-[2rem] bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-white/5 flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-slate-900 dark:text-white font-black text-lg tracking-tight">
              No certificates yet
            </p>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-1">
              Complete interviews to earn
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
