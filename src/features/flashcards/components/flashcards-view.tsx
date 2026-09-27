import React, { useState } from "react";
import type { Flashcard } from "@/lib/sample-data";
import { SRSCard } from "./srs-card";
import { Layers, Sparkles, CheckCircle2, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlashcardsViewProps {
  cards: Flashcard[];
  onUpdateCardRating: (cardId: string, rating: string) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ cards, onUpdateCardRating }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCard = cards[currentIndex];
  const isCompleted = currentIndex >= cards.length;

  const handleRating = (cardId: string, rating: string) => {
    onUpdateCardRating(cardId, rating);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-950 dark:text-amber-200 flex items-center gap-2">
            <Layers className="w-7 h-7 text-amber-600" /> Spaced Repetition Flashcards (SRS)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Review vocabulary saved from reading materials with 3D flip card self-assessments.
          </p>
        </div>

        {!isCompleted && cards.length > 0 && (
          <div className="text-xs font-semibold text-amber-900 dark:text-amber-300 bg-amber-500/15 px-3.5 py-1.5 rounded-full border border-amber-500/30">
            Card {currentIndex + 1} of {cards.length}
          </div>
        )}
      </div>

      {/* Main Flashcard Practice Area */}
      {!isCompleted && currentCard ? (
        <div className="space-y-6">
          <SRSCard card={currentCard} onRating={handleRating} />
          
          <div className="flex justify-end max-w-xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="text-zinc-500 hover:text-amber-800"
            >
              Skip Card <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 rounded-3xl border border-amber-500/30 glass-panel space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-amber-950 dark:text-amber-200">
            {cards.length === 0 ? "No Flashcards Saved Yet" : "Today's Review Complete!"}
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            {cards.length === 0
              ? "Read cultural materials in Dual Reader and click vocabulary tooltips or '+' buttons to save words to your deck."
              : "Great job maintaining your streak! All due cultural vocabulary items have been reviewed."}
          </p>

          {cards.length > 0 && (
            <Button variant="gold" onClick={handleRestart} className="mt-4">
              <RefreshCw className="w-4 h-4" /> Review Deck Again
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
