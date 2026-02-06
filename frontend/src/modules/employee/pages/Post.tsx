import { useState } from "react";
import { Send, Image as ImageIcon, MapPin, Smile, MoreHorizontal, Heart, MessageCircle, Share2, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

const Post = () => {
    const { user } = useAuthStore();
    const [postContent, setPostContent] = useState("");

    const posts = [
        {
            id: 1,
            author: "Sarah Jenkins",
            role: "Architect",
            time: "2 hours ago",
            content: "Just finished a major project design for the new downtown complex! Excited to share more details soon. #Architecture #Design",
            likes: 24,
            comments: 5,
        },
        {
            id: 2,
            author: "David Chen",
            role: "Civil Engineer",
            time: "5 hours ago",
            content: "Looking for recommendations for reliable concrete suppliers in the Metro area. Any suggestions?",
            likes: 12,
            comments: 8,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-700">
            <div className="bg-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-sm mb-6">
                <h1 className="text-2xl font-black text-slate-900">Community</h1>
                <p className="text-slate-500 font-medium mt-1">Share updates and connect with peers</p>
            </div>

            <div className="px-5 space-y-6">
                {/* Create Post Input */}
                <Card className="p-4 border-slate-200">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full bg-transparent border-none resize-none focus:ring-0 p-0 text-slate-900 placeholder:text-slate-400 font-medium text-sm min-h-[60px]"
                            />
                            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                <div className="flex gap-2 text-slate-400">
                                    <button className="hover:text-primary transition-colors p-1 hover:bg-primary/5 rounded-lg">
                                        <ImageIcon className="w-5 h-5" />
                                    </button>
                                    <button className="hover:text-primary transition-colors p-1 hover:bg-primary/5 rounded-lg">
                                        <MapPin className="w-5 h-5" />
                                    </button>
                                    <button className="hover:text-primary transition-colors p-1 hover:bg-primary/5 rounded-lg">
                                        <Smile className="w-5 h-5" />
                                    </button>
                                </div>
                                <Button
                                    size="sm"
                                    disabled={!postContent.trim()}
                                    className="bg-primary text-white rounded-lg px-4 font-bold disabled:opacity-50"
                                >
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Feed */}
                <div className="space-y-4">
                    {posts.map((post) => (
                        <Card key={post.id} className="p-5 border-slate-200">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                        <span className="font-bold text-slate-600">{post.author[0]}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{post.author}</h3>
                                        <p className="text-xs text-slate-500 font-medium">{post.role} • {post.time}</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-slate-700 text-sm leading-relaxed mb-4">
                                {post.content}
                            </p>

                            <div className="flex items-center gap-6 border-t border-slate-100 pt-4">
                                <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors group">
                                    <Heart className="w-5 h-5 group-hover:fill-current" />
                                    <span className="text-xs font-bold">{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="text-xs font-bold">{post.comments}</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-slate-500 hover:text-green-500 transition-colors ml-auto">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Post;
