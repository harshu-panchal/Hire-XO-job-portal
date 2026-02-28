import { useState, useEffect, useRef } from "react";
import {
    Send,
    MoreHorizontal,
    Plus,
    Trash2,
    Mail,
    Phone,
    FileText,
    Eye,
    EyeOff,
    Lock,
    Upload,
    X,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { postService, type Post as IPost } from "@/services/postService";
import { formatDistanceToNow } from "date-fns";

const Post = () => {
    const { user } = useAuthStore();
    const [postContent, setPostContent] = useState("");
    const [posts, setPosts] = useState<IPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Contact detail fields (employee only)
    const [showContactFields, setShowContactFields] = useState(false);
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeUrl, setResumeUrl] = useState<string>("");
    const [isUploadingResume, setIsUploadingResume] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Expanded contact detail in feed
    const [expandedContacts, setExpandedContacts] = useState<Set<string>>(new Set());

    const isEmployee = user?.role === "employee" || user?.role === "job-seeker";
    const isEmployer = ["employer", "recruiter"].includes(user?.role ?? "");

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const { data: postsData } = await postService.getAllPosts(1, 1000);
            setPosts(postsData.filter((post: any) => post.userId));
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleResumeUpload = async (file: File) => {
        try {
            setIsUploadingResume(true);
            const result = await postService.uploadMedia(file);
            const url = result?.data?.url || result?.url || "";
            setResumeUrl(url);
            setResumeFile(file);
            toast.success("Resume uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload resume");
            console.error("Resume upload error:", error);
        } finally {
            setIsUploadingResume(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only PDF, DOC, DOCX files are allowed for resume.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Resume file must be under 5MB.");
            return;
        }
        handleResumeUpload(file);
    };

    const handleCreatePost = async () => {
        if (!postContent.trim() || isPosting) return;

        try {
            setIsPosting(true);

            await postService.createPost(
                postContent,
                undefined, // contactDetail (legacy field)
                undefined, // images
                contactEmail.trim() || undefined,
                contactPhone.trim() || undefined,
                resumeUrl || undefined
            );

            setPostContent("");
            setContactEmail("");
            setContactPhone("");
            setResumeFile(null);
            setResumeUrl("");
            setShowContactFields(false);
            toast.success("Post created successfully!");
            fetchPosts();
        } catch (error) {
            console.error("Failed to create post:", error);
            toast.error(error instanceof Error ? error.message : "Failed to create post");
        } finally {
            setIsPosting(false);
        }
    };

    const handleDeletePost = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            await postService.deletePost(id);
            toast.success("Post deleted successfully");
            fetchPosts();
        } catch (error) {
            toast.error("Failed to delete post");
            console.error("Delete error:", error);
        } finally {
            setActiveMenu(null);
        }
    };

    const toggleContactExpanded = (postId: string) => {
        setExpandedContacts((prev) => {
            const next = new Set(prev);
            if (next.has(postId)) next.delete(postId);
            else next.add(postId);
            return next;
        });
    };

    // Helper: Is this post's contact info visible to the current user?
    const isContactVisible = (post: IPost) => {
        // The post author always sees their own details
        if (user?.id === post.userId._id) return true;
        // If the backend already hid the contact (isContactHidden flag), not visible
        if (post.userId.isContactHidden) return false;
        // Other employees cannot see contact details
        if (isEmployee && user?.id !== post.userId._id) return false;
        return true;
    };

    const hasContactDetails = (post: IPost) => {
        return !!(post.email || post.phoneNumber || post.resume);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-700">
            <div className="bg-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-sm mb-6">
                <h1 className="text-2xl font-black text-slate-900">Community</h1>
                <p className="text-slate-500 font-medium mt-1">Share updates and connect with peers</p>
            </div>

            <div className="px-5 space-y-6 max-w-2xl mx-auto">
                {/* Create Post Section — Employee only */}
                {user && isEmployee && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Plus className="w-5 h-5 text-primary" />
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Create New Update</h2>
                        </div>

                        <Card className="border-slate-200 shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                            <div className="p-8 flex flex-col gap-5">
                                {/* Header */}
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                        <Send className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Write Update</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Share with community</p>
                                    </div>
                                </div>

                                {/* Post text */}
                                <textarea
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder="Broadcast your update here..."
                                    className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[130px] resize-none"
                                />

                                {/* Toggle: Add contact details */}
                                <button
                                    type="button"
                                    onClick={() => setShowContactFields((v) => !v)}
                                    className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors self-start"
                                >
                                    {showContactFields ? (
                                        <>
                                            <ChevronUp className="w-4 h-4" />
                                            Hide Contact Details
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-4 h-4" />
                                            + Add Contact Details (Email, Phone, Resume)
                                        </>
                                    )}
                                </button>

                                {/* Contact fields */}
                                {showContactFields && (
                                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {/* Privacy note */}
                                        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 font-semibold">
                                            <EyeOff className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <span>
                                                These details are <strong>hidden from other employees</strong>. Only employers with an active subscription can view your contact information.
                                            </span>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 px-4 py-3 shadow-sm">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <input
                                                type="email"
                                                value={contactEmail}
                                                onChange={(e) => setContactEmail(e.target.value)}
                                                placeholder="Your contact email (optional)"
                                                className="flex-1 bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 px-4 py-3 shadow-sm">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <input
                                                type="tel"
                                                value={contactPhone}
                                                onChange={(e) => setContactPhone(e.target.value)}
                                                placeholder="Your phone number (optional)"
                                                className="flex-1 bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none"
                                            />
                                        </div>

                                        {/* Resume upload */}
                                        <div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            {resumeFile ? (
                                                <div className="flex items-center gap-3 bg-white rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
                                                    <FileText className="w-4 h-4 text-emerald-500" />
                                                    <span className="flex-1 text-sm font-semibold text-emerald-700 truncate">{resumeFile.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setResumeFile(null); setResumeUrl(""); }}
                                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={isUploadingResume}
                                                    className="w-full flex items-center justify-center gap-2 bg-white rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:border-primary hover:text-primary transition-all disabled:opacity-50"
                                                >
                                                    {isUploadingResume ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-4 h-4" />
                                                            Upload Resume (PDF / DOC, max 5MB)
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Post button */}
                                <div className="flex items-center justify-center">
                                    <Button
                                        onClick={handleCreatePost}
                                        disabled={!postContent.trim() || isPosting}
                                        className="h-12 px-8 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/25 disabled:opacity-50 active:scale-95 transition-all"
                                    >
                                        {isPosting ? "Publishing..." : "Post Now"}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Feed */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                            <p className="text-slate-400 font-bold">Loading feed...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => {
                            const contactVisible = isContactVisible(post);
                            const hasContact = hasContactDetails(post);
                            const isExpanded = expandedContacts.has(post._id);
                            const isOwnPost = user?.id === post.userId._id;

                            return (
                                <Card key={post._id} className="p-5 border-slate-200 hover:shadow-md transition-shadow">
                                    {/* Post header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                                                {post.userId.profilePhoto ? (
                                                    <img src={post.userId.profilePhoto} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-bold text-slate-600">{post.userId.name?.[0] || "?"}</span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-2">
                                                    {post.userId.name || "Unknown User"}
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full uppercase tracking-wider font-black">
                                                        {post.userId.role || "Member"}
                                                    </span>
                                                </h3>
                                                <p className="text-xs text-slate-500 font-medium">
                                                    {formatDistanceToNow(new Date(post.createdAt))} ago
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions menu */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setActiveMenu(activeMenu === post._id ? null : post._id)}
                                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>

                                            {activeMenu === post._id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-10 animate-in fade-in zoom-in duration-200">
                                                    {isOwnPost || user?.role === "admin" ? (
                                                        <button
                                                            onClick={() => handleDeletePost(post._id)}
                                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete Post
                                                        </button>
                                                    ) : (
                                                        <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                            No Actions Available
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Post content */}
                                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap mb-3">
                                        {post.content}
                                    </p>

                                    {/* Contact details section */}
                                    {hasContact && (
                                        <div className="mt-3">
                                            {/* Show contact details button — visible to post owner & subscribed employers */}
                                            {contactVisible ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleContactExpanded(post._id)}
                                                        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors mb-2"
                                                    >
                                                        {isExpanded ? (
                                                            <><EyeOff className="w-3.5 h-3.5" />Hide Contact Info</>
                                                        ) : (
                                                            <><Eye className="w-3.5 h-3.5" />View Contact Info</>
                                                        )}
                                                    </button>

                                                    {isExpanded && (
                                                        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                                            {isOwnPost && (
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                                                    Your contact details (hidden from employees)
                                                                </p>
                                                            )}
                                                            {post.email && (
                                                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                                                    <Mail className="w-4 h-4 text-primary/70 flex-shrink-0" />
                                                                    <a href={`mailto:${post.email}`} className="font-semibold hover:underline">{post.email}</a>
                                                                </div>
                                                            )}
                                                            {post.phoneNumber && (
                                                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                                                    <Phone className="w-4 h-4 text-primary/70 flex-shrink-0" />
                                                                    <a href={`tel:${post.phoneNumber}`} className="font-semibold hover:underline">{post.phoneNumber}</a>
                                                                </div>
                                                            )}
                                                            {post.resume && (
                                                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                                                    <FileText className="w-4 h-4 text-primary/70 flex-shrink-0" />
                                                                    <a
                                                                        href={post.resume}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="font-semibold text-primary hover:underline"
                                                                    >
                                                                        View Resume / CV
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                /* Locked: shown to employees viewing other employees' posts,
                                                   or unsubscribed employers */
                                                <div className="flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-500">
                                                    <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                                                    {isEmployer ? (
                                                        <span>Contact details require an active employer subscription.</span>
                                                    ) : (
                                                        <span>Contact details are visible only to verified employers.</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <Send className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900">No posts yet</h3>
                            <p className="text-slate-500">Be the first to share something with the community!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Post;
