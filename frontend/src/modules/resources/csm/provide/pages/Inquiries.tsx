import { Search, Phone, Mail, ArrowLeft } from "lucide-react";
import { useCSMStore } from "@/store/useCSMStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Inquiries = () => {
  const { myInquiries } = useCSMStore();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredInquiries = myInquiries.filter(
    (inq) =>
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6 space-y-6 select-none">
      {/* Header */}
      <div className="space-y-4 px-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-95 transition-all"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-3xl font-black tracking-tighter italic">Inquiries</h1>
        </div>

        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
            <Search className="size-5" />
          </div>
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[2rem] py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-rose-600 transition-all font-sans"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredInquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="bg-white rounded-[2.5rem] p-5 border border-slate-200 group active:scale-[0.98] transition-all"
          >
            <div className="flex items-start gap-4">
              <div
                className={`size-14 rounded-2xl bg-gradient-to-br ${inquiry.color} flex items-center justify-center text-white text-xl font-black shadow-lg`}
              >
                {inquiry.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-black text-base tracking-tight">{inquiry.name}</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">
                      {inquiry.role}
                    </p>
                  </div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    {inquiry.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 font-medium leading-relaxed">
                  "{inquiry.message}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <a
                      href={`tel:+910000000000`}
                      className="size-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:text-rose-600 transition-colors border border-slate-100"
                    >
                      <Phone className="size-4" />
                    </a>
                    <a
                      href={`mailto:contact@example.com`}
                      className="size-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:text-rose-600 transition-colors border border-slate-100"
                    >
                      <Mail className="size-4" />
                    </a>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      inquiry.status === "New"
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {inquiry.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredInquiries.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="size-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="size-6 text-slate-300" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              No inquiries found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inquiries;
