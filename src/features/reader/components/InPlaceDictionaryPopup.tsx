import React, { useState, useEffect, useRef } from "react";
import { Volume2, Bookmark, Check, X, Sparkles, BookOpen } from "lucide-react";
import type { VocabItem } from "@/data/readerData";

interface InPlaceDictionaryPopupProps {
  isOpen: boolean;
  vocab: VocabItem | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  themeMode?: "paper" | "dark";
}

export const InPlaceDictionaryPopup: React.FC<InPlaceDictionaryPopupProps> = ({
  isOpen,
  vocab,
  position,
  onClose,
  themeMode = "paper",
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const isLight = themeMode === "paper";

  // Check if word is already saved in localStorage
  useEffect(() => {
    if (vocab) {
      try {
        const saved = JSON.parse(localStorage.getItem("vie_saved_vocab") || "[]");
        const exists = saved.some((item: VocabItem) => item.id === vocab.id || item.word.toLowerCase() === vocab.word.toLowerCase());
        setIsSaved(exists);
      } catch (e) {
        setIsSaved(false);
      }
    }
  }, [vocab]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !vocab || !position) return null;

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(vocab.word);
      utterance.rate = 0.9;
      utterance.lang = "en-US";
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const saved: VocabItem[] = JSON.parse(localStorage.getItem("vie_saved_vocab") || "[]");
      if (isSaved) {
        const next = saved.filter((item) => item.id !== vocab.id && item.word.toLowerCase() !== vocab.word.toLowerCase());
        localStorage.setItem("vie_saved_vocab", JSON.stringify(next));
        setIsSaved(false);
      } else {
        const next = [vocab, ...saved.filter((item) => item.id !== vocab.id)];
        localStorage.setItem("vie_saved_vocab", JSON.stringify(next));
        setIsSaved(true);
      }
    } catch (e) {
      setIsSaved(!isSaved);
    }
  };

  // Clamped position calculation
  const popupWidth = 340;
  const popupHeight = 280;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = position.x - popupWidth / 2;
  if (left < 16) left = 16;
  if (left + popupWidth > viewportWidth - 16) left = viewportWidth - popupWidth - 16;

  let top = position.y + 16;
  // If popup would overflow bottom, show above target
  if (top + popupHeight > viewportHeight - 16) {
    top = Math.max(16, position.y - popupHeight - 16);
  }

  const isPhrase = vocab.word.trim().split(/\s+/).length > 1;

  return (
    <div
      ref={popupRef}
      style={{ top: `${top}px`, left: `${left}px`, width: `${popupWidth}px` }}
      className={`fixed z-50 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 ${
        isLight
          ? "bg-[#FBF7EE]/98 text-[#1E4B43] border-[#D9B76A]/60 shadow-[0_16px_45px_rgba(30,75,67,0.2)]"
          : "bg-[#141C1A]/98 text-[#FBF7EE] border-[#D9B76A]/80 shadow-[0_16px_50px_rgba(0,0,0,0.8)]"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[rgba(217,183,106,0.25)]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg leading-tight truncate text-current">
                {vocab.word}
              </h3>
              <button
                onClick={handlePlayAudio}
                title="Nghe phát âm chuẩn"
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  isPlayingAudio
                    ? "bg-[#D9B76A] text-[#1E4B43]"
                    : "hover:bg-[#D9B76A]/20 text-[#D9B76A]"
                }`}
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-pulse" : ""}`} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs text-[#D9B76A] font-semibold">
                {vocab.ipa}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#1E4B43]/10 dark:bg-white/10 text-[#1E4B43] dark:text-[#BFE3EA]">
                {vocab.pos}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-current/60 hover:text-current hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
          title="Đóng popup tra từ"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Meanings */}
      <div className="py-2.5 space-y-2 text-xs">
        {/* Tiếng Việt */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] dark:text-[#6EE7B7] block">
            Nghĩa Tiếng Việt:
          </span>
          <p className="font-medium mt-0.5 leading-relaxed text-current">
            {vocab.viMeaning}
          </p>
        </div>

        {/* English Definition */}
        {vocab.enDefinition && (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#93C5FD] block">
              English Definition:
            </span>
            <p className="opacity-90 italic mt-0.5 leading-relaxed">
              {vocab.enDefinition}
            </p>
          </div>
        )}

        {/* Ngữ Cảnh Bài Đọc */}
        {vocab.contextSentence && (
          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[rgba(217,183,106,0.15)]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D9B76A] flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Ngữ cảnh bài học:
            </span>
            <p className="text-[11px] opacity-80 mt-1 line-clamp-2 leading-normal">
              "{vocab.contextSentence}"
            </p>
          </div>
        )}
      </div>

      {/* Footer Action: + LƯU TỪ / + LƯU CỤM */}
      <div className="pt-2 border-t border-[rgba(217,183,106,0.25)] flex items-center justify-between gap-2">
        <button
          onClick={handleToggleSave}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
            isSaved
              ? "bg-[#059669] text-white hover:bg-[#047857]"
              : isLight
              ? "bg-[#1E4B43] text-[#FBF7EE] hover:bg-[#163D37]"
              : "bg-[#D9B76A] text-[#1E4B43] hover:bg-[#c9a657]"
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>✓ ĐÃ LƯU VÀO SỔ TAY</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isPhrase ? "+ LƯU CỤM TỪ KÈM NGỮ CẢNH" : "+ LƯU TỪ VỰNG KÈM NGỮ CẢNH"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InPlaceDictionaryPopup;
