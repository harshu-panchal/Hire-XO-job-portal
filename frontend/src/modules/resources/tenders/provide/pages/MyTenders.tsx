import { useState, useEffect } from "react";
import {
  FileText,
  Users,
  Clock,
  CheckCircle2,
  MoreVertical,
  Edit2,
  Archive,
  Eye,
  Plus,
  X,
  Copy,
  Calendar,
  MapPin,
  DollarSign,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { toast } from "sonner";
import { applicationService } from "@/services/applicationService"; // To estimate bids count if not in tender object

interface Tender {
  _id: string; // Updated ID type
  id?: string; // fallback
  title: string;
  refNo?: string;
  bids?: number;
  closingDate?: string;
  deadline?: string;
  status: string;
  statusColor?: string; // These will be computed
  statusBg?: string; // These will be computed
  description?: string;
  tenderValue?: string; // API uses tenderValue
  budget?: string; // fallback
  location?: string;
  category?: string;
  postedAt?: string;
  publishedDate?: string; // fallback
}

const MyTenders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const data: any[] = await resourceService.getMyListings("tenders");

      // Map API data to component structure and add UI helpers
      const mappedTenders = data.map((t) => ({
        ...t,
        id: t._id,
        refNo: t._id.slice(-8).toUpperCase(), // Mock ref if missing
        bids: t.bidsCount || 0, // Assuming backend might populate this, else defaulted
        closingDate: t.deadline ? new Date(t.deadline).toLocaleDateString() : "Open",
        publishedDate: t.postedAt ? new Date(t.postedAt).toLocaleDateString() : "N/A",
        budget: t.tenderValue,
        statusColor: getStatusColor(t.status || "Active").color,
        statusBg: getStatusColor(t.status || "Active").bg,
      }));

      setTenders(mappedTenders);
    } catch (error) {
      console.error("Failed to fetch tenders", error);
      toast.error("Failed to load your tenders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return { color: "text-emerald-600", bg: "bg-emerald-100" };
      case "Published":
        return { color: "text-blue-600", bg: "bg-blue-100" };
      case "Evaluation":
        return { color: "text-amber-600", bg: "bg-amber-100" };
      case "Draft":
        return { color: "text-slate-600", bg: "bg-slate-100" };
      case "Archived":
        return { color: "text-slate-500", bg: "bg-slate-200" };
      default:
        return { color: "text-slate-600", bg: "bg-slate-100" };
    }
  };

  const stats = [
    {
      label: "Active",
      value: tenders
        .filter((t) => t.status === "Active" || t.status === "Published")
        .length.toString(),
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      label: "Total Tenders",
      value: tenders.length.toString(),
      icon: Users,
      color: "text-violet-600",
      bgColor: "bg-violet-100",
    },
    // Mocking 'Awarded' count for now as it depends on application statuses
    {
      label: "Closed",
      value: tenders.filter((t) => t.status === "Closed").length.toString(),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ];

  const tabs = ["All", "Active", "Evaluation", "Drafts"];

  const filteredTenders = tenders.filter((tender) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return tender.status === "Active" || tender.status === "Published";
    if (activeTab === "Evaluation") return tender.status === "Evaluation";
    if (activeTab === "Drafts") return tender.status === "Draft";
    return true;
  });

  const handleView = (tender: Tender) => {
    setSelectedTender(tender);
    setShowViewModal(true);
  };

  const handleEdit = (tender: Tender) => {
    navigate("/tenders/provide/post", { state: { tender } });
  };

  const handleArchive = async (tenderId: string) => {
    if (confirm("Are you sure you want to archive this tender?")) {
      const previous = tenders;
      setTenders((prev) =>
        prev.map((t) =>
          t._id === tenderId
            ? {
                ...t,
                status: "Archived",
                statusColor: getStatusColor("Archived").color,
                statusBg: getStatusColor("Archived").bg,
              }
            : t
        )
      );

      try {
        await resourceService.update("tenders", tenderId, { status: "Archived" } as any);
        toast.success("Tender archived successfully");
      } catch (error) {
        setTenders(previous);
        toast.error("Failed to archive tender");
      }
    }
  };

  const handleMenu = (tender: Tender) => {
    setSelectedTender(tender);
    setShowMenuModal(true);
  };

  const copyRefNo = (refNo: string | undefined) => {
    if (refNo) {
      navigator.clipboard.writeText(refNo);
      toast.success("Reference number copied!");
    }
  };

  const handleDelete = async (tenderId: string) => {
    if (confirm("Are you sure you want to delete this tender? This action cannot be undone.")) {
      try {
        await resourceService.delete("tenders", tenderId);
        setTenders(tenders.filter((t) => t._id !== tenderId)); // Optimistic update
        setShowMenuModal(false);
        toast.success("Tender deleted successfully!");
      } catch (error) {
        console.error("Failed to delete tender", error);
        toast.error("Failed to delete tender");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse font-bold text-slate-400">
        Loading Tenders...
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight">Tender Portfolio</h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
            Manage your published opportunities
          </p>
        </div>
        <Link
          to="/tenders/provide/post"
          className="size-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
        >
          <Plus className="size-6" />
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col items-center text-center space-y-2 group shadow-sm"
          >
            <div className={`size-10 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`size-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-black tracking-tight">{stat.value}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
              activeTab === tab
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/20"
                : "bg-white text-slate-500 border-slate-200 hover:border-indigo-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tenders List */}
      <div className="space-y-5">
        {filteredTenders.map((tender) => (
          <div
            key={tender._id}
            className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1.5 flex-1 pr-12">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  REF: {tender.refNo}
                </p>
                <h3 className="text-base font-black tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">
                  {tender.title}
                </h3>
              </div>
              <button
                onClick={() => handleMenu(tender)}
                className="size-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 active:scale-95 transition-all"
              >
                <MoreVertical className="size-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link
                to="/tenders/provide/bids"
                className="bg-indigo-50 rounded-2xl p-3 flex items-center justify-between group/bid"
              >
                <div className="space-y-0.5">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Total Bids
                  </p>
                  <p className="text-base font-black tracking-tight text-indigo-600">
                    {tender.bids}
                  </p>
                </div>
                <div className="size-8 rounded-lg bg-white flex items-center justify-center group-hover/bid:scale-110 transition-transform">
                  <Users className="size-4 text-indigo-600" />
                </div>
              </Link>
              <div className="bg-slate-50 rounded-2xl p-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Ends On
                  </p>
                  <p className="text-sm font-black tracking-tight">{tender.closingDate}</p>
                </div>
                <Clock className="size-4 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div
                className={`px-4 py-1.5 rounded-full ${tender.statusBg} ${tender.statusColor} text-[8px] font-black uppercase tracking-widest border border-current opacity-80`}
              >
                {tender.status}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(tender)}
                  className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all"
                >
                  <Edit2 className="size-4" />
                </button>
                <button
                  onClick={() => handleView(tender)}
                  className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all"
                >
                  <Eye className="size-4" />
                </button>
                <button
                  onClick={() => handleDelete(tender._id)}
                  className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all"
                >
                  <Archive className="size-4" />
                </button>
              </div>
            </div>

            {/* Background Highlight */}
            <div className="absolute top-0 right-0 size-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
          </div>
        ))}

        {filteredTenders.length === 0 && (
          <div className="text-center py-20 opacity-50 space-y-4">
            <FileText className="size-16 mx-auto text-slate-300" />
            <p className="text-xs font-black uppercase tracking-widest">No tenders found</p>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="h-4" />

      {/* View Tender Modal */}
      {showViewModal && selectedTender && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black">Tender Details</h3>
                <p className="text-xs text-slate-500 mt-1">REF: {selectedTender.refNo}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="size-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <div
                className={`inline-flex px-4 py-2 rounded-full ${selectedTender.statusBg} ${selectedTender.statusColor} text-xs font-black uppercase tracking-widest border border-current`}
              >
                {selectedTender.status}
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h4 className="text-2xl font-black mb-2">{selectedTender.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedTender.description}
              </p>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="size-4 text-indigo-600" />
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                    Budget
                  </p>
                </div>
                <p className="text-xl font-black text-indigo-600">
                  {selectedTender.budget || selectedTender.tenderValue || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="size-4 text-slate-500" />
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                    Bids Received
                  </p>
                </div>
                <p className="text-xl font-black">{selectedTender.bids}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="size-4 text-slate-500" />
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                    Closing Date
                  </p>
                </div>
                <p className="text-sm font-black">{selectedTender.closingDate}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="size-4 text-slate-500" />
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                    Location
                  </p>
                </div>
                <p className="text-sm font-black">{selectedTender.location || "N/A"}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-3 mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">
                  Category
                </p>
                <p className="text-sm font-bold">{selectedTender.category}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">
                  Published Date
                </p>
                <p className="text-sm font-bold">{selectedTender.publishedDate}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleEdit(selectedTender);
                  setShowViewModal(false);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <Edit2 className="size-4" />
                Edit Tender
              </button>
              <button
                onClick={() => copyRefNo(selectedTender.refNo)}
                className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-black text-sm uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Copy className="size-4" />
                Copy Ref
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Modal */}
      {showMenuModal && selectedTender && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black">Tender Actions</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedTender.title}</p>
              </div>
              <button
                onClick={() => setShowMenuModal(false)}
                className="size-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  handleView(selectedTender);
                  setShowMenuModal(false);
                }}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-all group"
              >
                <div className="size-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-indigo-100 transition-all">
                  <Eye className="size-5 text-slate-600 group-hover:text-indigo-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-black">View Details</p>
                  <p className="text-xs text-slate-500">See complete tender information</p>
                </div>
              </button>

              <button
                onClick={() => {
                  handleEdit(selectedTender);
                  setShowMenuModal(false);
                }}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-all group"
              >
                <div className="size-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-indigo-100 transition-all">
                  <Edit2 className="size-5 text-slate-600 group-hover:text-indigo-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-black">Edit Tender</p>
                  <p className="text-xs text-slate-500">Modify tender details</p>
                </div>
              </button>

              <button
                onClick={() => copyRefNo(selectedTender.refNo)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-all group"
              >
                <div className="size-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-blue-100 transition-all">
                  <Copy className="size-5 text-slate-600 group-hover:text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-black">Copy Reference</p>
                  <p className="text-xs text-slate-500">Copy tender reference number</p>
                </div>
              </button>

              <button
                onClick={() => {
                  handleArchive(selectedTender._id);
                  setShowMenuModal(false);
                }}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-amber-50 transition-all group"
              >
                <div className="size-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-amber-100 transition-all">
                  <Archive className="size-5 text-slate-600 group-hover:text-amber-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-black">Archive</p>
                  <p className="text-xs text-slate-500">Move to archived tenders</p>
                </div>
              </button>

              <button
                onClick={() => handleDelete(selectedTender._id)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 transition-all group border border-rose-200"
              >
                <div className="size-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-rose-100 transition-all">
                  <Trash2 className="size-5 text-rose-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-black text-rose-600">Delete Tender</p>
                  <p className="text-xs text-rose-500">Permanently remove this tender</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTenders;
