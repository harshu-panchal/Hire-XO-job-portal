import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Mail, CheckCircle2, XCircle, Clock3, Shield, Eye } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../../services/adminService";
import type { CertificateRequest } from "../../../types";
import { getErrorMessage } from "../../../lib/apiConfig";
import certificateTemplateImage from "../../../assets/emp.jpeg";

type TabType = "pending" | "issued" | "rejected";

type CertificateEditor = {
  title: string;
  subtitle: string;
  certifyLine: string;
  resultLine: string;
  adminContent: string;
  dateText: string;
  signatureText: string;
  signatoryText: string;
};

const defaultEditorState = (): CertificateEditor => ({
  title: "CERTIFICATE OF STAGE-1 CLEARANCE",
  subtitle: "(Provisional Selection)",
  certifyLine: "This is to certify that",
  resultLine: "has successfully cleared 50% of the Interview & Verification Process.",
  adminContent:
    "Identity Verification: Confirmed via [method]\n" +
    "Legal Status: [Details]\n" +
    "Education: Graduation Completed.\n" +
    "Experience: Mentioned work experience validated.\n" +
    "Fitness: Physically and Mentally Fit for the role.",
  dateText: new Date().toLocaleDateString(),
  signatureText: "[Signature]",
  signatoryText: "[Authorized Signatory]",
});

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildCertificateHtml = (
  editor: CertificateEditor,
  templateImageUrl: string,
  employeeName: string
) => {
  const rows = editor.adminContent
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(
      (text) => `
        <div class="check-row">
          <span class="box">&#9633;</span>
          <span>${escapeHtml(text)}</span>
        </div>
      `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; font-family: "Segoe UI", Arial, sans-serif; }
    .page {
      width: 1536px;
      height: 1021px;
      position: relative;
      background-image: url('${templateImageUrl}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      overflow: hidden;
    }
    .overlay {
      position: absolute;
      inset: 0;
      color: #1f2937;
      text-align: center;
      font-weight: 500;
    }
    .title {
      position: absolute; top: 29.5%; left: 8%; width: 84%;
      font-size: 58px; font-weight: 800; color: #0c3a69; letter-spacing: 1px;
      text-transform: uppercase; line-height: 1.1;
    }
    .subtitle {
      position: absolute; top: 37.1%; left: 8%; width: 84%;
      font-size: 44px; color: #111827; line-height: 1.2;
    }
    .certify {
      position: absolute; top: 44.7%; left: 8%; width: 84%;
      font-size: 32px; line-height: 1.25;
    }
    .name {
      position: absolute; top: 49.2%; left: 8%; width: 84%;
      font-size: 56px; font-weight: 800; line-height: 1.1;
    }
    .result {
      position: absolute; top: 55.4%; left: 8%; width: 84%;
      font-size: 36px; line-height: 1.2;
    }
    .checks {
      position: absolute; top: 61.5%; left: 27%; width: 48%;
      text-align: left;
    }
    .check-row {
      display: flex; align-items: flex-start; gap: 10px;
      font-size: 28px; margin: 2px 0; line-height: 1.24;
    }
    .box { font-size: 24px; min-width: 24px; margin-top: 2px; }
    .date {
      position: absolute; bottom: 20.4%; left: 12.5%; width: 30%;
      text-align: left; font-size: 34px;
    }
    .sign {
      position: absolute; bottom: 19.7%; right: 17.2%; width: 26%;
      text-align: center;
    }
    .signature-text { font-size: 38px; font-family: "Segoe Script", cursive; }
    .signatory-text { font-size: 28px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="overlay">
      <div class="title">${escapeHtml(editor.title)}</div>
      <div class="subtitle">${escapeHtml(editor.subtitle)}</div>
      <div class="certify">${escapeHtml(editor.certifyLine)}</div>
      <div class="name">${escapeHtml(employeeName)}</div>
      <div class="result">${escapeHtml(editor.resultLine)}</div>
      <div class="checks">${rows}</div>
      <div class="date">Date: ${escapeHtml(editor.dateText)}</div>
      <div class="sign">
        <div class="signature-text">${escapeHtml(editor.signatureText)}</div>
        <div class="signatory-text">${escapeHtml(editor.signatoryText)}</div>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

const editorClass =
  "w-full bg-transparent border border-transparent text-center focus:outline-none focus:border-slate-300 focus:bg-white/60 rounded px-2";

export default function Certificates() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = (searchParams.get("tab") as TabType) || "pending";
  const [activeTab, setActiveTab] = useState<TabType>(
    ["pending", "issued", "rejected"].includes(requestedTab) ? requestedTab : "pending"
  );

  const [requests, setRequests] = useState<CertificateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CertificateRequest | null>(null);
  const [certificateName, setCertificateName] = useState("");
  const [editor, setEditor] = useState<CertificateEditor>(defaultEditorState());
  const [templateDataUrl, setTemplateDataUrl] = useState<string>(certificateTemplateImage);

  const highlightedRequestId = searchParams.get("requestId");

  const fetchData = async () => {
    setLoading(true);
    try {
      const reqRes = await adminService.getCertificateRequests({ status: activeTab, search, page: 1, limit: 50 });
      setRequests(reqRes.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let mounted = true;
    const convertTemplateToDataUrl = async () => {
      try {
        const res = await fetch(certificateTemplateImage);
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (mounted && typeof reader.result === "string") {
            setTemplateDataUrl(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      } catch {
        // fallback keeps original asset URL
      }
    };
    convertTemplateToDataUrl();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    setCertificateName(`${selected.planId?.name || "Subscription"} Certificate`);
    setEditor(defaultEditorState());
  }, [selected]);

  const updateTab = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", tab);
      next.delete("requestId");
      return next;
    });
  };

  const openIssueModal = (request: CertificateRequest) => setSelected(request);

  const closeIssueModal = () => {
    setSelected(null);
    setCertificateName("");
    setEditor(defaultEditorState());
  };

  const issueCertificate = async () => {
    if (!selected) return;
    setActionLoading(selected._id);
    try {
      const renderedHtml = buildCertificateHtml(
        editor,
        templateDataUrl,
        selected.userId?.name || "Employee"
      );
      await adminService.issueCertificateRequest(selected._id, {
        certificateName: certificateName || undefined,
        editedHtml: renderedHtml,
        userEmail: selected.userId.email
      });
      toast.success("Certificate issued successfully");
      closeIssueModal();
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setActionLoading(null);
    }
  };

  const rejectRequest = async (id: string) => {
    setActionLoading(id);
    try {
      await adminService.rejectCertificateRequest(id, "Rejected by admin");
      toast.success("Certificate request rejected");
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Certificates</h1>
          <p className="text-slate-500 mt-1">Subscription-based certificate requests</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
          <button onClick={() => updateTab("pending")} className={`px-3 py-1.5 text-sm rounded-md ${activeTab === "pending" ? "bg-primary text-white" : "text-slate-600"}`}>Pending</button>
          <button onClick={() => updateTab("issued")} className={`px-3 py-1.5 text-sm rounded-md ${activeTab === "issued" ? "bg-primary text-white" : "text-slate-600"}`}>Issued</button>
          <button onClick={() => updateTab("rejected")} className={`px-3 py-1.5 text-sm rounded-md ${activeTab === "rejected" ? "bg-primary text-white" : "text-slate-600"}`}>Rejected</button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
        <Mail className="w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user name or email"
          className="w-full outline-none text-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
          No certificate requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {requests.map((request) => {
            const highlighted = highlightedRequestId === request._id;
            return (
              <div key={request._id} className={`bg-white border rounded-xl p-5 ${highlighted ? "border-primary ring-2 ring-primary/20" : "border-slate-200"}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-slate-900">{request.userId?.name || "Unknown User"}</p>
                    <p className="text-sm text-slate-500">{request.userId?.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${request.status === "pending" ? "bg-amber-100 text-amber-700" : request.status === "issued" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {request.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Plan: {request.planId?.name}</div>
                  <div className="flex items-center gap-2"><Clock3 className="w-4 h-4" /> Requested: {new Date(request.requestedAt).toLocaleString()}</div>
                  {request.processedAt && (
                    <div className="flex items-center gap-2"><Eye className="w-4 h-4" /> Processed: {new Date(request.processedAt).toLocaleString()}</div>
                  )}
                </div>

                {request.status === "pending" && (
                  <div className="flex gap-2 mt-5">
                    <button onClick={() => openIssueModal(request)} disabled={actionLoading === request._id} className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-60">
                      <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />Issue</span>
                    </button>
                    <button onClick={() => rejectRequest(request._id)} disabled={actionLoading === request._id} className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60">
                      <span className="inline-flex items-center gap-2"><XCircle className="w-4 h-4" />Reject</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-7xl max-h-[92vh] overflow-auto p-6 space-y-4">
            <h2 className="text-lg font-semibold">Issue Certificate</h2>
            <input
              className="w-full border border-slate-200 rounded-lg p-2 text-sm"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              placeholder="Certificate Name"
            />
            <p className="text-sm text-slate-600">
              Employee info is locked. Click directly inside the certificate preview and type your custom content.
            </p>

            <div className="relative w-full max-w-[1200px] mx-auto border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <img src={certificateTemplateImage} alt="Certificate template" className="w-full h-auto block" />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-[8%] top-[29.5%] w-[84%] pointer-events-auto">
                  <input className={`${editorClass} text-[clamp(14px,1.8vw,44px)] font-extrabold text-[#0c3a69] uppercase`} value={editor.title} onChange={(e) => setEditor((p) => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="absolute left-[8%] top-[37.1%] w-[84%] pointer-events-auto">
                  <input className={`${editorClass} text-[clamp(12px,1.3vw,30px)]`} value={editor.subtitle} onChange={(e) => setEditor((p) => ({ ...p, subtitle: e.target.value }))} />
                </div>
                <div className="absolute left-[8%] top-[44.7%] w-[84%] pointer-events-auto">
                  <input className={`${editorClass} text-[clamp(12px,1.2vw,26px)]`} value={editor.certifyLine} onChange={(e) => setEditor((p) => ({ ...p, certifyLine: e.target.value }))} />
                </div>
                <div className="absolute left-[8%] top-[49.2%] w-[84%] pointer-events-auto">
                  <input className={`${editorClass} text-[clamp(14px,1.8vw,40px)] font-bold`} value={selected.userId?.name || "Employee"} readOnly />
                </div>
                <div className="absolute left-[8%] top-[55.4%] w-[84%] pointer-events-auto">
                  <textarea className={`${editorClass} text-[clamp(12px,1.2vw,25px)] resize-none h-[clamp(24px,4vw,65px)]`} value={editor.resultLine} onChange={(e) => setEditor((p) => ({ ...p, resultLine: e.target.value }))} />
                </div>
                <div className="absolute left-[27%] top-[61.5%] w-[48%] pointer-events-auto">
                  <textarea
                    className="w-full bg-transparent border border-transparent focus:outline-none focus:border-slate-300 focus:bg-white/60 rounded px-2 text-left leading-[1.25] text-[clamp(11px,1vw,20px)] resize-none h-[clamp(90px,15vw,220px)]"
                    value={editor.adminContent}
                    onChange={(e) => setEditor((p) => ({ ...p, adminContent: e.target.value }))}
                  />
                </div>
                <div className="absolute left-[12.5%] bottom-[20.4%] w-[30%] pointer-events-auto">
                  <input className={`${editorClass} text-left text-[clamp(11px,1.1vw,22px)]`} value={`Date: ${editor.dateText}`} onChange={(e) => setEditor((p) => ({ ...p, dateText: e.target.value.replace(/^Date:\s*/i, "") }))} />
                </div>
                <div className="absolute right-[17.2%] bottom-[19.7%] w-[26%] pointer-events-auto">
                  <input className={`${editorClass} text-[clamp(11px,1.1vw,22px)]`} value={editor.signatureText} onChange={(e) => setEditor((p) => ({ ...p, signatureText: e.target.value }))} />
                  <input className={`${editorClass} mt-1 text-[clamp(11px,1vw,20px)]`} value={editor.signatoryText} onChange={(e) => setEditor((p) => ({ ...p, signatoryText: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={closeIssueModal} className="px-4 py-2 rounded-lg border border-slate-200 text-sm">Cancel</button>
              <button onClick={issueCertificate} disabled={actionLoading === selected._id} className="px-4 py-2 rounded-lg bg-primary text-white text-sm disabled:opacity-60">
                {actionLoading === selected._id ? "Issuing..." : "Issue Certificate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
