import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Search,
  // Plus, // Hiding Add button for now
  Edit2,
  Trash2,
  X,
  MapPin,
  Phone,
  // Mail,
  DollarSign,
  TrendingUp,
  HandCoins,
  Loader2
} from "lucide-react";
import { adminService } from "../../../../services/adminService";
import { toast } from "sonner";

interface InvestorItem {
  _id: string; // Changed to _id
  id?: string; // For compatibility if needed
  name: string; // Mapped from company
  title?: string; // For Seekers
  description: string;
  location: string;
  contact?: string; // Mapped from userId?.phone or placeholder
  email?: string;   // Mapped from userId?.email
  budget?: string;  // Mapped from investmentAmount
  amountNeeded?: string; // Mapped from investmentAmount
  status: "Active" | "Inactive" | "Pending" | "Funded";
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

export default function Investors() {
  const [activeTab, setActiveTab] = useState<"invest" | "seek">("invest");
  const [data, setData] = useState<InvestorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InvestorItem | null>(null);

  // Form States
  const [formData, setFormData] = useState<Partial<InvestorItem>>({});

  const fetchResources = async () => {
    setLoading(true);
    try {
      // Filter by investorType based on tab
      const type = activeTab === "invest" ? "want-to-invest" : "want-investment";

      const allResources = await adminService.getResources("investors");

      // Filter active tab
      const filtered = allResources.data.filter((item: any) =>
        activeTab === "invest" ? (item.investorType === "want-to-invest") : (item.investorType === "want-investment")
      );

      // Map to UI model
      const mapped = filtered.map((item: any) => ({
        _id: item._id,
        name: item.company,
        title: item.title,
        description: item.description,
        location: item.location,
        contact: item.userId?.phoneNumber || "N/A", // User model might not have phone exposed or populated fully
        email: item.userId?.email || "N/A",
        budget: item.investmentAmount,
        amountNeeded: item.investmentAmount,
        status: item.status || "Active",
        userId: item.userId
      }));

      setData(mapped);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load investors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [activeTab]);

  // Client-side search filtering
  const filteredData = data.filter(
    (item) =>
      (item.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (item.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (item.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const activeCount = filteredData.filter((i) => i.status === "Active").length;
  const totalCount = filteredData.length;

  const handleOpenModal = (item?: InvestorItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
      setShowModal(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await adminService.deleteResource("investors", id);
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
      // Prepare update payload
      const payload: any = {
        company: formData.name, // Map back
        description: formData.description,
        location: formData.location,
        status: formData.status,
        // Map budget/amount back to investmentAmount
        investmentAmount: activeTab === 'invest' ? formData.budget : formData.amountNeeded
      };
      if (activeTab === 'seek') {
        payload.title = formData.title;
      }

      await adminService.updateResource("investors", editingItem._id, payload);
      toast.success("Updated successfully");
      setShowModal(false);
      fetchResources(); // Refresh
    } catch (e) {
      toast.error("Failed to update");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Investment</h1>
          <p className="text-slate-500 mt-1">Manage investment opportunities</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => {
              setActiveTab("invest");
              setSearchTerm("");
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "invest"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            Ready to Invest
          </button>
          <button
            onClick={() => {
              setActiveTab("seek");
              setSearchTerm("");
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "seek"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            Need Investment
          </button>
        </div>
      </motion.div>

      {/* Sub-Header Actions */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === "invest" ? "Search investment..." : "Search funding requests..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        {/* Hidden Add Button
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {activeTab === "invest" ? "Add Investment" : "Post Request"}
        </button>
        */}
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {activeTab === "invest" ? (
                <HandCoins className="w-5 h-5 text-primary" />
              ) : (
                <TrendingUp className="w-5 h-5 text-primary" />
              )}
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
          <p className="text-sm text-slate-500 mt-1">
            Total {activeTab === "invest" ? "Investment" : "Requests"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          <p className="text-sm text-slate-500 mt-1">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-2xl font-bold text-slate-400">{totalCount - activeCount}</p>
          <p className="text-sm text-slate-500 mt-1">
            {activeTab === "invest" ? "Inactive" : "Closed/Pending"}
          </p>
        </div>
      </motion.div>

      {/* Content Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredData.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === "Active" || item.status === "Funded"
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-600"
                  }`}
              >
                {item.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {activeTab === "invest" ? item.name : item.title}
            </h3>
            {activeTab === "seek" && (
              <p className="text-xs font-medium text-primary mb-2 text-start">{item.name}</p>
            )}
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              {item.description}
            </p>

            <div className="space-y-2 text-sm mb-4 flex-grow">
              <div className="flex items-center gap-2 text-slate-600">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">
                  {activeTab === "invest" ? item.budget : item.amountNeeded}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                {item.location}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                {item.contact}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-100 mt-auto">
              <button
                onClick={() => handleOpenModal(item)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="py-12 text-center bg-white rounded-xl border border-slate-200">
          <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No results found</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingItem
                    ? activeTab === "invest"
                      ? "Edit Investment"
                      : "Edit Funding Request"
                    : activeTab === "invest"
                      ? "Add New Investment"
                      : "Post Funding Request"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {activeTab === "invest" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Investor Name
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g. Venture Capital Ltd."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Budget Range
                      </label>
                      <input
                        type="text"
                        value={formData.budget || ""}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. ₹5 Cr - ₹10 Cr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location || ""}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                  {/* Read only contact fields or editable? Since they come from User, editing them here might be misleading if we don't update User model. But we are acting as Admin.
                      Actually, Investor model DOES NOT have contact/email. It has userId. 
                      So we CANNOT edit contact/email here unless we update User or if we had them on Investor model. 
                      I will make them READ ONLY or hide them from Edit form.
                      UI had them editable. 
                      For now I'll hide them or make them read-only to avoid confusion.
                   */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Description / Interests
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      placeholder="Describe investment focus..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status || "Active"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "Active" | "Inactive",
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g. AI Powered recruitment"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Startup Name
                      </label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Amount Needed
                      </label>
                      <input
                        type="text"
                        value={formData.amountNeeded || ""}
                        onChange={(e) => setFormData({ ...formData, amountNeeded: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. ₹50 Lakhs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location || ""}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Description / Pitch
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      placeholder="Detail your funding requirements..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.status || "Pending"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Funded">Funded</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
