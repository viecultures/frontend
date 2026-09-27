import React, { useState } from "react";
import { motion } from "motion/react";
import type { CulturalArticle } from "@/lib/sample-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";

interface CoverflowHeroProps {
  articles: CulturalArticle[];
  onSelectArticle: (article: CulturalArticle) => void;
}

export const CoverflowHero: React.FC<CoverflowHeroProps> = ({ articles, onSelectArticle }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full py-8 overflow-hidden">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-950 dark:text-amber-200 tracking-tight">
          Explore Vietnamese Heritage
        </h1>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Immerse yourself in bilingual cultural reading materials curated from A2 to C1 level.
        </p>
      </div>

      {/* 3D Coverflow Container */}
      <div className="relative h-[420px] flex items-center justify-center max-w-5xl mx-auto perspective-1000">
        {articles.map((article, idx) => {
          const offset = idx - activeIndex;
          const isCenter = offset === 0;

          // Compute 3D coverflow transforms
          const rotateY = offset * -25;
          const translateX = offset * 220;
          const scale = isCenter ? 1 : 0.82;
          const opacity = Math.abs(offset) > 2 ? 0 : isCenter ? 1 : 0.65;
          const zIndex = 30 - Math.abs(offset) * 10;

          return (
            <motion.div
              key={article.id}
              onClick={() => setActiveIndex(idx)}
              animate={{
                x: translateX,
                rotateY: rotateY,
                scale: scale,
                opacity: opacity,
                zIndex: zIndex
              }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              className={`absolute top-0 w-[300px] sm:w-[360px] h-[400px] rounded-3xl border border-amber-500/30 overflow-hidden cursor-pointer shadow-2xl glass-panel ${
                isCenter ? "ring-2 ring-amber-500/50" : ""
              }`}
            >
              {/* Cover Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
                
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant={`cefr-${article.cefr.toLowerCase()}` as any}>
                    {article.cefr}
                  </Badge>
                  <Badge variant="gold">{article.category}</Badge>
                </div>

                {article.hasAudio && (
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-1.5 rounded-full text-amber-400">
                    <Volume2 className="w-4 h-4" />
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-serif font-bold text-lg leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-amber-200 text-xs italic mt-0.5 line-clamp-1">{article.titleVi}</p>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 flex flex-col justify-between h-[160px]">
                <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-500/15">
                  <span className="text-[11px] text-zinc-500 font-medium">{article.readTimeMinutes} min read</span>
                  {isCenter && (
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectArticle(article);
                      }}
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Read Now
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="text-xs font-semibold text-zinc-500">
          {activeIndex + 1} / {articles.length}
        </span>
        <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
