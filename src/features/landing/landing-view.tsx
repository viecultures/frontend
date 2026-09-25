import React from "react";
import type { CulturalArticle } from "@/lib/sample-data";
import { CoverflowHero } from "./coverflow-hero";
import { CategoryGrid } from "./category-grid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Headphones, Layers, Sparkles, Award } from "lucide-react";

interface LandingViewProps {
  articles: CulturalArticle[];
  onSelectArticle: (article: CulturalArticle) => void;
  onNavigateTab: (tab: any) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  articles,
  onSelectArticle,
  onNavigateTab
}) => {
  return (
    <div className="space-y-12">
      {/* Hero Coverflow */}
      <CoverflowHero articles={articles} onSelectArticle={onSelectArticle} />

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        <Card className="flex flex-col items-start p-6 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-800 dark:text-amber-300 mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-amber-950 dark:text-amber-200">
            Smart Dual Reader
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
            Switch effortlessly between Dual Floating Paper & Stacked Parallel views with instant sentence-level translation and vocabulary tooltips.
          </p>
        </Card>

        <Card className="flex flex-col items-start p-6 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-800 dark:text-rose-300 mb-4">
            <Headphones className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-amber-950 dark:text-amber-200">
            Audio Shadowing Engine
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
            Train your English pronunciation and listening with native narrator recordings, pitch adjustments, and single-sentence loop controls.
          </p>
        </Card>

        <Card className="flex flex-col items-start p-6 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-amber-950 dark:text-amber-200">
            SRS Spaced Repetition
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
            One-click save vocabulary from articles directly into your personal spaced repetition deck with 3D flip card self-assessment.
          </p>
        </Card>
      </div>

      {/* Categories */}
      <CategoryGrid onSelectCategory={() => onNavigateTab("discovery")} />

      {/* Call to Action Banner */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-700 via-amber-800 to-rose-900 p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" /> Cultural Ambassador Program
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Share Your Reflection & Earn Badges
          </h2>
          <p className="text-amber-100/80 text-xs sm:text-sm max-w-xl">
            Join thousands of learners publishing bilingual cultural essays, exchanging audio notes, and competing in monthly contests.
          </p>
        </div>
        <Button
          variant="gold"
          size="lg"
          onClick={() => onNavigateTab("community")}
          className="whitespace-nowrap shadow-lg"
        >
          <Sparkles className="w-4 h-4" /> Join Community Hub
        </Button>
      </div>
    </div>
  );
};
