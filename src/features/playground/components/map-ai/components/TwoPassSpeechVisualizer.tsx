/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mic,
  MicOff,
  Sparkles,
  Loader2,
  AlertCircle,
  RotateCcw,
  Check,
  X,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Wand2,
  Square,
  Settings2,
} from 'lucide-react';
import type { TwoPassSttData } from '../services/twoPassSttService';

export type TwoPassVisualizerState = 'idle' | 'listening' | 'refining' | 'empty' | 'error';

export interface TwoPassSpeechVisualizerProps {
  state: TwoPassVisualizerState;
  volume: number; // 0.0 to 1.0
  smartCleanup: boolean;
  onToggleSmartCleanup: (enabled: boolean) => void;
  errorMessage?: string;
  resultData?: TwoPassSttData | null;
  onRetry?: () => void;
  onApplyPrompt?: (text: string) => void;
  onDirectSend?: (text: string) => void;
  onDismissResult?: () => void;
  onCancelListening?: () => void;
  onStopListening?: () => void;
}

const EQUALIZER_MULTIPLIERS = [
  0.3, 0.55, 0.8, 0.65, 0.95, 0.7, 1.0, 0.85, 0.75, 0.9, 0.6, 0.8, 0.5, 0.7, 0.4, 0.25,
];

export const TwoPassSpeechVisualizer: React.FC<TwoPassSpeechVisualizerProps> = memo(({
  state,
  volume,
  smartCleanup,
  onToggleSmartCleanup,
  errorMessage,
  resultData,
  onRetry,
  onApplyPrompt,
  onDirectSend,
  onDismissResult,
  onCancelListening,
  onStopListening,
}) => {
  const { t } = useTranslation('playground');

  // Render comparative raw text with crossed-out filler words
  const renderAnnotatedRawText = (data: TwoPassSttData) => {
    if (!data.corrections || data.corrections.length === 0) {
      return <span>{data.rawText}</span>;
    }

    const fillerWords = new Set(
      data.corrections
        .filter(c => c.type === 'filler_word' || !c.replacement)
        .map(c => c.original.toLowerCase().trim())
    );

    const tokens = data.rawText.split(/(\s+)/);

    return (
      <span className="leading-relaxed">
        {tokens.map((token, index) => {
          const cleanToken = token.toLowerCase().replace(/^[.,?!;:]+|[.,?!;:]+$/g, '');
          const isFiller = fillerWords.has(cleanToken);

          if (isFiller) {
            return (
              <del
                key={index}
                className="line-through decoration-amber-600 dark:decoration-amber-400 text-amber-700/80 dark:text-amber-300/80 bg-amber-100/60 dark:bg-amber-950/40 px-1 py-0.5 rounded mx-0.5"
                title={t('playground.two_pass_stt.filler_removed', 'Đã lọc từ đệm')}
              >
                {token}
              </del>
            );
          }
          return <span key={index}>{token}</span>;
        })}
      </span>
    );
  };

  return (
    <div
      className="two-pass-stt-container w-full max-w-4xl mx-auto mb-3 transition-all duration-200"
      role="region"
      aria-label={t('playground.two_pass_stt.title', 'Smart Two-Pass STT')}
    >
      {/* AI Smart Cleanup Toggle Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 mb-2 bg-stone-50/90 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-xl text-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            role="switch"
            aria-checked={smartCleanup}
            onClick={() => onToggleSmartCleanup(!smartCleanup)}
            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              smartCleanup ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
            }`}
            aria-label="Toggle AI Smart Cleanup"
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                smartCleanup ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              AI Smart Cleanup: {smartCleanup ? 'BẬT (Hội thoại thông minh)' : 'TẮT (Luyện phát âm)'}
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              {smartCleanup
                ? 'Chế độ hội thoại thông minh (tự động loại bỏ từ đệm, sửa câu vấp).'
                : 'Chế độ luyện phát âm (giữ nguyên 100% âm thô để phát hiện lỗi).'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          <span>VAD tự động ngắt sau 800ms im lặng</span>
        </div>
      </div>

      {/* 1. STATE: Active Listening */}
      {state === 'listening' && (
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl shadow-sm animate-pulse-subtle"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white shrink-0 shadow-md">
              <Mic className="w-5 h-5 animate-pulse" />
              <span className="absolute -inset-1 rounded-full bg-red-400/40 animate-ping pointer-events-none" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-white dark:border-stone-900 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                {t('playground.two_pass_stt.state_listening', 'Đang thu âm giọng nói...')}
              </p>
              <p className="text-xs text-red-700/80 dark:text-red-300/80">
                {smartCleanup
                  ? 'Chế độ hội thoại: AI sẽ tự động lọc từ đệm, sửa câu vấp sau 800ms im lặng.'
                  : 'Chế độ luyện phát âm: Giữ nguyên 100% âm thô để phát hiện lỗi.'}
              </p>
            </div>
          </div>

          {/* Dynamic Audio Equalizer Bars */}
          <div className="flex items-center gap-1 h-8 px-2 py-1 bg-white/70 dark:bg-black/40 rounded-xl border border-red-100 dark:border-red-900/30">
            {EQUALIZER_MULTIPLIERS.map((mult, idx) => {
              const barHeight = Math.max(4, Math.min(28, Math.round(mult * volume * 32 + 3)));
              return (
                <div
                  key={idx}
                  className="w-1 bg-red-500 rounded-full transition-all duration-75"
                  style={{ height: `${barHeight}px` }}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {onStopListening && (
              <button
                type="button"
                onClick={onStopListening}
                className="flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] sm:min-h-0 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors focus:ring-2 focus:ring-red-400 focus:outline-none cursor-pointer"
                aria-label={t('playground.two_pass_stt.stop_recording', 'Dừng thu âm')}
                title="Bấm để dừng chủ động hoặc để VAD tự ngắt sau 800ms im lặng"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{t('playground.two_pass_stt.stop_recording', 'Dừng thu âm')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onCancelListening}
              className="text-xs px-3 py-1.5 min-h-[44px] sm:min-h-0 rounded-xl text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 transition-colors focus:ring-2 focus:ring-red-400 focus:outline-none cursor-pointer"
              aria-label={t('playground.two_pass_stt.cancel', 'Hủy')}
            >
              {t('playground.two_pass_stt.cancel', 'Hủy')}
            </button>
          </div>
        </div>
      )}

      {/* 2. STATE: AI Refining / Loading */}
      {state === 'refining' && (
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl shadow-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600 text-white shrink-0 shadow-md">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-950 dark:text-indigo-200">
                  {t('playground.two_pass_stt.state_refining', 'AI Two-Pass Refinement đang xử lý...')}
                </span>
              </div>
              <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80">
                {t(
                  'playground.two_pass_stt.state_refining_desc',
                  'Pass 1: Speech-to-Text → Pass 2: Gemini Contextual & Disfluency Removal'
                )}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            {t('playground.two_pass_stt.optimizing', 'Đang tối ưu ngữ cảnh văn hóa')}
          </div>
        </div>
      )}

      {/* 3. STATE: Empty / No speech detected */}
      {state === 'empty' && (
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl shadow-sm"
          role="status"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-500 text-white shrink-0">
              <MicOff className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                {t('playground.two_pass_stt.state_empty_title', 'Chưa nhận diện được giọng nói')}
              </p>
              <p className="text-xs text-amber-700/90 dark:text-amber-300/90">
                {t(
                  'playground.two_pass_stt.state_empty_desc',
                  'Âm thanh thu được quá ngắn hoặc âm lượng nhỏ. Vui lòng nói to và rõ hơn.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] sm:min-h-0 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors focus:ring-2 focus:ring-amber-400 focus:outline-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t('playground.two_pass_stt.retry', 'Nói lại')}
              </button>
            )}
            {onDismissResult && (
              <button
                type="button"
                onClick={onDismissResult}
                className="p-2 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={t('playground.two_pass_stt.close', 'Đóng')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. STATE: Error */}
      {state === 'error' && (
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-red-50/90 dark:bg-red-950/40 border border-red-300 dark:border-red-900/60 rounded-2xl shadow-sm"
          role="alert"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-red-600 text-white shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                {t('playground.two_pass_stt.state_error_title', 'Lỗi xử lý giọng nói')}
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">
                {errorMessage ||
                  t(
                    'playground.two_pass_stt.state_error_desc',
                    'Không thể gửi âm thanh đến máy chủ hoặc micro bị từ chối quyền truy cập.'
                  )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] sm:min-h-0 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors focus:ring-2 focus:ring-red-400 focus:outline-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t('playground.two_pass_stt.retry', 'Thử lại')}
              </button>
            )}
            {onDismissResult && (
              <button
                type="button"
                onClick={onDismissResult}
                className="p-2 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={t('playground.two_pass_stt.close', 'Đóng')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. STATE: Result Display with Learning Comparison Card */}
      {resultData && state !== 'listening' && state !== 'refining' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-md space-y-3">
          {/* Card Header & Performance Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                <Wand2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {t('playground.two_pass_stt.learning_card_title', 'Phân tích Giọng nói 2-Pass AI')}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
                title={t('playground.two_pass_stt.confidence_title', 'Độ tin cậy nhận diện')}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {Math.round(resultData.confidence * 100)}%
              </span>

              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono"
                title={t('playground.two_pass_stt.latency_title', 'Độ trễ xử lý')}
              >
                <Clock className="w-3 h-3" />
                {resultData.totalLatencyMs}ms (P1: {resultData.pass1LatencyMs}ms | P2: {resultData.pass2LatencyMs}ms)
              </span>

              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
                  smartCleanup
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                {smartCleanup ? 'Smart Cleanup' : 'Raw Audio'}
              </span>

              {onDismissResult && (
                <button
                  type="button"
                  onClick={onDismissResult}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-md transition-colors"
                  aria-label={t('playground.two_pass_stt.close', 'Đóng')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Comparison Panels: Raw vs Cleaned */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
            {/* Raw Speech Box */}
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex flex-col justify-between">
              <div>
                <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  {t('playground.two_pass_stt.raw_label', 'Lời nói gốc (Pass 1 STT):')}
                </span>
                <p className="text-stone-700 dark:text-stone-300 italic">
                  &ldquo;{renderAnnotatedRawText(resultData)}&rdquo;
                </p>
              </div>
              <p className="text-[10px] text-stone-400 mt-2">
                {t(
                  'playground.two_pass_stt.raw_hint',
                  'Các từ đệm, ngập ngừng được phát hiện và đánh dấu gạch ngang'
                )}
              </p>
            </div>

            {/* Cleaned Speech Box */}
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="block text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    {t('playground.two_pass_stt.cleaned_label', 'Bản tinh chỉnh AI (Pass 2):')}
                  </span>
                  <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-stone-900 dark:text-stone-100 font-medium leading-relaxed">
                  &ldquo;{resultData.cleanedText}&rdquo;
                </p>
              </div>

              {resultData.corrections && resultData.corrections.length > 0 && (
                <div className="mt-2 pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex flex-wrap gap-1">
                  {resultData.corrections.map((corr, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-amber-200 dark:border-stone-700"
                    >
                      <span className="line-through text-stone-400">{corr.original}</span>
                      {corr.replacement && (
                        <>
                          <ArrowRight className="w-2.5 h-2.5 text-stone-400" />
                          <span className="font-semibold text-amber-700 dark:text-amber-300">
                            {corr.replacement}
                          </span>
                        </>
                      )}
                      {corr.explanation && (
                        <span className="text-stone-400">({corr.explanation})</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            {onApplyPrompt && (
              <button
                type="button"
                onClick={() => onApplyPrompt(resultData.cleanedText)}
                className="flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] sm:min-h-0 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold transition-colors focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <Check className="w-3.5 h-3.5" />
                {t('playground.two_pass_stt.apply_button', 'Áp dụng vào câu hỏi')}
              </button>
            )}

            {onDirectSend && (
              <button
                type="button"
                onClick={() => onDirectSend(resultData.cleanedText)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 min-h-[44px] sm:min-h-0 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <Send className="w-3.5 h-3.5" />
                {t('playground.two_pass_stt.send_button', 'Gửi vào hội thoại')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

TwoPassSpeechVisualizer.displayName = 'TwoPassSpeechVisualizer';
export default TwoPassSpeechVisualizer;
