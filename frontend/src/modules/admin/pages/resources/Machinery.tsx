import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Search,
  Edit2,
  Trash2,
  X,
  MapPin,
  Truck,
  Loader2,
  Settings
} from "lucide-react";
import { adminService } from "../../../../services/adminService";
import { toast } from "sonner";
import { getErrorMessage } from "../../../../lib/apiConfig";

interface MachineryItem {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  contact?: string;
  email?: string;
  machineryType: "provide-machinery" | "need-machinery";
  machineryTypes?: string[];
  status: "Active" | "Inactive";
  userId?: any;
}

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

export default function Machinery() {
  const [activeTab, setActiveTab] = useState<"provide" | "need">("provide");
  const [data, setData] = useState<MachineryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MachineryItem | null>(null);
  const [formData, setFormData] = useState<Partial<MachineryItem>>({});
  const [machineryTypesString, setMachineryTypesString] = useState("");

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

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await adminService.getResources("machinery", {
        search: debouncedSearch,
        page,
        limit
      });

      const targetType = activeTab === "provide" ? "provide-machinery" : "need-machinery";

      // Map and filter
      const mapped = response.data.map((item: any) => ({
        _id: item._id,
        title: item.title,
        company: item.company,
        description: item.description,
        location: item.location,
        contact: item.userId?.phoneNumber || "N/A",
        email: item.userId?.email || "N/A",
        machineryType: item.machineryType,
        machineryTypes: item.machineryTypes,
        status: item.status || "Active",
        userId: item.userId
      }));

      const filtered = mapped.filter((item: any) => item.machineryType === targetType);

      setData(filtered);
      if (response.pagination) {
        setTotalPages(response.pagination.pages);
        setTotalItems(response.pagination.total);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load machinery records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [activeTab, debouncedSearch, page]);

  const activeCount = data.filter((i) => i.status === "Active").length;
  const totalCount = data.length;

  const handleOpenModal = (item?: MachineryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
      setMachineryTypesString(item.machineryTypes?.join(", ") || "");
      setShowModal(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await adminService.deleteResource("machinery", id);
        toast.success("Deleted successfully");
        setData(prev => prev.filter(i => i._id !== id));
      } catch (e) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleSave = async () => {
    if (!editingItem || !editingItem._id) return;

    try {
      const payload: any = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        location: formData.location,
        status: formData.status,
        machineryTypes: machineryTypesString.split(",").map(s => s.trim()).filter(s => s)
      };

      await adminService.updateResource("machinery", editingItem._id, payload);
      toast.success("Updated successfully");
      setShowModal(false);
      fetchResources();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Machinery</h1>
          <p className="text-slate-500 mt-1">Manage heavy machinery requests</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => { setActiveTab("provide"); setSearchTerm(""); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "provide" ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
          >
            Providing
          </button>
          <button
            onClick={() => { setActiveTab("need"); setSearchTerm(""); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "need" ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
          >
            Needing
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search machinery..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
          <p className="text-sm text-slate-500 mt-1">Total Records</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Settings className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          <p className="text-sm text-slate-500 mt-1">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-slate-100">
              <Settings className="w-5 h-5 text-slate-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-400">{totalCount - activeCount}</p>
          <p className="text-sm text-slate-500 mt-1">Inactive</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <div key={item._id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                {item.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">{item.title}</h3>
            <p className="text-sm font-medium text-slate-700 mb-2">{item.company}</p>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{item.description}</p>
            <div className="space-y-2 text-sm mb-4 flex-grow">
              {item.machineryTypes && item.machineryTypes.length > 0 ? (
                <div className="flex items-start gap-2 text-slate-600">
                  <Settings className="w-4 h-4 text-slate-400 mt-0.5" />
                  <span>{item.machineryTypes.slice(0, 3).join(", ")}{item.machineryTypes.length > 3 ? "..." : ""}</span>
                </div>
              ) : null}
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                {item.location}
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-slate-100 mt-auto">
              <button onClick={() => handleOpenModal(item)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => handleDelete(item._id)} className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <div className="py-12 text-center bg-white rounded-xl border border-slate-200">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No records found</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-200 rounded-xl mt-6">
          <div className="flex items-center text-sm text-slate-500">
            Showing <span className="font-medium mx-1">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-medium mx-1">{Math.min(page * limit, totalItems)}</span> of{" "}
            <span className="font-medium mx-1">{totalItems}</span> items
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

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Edit Machinery Record</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label><input type="text" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label><input type="text" value={formData.company || ""} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Type (Comma sep)</label><input type="text" value={machineryTypesString} onChange={(e) => setMachineryTypesString(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label><input type="text" value={formData.location || ""} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                </div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label><textarea rows={4} value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" /></div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                  <select value={formData.status || "Active"} onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Save Changes</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
