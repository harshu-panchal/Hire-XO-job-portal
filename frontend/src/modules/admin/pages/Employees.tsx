import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
    Search,
    Plus,
    Users,
    Edit2,
    Trash2,
    X,
    Loader2
} from "lucide-react";
import { adminService } from "../../../services/adminService";
import type { User } from "../../../types";
import { toast } from "sonner";
import { useDebounce } from "../../../hooks/useDebounce";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
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

export default function Employees() {
    const [employees, setEmployees] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // Simple debounce implementation if hook doesn't exist
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getUsers({
                role: 'employee',
                search: debouncedSearch,
                status: statusFilter,
                page,
                limit
            });
            setEmployees(response.data);
            setTotalPages(response.pagination.pages);
            setTotalUsers(response.pagination.total);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
            toast.error("Failed to fetch employees");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [debouncedSearch, statusFilter, page]); // Dependency array updated

    const handleDelete = async (id: string | undefined) => {
        if (!id) return;
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await adminService.deleteUser(id);
                toast.success("User deleted successfully");
                setEmployees(employees.filter((u) => u._id !== id));
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                status: user.status,
                // @ts-ignore
                age: user.profile?.age || user.age || "",
                // @ts-ignore
                education: user.profile?.education || user.education || "",
                // @ts-ignore
                experience: user.profile?.experience || user.experience || "",
            });
        } else {
            setEditingUser(null);
            setFormData({ status: "active" } as Partial<User>);
        }
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (editingUser && editingUser._id) {
                await adminService.updateUser(editingUser._id, {
                    name: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    status: (formData.status || "active") as any,
                    // @ts-ignore
                    age: formData.age,
                    // @ts-ignore
                    education: formData.education,
                    // @ts-ignore
                    experience: formData.experience,
                });

                if (formData.status && formData.status !== editingUser.status) {
                    await adminService.updateUserStatus(editingUser._id, formData.status as any);
                }

                toast.success("User updated successfully");
                fetchEmployees();
            } else {
                await adminService.createUser({
                    name: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    // @ts-ignore
                    age: formData.age,
                    // @ts-ignore
                    education: formData.education,
                    // @ts-ignore
                    experience: formData.experience,
                    role: "employee"
                });
                toast.success("User created successfully");
                fetchEmployees();
            }
            setShowModal(false);
        } catch (error) {
            toast.error("Failed to save user");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Employees</h1>
                    <p className="text-slate-500 mt-1">Manage all registered employees</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Employee
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Total Users</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                        {totalUsers}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Active (Visible)</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {employees.filter((u) => u.status === "active").length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Inactive (Visible)</p>
                    <p className="text-2xl font-bold text-slate-400 mt-1">
                        {employees.filter((u) => u.status !== "active").length}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {employees.map((user) => (
                                        <motion.tr
                                            key={user._id}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="show"
                                            exit={{ opacity: 0, x: -20 }}
                                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium overflow-hidden">
                                                        {user.profilePhoto ? (
                                                            <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {user.phoneNumber || "-"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : user.status === "banned"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-slate-100 text-slate-600"
                                                        }`}
                                                >
                                                    {user.status || "active"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(user)}
                                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4 text-slate-500" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}
                </div>

                {!isLoading && employees.length === 0 && (
                    <div className="py-12 text-center">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No employees found</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalUsers > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-200">
                        <div className="flex items-center text-sm text-slate-500">
                            Showing <span className="font-medium mx-1">{(page - 1) * limit + 1}</span> to{" "}
                            <span className="font-medium mx-1">{Math.min(page * limit, totalUsers)}</span> of{" "}
                            <span className="font-medium mx-1">{totalUsers}</span> users
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
            </div>

            {/* Add/Edit Modal */}
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
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {editingUser ? "Edit Employee" : "Add New Employee"}
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name || ""}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email || ""}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phoneNumber || ""}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.age || ""}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value as any })}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Experience (Years)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.experience || ""}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value as any })}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Education
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.education || ""}
                                        onChange={(e) => setFormData({ ...formData, education: e.target.value as any })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="e.g. Bachelor of Technology"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({ ...formData, status: e.target.value as any })
                                        }
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                        <option value="banned">Banned</option>
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
                                        {editingUser ? "Save Changes" : "Add Employee"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
