import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, Volume2, Play, Pause, Check, Headphones, Globe, BookOpen, Layers } from "lucide-react";
import { GEMINI_VOICES, type GeminiVoice } from "../types/voice";

interface VoiceCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoiceId: string;
  onSelectVoice: (voiceId: "puck" | "charon" | "kore" | "aoede" | "fenrir") => void;
  audioScope: "full" | "sentence";
  onChangeAudioScope: (scope: "full" | "sentence") => void;
  themeMode?: "paper" | "dark";
}

export const VoiceCustomizerModal: React.FC<VoiceCustomizerModalProps> = ({
  isOpen,
  onClose,
  selectedVoiceId,
  onSelectVoice,
  audioScope,
  onChangeAudioScope,
  themeMode = "paper",
}) => {
  const isDark = themeMode === "dark";
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Stop preview audio when modal closes
  useEffect(() => {
    if (!isOpen && previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
      setPreviewingVoiceId(null);
    }
  }, [isOpen]);

  const handleTogglePreview = (voice: GeminiVoice, e: React.MouseEvent) => {
    e.stopPropagation();

    if (previewingVoiceId === voice.id) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setPreviewingVoiceId(null);
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      // Dùng sentenceAudioUrl để nghe thử nhanh
      const audio = new Audio(voice.sentenceAudioUrl);
      previewAudioRef.current = audio;
      setPreviewingVoiceId(voice.id);
      audio.play().catch(() => setPreviewingVoiceId(null));
      audio.onended = () => {
        setPreviewingVoiceId(null);
      };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border transition-colors duration-200 max-h-[90vh] overflow-y-auto ${
          isDark
            ? "bg-[#1A2522] border-antique-gold/40 text-warm-ivory"
            : "bg-warm-ivory border-heritage-green/20 text-heritage-green"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-antique-gold/30 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-antique-gold/20 text-antique-gold border border-antique-gold/40">
                <Headphones className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-bold font-sans">Voice settings</h3>
                <p className={`text-xs ${isDark ? "text-sky-mist" : "text-heritage-green/70"}`}>
                  Choose a voice for listening and shadowing practice
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDark ? "hover:bg-white/10 text-sky-mist" : "hover:bg-black/5 text-heritage-green"
            }`}
            title="Close voice settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chế độ phát: Toàn bài đọc vs Câu Shadowing */}
        <div className="mb-6 p-4 rounded-2xl border border-antique-gold/30 bg-black/5 dark:bg-white/5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider block text-antique-gold">
            Audio scope
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onChangeAudioScope("full")}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                audioScope === "full"
                  ? isDark
                    ? "bg-antique-gold/20 border-antique-gold text-warm-ivory shadow-sm"
                    : "bg-heritage-green border-heritage-green text-warm-ivory shadow-sm"
                  : isDark
                  ? "bg-white/5 border-transparent text-sky-mist hover:bg-white/10"
                  : "bg-white border-black/5 text-heritage-green hover:bg-black/5"
              }`}
            >
              <BookOpen className="w-4 h-4 mt-0.5 shrink-0 text-antique-gold" />
              <div>
                <div className="font-bold text-sm">Full article</div>
                <div className="text-[11px] opacity-80">
                  Listen to the full article with natural intonation
                </div>
              </div>
            </button>

            <button
              onClick={() => onChangeAudioScope("sentence")}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                audioScope === "sentence"
                  ? isDark
                    ? "bg-antique-gold/20 border-antique-gold text-warm-ivory shadow-sm"
                    : "bg-heritage-green border-heritage-green text-warm-ivory shadow-sm"
                  : isDark
                  ? "bg-white/5 border-transparent text-sky-mist hover:bg-white/10"
                  : "bg-white border-black/5 text-heritage-green hover:bg-black/5"
              }`}
            >
              <Layers className="w-4 h-4 mt-0.5 shrink-0 text-antique-gold" />
              <div>
                <div className="font-bold text-sm">Shadowing sentence</div>
                <div className="text-[11px] opacity-80">
                  Listen and repeat one sentence at a time
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Danh sách 5 giọng đọc Gemini */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider block text-antique-gold">
            Choose a voice ({GEMINI_VOICES.length} voices available)
          </label>

          <div className="space-y-2.5">
            {GEMINI_VOICES.map((v) => {
              const isSelected = selectedVoiceId === v.id;
              const isPreviewing = previewingVoiceId === v.id;

              return (
                <div
                  key={v.id}
                  onClick={() => onSelectVoice(v.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? isDark
                        ? "bg-heritage-green/50 border-antique-gold shadow-md ring-2 ring-antique-gold/40"
                        : "bg-[#E6F3EF] border-heritage-green shadow-md ring-2 ring-heritage-green/20"
                      : isDark
                      ? "bg-white/5 border-white/10 hover:border-antique-gold/40 hover:bg-white/10"
                      : "bg-white border-black/5 hover:border-heritage-green/30 hover:bg-black/5"
                  }`}
                >
                  {/* Left: Info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base font-bold border ${
                        isSelected
                          ? "bg-antique-gold text-heritage-green border-antique-gold"
                          : isDark
                          ? "bg-white/10 text-antique-gold border-white/10"
                          : "bg-heritage-green/10 text-heritage-green border-heritage-green/20"
                      }`}
                    >
                      {v.flag}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm font-sans">{v.name}</span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            v.gender === "Male"
                              ? "bg-blue-500/10 text-blue-400 border-blue-400/30"
                              : "bg-pink-500/10 text-pink-400 border-pink-400/30"
                          }`}
                        >
                          {v.gender === "Male" ? "Male" : "Female"} • {v.accent}
                        </span>
                        <span className="text-[11px] font-medium text-antique-gold italic">
                          {v.toneDesc}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-sky-mist/90" : "text-[#4B5563]"}`}>
                        {v.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions (Preview & Select) */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={(e) => handleTogglePreview(v, e)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isPreviewing
                          ? "bg-antique-gold text-heritage-green border-antique-gold shadow-sm animate-pulse"
                          : isDark
                          ? "bg-white/5 border-white/20 text-warm-ivory hover:bg-white/15"
                          : "bg-white border-black/10 text-heritage-green hover:bg-black/5"
                      }`}
                      title={isPreviewing ? "Stop preview" : "Preview voice"}
                    >
                      {isPreviewing ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Playing</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Preview</span>
                        </>
                      )}
                    </button>

                    {/* Radio / Selection Indicator */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? "bg-antique-gold border-antique-gold text-heritage-green"
                          : isDark
                          ? "border-white/30"
                          : "border-black/20"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-antique-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-antique-gold">
            <Sparkles className="w-4 h-4" />
            <span>Google Gemini TTS 24kHz Studio Audio</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-antique-gold hover:bg-[#c9a657] text-heritage-green font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Apply & close
          </button>
        </div>
      </div>
    </div>
  );
};
