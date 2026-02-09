import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, Edit2, Trash2, X, MapPin, Phone, Mail, Loader2, AlertCircle } from "lucide-react";
import { adminService } from "../../../../services/adminService";
import { toast } from "sonner";

interface ResourceItem {
  _id: string;
  id?: string;
  name: string;
  description: string;
  location: string;
  contact: string;
  email: string;
  status: "Active" | "Inactive";
  userId?: any;
  [key: string]: any; // Allow other props
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

interface ResourcePageProps {
  title: string;
  icon: React.ElementType;
}

export default function ResourcePage({ title, icon: Icon }: ResourcePageProps) {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState<Partial<ResourceItem>>({});

  const category = title.toLowerCase();

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await adminService.getResources(category);
      const mapped = response.data.map((item: any) => ({
        _id: item._id,
        name: item.title || item.company || item.name || "Unnamed Resource",
        description: item.description || "No description",
        location: item.location || "Unknown Location",
        contact: item.userId?.phone || "N/A",
        email: item.userId?.email || "N/A",
        status: item.status || "Active",
        userId: item.userId,
        ...item // Keep original fields for editing if needed
      }));
      setItems(mapped);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to load ${title}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [category]);

  const filteredItems = items.filter(
    (i) =>
      (i.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (i.location?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (i.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const openModal = (item?: ResourceItem) => {
    if (item) {
      setEditingItem(item);
      setFormState(item);
      setShowModal(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await adminService.deleteResource(category, id);
        setItems(items.filter((i) => i._id !== id));
        toast.success("Deleted successfully");
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem._id) return;

    setIsSaving(true);
    try {
      // We only update common fields + generic 'name' mapped back to 'title' if applicable
      // This is tricky because different resources have different field names for "Name".
      // Tenders/Equipments/Machinery/PMC/CSM/Logistics/Vehicles all use `title`.
      // Ensure we explicitly map 'name' back to 'title' if the original item had 'title'.

      const payload: any = {
        description: formState.description,
        location: formState.location,
        status: formState.status
      };

      if (editingItem.title) {
        payload.title = formState.name;
      } else if (editingItem.company) {
        // If it uses company as name (like Investor), but Investor uses Investors.tsx. 
        // Other resources might use company?
        // Most use 'title'.
        payload.company = formState.name; // Fallback or strict?
      }

      // If we want to be safe, we should probably fetch the original specific fields or just rely on what we have.
      // But ResourcePage is generic.
      // Users might edit "Name" and expect "Title" to change.
      if (typeof editingItem.title !== 'undefined') payload.title = formState.name;

      await adminService.updateResource(category, editingItem._id, payload);

      setItems(
        items.map((i) => (i._id === editingItem._id ? { ...i, ...formState, name: formState.name! } : i))
      );
      toast.success("Updated successfully");
      setShowModal(false);
      fetchResources(); // Refresh to be sure
    } catch (error) {
      toast.error("Failed to update");
    } finally {
      setIsSaving(false);
    }
  };

  const activeCount = items.filter((i) => i.status === "Active").length;

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
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="text-slate-500 mt-1">Manage all {title.toLowerCase()}</p>
        </div>
        {/* Hiding Add Button
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add {title.slice(0, -1)}
        </button>
        */}
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{items.length}</p>
          <p className="text-sm text-slate-500 mt-1">Total {title}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          <p className="text-sm text-slate-500 mt-1">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-2xl font-bold text-slate-400">{items.length - activeCount}</p>
          <p className="text-sm text-slate-500 mt-1">Inactive</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </motion.div>

      {/* Items Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                  }`}
              >
                {item.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {item.name}
            </h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              {item.description}
            </p>

            <div className="space-y-2 text-sm mb-4 flex-grow">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                {item.location}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                {item.contact}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                {item.email}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-100 mt-auto">
              <button
                onClick={() => openModal(item)}
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

      {filteredItems.length === 0 && (
        <div className="py-12 text-center bg-white rounded-xl border border-slate-200">
          <Icon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
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
                  {editingItem ? `Edit ${title.slice(0, -1)}` : `Add New ${title.slice(0, -1)}`}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Name/Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name || ""}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formState.description || ""}
                    onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.location || ""}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                {/* Contact and Email are usually from User, so we make them read-only or hidden in edit if we can't change User */}
                {/*
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Contact
                    </label>
                    <input
                      type="tel"
                      value={formState.contact || ""}
                      readOnly
                      className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formState.email || ""}
                      readOnly
                      className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formState.status}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        status: e.target.value as "Active" | "Inactive",
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
