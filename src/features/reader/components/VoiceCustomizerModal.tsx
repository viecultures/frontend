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
            ? "bg-[#1A2522] border-[#D9B76A]/40 text-[#FBF7EE]"
            : "bg-[#FBF7EE] border-[#1E4B43]/20 text-[#1E4B43]"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[rgba(217,183,106,0.3)] mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#D9B76A]/20 text-[#D9B76A] border border-[#D9B76A]/40">
                <Headphones className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-bold font-serif">Tùy Chỉnh Giọng Đọc Google Gemini</h3>
                <p className={`text-xs ${isDark ? "text-[#BFE3EA]" : "text-[#1E4B43]/70"}`}>
                  Giọng đọc thần kinh (Neural Studio 24kHz) thế hệ mới từ Google Gemini
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDark ? "hover:bg-white/10 text-[#BFE3EA]" : "hover:bg-black/5 text-[#1E4B43]"
            }`}
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chế độ phát: Toàn bài đọc vs Câu Shadowing */}
        <div className="mb-6 p-4 rounded-2xl border border-[#D9B76A]/30 bg-black/5 dark:bg-white/5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider block text-[#D9B76A]">
            Phạm Vi Phát Âm Thanh
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onChangeAudioScope("full")}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                audioScope === "full"
                  ? isDark
                    ? "bg-[#D9B76A]/20 border-[#D9B76A] text-[#FBF7EE] shadow-sm"
                    : "bg-[#1E4B43] border-[#1E4B43] text-[#FBF7EE] shadow-sm"
                  : isDark
                  ? "bg-white/5 border-transparent text-[#BFE3EA] hover:bg-white/10"
                  : "bg-white border-black/5 text-[#1E4B43] hover:bg-black/5"
              }`}
            >
              <BookOpen className="w-4 h-4 mt-0.5 shrink-0 text-[#D9B76A]" />
              <div>
                <div className="font-bold text-sm">Toàn bộ bài đọc (~370 từ)</div>
                <div className="text-[11px] opacity-80">
                  Phát liên tục toàn văn bài viết Tết với ngữ điệu tự nhiên
                </div>
              </div>
            </button>

            <button
              onClick={() => onChangeAudioScope("sentence")}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                audioScope === "sentence"
                  ? isDark
                    ? "bg-[#D9B76A]/20 border-[#D9B76A] text-[#FBF7EE] shadow-sm"
                    : "bg-[#1E4B43] border-[#1E4B43] text-[#FBF7EE] shadow-sm"
                  : isDark
                  ? "bg-white/5 border-transparent text-[#BFE3EA] hover:bg-white/10"
                  : "bg-white border-black/5 text-[#1E4B43] hover:bg-black/5"
              }`}
            >
              <Layers className="w-4 h-4 mt-0.5 shrink-0 text-[#D9B76A]" />
              <div>
                <div className="font-bold text-sm">Câu Shadowing trọng tâm</div>
                <div className="text-[11px] opacity-80">
                  Luyện nghe và nói nhại theo từng câu tiêu biểu
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Danh sách 5 giọng đọc Gemini */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider block text-[#D9B76A]">
            Chọn Giọng Đọc Gemini ({GEMINI_VOICES.length} giọng sẵn sàng)
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
                        ? "bg-[#1E4B43]/50 border-[#D9B76A] shadow-md ring-2 ring-[#D9B76A]/40"
                        : "bg-[#E6F3EF] border-[#1E4B43] shadow-md ring-2 ring-[#1E4B43]/20"
                      : isDark
                      ? "bg-white/5 border-white/10 hover:border-[#D9B76A]/40 hover:bg-white/10"
                      : "bg-white border-black/5 hover:border-[#1E4B43]/30 hover:bg-black/5"
                  }`}
                >
                  {/* Left: Info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base font-bold border ${
                        isSelected
                          ? "bg-[#D9B76A] text-[#1E4B43] border-[#D9B76A]"
                          : isDark
                          ? "bg-white/10 text-[#D9B76A] border-white/10"
                          : "bg-[#1E4B43]/10 text-[#1E4B43] border-[#1E4B43]/20"
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
                          {v.gender === "Male" ? "Nam" : "Nữ"} • {v.accent}
                        </span>
                        <span className="text-[11px] font-medium text-[#D9B76A] italic">
                          {v.toneDesc}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-[#BFE3EA]/90" : "text-[#4B5563]"}`}>
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
                          ? "bg-[#D9B76A] text-[#1E4B43] border-[#D9B76A] shadow-sm animate-pulse"
                          : isDark
                          ? "bg-white/5 border-white/20 text-[#FBF7EE] hover:bg-white/15"
                          : "bg-white border-black/10 text-[#1E4B43] hover:bg-black/5"
                      }`}
                      title={isPreviewing ? "Dừng nghe thử" : "Nghe thử mẫu câu"}
                    >
                      {isPreviewing ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Đang phát</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Nghe thử</span>
                        </>
                      )}
                    </button>

                    {/* Radio / Selection Indicator */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? "bg-[#D9B76A] border-[#D9B76A] text-[#1E4B43]"
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
        <div className="mt-8 pt-4 border-t border-[rgba(217,183,106,0.2)] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#D9B76A]">
            <Sparkles className="w-4 h-4" />
            <span>Google Gemini TTS 24kHz Studio Audio</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#D9B76A] hover:bg-[#c9a657] text-[#1E4B43] font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Áp Dụng & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
