import { useState } from "react";
import {
  Eye,
  MessageSquare,
  MoreVertical,
  Edit3,
  Trash2,
  Car,
  X,
  Copy,
  Archive,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Vehicle {
  id: number;
  title: string;
  category: string;
  views: number;
  inquiries: number;
  status: string;
  postedDate: string;
  price: string;
  description?: string;
  location?: string;
  capacity?: string;
  features?: string[];
}

const MyVehicles = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      title: "2023 Tesla Model 3 Long Range",
      category: "Electric",
      views: 120,
      inquiries: 5,
      status: "Active",
      postedDate: "Jan 10, 2026",
      price: "₹4,500/day",
      description:
        "Premium electric sedan with autopilot, perfect for business travel and daily commutes. Fully charged and maintained.",
      location: "Mumbai, Maharashtra",
      capacity: "5 Passengers",
      features: ["Autopilot", "Premium Sound", "Leather Seats", "Supercharging"],
    },
    {
      id: 2,
      title: "Tata Ace Delivery Van",
      category: "Commercial",
      views: 350,
      inquiries: 18,
      status: "Active",
      postedDate: "Jan 18, 2026",
      price: "₹1,800/day",
      description:
        "Reliable commercial vehicle for deliveries and logistics. Well-maintained with regular servicing.",
      location: "Pune, Maharashtra",
      capacity: "750 kg Load",
      features: ["GPS Tracking", "Cargo Space", "Fuel Efficient", "Driver Available"],
    },
  ]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowViewModal(true);
  };

  const handleMenu = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowMenuModal(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    // Navigate to edit page with vehicle data
    navigate("/vehicles/provide/post", { state: { vehicle } });
  };

  const handleDelete = (vehicleId: number) => {
    if (confirm("Are you sure you want to delete this vehicle listing?")) {
      setVehicles(vehicles.filter((v) => v.id !== vehicleId));
      setShowMenuModal(false);
      alert("Vehicle deleted successfully!");
    }
  };

  const handleArchive = (vehicleId: number) => {
    if (confirm("Are you sure you want to archive this vehicle?")) {
      setVehicles(vehicles.filter((v) => v.id !== vehicleId));
      setShowMenuModal(false);
      alert("Vehicle archived successfully!");
    }
  };

  const handleCopyId = (vehicleId: number) => {
    navigator.clipboard.writeText(`VEH-${vehicleId.toString().padStart(4, "0")}`);
    alert("Vehicle ID copied to clipboard!");
  };

  const handleAddNew = () => {
    navigate("/vehicles/provide/post");
  };

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-black tracking-tighter">My Fleet</h1>
        <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
          Manage your active rental vehicles
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-900">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">
            Total Vehicles
          </p>
          <p className="text-2xl font-black text-blue-600">{vehicles.length}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900">
          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">
            Total Views
          </p>
          <p className="text-2xl font-black text-emerald-600">
            {vehicles.reduce((sum, v) => sum + v.views, 0)}
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-2xl border border-orange-200 dark:border-orange-900">
          <p className="text-[9px] font-black uppercase tracking-widest text-orange-600 mb-1">
            Total Leads
          </p>
          <p className="text-2xl font-black text-orange-600">
            {vehicles.reduce((sum, v) => sum + v.inquiries, 0)}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/10 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                  <Car className="size-5" />
                </div>
                <div
                  className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                    vehicle.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}
                >
                  {vehicle.status}
                </div>
              </div>
              <button
                onClick={() => handleMenu(vehicle)}
                className="size-10 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-center text-slate-400 transition-colors"
              >
                <MoreVertical className="size-5" />
              </button>
            </div>

            <h3 className="font-black text-lg tracking-tight mb-2 leading-tight">
              {vehicle.title}
            </h3>

            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6 px-1">
              <span className="text-blue-600 italic">#{vehicle.category}</span>
              <div className="size-1 rounded-full bg-slate-200" />
              <span>{vehicle.price}</span>
              <div className="size-1 rounded-full bg-slate-200" />
              <span>Posted {vehicle.postedDate}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                  <Eye className="size-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Views
                  </p>
                  <p className="text-xs font-black italic">{vehicle.views}</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                  <MessageSquare className="size-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Leads
                  </p>
                  <p className="text-xs font-black italic">{vehicle.inquiries}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleView(vehicle)}
                className="h-12 rounded-2xl bg-blue-500/10 text-blue-600 border border-blue-500/10 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500/20 active:scale-95 transition-all"
              >
                <Eye className="size-3.5" />
                View
              </button>
              <button
                onClick={() => handleEdit(vehicle)}
                className="h-12 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Edit3 className="size-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(vehicle.id)}
                className="h-12 rounded-2xl bg-red-500/10 text-red-600 border border-red-500/10 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/20 active:scale-95 transition-all"
              >
                <Trash2 className="size-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddNew}
        className="w-full h-16 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all active:scale-[0.98]"
      >
        <Plus className="size-4" />
        List New Vehicle
      </button>

      {/* View Vehicle Modal */}
      {showViewModal && selectedVehicle && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowViewModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black">Vehicle Details</h3>
                <p className="text-xs text-slate-500 mt-1">
                  VEH-{selectedVehicle.id.toString().padStart(4, "0")}
                </p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Badge */}
              <div
                className={`inline-flex px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                  selectedVehicle.status === "Active"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                }`}
              >
                {selectedVehicle.status}
              </div>

              {/* Title */}
              <div>
                <h4 className="text-2xl font-black mb-2">{selectedVehicle.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedVehicle.description}
                </p>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="size-4 text-blue-600" />
                    <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                      Price
                    </p>
                  </div>
                  <p className="text-lg font-black text-blue-600">{selectedVehicle.price}</p>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="size-4 text-emerald-600" />
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                      Views
                    </p>
                  </div>
                  <p className="text-lg font-black text-emerald-600">{selectedVehicle.views}</p>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-200 dark:border-orange-900">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="size-4 text-orange-600" />
                    <p className="text-xs font-black uppercase tracking-widest text-orange-600">
                      Inquiries
                    </p>
                  </div>
                  <p className="text-lg font-black text-orange-600">{selectedVehicle.inquiries}</p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-2xl border border-purple-200 dark:border-purple-900">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="size-4 text-purple-600" />
                    <p className="text-xs font-black uppercase tracking-widest text-purple-600">
                      Posted
                    </p>
                  </div>
                  <p className="text-sm font-black text-purple-600">{selectedVehicle.postedDate}</p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <MapPin className="size-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Location
                    </p>
                    <p className="text-sm font-bold">{selectedVehicle.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Users className="size-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Capacity
                    </p>
                    <p className="text-sm font-bold">{selectedVehicle.capacity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Car className="size-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Category
                    </p>
                    <p className="text-sm font-bold">{selectedVehicle.category}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              {selectedVehicle.features && selectedVehicle.features.length > 0 && (
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                    Features
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedVehicle.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900"
                      >
                        <CheckCircle className="size-3 text-blue-600" />
                        <span className="text-xs font-bold text-blue-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedVehicle);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-black text-sm uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
              >
                Edit Vehicle
              </button>
              <button
                onClick={() => handleCopyId(selectedVehicle.id)}
                className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-2"
              >
                <Copy className="size-4" />
                Copy ID
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Modal */}
      {showMenuModal && selectedVehicle && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowMenuModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black">Vehicle Actions</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedVehicle.title}</p>
              </div>
              <button
                onClick={() => setShowMenuModal(false)}
                className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowMenuModal(false);
                  handleView(selectedVehicle);
                }}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-all group border border-blue-200 dark:border-blue-900"
              >
                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-950/40 transition-all">
                  <Eye className="size-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-black text-blue-600">View Details</p>
                  <p className="text-xs text-blue-500">See full vehicle information</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowMenuModal(false);
                  handleEdit(selectedVehicle);
                }}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group border border-slate-200 dark:border-white/10"
              >
                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-all">
                  <Edit3 className="size-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-black">Edit Vehicle</p>
                  <p className="text-xs text-slate-500">Update vehicle details</p>
                </div>
              </button>

              <button
                onClick={() => handleCopyId(selectedVehicle.id)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/30 transition-all group border border-purple-200 dark:border-purple-900"
              >
                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-950/40 transition-all">
                  <Copy className="size-5 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-black text-purple-600">Copy Vehicle ID</p>
                  <p className="text-xs text-purple-500">
                    VEH-{selectedVehicle.id.toString().padStart(4, "0")}
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleArchive(selectedVehicle.id)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/30 transition-all group border border-amber-200 dark:border-amber-900"
              >
                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-950/40 transition-all">
                  <Archive className="size-5 text-amber-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-black text-amber-600">Archive Vehicle</p>
                  <p className="text-xs text-amber-500">Move to archived listings</p>
                </div>
              </button>

              <button
                onClick={() => handleDelete(selectedVehicle.id)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 transition-all group border border-red-200 dark:border-red-900"
              >
                <div className="size-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-950/40 transition-all">
                  <Trash2 className="size-5 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-black text-red-600">Delete Vehicle</p>
                  <p className="text-xs text-red-500">Permanently remove listing</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVehicles;
