import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Building2,
  Clock,
  ChevronRight,
  MessageSquare,
  Download,
  Users,
  X,
  Send,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { applicationService } from "@/services/applicationService";
import { toast } from "sonner";

interface Bid {
  id: string;
  vendorName: string;
  tenderTitle: string;
  amount: string;
  submittedDate: string;
  status: string;
  statusColor: string;
  statusBg: string;
  location: string;
  rating: number;
  email?: string;
  phone?: string;
  experience?: string;
  proposal?: string;
  _id: string;
}

const ReceivedBids = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [message, setMessage] = useState("");
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  const statuses = ["All", "Pending", "Accepted", "Rejected"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return { statusColor: "text-blue-600", statusBg: "bg-blue-100" };
      case "Accepted":
        return {
          statusColor: "text-emerald-600",
          statusBg: "bg-emerald-100",
        };
      case "Rejected":
        return { statusColor: "text-rose-600", statusBg: "bg-rose-100" };
      default:
        return { statusColor: "text-slate-600", statusBg: "bg-slate-100" };
    }
  };

  const fetchBids = useCallback(async () => {
    setLoading(true);
    try {
      const data: any[] = await applicationService.getReceivedResourceApplications("tenders");

      if (Array.isArray(data)) {
        const mappedBids = data.map((app) => ({
          id: app.id,
          _id: app.id,
          vendorName: app.applicantId?.name || "Unknown Vendor",
          tenderTitle: app.resourceId?.title || "Tender Deleted",
          amount: app.bidAmount ? `₹${app.bidAmount}` : "Not Specified",
          submittedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A",
          status: app.status || "Pending",
          ...getStatusColor(app.status || "Pending"),
          location: app.applicantId?.location || "N/A",
          rating: app.applicantId?.rating || 0,
          email: app.applicantId?.email,
          phone: app.applicantId?.phoneNumber,
          experience: app.applicantId?.experience || "N/A",
          proposal: app.coverLetter || "No additional comments provided.",
        }));
        setBids(mappedBids);
      } else {
        setBids([]);
      }
    } catch (error) {
      console.error("Failed to fetch bids", error);
      toast.error("Could not load bids");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  const filteredBids = bids.filter(
    (bid) =>
      (selectedStatus === "All" || bid.status === selectedStatus) &&
      ((bid.vendorName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bid.tenderTitle || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewProposal = (bid: Bid) => {
    setSelectedBid(bid);
    setShowProposalModal(true);
  };

  const handleMessage = (bid: Bid) => {
    setSelectedBid(bid);
    setShowMessageModal(true);
  };

  const handleDownload = (bid: Bid) => {
    toast.info(`Downloading proposal from ${bid.vendorName}...`);
  };

  const sendMessage = () => {
    if (message.trim() && selectedBid) {
      toast.success(`Message sent to ${selectedBid.vendorName}!`);
      setMessage("");
      setShowMessageModal(false);
    }
  };

  const updateBidStatus = async (bidId: string, newStatus: "Pending" | "Accepted" | "Rejected") => {
    try {
      await applicationService.updateApplicationStatus(bidId, newStatus, "resource");
      toast.success(`Bid status updated to ${newStatus}`);
      fetchBids();
      setShowProposalModal(false);
    } catch (error) {
      console.error("Failed to update bid status", error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse font-bold text-slate-400">
        Loading received bids...
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6 select-none">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight">Received Bids</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
          Manage incoming proposals from vendors
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search bids, vendors or tenders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white border border-slate-200 text-sm font-bold focus:outline-none shadow-sm"
          />
          <button
            onClick={() => setShowFilterModal(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Filter className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                selectedStatus === status
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                  : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bids List */}
      <div className="space-y-5">
        {filteredBids.map((bid) => (
          <div
            key={bid.id}
            className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 pt-6 pr-6">
              <div
                className={`px-4 py-1.5 rounded-full ${bid.statusBg} ${bid.statusColor} text-[8px] font-black uppercase tracking-widest border border-current opacity-80 shrink-0`}
              >
                {bid.status}
              </div>
            </div>

            <div className="flex items-start gap-4 mb-4 pr-32">
              <div className="size-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <Building2 className="size-7 text-indigo-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                  {bid.vendorName}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-black text-xs">★ {bid.rating}</span>
                  <span className="size-1 rounded-full bg-slate-200" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">
                    {bid.tenderTitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                  Proposed Amount
                </p>
                <p className="text-xl font-black text-indigo-600 tracking-tight">{bid.amount}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                  Submission Date
                </p>
                <div className="flex items-center justify-end gap-1">
                  <Clock className="size-3 text-slate-400" />
                  <p className="text-[11px] font-black">{bid.submittedDate}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleViewProposal(bid)}
                className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                View Proposal <ChevronRight className="size-4" />
              </button>
              <button
                onClick={() => handleMessage(bid)}
                className="size-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 active:scale-95 transition-all"
              >
                <MessageSquare className="size-5" />
              </button>
              <button
                onClick={() => handleDownload(bid)}
                className="size-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all"
              >
                <Download className="size-5" />
              </button>
            </div>
          </div>
        ))}

        {filteredBids.length === 0 && (
          <div className="text-center py-20 opacity-50 space-y-4">
            <Users className="size-16 mx-auto text-slate-300" />
            <p className="text-xs font-black uppercase tracking-widest">No bids found</p>
          </div>
        )}
      </div>

      {/* Proposal Modal */}
      {showProposalModal && selectedBid && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black">Bid Proposal</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedBid.vendorName}</p>
              </div>
              <button
                onClick={() => setShowProposalModal(false)}
                className="size-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="size-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <Building2 className="size-8 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-black mb-1">{selectedBid.vendorName}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-500 font-black text-sm">
                      ★ {selectedBid.rating}
                    </span>
                    <span className="size-1 rounded-full bg-slate-300" />
                    <span className="text-xs text-slate-500">{selectedBid.location}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {selectedBid.experience}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Email
                  </p>
                  <p className="text-xs font-bold">{selectedBid.email}</p>
                </div>
                <div className="p-3 bg-white rounded-xl">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Phone
                  </p>
                  <p className="text-xs font-bold">{selectedBid.phone}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h5 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">
                Tender Details
              </h5>
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-1">
                  Project
                </p>
                <p className="text-base font-black mb-3">{selectedBid.tenderTitle}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">
                      Bid Amount
                    </p>
                    <p className="text-xl font-black text-indigo-600">{selectedBid.amount}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">
                      Submitted
                    </p>
                    <p className="text-sm font-bold">{selectedBid.submittedDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h5 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">
                Proposal Summary
              </h5>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-sm leading-relaxed text-slate-700">
                  {selectedBid.proposal}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => updateBidStatus(selectedBid.id, "Accepted")}
                className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <CheckCircle className="size-4" />
                Accept Bid
              </button>
              <button
                onClick={() => updateBidStatus(selectedBid.id, "Rejected")}
                className="flex-1 px-4 py-3 rounded-xl bg-rose-600 text-white font-black text-sm uppercase tracking-widest hover:bg-rose-700 active:scale-95 transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
              >
                <XCircle className="size-4" />
                Reject Bid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedBid && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black">Send Message</h3>
                <p className="text-xs text-slate-500 mt-1">To: {selectedBid.vendorName}</p>
              </div>
              <button
                onClick={() => setShowMessageModal(false)}
                className="size-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mb-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-black text-sm uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
                className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <Send className="size-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">Advanced Filters</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="size-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <AlertCircle className="size-5 text-blue-600 mb-2" />
                <p className="text-sm font-bold text-blue-900">
                  Filter Options Coming Soon
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Advanced filtering by amount range, rating, location, and submission date will be
                  available soon.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full mt-4 h-14 rounded-2xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedBids;
