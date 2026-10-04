import React, { useState } from 'react';
import { X, Check, Volume2, Sparkles, User, Play, Pause, Loader2, Wand2 } from 'lucide-react';
import { AVAILABLE_VOICES, ARTICLE_BILINGUAL_DATA, type AIVoiceConfig } from '@/data/readerData';
import { requestGeminiVoiceGeneration } from '../services/geminiVoiceApi';

interface VoiceCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  onVoiceGenerated?: (newAudioUrl: string) => void;
}

export const VoiceCustomizerModal: React.FC<VoiceCustomizerModalProps> = ({
  isOpen,
  onClose,
  selectedVoiceId,
  onSelectVoice,
  playbackSpeed,
  onChangeSpeed,
  onVoiceGenerated,
}) => {
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateResult, setGenerateResult] = useState<{
    success: boolean;
    message: string;
    audioUrl?: string;
  } | null>(null);

  if (!isOpen) return null;

  const selectedVoiceConfig =
    AVAILABLE_VOICES.find((v) => v.id === selectedVoiceId) || AVAILABLE_VOICES[0];

  const handlePreview = (voice: AIVoiceConfig, e: React.MouseEvent) => {
    e.stopPropagation();

    // If currently previewing this voice, stop it
    if (previewingVoiceId === voice.id && previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
      setPreviewingVoiceId(null);
      return;
    }

    if (previewAudio) {
      previewAudio.pause();
    }

    // Play sentence 1 sample for preview (using Gemini .wav or .mp3)
    const sampleUrl = `/audio/${voice.id}/sentence_1.wav`;
    const audio = new Audio(sampleUrl);
    setPreviewAudio(audio);
    setPreviewingVoiceId(voice.id);

    audio.onended = () => {
      setPreviewingVoiceId(null);
      setPreviewAudio(null);
    };
    audio.onerror = () => {
      // Fallback to mp3 if wav not found
      const fallbackAudio = new Audio(`/audio/${voice.id}/sentence_1.mp3`);
      setPreviewAudio(fallbackAudio);
      fallbackAudio.onended = () => {
        setPreviewingVoiceId(null);
        setPreviewAudio(null);
      };
      fallbackAudio.onerror = () => {
        setPreviewingVoiceId(null);
        setPreviewAudio(null);
      };
      fallbackAudio.play().catch(console.error);
    };
    audio.play().catch(console.error);
  };

  const handleSelect = (voiceId: string) => {
    if (previewAudio) {
      previewAudio.pause();
      setPreviewAudio(null);
      setPreviewingVoiceId(null);
    }
    onSelectVoice(voiceId);
  };

  const handleGenerateLive = async () => {
    setIsGenerating(true);
    setGenerateResult(null);

    // Full article text from ARTICLE_BILINGUAL_DATA
    const articleText = ARTICLE_BILINGUAL_DATA.paragraphs.map((p) => p.enText).join(" ");
    const filename = `${selectedVoiceId}_article_${Date.now()}.wav`;

    try {
      const res = await requestGeminiVoiceGeneration(
        articleText,
        selectedVoiceConfig.edgeVoice,
        filename
      );

      if (res.success && res.audioUrl) {
        setGenerateResult({
          success: true,
          message: `Sinh giọng đọc thành công cho bài đọc với giọng ${selectedVoiceConfig.name}!`,
          audioUrl: res.audioUrl,
        });
        if (onVoiceGenerated) {
          onVoiceGenerated(res.audioUrl);
        }
      } else {
        setGenerateResult({
          success: false,
          message: res.message || "Không thể sinh voice từ Gemini API",
        });
      }
    } catch (err: any) {
      setGenerateResult({
        success: false,
        message: err.message || "Lỗi kết nối tới backend Spring Boot (cần bật backend trên cổng 8080)",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const speeds = [0.75, 1.0, 1.25];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#162B25] border-2 border-[#D9B76A]/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10 bg-gradient-to-r from-[#1E4B43] to-[#14332D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D9B76A]/20 border border-[#D9B76A] flex items-center justify-center text-[#D9B76A] shadow-inner">
              <Sparkles className="w-5 h-5 text-[#D9B76A]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FBF7EE] font-serif">
                Tùy Chỉnh Giọng Đọc AI (Google Gemini Neural Voice)
              </h2>
              <p className="text-xs text-[#BFE3EA]">
                Chất giọng Google Gemini AI thế hệ mới với ngữ điệu tự nhiên, sống động và truyền cảm
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (previewAudio) previewAudio.pause();
              onClose();
            }}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Interactive Google Gemini Live Generator for this Reading */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E4B43] to-[#142E28] border-2 border-[#D9B76A]/40 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D9B76A] animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#D9B76A]">
                  Sinh Giọng Đọc Gemini Trực Tiếp Cho Bài Này
                </span>
              </div>
              <span className="text-[10px] font-mono bg-[#D9B76A]/20 text-[#D9B76A] px-2 py-0.5 rounded-full border border-[#D9B76A]/30">
                Google Gemini API
              </span>
            </div>

            <p className="text-xs text-[#E8DFCB]/90 leading-relaxed">
              Bấm nút bên dưới để gửi toàn bộ văn bản bài đọc tới <strong>Google Gemini API</strong> để sinh file âm thanh mới với giọng <strong>{selectedVoiceConfig.name}</strong>.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerateLive}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D9B76A] via-[#E2C37D] to-[#D9B76A] text-[#1E4B43] font-bold text-xs shadow-md hover:shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#1E4B43]" />
                    <span>Đang gọi Google Gemini API sinh giọng...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-[#1E4B43]" />
                    <span>⚡ Bấm để sinh giọng đọc bài này bằng Gemini ({selectedVoiceConfig.name})</span>
                  </>
                )}
              </button>
            </div>

            {generateResult && (
              <div
                className={`p-3 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  generateResult.success
                    ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
                    : 'bg-red-950/70 border border-red-500/50 text-red-200'
                }`}
              >
                <span>{generateResult.message}</span>
                {generateResult.success && generateResult.audioUrl && (
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    ✓ Đã cập nhật phát ngay!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Voice Cards Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#D9B76A]">
                Danh Sách Giọng Đọc Google Gemini:
              </span>
              <span className="text-[11px] text-white/60">5 Giọng Studio Có Sẵn</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_VOICES.map((voice) => {
                const isSelected = selectedVoiceId === voice.id;
                const isPreviewing = previewingVoiceId === voice.id;

                return (
                  <div
                    key={voice.id}
                    onClick={() => handleSelect(voice.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#D9B76A]/20 border-[#D9B76A] shadow-lg shadow-[#D9B76A]/10'
                        : 'bg-white/5 border-white/10 hover:border-[#D9B76A]/40 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      {/* Top Row: Avatar & Flag & Selected Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{voice.flag}</span>
                          <div>
                            <span className="font-bold text-sm text-[#FBF7EE] block leading-tight">
                              {voice.name}
                            </span>
                            <span className="text-[10px] text-[#BFE3EA] font-medium">
                              {voice.genderLabel} • {voice.accent}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="flex items-center gap-1 text-[10px] font-bold bg-[#D9B76A] text-[#1E4B43] px-2 py-0.5 rounded-full shadow-xs">
                            <Check className="w-3 h-3" /> Đang chọn
                          </span>
                        )}
                      </div>

                      {/* Tone Badge */}
                      <span className="inline-block text-[11px] font-semibold text-[#D9B76A] bg-[#D9B76A]/10 px-2 py-0.5 rounded-md mb-2">
                        {voice.toneDesc}
                      </span>

                      {/* Description */}
                      <p className="text-xs text-[#E8DFCB]/80 leading-relaxed mb-3">
                        {voice.description}
                      </p>
                    </div>

                    {/* Preview Button */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={(e) => handlePreview(voice, e)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isPreviewing
                            ? 'bg-[#D9B76A] text-[#1E4B43] shadow-md animate-pulse'
                            : 'bg-white/10 hover:bg-white/20 text-[#FBF7EE]'
                        }`}
                        title="Nghe thử một câu mẫu bằng giọng này"
                      >
                        {isPreviewing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                        <span>{isPreviewing ? 'Đang phát...' : 'Nghe thử'}</span>
                      </button>

                      <span className="text-[10px] text-[#D9B76A]/70 font-mono font-semibold">
                        Gemini {voice.edgeVoice}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Speed Preset Selector */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#D9B76A] block">
              Tốc Độ Đọc (Playback Speed):
            </span>
            <div className="grid grid-cols-3 gap-2">
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    playbackSpeed === s
                      ? 'bg-[#D9B76A] text-[#1E4B43] border-[#D9B76A] shadow-md'
                      : 'bg-black/30 border-white/10 text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {s}x {s === 0.75 ? '• Chậm' : s === 1.0 ? '• Chuẩn' : '• Nhanh'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#0E1E19] flex items-center justify-between">
          <span className="text-[11px] text-white/50">
            Giọng đọc được sinh trực tiếp bằng Google Gemini AI (không dùng local TTS).
          </span>
          <button
            onClick={() => {
              if (previewAudio) previewAudio.pause();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D9B76A] to-[#c9a657] text-[#1E4B43] font-bold text-xs hover:shadow-lg transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
