import React, { useState } from "react";
import type { CommunityEssay } from "@/lib/sample-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, Volume2, Award, PlusCircle, MessageSquare } from "lucide-react";

interface CommunityViewProps {
  posts: CommunityEssay[];
  onAddPost: (post: CommunityEssay) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ posts, onAddPost }) => {
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(() =>
    posts.reduce((acc, p) => ({ ...acc, [p.id]: p.likes }), {})
  );
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const isLiked = prev[id];
      setLikeCounts((c) => ({ ...c, [id]: c[id] + (isLiked ? -1 : 1) }));
      return { ...prev, [id]: !isLiked };
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-950 dark:text-amber-200 flex items-center gap-2">
            <Users className="w-7 h-7 text-amber-600" /> Cultural Ambassadors Community
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Read learner reflections, listen to audio notes, and exchange cultural insights globally.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => {
            onAddPost({
              id: `post-${Date.now()}`,
              authorName: "You (Cultural Learner)",
              avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
              title: "My Reflection on Vietnamese Tea Ceremony & Quiet Moments",
              excerpt: "Sipping Lotus-infused green tea in Tay Ho while reading traditional poetry gave me a deep appreciation for Vietnamese mindfulness...",
              category: "Learner Reflection",
              likes: 1,
              badge: "A2 Explorer",
              date: "Just now"
            });
          }}
          className="self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Share Cultural Essay
        </Button>
      </div>

      {/* Monthly Contest Banner */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-600 via-rose-700 to-amber-900 p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" /> Monthly Cultural Contest
          </div>
          <h2 className="font-serif text-xl font-bold">
            September Theme: "Traditional Dishes That Remind You of Home"
          </h2>
          <p className="text-amber-100/80 text-xs">
            Submit a 300-word bilingual essay or a 2-minute audio recording to earn the "Master Ambassador 2026" badge.
          </p>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{post.authorName}</h3>
                    <Badge variant="gold">{post.badge}</Badge>
                  </div>
                  <span className="text-[11px] text-zinc-400">{post.date} • {post.category}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif font-bold text-lg text-amber-950 dark:text-amber-200">
                {post.title}
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mt-1">
                {post.excerpt}
              </p>
            </div>

            {post.audioNoteDuration && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-900 dark:text-amber-300">
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>Audio Note Attached ({post.audioNoteDuration})</span>
                <button
                  onClick={() => alert(`Playing audio note from ${post.authorName}`)}
                  className="ml-auto font-bold text-amber-700 dark:text-amber-400 hover:underline"
                >
                  Listen Now
                </button>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-amber-500/10 pt-3 text-xs text-zinc-500">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                  likedPosts[post.id]
                    ? "bg-rose-500/20 text-rose-600 font-bold"
                    : "hover:bg-amber-500/10 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <Heart className={`w-4 h-4 ${likedPosts[post.id] ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{likeCounts[post.id] || 0} Likes</span>
              </button>

              <button className="flex items-center gap-1.5 text-zinc-500 hover:text-amber-800">
                <MessageSquare className="w-4 h-4" /> Reply Reflection
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
