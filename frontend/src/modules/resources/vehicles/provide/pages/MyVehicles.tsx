import { useEffect, useRef, useState } from "react";
import {
  Eye,
  MessageSquare,
  MoreVertical,
  Edit3,
  Trash2,
  Car,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";

const MyVehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const load = async () => {
      try {
        const [myVehicles, myInquiries] = await Promise.all([
          resourceService.getMyListings("vehicles"),
          applicationService.getReceivedResourceApplications("vehicles"),
        ]);
        setVehicles(myVehicles || []);
        setInquiries(myInquiries || []);
      } catch (error) {
        setVehicles([]);
        setInquiries([]);
      }
    };

    load();
  }, []);

  const handleEdit = (vehicle: any) => {
    navigate("/vehicles/provide/post", { state: { vehicle } });
  };

  const handleDelete = async (vehicleId: string) => {
    try {
      await resourceService.delete("vehicles", vehicleId);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    } catch (error) {
      // keep page state unchanged
    }
  };

  const getInquiryCount = (vehicleId: string) =>
    inquiries.filter((inq: any) => (inq.resourceId?._id || inq.resourceId) === vehicleId).length;

  const handleAddNew = () => {
    navigate("/vehicles/provide/post");
  };

  return (
    <div className="py-6 space-y-8 select-none">
      {/* Header */}
      <div className="space-y-1 px-1">
        <h1 className="text-3xl font-black tracking-tighter">My Fleet</h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
          Manage your active rental vehicles
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">
            Total Vehicles
          </p>
          <p className="text-2xl font-black text-blue-600">{vehicles.length}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">
            Total Views
          </p>
          <p className="text-2xl font-black text-emerald-600">
            {vehicles.reduce((sum, v) => sum + (v.views || 0), 0)}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
          <p className="text-[9px] font-black uppercase tracking-widest text-orange-600 mb-1">
            Total Leads
          </p>
          <p className="text-2xl font-black text-orange-600">
            {inquiries.length}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                  <Car className="size-5" />
                </div>
                <div
                  className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                    (vehicle.status || "Active") === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}
                >
                  {vehicle.status || "Active"}
                </div>
              </div>
              <button className="size-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors">
                <MoreVertical className="size-5" />
              </button>
            </div>

            <h3 className="font-black text-lg tracking-tight mb-2 leading-tight">
              {vehicle.title}
            </h3>

            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6 px-1">
              <span className="text-blue-600 italic">#{vehicle.category || "Vehicles"}</span>
              <div className="size-1 rounded-full bg-slate-200" />
              <span>{vehicle.compensation || "N/A"}</span>
              <div className="size-1 rounded-full bg-slate-200" />
              <span>
                Posted {vehicle.postedAt ? new Date(vehicle.postedAt).toLocaleDateString() : "Recently"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Eye className="size-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Views
                  </p>
                  <p className="text-xs font-black italic">{vehicle.views || 0}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <MessageSquare className="size-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Leads
                  </p>
                  <p className="text-xs font-black italic">{getInquiryCount(vehicle.id)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => navigate("/vehicles/provide/inquiries")}
                className="h-12 rounded-2xl bg-blue-500/10 text-blue-600 border border-blue-500/10 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500/20 active:scale-95 transition-all"
              >
                <Eye className="size-3.5" />
                View
              </button>
              <button
                onClick={() => handleEdit(vehicle)}
                className="h-12 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
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
        {vehicles.length === 0 && (
          <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
              No vehicles listed yet
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleAddNew}
        className="w-full h-16 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all active:scale-[0.98]"
      >
        <Plus className="size-4" />
        List New Vehicle
      </button>
    </div>
  );
};

export default MyVehicles;
