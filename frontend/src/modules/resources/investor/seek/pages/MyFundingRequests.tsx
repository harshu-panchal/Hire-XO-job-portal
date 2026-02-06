import { useState, useEffect } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  TrendingUp,
  MessageSquare,
  Calendar,
  X,
  Search,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";
// import { toast } from "sonner"; // Assuming toast exists or use alert

const MyFundingRequests = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [allRequests, setAllRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Resources and Inquiries in parallel
      const [resources, applications] = await Promise.all([
        resourceService.getMyListings("investors"),
        applicationService.getReceivedResourceApplications("investors").catch(() => []),
      ]);

      // Count inquiries per resource
      const inquiryCounts: Record<string, number> = {};
      applications.forEach((app: any) => {
        const resId = app.resourceId?._id || app.resourceId; // dependent on populate or not
        if (resId) {
          inquiryCounts[resId] = (inquiryCounts[resId] || 0) + 1;
        }
      });

      // Format resources
      const formatted = resources.map((res: any) => ({
        id: res._id,
        title: res.title,
        sector: res.category || "General",
        sectorColor: "blue", // Dynamic mapping could be added
        amount: res.amount || "N/A",
        equity: res.equity || "N/A",
        duration: res.duration || "N/A",
        status: res.status || "Active",
        statusColor: res.status === "Active" ? "emerald" : "slate",
        postedDate: new Date(res.createdAt).toLocaleDateString(),
        views: res.views || 0,
        inquiries: inquiryCounts[res._id] || 0,
        description: res.description,
        fullDescription: res.description, // Same for now
      }));

      setAllRequests(formatted);
    } catch (error) {
      console.error("Failed to fetch funding requests", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter requests based on active filter and search query
  const filteredRequests = allRequests.filter((request) => {
    // Map backend status to UI filters if needed
    // Since we likely just use strings, basic match is fine
    const matchesFilter = activeFilter === "All" || request.status === activeFilter;
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: allRequests.length,
    active: allRequests.filter((r) => r.status === "Active").length,
    totalViews: allRequests.reduce((sum, r) => sum + r.views, 0),
    totalInquiries: allRequests.reduce((sum, r) => sum + r.inquiries, 0),
  };

  const handleEdit = (request: any) => {
    // Navigate to edit page or open edit modal
    navigate("/investor/seek/post", { state: { editRequest: request } });
  };

  const handleDelete = (request: any) => {
    setRequestToDelete(request);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (requestToDelete) {
      try {
        await resourceService.delete("investors", requestToDelete.id);
        setAllRequests(allRequests.filter((r) => r.id !== requestToDelete.id));
        setShowDeleteModal(false);
        setRequestToDelete(null);
        // toast.success("Request deleted successfully");
      } catch (error) {
        console.error("Failed to delete request", error);
        // toast.error("Failed to delete request");
      }
    }
  };

  const handleView = (request: any) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  return (
    <div className="py-6 space-y-6 select-none">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-3xl font-black tracking-tight">
          My Funding <span className="text-primary">Requests</span>
        </h1>
        <p className="text-slate-500 font-black text-xs uppercase tracking-widest mt-1">
          Manage your posted funding needs
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-[2rem] p-5 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              Total Requests
            </p>
            <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <TrendingUp className="size-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-black">{stats.total}</p>
          <p className="text-[8px] font-bold text-emerald-600 mt-1">{stats.active} Active</p>
        </div>
        <div className="bg-white rounded-[2rem] p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              Total Views
            </p>
            <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Eye className="size-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-black">{stats.totalViews}</p>
        </div>
        <div className="bg-white rounded-[2rem] p-5 border border-slate-200 col-span-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              Investor Inquiries
            </p>
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <MessageSquare className="size-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600">{stats.totalInquiries}</p>
          <p className="text-[8px] font-bold text-slate-500 mt-1">Across all requests</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title or sector..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 size-6 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
          >
            <X className="size-4 text-slate-600" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {["All", "Active", "Under Review", "Closed"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              filter === activeFilter
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10">Loading requests...</div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-[2rem] p-5 border border-slate-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`inline-flex items-center px-2 py-0.5 rounded-md bg-${request.sectorColor}-500/10 border border-${request.sectorColor}-500/10`}
                    >
                      <span
                        className={`text-[8px] font-black uppercase tracking-widest text-${request.sectorColor}-600`}
                      >
                        {request.sector}
                      </span>
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded-full bg-${request.statusColor}-500/10 border border-${request.statusColor}-500/20`}
                    >
                      <span
                        className={`text-[8px] font-black uppercase tracking-widest text-${request.statusColor}-600`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-black text-lg tracking-tight mb-1">{request.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {request.description}
                  </p>
                </div>
                <button
                  onClick={() => handleView(request)}
                  className="size-10 rounded-xl bg-slate-50 flex items-center justify-center active:scale-90 transition-all shrink-0 ml-3 hover:bg-slate-100"
                >
                  <Eye className="size-5 text-slate-600" />
                </button>
              </div>

              {/* Funding Details */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-0.5">
                    Seeking
                  </p>
                  <p className="text-base font-black text-emerald-700">
                    {request.amount}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-0.5">
                    Equity
                  </p>
                  <p className="text-base font-black text-blue-700">
                    {request.equity}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                  <p className="text-[9px] font-black uppercase tracking-widest text-purple-600 mb-0.5">
                    Duration
                  </p>
                  <p className="text-xs font-black text-purple-700">
                    {request.duration}
                  </p>
                </div>
              </div>

              {/* Meta & Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>{request.postedDate}</span>
                  </div>
                  <div className="size-1 rounded-full bg-slate-200" />
                  <div className="flex items-center gap-1">
                    <Eye className="size-3" />
                    <span>{request.views}</span>
                  </div>
                  <div className="size-1 rounded-full bg-slate-200" />
                  <div className="flex items-center gap-1">
                    <MessageSquare className="size-3" />
                    <span>{request.inquiries}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(request)}
                    className="size-9 rounded-xl bg-blue-50 flex items-center justify-center active:scale-90 transition-all hover:bg-blue-100"
                  >
                    <Edit2 className="size-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(request)}
                    className="size-9 rounded-xl bg-red-50 flex items-center justify-center active:scale-90 transition-all hover:bg-red-100"
                  >
                    <Trash2 className="size-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty State for filtered results */}
      {!loading && filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="size-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="size-8 text-slate-400" />
          </div>
          <p className="text-lg font-black text-slate-400">No requests found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery ? "Try adjusting your search" : "No requests match the selected filter"}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <div className="size-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="size-7 text-red-600" />
            </div>
            <h3 className="text-xl font-black text-center mb-2">Delete Request?</h3>
            <p className="text-sm text-slate-600 text-center mb-6">
              Are you sure you want to delete "{requestToDelete?.title}"? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-black text-sm uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-black text-sm uppercase tracking-widest hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-slate-200 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`px-3 py-1 rounded-lg bg-${selectedRequest.sectorColor}-500/10 border border-${selectedRequest.sectorColor}-500/20`}
                  >
                    <span
                      className={`text-xs font-black uppercase tracking-widest text-${selectedRequest.sectorColor}-600`}
                    >
                      {selectedRequest.sector}
                    </span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full bg-${selectedRequest.statusColor}-500/10 border border-${selectedRequest.statusColor}-500/20`}
                  >
                    <span
                      className={`text-xs font-black uppercase tracking-widest text-${selectedRequest.statusColor}-600`}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl font-black tracking-tight">{selectedRequest.title}</h2>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="size-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-90 transition-all shrink-0 ml-4"
              >
                <X className="size-5 text-slate-600" />
              </button>
            </div>

            {/* Funding Details */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-1">
                  Seeking
                </p>
                <p className="text-2xl font-black text-emerald-700">
                  {selectedRequest.amount}
                </p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-1">
                  Equity
                </p>
                <p className="text-2xl font-black text-blue-700">
                  {selectedRequest.equity}
                </p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                <p className="text-xs font-black uppercase tracking-widest text-purple-600 mb-1">
                  Duration
                </p>
                <p className="text-lg font-black text-purple-700">
                  {selectedRequest.duration}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">
                Full Description
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedRequest.fullDescription}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-2xl">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="size-4 text-slate-400" />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Posted
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-700">
                  {selectedRequest.postedDate}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Eye className="size-4 text-slate-400" />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Views
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-700">
                  {selectedRequest.views}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MessageSquare className="size-4 text-slate-400" />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Inquiries
                  </p>
                </div>
                <p className="text-sm font-bold text-emerald-600">{selectedRequest.inquiries}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedRequest);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-black text-sm uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <Edit2 className="size-4" />
                Edit Request
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleDelete(selectedRequest);
                }}
                className="px-4 py-3 rounded-xl bg-red-50 text-red-600 font-black text-sm uppercase tracking-widest hover:bg-red-100 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFundingRequests;
