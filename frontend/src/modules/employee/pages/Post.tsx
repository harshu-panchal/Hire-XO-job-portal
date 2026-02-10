import { useState, useEffect } from "react";
import { Send, Image as ImageIcon, MapPin, Smile, MoreHorizontal, Heart, MessageCircle, Share2, User, Phone, Mail, Lock, ShieldCheck, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { postService, type Post as IPost } from "@/services/postService";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const Post = () => {
    const { user } = useAuthStore();
    const [postContent, setPostContent] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [resume, setResume] = useState<File | null>(null);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const { data: postsData } = await postService.getAllPosts();
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

    const handleCreatePost = async () => {
        if (!postContent.trim() || isPosting) return;

        try {
            setIsPosting(true);

            let resumeUrl: string | undefined = undefined;

            // Upload resume if selected
            if (resume) {
                try {
                    const uploadResult = await postService.uploadMedia(resume);
                    resumeUrl = uploadResult.url;
                } catch (uploadError) {
                    console.error("Failed to upload resume:", uploadError);
                    toast.error("Failed to upload file. Please try again.");
                    setIsPosting(false);
                    return;
                }
            }

            await postService.createPost(
                postContent,
                undefined, // contactDetail
                undefined, // images
                contactEmail || undefined,
                contactPhone || undefined,
                resumeUrl
            );

            setPostContent("");
            setContactEmail("");
            setContactPhone("");
            setResume(null);
            toast.success("Post created successfully!");
            // Refresh feed
            fetchPosts();
        } catch (error) {
            console.error("Failed to create post:", error);
            toast.error(error instanceof Error ? error.message : "Failed to create post");
        } finally {
            setIsPosting(false);
        }
    };

    const handleLike = async (postId: string) => {
        // Optimistic update
        setPosts((prev: IPost[]) => prev.map((p: IPost) => {
            if (p._id === postId) {
                const userId = user?._id || user?.id || '';
                const isLiked = p.likes.includes(userId);
                return {
                    ...p,
                    likes: isLiked ? p.likes.filter((id: string) => id !== userId) : [...p.likes, userId]
                };
            }
            return p;
        }));

        try {
            await postService.likePost(postId);
        } catch (err) {
            // Revert on error
            fetchPosts();
            toast.error("Failed to like post");
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

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-700">
            <div className="bg-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-sm mb-6">
                <h1 className="text-2xl font-black text-slate-900">Community</h1>
                <p className="text-slate-500 font-medium mt-1">Share updates and connect with peers</p>
            </div>

            <div className="px-5 space-y-6 max-w-2xl mx-auto">
                {/* Create Post Section */}
                {user && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Plus className="w-5 h-5 text-primary" />
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Create New Update</h2>
                        </div>

                        <Card className="border-slate-200 shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                            <div className="grid md:grid-cols-2">
                                {/* Section 1: Contact Info */}
                                <div className="p-8 bg-primary/5 border-r border-slate-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Contact Info</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Protected details</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                                                <input
                                                    type="email"
                                                    value={contactEmail}
                                                    onChange={(e) => setContactEmail(e.target.value)}
                                                    placeholder="your@email.com"
                                                    className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                                                <input
                                                    type="tel"
                                                    value={contactPhone}
                                                    onChange={(e) => setContactPhone(e.target.value)}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 pt-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Upload Resume</label>
                                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl bg-white hover:bg-slate-50 transition-colors cursor-pointer group">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Plus className="size-5 text-slate-300 group-hover:text-primary transition-colors mb-1" />
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest group-hover:text-primary transition-colors">
                                                        {resume ? resume.name : "Select PDF/Doc"}
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Post Content */}
                                <div className="p-8 flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="size-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                            <Send className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Write Update</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Share with community</p>
                                        </div>
                                    </div>

                                    <textarea
                                        value={postContent}
                                        onChange={(e) => setPostContent(e.target.value)}
                                        placeholder="Broadcast your update here..."
                                        className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[150px] resize-none"
                                    />

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <button className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                                                <ImageIcon className="w-5 h-5" />
                                            </button>
                                            <button className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                                                <Smile className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <Button
                                            onClick={handleCreatePost}
                                            disabled={!postContent.trim() || isPosting}
                                            className="h-12 px-8 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/25 disabled:opacity-50 active:scale-95 transition-all"
                                        >
                                            {isPosting ? "Publishing..." : "Post Now"}
                                        </Button>
                                    </div>
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
                        posts.map((post) => (
                            <Card key={post._id} className="p-5 border-slate-200 hover:shadow-md transition-shadow">
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
                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveMenu(activeMenu === post._id ? null : post._id)}
                                            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>

                                        {activeMenu === post._id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-10 animate-in fade-in zoom-in duration-200">
                                                {user?.id === post.userId._id || user?.role === 'admin' ? (
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

                                <p className="text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                                    {post.content}
                                </p>

                                {/* Custom Contact Detail Block */}
                                {post.contactDetail && (
                                    <div className="mb-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 border-l-4 border-l-primary relative overflow-hidden group">
                                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-2">
                                            <ShieldCheck className={`w-4 h-4 ${post.userId.isContactHidden ? 'animate-pulse' : ''}`} />
                                            Direct Contact Detail
                                        </div>
                                        <p className={`text-sm font-bold transition-all duration-500 ${post.userId.isContactHidden ? 'blur-sm select-none text-slate-400' : 'text-slate-800'}`}>
                                            {post.contactDetail}
                                        </p>

                                        {post.userId.isContactHidden && (
                                            <div className="mt-3 flex items-center gap-3">
                                                <Link
                                                    to={user?.role === 'employee' ? '/payments' : '/employer/subscription'}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-[10px] font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                                >
                                                    <Lock className="w-3 h-3" />
                                                    SUBSCRIBE TO REVEAL
                                                </Link>
                                                <p className="text-[9px] text-slate-400 font-bold italic">
                                                    Protection active for this worker
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Redesigned Contact Plate for Feed */}
                                {(post.email || post.phoneNumber || post.resume || post.contactDetail) && (
                                    <div className="mb-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-wrap gap-4">
                                        {post.email && (
                                            <div className="flex items-center gap-2">
                                                <div className="size-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                </div>
                                                <span className={`text-[10px] uppercase tracking-widest font-black ${post.userId.isContactHidden ? "text-slate-300 italic" : "text-slate-600"}`}>
                                                    {post.email}
                                                </span>
                                            </div>
                                        )}
                                        {post.phoneNumber && (
                                            <div className="flex items-center gap-2">
                                                <div className="size-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                </div>
                                                <span className={`text-[10px] uppercase tracking-widest font-black ${post.userId.isContactHidden ? "text-slate-300 italic" : "text-slate-600"}`}>
                                                    {post.phoneNumber}
                                                </span>
                                            </div>
                                        )}
                                        {post.resume && (
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="size-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                                    </div>
                                                    {post.resume && post.resume.startsWith('http') ? (
                                                        <a
                                                            href={post.resume}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`text-[10px] uppercase tracking-widest font-black hover:underline ${post.userId.isContactHidden ? "text-slate-300 italic pointer-events-none" : "text-emerald-700"}`}
                                                        >
                                                            View Resume
                                                        </a>
                                                    ) : (
                                                        <span className={`text-[10px] uppercase tracking-widest font-black ${post.userId.isContactHidden ? "text-slate-300 italic" : "text-emerald-700"}`}>
                                                            Resume Available
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {post.userId.isContactHidden && (
                                            <div className="w-full pt-2 mt-2 border-t border-slate-200/50">
                                                <Link
                                                    to={user?.role === 'employee' ? '/payments' : '/employer/subscription'}
                                                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    <Lock className="w-3 h-3" />
                                                    Unlock Full Contact Info
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        className={`flex items-center gap-2 transition-colors group ${post.likes.includes(user?._id || user?.id || '') ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'}`}
                                        disabled={isLoading}
                                    >
                                        <Heart className={`w-5 h-5 group-hover:scale-110 transition-transform ${post.likes.includes(user?._id || user?.id || '') ? 'fill-current' : ''}`} />
                                        <span className="text-xs font-bold">{post.likes.length} Likes</span>
                                    </button>

                                    <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors ml-auto">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <Send className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900">No posts yet</h3>
                            <p className="text-slate-500">Be the first to share something with the community!</p>
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
};

export default Post;
