import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Search,
  Plus,
  Shield,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  Upload,
  Download,
  Eye,
  Loader2,
  Check,
  XCircle
} from "lucide-react";
import { adminService } from "../../../services/adminService";
import type { Certificate } from "../../../types";
import { toast } from "sonner";
import { getErrorMessage } from "../../../lib/apiConfig";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
} as const;

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // const [showModal, setShowModal] = useState(false); // Hiding modal as manual issue is not supported yet
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Simple debounce implementation
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getAllCertificates({
        search: debouncedSearch,
        page,
        limit
      });
      setCertificates(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.pages);
        setTotalItems(response.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
      toast.error("Failed to fetch certificates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [debouncedSearch, page]);



  const handleApprove = async (id: string) => {
    if (window.confirm("Are you sure you want to approve this certificate?")) {
      setActionLoading(id);
      try {
        await adminService.approveCertificate(id);
        toast.success("Certificate approved successfully");
        // Update local state
        setCertificates(prev => prev.map(c =>
          c._id === id ? { ...c, verificationStatus: "approved" } : c
        ));
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setActionLoading(null);
      }
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedCertId(id);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!selectedCertId || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setActionLoading(selectedCertId);
    try {
      await adminService.rejectCertificate(selectedCertId, rejectionReason);
      toast.success("Certificate rejected");
      // Update local state
      setCertificates(prev => prev.map(c =>
        c._id === selectedCertId ? { ...c, verificationStatus: "rejected" } : c
      ));
      setRejectModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setActionLoading(null);
    }
  };

  const activeCount = certificates.filter((c) => c.status === "Active").length;
  const expiredCount = certificates.filter((c) => c.status === "Expired").length;
  // const pendingCount = certificates.filter(c => c.verificationStatus === 'pending').length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Certificates</h1>
          <p className="text-slate-500 mt-1">Manage verification certificates</p>
        </div>
        {/* Manual Issue hidden as it's not supported by backend properly yet (requires User context) */}
        {/* <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Issue Certificate
        </button> */}
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{certificates.length}</p>
          <p className="text-sm text-slate-500 mt-1">Total Certificates</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          <p className="text-sm text-slate-500 mt-1">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <Shield className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{expiredCount}</p>
          <p className="text-sm text-slate-500 mt-1">Expired</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">-</p>
          <p className="text-sm text-slate-500 mt-1">Downloads</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search certificates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </motion.div>

      {/* Certificates Grid */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white rounded-xl border border-slate-200 p-6 relative overflow-hidden"
            >
              {cert.verificationStatus === 'rejected' && (
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                  <div className="absolute top-[10px] right-[-20px] transform rotate-45 bg-red-500 text-white text-[10px] font-bold py-1 w-[80px] text-center shadow-sm">
                    REJECTED
                  </div>
                </div>
              )}
              {cert.verificationStatus === 'pending' && (
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                  <div className="absolute top-[10px] right-[-20px] transform rotate-45 bg-amber-500 text-white text-[10px] font-bold py-1 w-[80px] text-center shadow-sm">
                    PENDING
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${cert.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : cert.status === "Expired"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {cert.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {cert.name}
              </h3>
              <p className="text-sm text-slate-500 mb-4 truncate">
                Issued to: {typeof cert.userId === 'object' ? cert.userId?.name : 'Unknown'}
              </p>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Certificate ID</span>
                  <span className="font-mono text-slate-900 text-xs">{cert._id?.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issue Date</span>
                  <span className="text-slate-900">{new Date(cert.issueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expiry Date</span>
                  <span className="text-slate-900">{new Date(cert.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-100">
                {cert.verificationStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(cert._id!)}
                      disabled={actionLoading === cert._id}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                      {actionLoading === cert._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Approve
                    </button>
                    <button
                      onClick={() => openRejectModal(cert._id!)}
                      disabled={actionLoading === cert._id}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                {cert.verificationStatus !== 'pending' && (
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                )}
                {cert.documentUrl && (
                  <a href={cert.documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-600">
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {!isLoading && certificates.length === 0 && (
        <div className="py-12 text-center bg-white rounded-xl border border-slate-200">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No certificates found</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-200 rounded-xl mt-6">
          <div className="flex items-center text-sm text-slate-500">
            Showing <span className="font-medium mx-1">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-medium mx-1">{Math.min(page * limit, totalItems)}</span> of{" "}
            <span className="font-medium mx-1">{totalItems}</span> certificates
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-slate-700 px-4">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Reject Certificate</h3>
              <p className="text-sm text-slate-500 mb-4">Please provide a reason for rejection:</p>
              <textarea
                className="w-full border border-slate-300 rounded-md p-2 text-sm mb-4 h-24 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
