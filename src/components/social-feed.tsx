"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Sparkles, UserPlus, Send, X } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";

interface FeedItemProps {
    item: any;
    onLike: (id: string, liked: boolean) => void;
}

function FeedItem({ item, onLike }: FeedItemProps) {
    const { data: session } = useSession();
    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [likesCount, setLikesCount] = useState(item.likes);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentCount, setCommentCount] = useState(item.comments);

    const handleLikeClick = async () => {
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikesCount((prev: number) => newLikedState ? prev + 1 : prev - 1);

        // Notify parent if needed, or just handle API here
        // Verify API call
        try {
            const res = await fetch(`/api/capsules/${item.id}/like`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to like');
        } catch (error) {
            // Revert
            setIsLiked(!newLikedState);
            setLikesCount((prev: number) => !newLikedState ? prev + 1 : prev - 1);
        }
    };

    const toggleComments = async () => {
        if (!showComments && comments.length === 0) {
            setCommentsLoading(true);
            try {
                const res = await fetch(`/api/capsules/${item.id}/comments`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data.comments || []);
                }
            } catch (error) {
                console.error("Failed to load comments", error);
            } finally {
                setCommentsLoading(false);
            }
        }
        setShowComments(!showComments);
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const tempComment = {
            id: `temp-${Date.now()}`,
            content: newComment,
            createdAt: new Date().toISOString(),
            user: {
                name: session?.user?.name || "You",
                image: session?.user?.image,
            }
        };

        setComments([...comments, tempComment]);
        setNewComment("");
        setCommentCount((prev: number) => prev + 1);

        try {
            const res = await fetch(`/api/capsules/${item.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: tempComment.content })
            });

            if (res.ok) {
                const data = await res.json();
                // Replace temp comment with real one
                setComments(prev => prev.map(c => c.id === tempComment.id ? data.comment : c));
            } else {
                throw new Error('Failed to post');
            }
        } catch (error) {
            console.error("Failed to post comment", error);
            // Remove temp comment
            setComments(prev => prev.filter(c => c.id !== tempComment.id));
            setCommentCount((prev: number) => prev - 1);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Author Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                    <Link href={`/profile/${item.author.id}`} className="block">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden hover:opacity-90 transition-opacity">
                            {item.author.image ? (
                                <img
                                    src={item.author.image}
                                    alt={item.author.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerText = item.author.name.charAt(0);
                                    }}
                                />
                            ) : (
                                item.author.name ? item.author.name.charAt(0) : '?'
                            )}
                        </div>
                    </Link>
                    <div>
                        <Link href={`/profile/${item.author.id}`} className="hover:underline">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                                {item.author.name}
                            </h3>
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            @{item.author.username || 'user'} • {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                {/* Follow badge if not following */}
                {!item.isFollowing && (
                    <Link href={`/profile/${item.author.id}`} className="text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded-full transition-colors">
                        <UserPlus className="w-3 h-3" />
                        Follow
                    </Link>
                )}
                {item.isFollowing && (
                    <span className="text-green-600 dark:text-green-400 text-xs font-medium px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                        Following
                    </span>
                )}
            </div>

            {/* Content Preview */}
            <div className="p-5">
                <Link href={`/capsules/${item.id}`} className="group">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {item.description}
                    </p>
                </Link>
            </div>

            {/* Interaction Bar */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleLikeClick}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isLiked
                            ? 'text-pink-600 dark:text-pink-400'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                    >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        {likesCount}
                    </button>
                    <button
                        onClick={toggleComments}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${showComments
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                    >
                        <MessageCircle className="w-4 h-4" />
                        {commentCount}
                    </button>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <Share2 className="w-4 h-4" />
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 p-4">
                    {commentsLoading ? (
                        <div className="flex justify-center py-4">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="space-y-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                            {comment.user.image ? (
                                                <img src={comment.user.image} alt={comment.user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-bold">
                                                    {comment.user.name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 bg-white dark:bg-slate-900 p-3 rounded-lg rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-slate-900 dark:text-white">{comment.user.name}</span>
                                                <span className="text-[10px] text-slate-400">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-slate-400 text-sm">No comments yet. Be the first!</div>
                            )}
                        </div>
                    )}

                    {/* Comment Input */}
                    <form onSubmit={handlePostComment} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export function SocialFeed() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'following' | 'featured'>('featured');

    useEffect(() => {
        fetchFeed();
    }, [activeTab]);

    const fetchFeed = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'following' ? '/api/feed?type=following' : '/api/feed';
            const res = await fetch(endpoint);
            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
            }
        } catch (error) {
            console.error('Failed to fetch feed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (items.length === 0 && activeTab === 'featured') {
        return (
            <div className="max-w-2xl mx-auto py-8 px-4 text-center">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your Feed is Empty</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Explore public capsules or be the first to post!
                    </p>
                    <Link
                        href="/explore"
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Explore Community
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            {/* Feed Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
                <button
                    onClick={() => setActiveTab('featured')}
                    className={`pb-4 px-6 text-sm font-medium transition-colors relative ${activeTab === 'featured'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Global Feed
                    </div>
                    {activeTab === 'featured' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('following')}
                    className={`pb-4 px-6 text-sm font-medium transition-colors relative ${activeTab === 'following'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                >
                    Following
                    {activeTab === 'following' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Feed Items */}
            <div className="space-y-6">
                {items.map((item) => (
                    <FeedItem
                        key={item.id}
                        item={item}
                        onLike={() => { }}
                    />
                ))}

                {items.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 border border-slate-200 dark:border-slate-700 shadow-sm max-w-md mx-auto">
                            {/* Icon */}
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-8 h-8" />
                            </div>

                            {/* Heading */}
                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">
                                {activeTab === 'following' ? 'Your Feed is Empty' : 'No Capsules Yet'}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                {activeTab === 'following'
                                    ? "You aren't following anyone yet, or they haven't posted anything."
                                    : "Explore public capsules or be the first to post!"}
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col gap-3">
                                {activeTab === 'following' ? (
                                    <>
                                        <Link
                                            href="/explore"
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Discover People to Follow
                                        </Link>
                                        <Link
                                            href="/capsules/create"
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
                                        >
                                            Create Your First Capsule
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/explore"
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Explore Community
                                        </Link>
                                        <Link
                                            href="/capsules/create"
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
                                        >
                                            Create a Capsule
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* End of Feed Message */}
                {items.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            You're all caught up! ✨
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
