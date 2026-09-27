import React from "react";
import type { CulturalArticle } from "@/lib/sample-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Volume2, Bookmark } from "lucide-react";

interface ArticleCardProps {
  article: CulturalArticle;
  onSelectArticle: (article: CulturalArticle) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (articleId: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  isBookmarked = false,
  onToggleBookmark
}) => {
  return (
    <Card className="flex flex-col justify-between h-full group p-0 overflow-hidden border-amber-500/20 hover:border-amber-500/40">
      <div>
        {/* Card Image */}
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge variant={`cefr-${article.cefr.toLowerCase()}` as any}>
              {article.cefr}
            </Badge>
            <Badge variant="gold">{article.category}</Badge>
          </div>

          {/* Bookmark Trigger */}
          {onToggleBookmark && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(article.id);
              }}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                isBookmarked
                  ? "bg-amber-500 text-white"
                  : "bg-black/40 text-amber-200 hover:bg-black/60"
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          )}

          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-[11px] text-amber-300/80 font-medium">By {article.author}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2">
          <h3 className="font-serif font-bold text-base text-amber-950 dark:text-amber-200 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-amber-800/70 dark:text-amber-400/70 italic line-clamp-1">
            {article.titleVi}
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 pt-0 flex items-center justify-between text-xs text-zinc-500 border-t border-amber-500/10 mt-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {article.readTimeMinutes} min
          </span>
          {article.hasAudio && (
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
              <Volume2 className="w-3.5 h-3.5" /> Audio
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectArticle(article)}
          className="text-amber-700 dark:text-amber-400 hover:bg-amber-500/15"
        >
          Read <BookOpen className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </Card>
  );
};
