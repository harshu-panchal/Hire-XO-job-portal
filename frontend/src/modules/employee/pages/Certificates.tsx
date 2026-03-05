import { useEffect, useState } from "react";
import { Award, Calendar, Clock, Download, ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { certificateService } from "@/services/certificateService";
import type { Certificate } from "@/types";

const Certificates = () => {
  const navigate = useNavigate();
  const { certificates, fetchCertificates, isLoading } = useEmployeeStore();
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return (
    <div className="py-8 space-y-8">
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

      {isLoading ? (
        <div className="text-center py-16 rounded-[2.5rem] border-4 border-dashed border-slate-100 bg-slate-50/50">
          <div className="size-20 rounded-[2rem] bg-white shadow-xl border border-slate-100 flex items-center justify-center mx-auto mb-6">
            <Award className="h-10 w-10 text-slate-300 animate-pulse" />
          </div>
          <p className="text-slate-900 font-black text-lg tracking-tight">Loading certificates...</p>
        </div>
      ) : Array.isArray(certificates) && certificates.length > 0 ? (
        <div className="grid gap-5">
          {certificates.map((cert) => {
            const expired =
              cert.status === "Expired" || new Date(cert.expiryDate) < new Date();
            const downloadUrl = cert.pdfUrl || cert.documentUrl;
            const downloadLink = certificateService.getCertificateDownloadUrl(cert.id || cert._id || "");
            return (
              <div
                key={cert.id || cert._id}
                className={`relative overflow-hidden rounded-3xl p-6 border transition-all ${
                  expired
                    ? "bg-slate-50 border-slate-100 opacity-70"
                    : "bg-white border-slate-200 shadow-sm"
                } cursor-pointer`}
                onClick={() => downloadUrl && setPreviewCertificate(cert)}
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`size-16 rounded-2xl shrink-0 flex items-center justify-center border ${expired
                      ? "bg-slate-200 border-transparent text-slate-400"
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
                          ? "border-red-200 text-red-500 bg-red-50"
                          : "border-green-200 text-green-600 bg-green-50"
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
                        className={`flex items-center text-[11px] font-black uppercase tracking-widest ${expired ? "text-red-500" : "text-green-500"}`}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {expired ? "Expired" : "Active"}
                      </div>
                    </div>
                  </div>
                </div>

                {downloadUrl && (
                  <a
                    href={downloadLink}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-6 right-6 size-11 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-all"
                    title="Download certificate"
                    onClick={(event) => event.stopPropagation()}
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
          <p className="text-slate-900 font-black text-lg tracking-tight">
            No certificates yet
          </p>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-1">
            Buy a subscription and wait for admin issuance
          </p>
        </div>
      )}

      {previewCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-2 sm:px-4">
          <div className="w-full max-w-6xl max-h-[95vh] rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                  Certificate Preview
                </p>
                <h2 className="text-lg font-black tracking-tight truncate">
                  {previewCertificate.name}
                </h2>
              </div>
              <button
                onClick={() => setPreviewCertificate(null)}
                className="size-9 flex items-center justify-center rounded-2xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition"
                aria-label="Close preview"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="px-6 pt-3 pb-2 flex flex-wrap items-center gap-4 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400">
              <span>
                Issued on{" "}
                {new Date(previewCertificate.issueDate).toLocaleDateString()}
              </span>
              <span>
                Valid till{" "}
                {new Date(previewCertificate.expiryDate).toLocaleDateString()}
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] border ${
                  previewCertificate.status === "Expired"
                    ? "border-red-200 text-red-600 bg-red-50"
                    : "border-green-200 text-green-600 bg-green-50"
                }`}
              >
                {previewCertificate.status === "Expired" ? "Expired" : "Active"}
              </span>
            </div>

            <div className="flex-1 bg-slate-50/80">
              {(() => {
                const downloadUrl =
                  previewCertificate.pdfUrl || previewCertificate.documentUrl;
                const downloadLink = certificateService.getCertificateDownloadUrl(previewCertificate.id || previewCertificate._id || "");
                if (!downloadUrl) {
                  return (
                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
                      <Award className="h-10 w-10 text-slate-300 mb-4" />
                      <p className="text-slate-900 font-black text-base tracking-tight">
                        No preview available
                      </p>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">
                        This certificate does not have a document attached yet.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="h-full p-4">
                    <div className="h-full rounded-2xl border border-slate-200 bg-white overflow-hidden">
                      <iframe
                        src={downloadUrl}
                        title="Certificate preview"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center justify-between gap-3 px-6 py-3 border-t border-slate-100 bg-white">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 truncate">
                Preview is based on the latest issued document
              </p>
              {(() => {
                const downloadUrl =
                  previewCertificate.pdfUrl || previewCertificate.documentUrl;
                const downloadLink = certificateService.getCertificateDownloadUrl(previewCertificate.id || previewCertificate._id || "");
                return (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewCertificate(null)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition"
                    >
                      Close
                    </button>
                    {downloadUrl && (
                      <a
                        href={downloadLink}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 active:scale-95 transition"
                      >
                        <Download className="h-4 w-4" />
                        Download PDF
                      </a>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
