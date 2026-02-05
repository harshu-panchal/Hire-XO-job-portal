import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Download,
  FileText,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  Wallet,
  X,
  Send,
  Briefcase,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { resourceService } from "@/services/resourceService";
import { applicationService } from "@/services/applicationService";
import { toast } from "sonner";

const TenderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Bid Form State
  const [bidData, setBidData] = useState({
    bidAmount: "",
    coverLetter: "",
  });

  useEffect(() => {
    const fetchTenderDetails = async () => {
      if (!id) return;
      try {
        const data = await resourceService.getById("tenders", id);
        setTender(data);
      } catch (error) {
        console.error("Failed to fetch tender details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTenderDetails();
  }, [id]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!bidData.bidAmount || !bidData.coverLetter) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await applicationService.applyToResource("Tender", id, {
        bidAmount: Number(bidData.bidAmount),
        coverLetter: bidData.coverLetter,
      });
      toast.success("Bid submitted successfully!");
      setShowBidModal(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit bid");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-sm font-black uppercase tracking-widest text-slate-400">
          Loading Details...
        </div>
      </div>
    );
  }

  if (!tender) {
    return <div className="p-10 text-center font-black">Tender not found</div>;
  }

  return (
    <div className="py-6 space-y-8 select-none mb-24">
      {/* Action Bar */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 font-black text-xs uppercase tracking-widest active:scale-95 transition-transform"
        >
          <ArrowLeft className="size-4" /> Back to List
        </button>
        <div className="flex gap-2">
          <button className="size-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-600 active:scale-95 transition-transform">
            <Download className="size-5" />
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-violet-500/20">
            {tender.companyLogo ? (
              <img
                src={tender.companyLogo}
                alt={tender.company}
                className="size-full rounded-2xl object-cover"
              />
            ) : (
              <Building2 className="size-9" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-violet-600 font-black text-[10px] uppercase tracking-[0.2em]">
              {tender.company}
            </p>
            <h1 className="text-2xl font-black tracking-tight leading-tight">{tender.title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-[8px] font-black uppercase tracking-widest text-slate-500">
            REF: {tender._id?.slice(-8).toUpperCase()}
          </span>
          <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900 text-[8px] font-black uppercase tracking-widest text-violet-600">
            {tender.type || "Open Tender"}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-[8px] font-black uppercase tracking-widest text-emerald-600">
            {tender.category || "General"}
          </span>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-5 space-y-1 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Total Tender Value
          </p>
          <p className="text-2xl font-black text-emerald-600 tracking-tight">
            {tender.tenderValue || tender.compensation || "N/A"}
          </p>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic pt-1">
            Estimated Budget
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-5 space-y-1 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Duration / Urgency
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {tender.duration || "Flexible"}
          </p>
          <div className="flex items-center gap-1 pt-1">
            <Clock className="size-3 text-amber-500" />
            <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">
              {tender.urgency || "Standard"}
            </span>
          </div>
        </div>
      </div>

      {/* Content Tabs-like Sections */}
      <div className="space-y-6">
        {/* Description */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm">
          <h2 className="text-lg font-black tracking-tight mb-3 flex items-center gap-2">
            <FileText className="size-5 text-violet-600" /> Tender Description
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-bold">
            {tender.description}
          </p>
        </div>

        {/* Requirements / Eligibility */}
        {tender.requirements && tender.requirements.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm">
            <h2 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
              <ShieldCheck className="size-5 text-violet-600" /> Requirements & Eligibility
            </h2>
            <div className="space-y-3">
              {tender.requirements.map((item: string, index: number) => (
                <div key={index} className="flex gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Schedule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm">
          <h2 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
            <Calendar className="size-5 text-violet-600" /> Key Schedule
          </h2>
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-violet-500 before:via-slate-200 before:to-transparent">
            <div className="relative flex items-center gap-6 group">
              <div className="absolute left-0 size-8 rounded-full bg-white dark:bg-slate-900 border-2 border-violet-500 flex items-center justify-center shrink-0 z-10">
                <div className="size-2 rounded-full bg-violet-600" />
              </div>
              <div className="ml-10 space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Posting Date
                </p>
                <p className="text-sm font-black tracking-tight">
                  {new Date(tender.postedAt || tender.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Authority Contact */}
        <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] p-6 shadow-xl">
          <h2 className="text-lg font-black tracking-tight mb-4 uppercase tracking-widest opacity-80 font-black">
            Authority Contact
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-white/10 dark:bg-slate-950/10 flex items-center justify-center">
                <Briefcase className="size-6 opacity-60" />
              </div>
              <div>
                <p className="text-sm font-black">{tender.company}</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">
                  Tender Authority
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 rounded-2xl bg-white/5 dark:bg-slate-950/5 flex items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">
                  Contact details available upon application
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Footer */}
      {!showBidModal && (
        <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-40 pointer-events-none">
          <div className="w-full max-w-[430px] flex gap-3 pointer-events-auto">
            <button
              onClick={() => setShowBidModal(true)}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-700 text-white font-black text-sm uppercase tracking-[0.2em] py-5 rounded-[2rem] shadow-2xl shadow-violet-500/40 active:scale-95 transition-all"
            >
              Initiate Bid Now
            </button>
          </div>
        </div>
      )}

      {/* Bid Modal Overlay */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-t-[3rem] p-8 space-y-8 animate-in slide-in-from-bottom-full duration-500 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight">Post Your Bid</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Project: {tender.title}
                </p>
              </div>
              <button
                onClick={() => setShowBidModal(false)}
                className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-rose-600 transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Proposed Bid Amount (₹)
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-violet-600" />
                    <input
                      type="number"
                      value={bidData.bidAmount}
                      onChange={(e) => setBidData({ ...bidData, bidAmount: e.target.value })}
                      placeholder="e.g. 50,00,000"
                      className="w-full pl-14 pr-5 py-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border-none font-black text-xl text-slate-900 dark:text-white focus:ring-4 focus:ring-violet-500/10 transition-all"
                      required
                    />
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 ml-1 italic">
                    * Enter your final competitive offer excluding taxes
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Proposal / Cover Letter
                  </label>
                  <textarea
                    value={bidData.coverLetter}
                    onChange={(e) => setBidData({ ...bidData, coverLetter: e.target.value })}
                    placeholder="Explain why your firm is best suited for this tender..."
                    rows={6}
                    className="w-full px-6 py-5 rounded-[2.5rem] bg-slate-50 dark:bg-slate-950 border-none font-bold text-sm focus:ring-4 focus:ring-violet-500/10 transition-all resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-5 rounded-[2rem] flex gap-4">
                <AlertCircle className="size-6 text-amber-600 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest">
                    Important Disclaimer
                  </p>
                  <p className="text-[9px] font-bold text-amber-800 dark:text-amber-500 leading-relaxed opacity-80">
                    Once submitted, your bid cannot be edited. Ensure your amount and proposal are
                    final. The authority will review your profile and company documents attached to
                    your account.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-indigo-500/20"
              >
                {submitting ? (
                  <>Submitting Bid...</>
                ) : (
                  <>
                    Submit Final Bid <Send className="size-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderDetails;
