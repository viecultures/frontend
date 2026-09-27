import React, { useState } from "react";
import { motion } from "motion/react";
import type { Flashcard } from "@/lib/sample-data";
import { Volume2, RotateCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SRSCardProps {
  card: Flashcard;
  onRating: (cardId: string, rating: "again" | "hard" | "good" | "easy") => void;
}

export const SRSCard: React.FC<SRSCardProps> = ({ card, onRating }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(card.word);
      utterance.lang = "en-US";
      synth.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto perspective-1000">
      {/* 3D Flip Card Container */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 25 }}
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative w-full h-[360px] rounded-3xl cursor-pointer shadow-2xl glass-panel border border-amber-500/30"
      >
        {/* FRONT SIDE: English word, IPA, Audio, Context */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 p-8 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full">
              {card.pos} • {card.articleSource}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={playAudio}
              className="rounded-full border-amber-500/30"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
            </Button>
          </div>

          <div className="text-center my-auto space-y-2">
            <h2 className="font-serif font-extrabold text-4xl text-amber-950 dark:text-amber-100 tracking-tight">
              {card.word}
            </h2>
            <p className="font-mono text-base text-amber-800/80 dark:text-amber-400/80">
              {card.ipa}
            </p>
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 text-xs text-zinc-700 dark:text-zinc-300 italic max-w-md mx-auto">
              "{card.enSentence}"
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <RotateCw className="w-3.5 h-3.5" /> Tap card to reveal Vietnamese meaning
          </div>
        </div>

        {/* BACK SIDE: Vietnamese definition, Vietnamese sentence context */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
          className="absolute inset-0 p-8 flex flex-col justify-between bg-amber-950 text-white rounded-3xl"
        >
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              Bản Dịch Tiếng Việt
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>

          <div className="text-center my-auto space-y-3">
            <h3 className="text-2xl font-bold text-amber-200">
              {card.vi}
            </h3>
            <p className="text-xs text-amber-100/80 italic max-w-md mx-auto bg-amber-900/50 p-3 rounded-xl">
              "{card.viSentence}"
            </p>
          </div>

          <div className="text-center text-xs text-amber-300/70">
            Choose SRS assessment below to update review schedule.
          </div>
        </div>
      </motion.div>

      {/* Self-Assessment SRS Buttons */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-3 mt-6"
        >
          <button
            onClick={() => onRating(card.id, "again")}
            className="p-3 rounded-2xl bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-semibold text-xs text-center transition-all"
          >
            <div className="font-bold">Again</div>
            <div className="text-[10px] opacity-80">1 day</div>
          </button>
          <button
            onClick={() => onRating(card.id, "hard")}
            className="p-3 rounded-2xl bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-semibold text-xs text-center transition-all"
          >
            <div className="font-bold">Hard</div>
            <div className="text-[10px] opacity-80">2 days</div>
          </button>
          <button
            onClick={() => onRating(card.id, "good")}
            className="p-3 rounded-2xl bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 font-semibold text-xs text-center transition-all"
          >
            <div className="font-bold">Good</div>
            <div className="text-[10px] opacity-80">4 days</div>
          </button>
          <button
            onClick={() => onRating(card.id, "easy")}
            className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 font-semibold text-xs text-center transition-all"
          >
            <div className="font-bold">Easy</div>
            <div className="text-[10px] opacity-80">7 days</div>
          </button>
        </motion.div>
      )}
    </div>
  );
};
