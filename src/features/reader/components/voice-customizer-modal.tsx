import React, { useState } from 'react';
import { X, Check, Volume2, Sparkles, User, Play, Pause } from 'lucide-react';
import { AVAILABLE_VOICES, type AIVoiceConfig } from '@/data/readerData';

interface VoiceCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
}

export const VoiceCustomizerModal: React.FC<VoiceCustomizerModalProps> = ({
  isOpen,
  onClose,
  selectedVoiceId,
  onSelectVoice,
  playbackSpeed,
  onChangeSpeed,
}) => {
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

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

    // Play sentence 1 sample for preview
    const sampleUrl = `/audio/${voice.id}/sentence_1.mp3`;
    const audio = new Audio(sampleUrl);
    setPreviewAudio(audio);
    setPreviewingVoiceId(voice.id);

    audio.onended = () => {
      setPreviewingVoiceId(null);
      setPreviewAudio(null);
    };
    audio.onerror = () => {
      setPreviewingVoiceId(null);
      setPreviewAudio(null);
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

  const speeds = [0.75, 1.0, 1.25];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#162B25] border-2 border-[#D9B76A]/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10 bg-gradient-to-r from-[#1E4B43] to-[#14332D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D9B76A]/20 border border-[#D9B76A] flex items-center justify-center text-[#D9B76A] shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FBF7EE] font-serif">
                Tùy Chỉnh Giọng Đọc AI (Edge Neural TTS)
              </h2>
              <p className="text-xs text-[#BFE3EA]">
                Chọn âm sắc và chất giọng AI bản xứ phù hợp nhất với phong cách luyện nghe của bạn
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
          {/* Voice Cards Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#D9B76A]">
                Danh Sách Giọng Đọc Neural Bản Xứ:
              </span>
              <span className="text-[11px] text-white/60">4 Giọng Studio Có Sẵn</span>
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
                        ? "bg-[#D9B76A]/20 border-[#D9B76A] shadow-lg shadow-[#D9B76A]/10"
                        : "bg-white/5 border-white/10 hover:border-[#D9B76A]/40 hover:bg-white/10"
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
                            ? "bg-[#D9B76A] text-[#1E4B43] shadow-md animate-pulse"
                            : "bg-white/10 hover:bg-white/20 text-[#FBF7EE]"
                        }`}
                        title="Nghe thử một câu mẫu bằng giọng này"
                      >
                        {isPreviewing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                        <span>{isPreviewing ? "Đang phát..." : "Nghe thử"}</span>
                      </button>

                      <span className="text-[10px] text-white/50 font-mono">
                        {voice.edgeVoice.split("-")[2]?.replace("Neural", "")}
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
                      ? "bg-[#D9B76A] text-[#1E4B43] border-[#D9B76A] shadow-md"
                      : "bg-black/30 border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {s}x {s === 0.75 ? "• Chậm" : s === 1.0 ? "• Chuẩn" : "• Nhanh"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#0E1E19] flex items-center justify-between">
          <span className="text-[11px] text-white/50">
            Tự động lưu lựa chọn của bạn vào bộ nhớ trình duyệt.
          </span>
          <button
            onClick={() => {
              if (previewAudio) previewAudio.pause();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D9B76A] to-[#c9a657] text-[#1E4B43] font-bold text-xs hover:shadow-lg transition-all"
          >
            Áp Dụng & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
export default VoiceCustomizerModal;
