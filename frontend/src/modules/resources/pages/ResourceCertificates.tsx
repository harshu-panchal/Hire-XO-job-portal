import { useEffect, useState } from "react";
import { Award, Download, Calendar, Clock, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { certificateService } from "@/services/certificateService";
import type { Certificate } from "@/types";

export default function ResourceCertificates() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await certificateService.getMyCertificates();
        if (mounted) setCertificates(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setCertificates([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="size-10 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Go back"
          >
            <ChevronLeft className="mx-auto h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">My Certificates</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Issued by admin</p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">
            <p className="text-sm font-black uppercase tracking-widest">Loading certificates...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Award className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-base font-black text-slate-800">No certificates yet</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-500">
              Buy a subscription and wait for admin issuance
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {certificates.map((cert) => {
              const id = cert.id || cert._id;
              const expired = cert.status === "Expired" || new Date(cert.expiryDate) < new Date();
              const downloadUrl = cert.pdfUrl || cert.documentUrl;
              const downloadLink = certificateService.getCertificateDownloadUrl(id || "");
              return (
                <div
                  key={id}
                  className={`rounded-2xl border p-4 shadow-sm ${expired ? "border-red-100 bg-red-50/30" : "border-slate-200 bg-white"}`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="line-clamp-2 text-sm font-black text-slate-900 sm:text-base">{cert.name}</p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                        expired ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {expired ? "Expired" : "Active"}
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      Valid till {new Date(cert.expiryDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      {expired ? "Expired" : "Active"}
                    </div>
                  </div>

                  {downloadUrl ? (
                    <a
                      href={downloadLink}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
