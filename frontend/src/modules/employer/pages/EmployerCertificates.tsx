import { useEffect, useState } from "react";
import { Award, Calendar, Clock, Download, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { certificateService } from "@/services/certificateService";
import type { Certificate } from "@/types";
import { toast } from "sonner";

const EmployerCertificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await certificateService.getMyCertificates();
        setCertificates(data || []);
      } catch (error: any) {
        toast.error(error.message || "Failed to load certificates");
      } finally {
        setLoading(false);
      }
    };

    void fetchCertificates();
  }, []);

  return (
    <div className="py-8 space-y-8 pb-32">
      <div className="flex items-center gap-4 px-1">
        <button
          onClick={() => navigate(-1)}
          className="size-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 active:scale-90 transition-all shadow-sm"
        >
          <ChevronLeft className="size-6" />
        </button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight leading-tight">Certificates</h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
            Issued by admin from subscriptions
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 rounded-[2.5rem] border-4 border-dashed border-slate-100 bg-slate-50/50">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading certificates...</p>
        </div>
      ) : certificates.length > 0 ? (
        <div className="grid gap-5">
          {certificates.map((cert) => {
            const expired = cert.status === "Expired" || new Date(cert.expiryDate) < new Date();
            const downloadUrl = cert.pdfUrl || cert.documentUrl;
            return (
              <div
                key={cert.id || cert._id}
                className={`relative overflow-hidden rounded-3xl p-6 border transition-all ${
                  expired ? "bg-slate-50 border-slate-100 opacity-70" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`size-16 rounded-2xl shrink-0 flex items-center justify-center border ${
                      expired ? "bg-slate-200 border-transparent text-slate-400" : "bg-primary/5 border-primary/10 text-primary"
                    }`}
                  >
                    <Award className="h-8 w-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-black text-lg truncate tracking-tight">{cert.name}</h3>
                      <div
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                          expired ? "border-red-200 text-red-500 bg-red-50" : "border-green-200 text-green-600 bg-green-50"
                        }`}
                      >
                        {expired ? "Expired" : "Active"}
                      </div>
                    </div>
                    <p className="text-sm font-black text-slate-400 mb-5">
                      Issued on {new Date(cert.issueDate).toLocaleDateString()}
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                        <Calendar className="h-4 w-4 mr-2 text-primary/60" />
                        Valid till {new Date(cert.expiryDate).toLocaleDateString()}
                      </div>
                      <div
                        className={`flex items-center text-[11px] font-black uppercase tracking-widest ${
                          expired ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {expired ? "Expired" : "Active"}
                      </div>
                    </div>
                  </div>
                </div>

                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-6 right-6 size-11 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-all"
                    title="Download certificate"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 rounded-[2.5rem] border-4 border-dashed border-slate-100 bg-slate-50/50">
          <div className="size-20 rounded-[2rem] bg-white shadow-xl border border-slate-100 flex items-center justify-center mx-auto mb-6">
            <Award className="h-10 w-10 text-slate-300" />
          </div>
          <p className="text-slate-900 font-black text-lg tracking-tight">No certificates yet</p>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-1">
            Buy a subscription and wait for admin issuance
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployerCertificates;
