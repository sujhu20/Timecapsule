"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, Filter, Heart, Share2, MessageSquare } from "lucide-react";
import { FeaturedCapsule } from "@/components/featured-capsule";

interface Capsule {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  type: string;
  privacy: string;
  likes?: number;
  author?: string;
}

// Mock featured capsules for visual impact
const featuredCapsules = [
  {
    id: "feat-1",
    title: "Letter to My Grandchildren (2100)",
    description: "Hopes and dreams for the world you will inherit. A message of love across the century.",
    author: "Elena R.",
    date: "Oct 12, 2023",
    likes: 342,
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "feat-2",
    title: "Predictions for AI in 2030",
    description: "My detailed predictions on how Artificial Intelligence will shape our daily lives in the next decade.",
    author: "TechFuturist",
    date: "Jan 15, 2024",
    likes: 128,
  }
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);

  // Categories for filtering
  const categories = [
    "All", "Wisdom", "Predictions", "Life Advice", "History", "Confessions", "Milestones"
  ];

  // Fetch public capsules
  useEffect(() => {
    async function fetchPublicCapsules() {
      setLoading(true);
      try {
        const response = await fetch('/api/capsules/public');
        if (response.ok) {
          const data = await response.json();
          setCapsules(data.capsules || []);
        }
      } catch (error) {
        console.error("Error fetching public capsules:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPublicCapsules();
  }, []);

  // Filter capsules
  const filteredCapsules = capsules.filter(capsule => {
    const matchesSearch = searchQuery === "" ||
      capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (capsule.description && capsule.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || selectedCategory === "All";

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Hero Header */}
      <div className="relative bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 opacity-50" />
        <div className="container max-w-6xl mx-auto px-4 relative z-10 text-center">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Discover the Community
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Connect with others through shared memories and time capsules.
                From personal wisdom to historical predictions, discover what people are sharing for tomorrow.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 -mt-16 relative z-20">
        {/* Featured Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {featuredCapsules.map(feature => (
            <FeaturedCapsule key={feature.id} capsule={feature} />
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Search the archives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 px-1 hide-scrollbar">
              <Filter className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${category === selectedCategory
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Capsules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            ))
          ) : filteredCapsules.length > 0 ? (
            filteredCapsules.map((capsule) => (
              <CapsuleCard key={capsule.id} capsule={capsule} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                {searchQuery ? "No capsules match your search." : "No public capsules yet. Be the first to share!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Capsule Card Component with Social Features
function CapsuleCard({ capsule }: { capsule: Capsule }) {
  const [likes, setLikes] = useState(capsule.likes || 0);
  const [liked, setLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      await fetch(`/api/capsules/${capsule.id}/like`, { method: 'POST' });
    } catch (error) {
      // Revert on error
      setLiked(!newLikedState);
      setLikes(prev => !newLikedState ? prev + 1 : prev - 1);
    }
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
    // Copy link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/capsules/${capsule.id}`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all group">
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            {capsule.author?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {capsule.author || 'Anonymous'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {new Date(capsule.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {capsule.type}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {capsule.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
          {capsule.description || "A moment preserved in time..."}
        </p>

        {/* Social Interaction Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group/like"
          >
            <Heart
              className={`w-5 h-5 transition-all ${liked
                ? 'fill-red-500 text-red-500'
                : 'text-slate-400 group-hover/like:text-red-500'
                }`}
            />
            <span className={`text-sm font-medium ${liked ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}>
              {likes}
            </span>
          </button>

          {/* Comment Button */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group/comment">
            <MessageSquare className="w-5 h-5 text-slate-400 group-hover/comment:text-blue-500 transition-colors" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {Math.floor(Math.random() * 20)}
            </span>
          </button>

          {/* Share Button */}
          <div className="relative ml-auto">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group/share"
            >
              <Share2 className="w-5 h-5 text-slate-400 group-hover/share:text-green-500 transition-colors" />
            </button>
            {showShareMenu && (
              <div className="absolute right-0 mt-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
                Link copied! ✓
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}