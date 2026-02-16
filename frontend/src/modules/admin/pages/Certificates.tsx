import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Mail, CheckCircle2, XCircle, Clock3, Shield, Eye } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../../services/adminService";
import type { CertificateRequest } from "../../../types";
import { getErrorMessage } from "../../../lib/apiConfig";
import employeeTemplateImage from "../../../assets/emp.jpeg";
import employerTemplateImage from "../../../assets/Employer.jpeg";
import resourceTemplateImage from "../../../assets/Resource.jpeg";
import resourceProviderTemplateImage from "../../../assets/ResourceProvider.jpeg";
import CertificateDraggableField, {
  type DraggablePosition,
} from "../components/CertificateDraggableField";

type TabType = "pending" | "issued" | "rejected";
type UserRole = "employee" | "employer" | "resource";

type FieldPositions = {
  username: DraggablePosition;
  certificateId: DraggablePosition;
  issueDate: DraggablePosition;
  validTill: DraggablePosition;
  category?: DraggablePosition;
};

type OverlayValues = {
  username: string;
  certificateId: string;
  issueDate: string;
  validTill: string;
  category?: string;
};

type TemplateConfig = {
  image: string;
  width: number;
  height: number;
  defaults: FieldPositions;
};

type FieldRenderSpec = {
  width: number;
  height: number;
  fontSize: number;
  textAlign?: "left" | "center" | "right";
};

const templateConfigs: Record<UserRole, TemplateConfig> = {
  employee: {
    image: employeeTemplateImage,
    width: 1536,
    height: 1021,
    defaults: {
      username: { x: 560, y: 488 },
      certificateId: { x: 1132, y: 962 },
      issueDate: { x: 246, y: 846 },
      validTill: { x: 246, y: 892 },
    },
  },
  employer: {
    image: employerTemplateImage,
    width: 1153,
    height: 1536,
    defaults: {
      username: { x: 340, y: 592 },
      certificateId: { x: 822, y: 1456 },
      issueDate: { x: 236, y: 1404 },
      validTill: { x: 236, y: 1478 },
    },
  },
  resource: {
    image: resourceTemplateImage,
    width: 1536,
    height: 1021,
    defaults: {
      username: { x: 560, y: 488 },
      certificateId: { x: 1132, y: 962 },
      issueDate: { x: 246, y: 846 },
      validTill: { x: 246, y: 892 },
      category: { x: 652, y: 556 },
    },
  },
};

const resourceProviderTypes = new Set([
  "want-investment",
  "provide-tenders",
  "rent-out-equipment",
  "provide-machinery",
  "offer-pmc-services",
  "offer-csm-services",
  "provide-logistics",
  "rent-out-vehicles",
]);

const isResourceProviderProfile = (profile: any): boolean => {
  if (!profile) return false;
  const typeKeys = [
    "investorType",
    "tenderType",
    "equipmentType",
    "machineryType",
    "pmcType",
    "csmType",
    "logisticsType",
    "vehicleType",
  ];

  return typeKeys.some((key) => {
    const value = profile[key];
    return typeof value === "string" && resourceProviderTypes.has(value);
  });
};

const fieldRenderSpecs: Record<UserRole, {
  username: FieldRenderSpec;
  certificateId: FieldRenderSpec;
  issueDate: FieldRenderSpec;
  validTill: FieldRenderSpec;
  category?: FieldRenderSpec;
}> = {
  employee: {
    username: { width: 520, height: 56, fontSize: 44, textAlign: "center" },
    certificateId: { width: 360, height: 34, fontSize: 22, textAlign: "left" },
    issueDate: { width: 260, height: 38, fontSize: 28, textAlign: "left" },
    validTill: { width: 260, height: 38, fontSize: 28, textAlign: "left" },
  },
  employer: {
    username: { width: 510, height: 56, fontSize: 42, textAlign: "left" },
    certificateId: { width: 300, height: 34, fontSize: 20, textAlign: "left" },
    issueDate: { width: 230, height: 40, fontSize: 30, textAlign: "left" },
    validTill: { width: 230, height: 40, fontSize: 30, textAlign: "left" },
  },
  resource: {
    username: { width: 520, height: 56, fontSize: 44, textAlign: "center" },
    certificateId: { width: 360, height: 34, fontSize: 22, textAlign: "left" },
    issueDate: { width: 260, height: 38, fontSize: 28, textAlign: "left" },
    validTill: { width: 260, height: 38, fontSize: 28, textAlign: "left" },
    category: { width: 420, height: 46, fontSize: 28, textAlign: "left" },
  },
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildPositionedHtml = (
  cfg: TemplateConfig,
  templateDataUrl: string,
  positions: FieldPositions,
  values: OverlayValues,
  role: UserRole
) => {
  const textStyle =
    "position:absolute;font-family:'Segoe UI',Arial,sans-serif;color:#111827;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
  const scriptStyle =
    "position:absolute;font-family:'Segoe Script',cursive;color:#111827;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";

  const categoryDiv =
    role === "resource" && positions.category
      ? `<div style="${textStyle}left:${positions.category.x}px;top:${positions.category.y}px;width:${fieldRenderSpecs.resource.category?.width || 420}px;font-size:${fieldRenderSpecs.resource.category?.fontSize || 28}px;text-align:${fieldRenderSpecs.resource.category?.textAlign || "left"};">${escapeHtml(
          values.category || ""
        )}</div>`
      : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; }
    .page {
      width: ${cfg.width}px;
      height: ${cfg.height}px;
      position: relative;
      background-image: url('${templateDataUrl}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div class="page">
    <div style="${textStyle}left:${positions.username.x}px;top:${positions.username.y}px;width:${fieldRenderSpecs[role].username.width}px;font-size:${fieldRenderSpecs[role].username.fontSize}px;text-align:${fieldRenderSpecs[role].username.textAlign || "left"};">${escapeHtml(
      values.username
    )}</div>
    <div style="${textStyle}left:${positions.certificateId.x}px;top:${positions.certificateId.y}px;width:${fieldRenderSpecs[role].certificateId.width}px;font-size:${fieldRenderSpecs[role].certificateId.fontSize}px;text-align:${fieldRenderSpecs[role].certificateId.textAlign || "left"};">${escapeHtml(
      values.certificateId
    )}</div>
    <div style="${textStyle}left:${positions.issueDate.x}px;top:${positions.issueDate.y}px;width:${fieldRenderSpecs[role].issueDate.width}px;font-size:${fieldRenderSpecs[role].issueDate.fontSize}px;text-align:${fieldRenderSpecs[role].issueDate.textAlign || "left"};">${escapeHtml(
      values.issueDate
    )}</div>
    <div style="${textStyle}left:${positions.validTill.x}px;top:${positions.validTill.y}px;width:${fieldRenderSpecs[role].validTill.width}px;font-size:${fieldRenderSpecs[role].validTill.fontSize}px;text-align:${fieldRenderSpecs[role].validTill.textAlign || "left"};">${escapeHtml(
      values.validTill
    )}</div>
    <div style="${scriptStyle}left:${positions.username.x + 120}px;top:${positions.validTill.y - 95}px;width:340px;font-size:34px;text-align:center;"></div>
    ${categoryDiv}
  </div>
</body>
</html>`;
};

const clonePositions = (p: FieldPositions): FieldPositions => ({
  username: { ...p.username },
  certificateId: { ...p.certificateId },
  issueDate: { ...p.issueDate },
  validTill: { ...p.validTill },
  ...(p.category ? { category: { ...p.category } } : {}),
});

export default function Certificates() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = (searchParams.get("tab") as TabType) || "pending";
  const [activeTab, setActiveTab] = useState<TabType>(
    ["pending", "issued", "rejected"].includes(requestedTab) ? requestedTab : "pending"
  );
  const highlightedRequestId = searchParams.get("requestId");

  const [requests, setRequests] = useState<CertificateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CertificateRequest | null>(null);
  const [certificateName, setCertificateName] = useState("");
  const [templateDataUrl, setTemplateDataUrl] = useState<string>(employeeTemplateImage);
  const [fieldPositions, setFieldPositions] = useState<FieldPositions>(
    clonePositions(templateConfigs.employee.defaults)
  );
  const [fieldValues, setFieldValues] = useState<OverlayValues>({
    username: "",
    certificateId: "",
    issueDate: "",
    validTill: "",
  });

  const selectedRole = (selected?.userId?.role || selected?.role || "employee") as UserRole;
  const selectedUserProfile = (selected?.userId as any)?.profile;
  const isSelectedResourceProvider =
    selectedRole === "resource" && isResourceProviderProfile(selectedUserProfile);
  const selectedConfig = useMemo(() => {
    if (selectedRole !== "resource") return templateConfigs[selectedRole] || templateConfigs.employee;

    const resourceBaseConfig = templateConfigs.resource;
    const useProviderTemplate = isSelectedResourceProvider;
    return {
      ...resourceBaseConfig,
      image: useProviderTemplate ? resourceProviderTemplateImage : resourceTemplateImage,
    };
  }, [selectedRole, selectedUserProfile, isSelectedResourceProvider]);
  const selectedSpecs = fieldRenderSpecs[selectedRole] || fieldRenderSpecs.employee;

  const contextDefaults = useMemo(() => {
    if (!selected) {
      return {
        username: "",
        issueDate: new Date().toLocaleDateString(),
        validTill: "",
        certificateId: "AUTO-GENERATED",
        category: "",
      };
    }
    const issue = new Date();
    const expiry = new Date(issue.getTime() + (selected.planId?.durationDays || 0) * 24 * 60 * 60 * 1000);
    const profile = (selected.userId as any)?.profile || {};
    return {
      username: selected.userId?.name || "",
      issueDate: issue.toLocaleDateString(),
      validTill: expiry.toLocaleDateString(),
      certificateId: "AUTO-GENERATED",
      category: profile.resourceCategory || profile.category || "",
    };
  }, [selected]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const reqRes = await adminService.getCertificateRequests({
        status: activeTab,
        search,
        page: 1,
        limit: 50,
      });
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
    const convert = async () => {
      try {
        const res = await fetch(selectedConfig.image);
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (mounted && typeof reader.result === "string") setTemplateDataUrl(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch {
        if (mounted) setTemplateDataUrl(selectedConfig.image);
      }
    };
    convert();
    return () => {
      mounted = false;
    };
  }, [selectedConfig.image]);

  useEffect(() => {
    if (!selected) return;
    setCertificateName(`${selected.planId?.name || "Subscription"} Certificate`);
    setFieldPositions(clonePositions(selectedConfig.defaults));
    setFieldValues({
      username: contextDefaults.username,
      certificateId: contextDefaults.certificateId,
      issueDate: contextDefaults.issueDate,
      validTill: contextDefaults.validTill,
      ...(selectedRole === "resource" ? { category: contextDefaults.category } : {}),
    });
  }, [selected, selectedConfig, selectedRole, contextDefaults]);

  const updateTab = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", tab);
      next.delete("requestId");
      return next;
    });
  };

  const closeIssueModal = () => {
    setSelected(null);
    setCertificateName("");
  };

  const issueCertificate = async () => {
    if (!selected) return;
    setActionLoading(selected._id);
    try {
      const editedHtml = buildPositionedHtml(
        selectedConfig,
        templateDataUrl,
        fieldPositions,
        fieldValues,
        selectedRole
      );

      await adminService.issueCertificateRequest(selected._id, {
        certificateName: certificateName || undefined,
        editedHtml,
        userEmail: selected.userId.email,
        fieldPositions,
        fieldValues,
        templateImageDataUrl: templateDataUrl,
        templateWidth: selectedConfig.width,
        templateHeight: selectedConfig.height,
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
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">No certificate requests found.</div>
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
                  <span className={`text-xs px-2 py-1 rounded-full ${request.status === "pending" ? "bg-amber-100 text-amber-700" : request.status === "issued" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{request.status}</span>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Plan: {request.planId?.name}</div>
                  <div className="flex items-center gap-2"><Clock3 className="w-4 h-4" /> Requested: {new Date(request.requestedAt).toLocaleString()}</div>
                  {request.processedAt && <div className="flex items-center gap-2"><Eye className="w-4 h-4" /> Processed: {new Date(request.processedAt).toLocaleString()}</div>}
                </div>
                {request.status === "pending" && (
                  <div className="flex gap-2 mt-5">
                    <button onClick={() => setSelected(request)} disabled={actionLoading === request._id} className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-60"><span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />Issue</span></button>
                    <button onClick={() => rejectRequest(request._id)} disabled={actionLoading === request._id} className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60"><span className="inline-flex items-center gap-2"><XCircle className="w-4 h-4" />Reject</span></button>
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
            <input className="w-full border border-slate-200 rounded-lg p-2 text-sm" value={certificateName} onChange={(e) => setCertificateName(e.target.value)} placeholder="Certificate Name" />
            <p className="text-sm text-slate-600">
              Drag only these fields: username, certificateId, issueDate, validTill {selectedRole === "resource" ? ", category" : ""}.
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Template:{" "}
              {selectedRole === "resource"
                ? isSelectedResourceProvider
                  ? "Resource Provider"
                  : "Resource Client"
                : selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </p>

            <div className="overflow-auto border border-slate-200 rounded-lg">
              <div
                className="relative"
                style={{ width: `${selectedConfig.width}px`, height: `${selectedConfig.height}px` }}
              >
                <img src={selectedConfig.image} alt="Certificate template" className="absolute inset-0 h-full w-full" />

                <CertificateDraggableField
                  value={fieldValues.username}
                  position={fieldPositions.username}
                  onPositionChange={(next) => setFieldPositions((p) => ({ ...p, username: next }))}
                  onValueChange={(value) => setFieldValues((p) => ({ ...p, username: value }))}
                  width={selectedSpecs.username.width}
                  height={selectedSpecs.username.height}
                  fontSize={selectedSpecs.username.fontSize}
                  textAlign={selectedSpecs.username.textAlign}
                />

                <CertificateDraggableField
                  value={fieldValues.certificateId}
                  position={fieldPositions.certificateId}
                  onPositionChange={(next) => setFieldPositions((p) => ({ ...p, certificateId: next }))}
                  onValueChange={(value) => setFieldValues((p) => ({ ...p, certificateId: value }))}
                  width={selectedSpecs.certificateId.width}
                  height={selectedSpecs.certificateId.height}
                  fontSize={selectedSpecs.certificateId.fontSize}
                  textAlign={selectedSpecs.certificateId.textAlign}
                />

                <CertificateDraggableField
                  value={fieldValues.issueDate}
                  position={fieldPositions.issueDate}
                  onPositionChange={(next) => setFieldPositions((p) => ({ ...p, issueDate: next }))}
                  onValueChange={(value) => setFieldValues((p) => ({ ...p, issueDate: value }))}
                  width={selectedSpecs.issueDate.width}
                  height={selectedSpecs.issueDate.height}
                  fontSize={selectedSpecs.issueDate.fontSize}
                  textAlign={selectedSpecs.issueDate.textAlign}
                />

                <CertificateDraggableField
                  value={fieldValues.validTill}
                  position={fieldPositions.validTill}
                  onPositionChange={(next) => setFieldPositions((p) => ({ ...p, validTill: next }))}
                  onValueChange={(value) => setFieldValues((p) => ({ ...p, validTill: value }))}
                  width={selectedSpecs.validTill.width}
                  height={selectedSpecs.validTill.height}
                  fontSize={selectedSpecs.validTill.fontSize}
                  textAlign={selectedSpecs.validTill.textAlign}
                />

                {selectedRole === "resource" && fieldPositions.category && (
                  <CertificateDraggableField
                    value={fieldValues.category || ""}
                    position={fieldPositions.category}
                    onPositionChange={(next) => setFieldPositions((p) => ({ ...p, category: next }))}
                    onValueChange={(value) => setFieldValues((p) => ({ ...p, category: value }))}
                    width={selectedSpecs.category?.width || 420}
                    height={selectedSpecs.category?.height || 46}
                    fontSize={selectedSpecs.category?.fontSize || 28}
                    textAlign={selectedSpecs.category?.textAlign || "left"}
                  />
                )}
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
