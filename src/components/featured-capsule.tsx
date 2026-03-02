'use client';

import { Heart, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface FeaturedCapsuleProps {
    capsule: {
        id: string;
        title: string;
        description?: string;
        author: string;
        date: string;
        likes: number;
        image?: string;
    };
}

export function FeaturedCapsule({ capsule }: FeaturedCapsuleProps) {
    const [likes, setLikes] = useState(capsule.likes);
    const [liked, setLiked] = useState(false);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        if (liked) {
            setLikes(prev => prev - 1);
            setLiked(false);
        } else {
            setLikes(prev => prev + 1);
            setLiked(true);
        }
    };

    return (
        <div className="relative group overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

            {capsule.image ? (
                <img
                    src={capsule.image}
                    alt={capsule.title}
                    className="w-full h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
            ) : (
                <div className="w-full h-96 bg-gradient-to-br from-blue-600 to-purple-700 p-8 flex items-center justify-center">
                    <MessageSquare className="w-24 h-24 text-white/20" />
                </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <div className="mb-2 inline-flex px-2 py-1 rounded bg-white/20 backdrop-blur-sm text-xs font-medium">
                    Featured
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">{capsule.title}</h3>
                <p className="text-white/80 line-clamp-2 mb-4 text-sm">
                    {capsule.description || "A moment frozen in time."}
                </p>

                <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">
                        By {capsule.author} • {capsule.date}
                    </div>

                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                    >
                        <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                        <span className="text-sm font-medium">{likes}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
