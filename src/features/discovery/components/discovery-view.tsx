import React, { useState, useMemo } from "react";
import type { CulturalArticle } from "@/lib/sample-data";
import { DiscoveryFilters } from "./discovery-filters";
import { ArticleCard } from "./article-card";
import { Compass, BookOpen } from "lucide-react";

interface DiscoveryViewProps {
  articles: CulturalArticle[];
  onSelectArticle: (article: CulturalArticle) => void;
  bookmarks: string[];
  onToggleBookmark: (articleId: string) => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  articles,
  onSelectArticle,
  bookmarks,
  onToggleBookmark
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCefr, setSelectedCefr] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [audioOnly, setAudioOnly] = useState(false);

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.titleVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCefr = selectedCefr === "All" || art.cefr === selectedCefr;
      const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;
      const matchesAudio = !audioOnly || art.hasAudio;

      return matchesSearch && matchesCefr && matchesCategory && matchesAudio;
    });
  }, [articles, searchQuery, selectedCefr, selectedCategory, audioOnly]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-950 dark:text-amber-200 flex items-center gap-2">
            <Compass className="w-7 h-7 text-amber-600" /> Cultural Materials Catalog
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Browse 500+ authentic Vietnamese bilingual texts organized by CEFR proficiency.
          </p>
        </div>

        <div className="text-xs font-semibold text-amber-900 dark:text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 self-start sm:self-auto">
          Showing {filteredArticles.length} of {articles.length} materials
        </div>
      </div>

      {/* Filters Component */}
      <DiscoveryFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCefr={selectedCefr}
        onSelectCefr={setSelectedCefr}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        audioOnly={audioOnly}
        onToggleAudioOnly={() => setAudioOnly(!audioOnly)}
      />

      {/* Grid of Article Cards */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onSelectArticle={onSelectArticle}
              isBookmarked={bookmarks.includes(article.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-dashed border-amber-500/30 glass-panel">
          <BookOpen className="w-12 h-12 text-amber-600/40 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-amber-950 dark:text-amber-300">
            No cultural materials found
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, CEFR level tabs, or category filters.
          </p>
        </div>
      )}
    </div>
  );
};
