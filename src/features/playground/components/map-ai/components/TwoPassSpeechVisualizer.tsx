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
      className="two-pass-stt-container w-full max-w-4xl mx-auto mb-2 transition-all duration-200"
      role="region"
      aria-label={t('playground.two_pass_stt.title', 'Smart Two-Pass STT')}
    >
      {/* 0. STATE: Idle waiting */}
      {state === 'idle' && !resultData && (
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-stone-50/90 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-xl text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={smartCleanup}
              onClick={() => onToggleSmartCleanup(!smartCleanup)}
              className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                smartCleanup ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
              }`}
              aria-label="Toggle AI Smart Cleanup"
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  smartCleanup ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="font-medium text-stone-700 dark:text-stone-300">
              AI Smart Cleanup: {smartCleanup ? 'Bật (Hội thoại)' : 'Tắt (Luyện phát âm)'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>VAD 800ms</span>
          </div>
        </div>
      )}

      {/* 1. STATE: Active Listening - Compact single unified bar */}
      {state === 'listening' && (
        <div
          className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 px-3 py-1.5 bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl shadow-xs"
          role="status"
          aria-live="polite"
        >
          {/* Left: Indicator + Label + Equalizer */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white shrink-0 shadow-xs">
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-600 rounded-full border border-white dark:border-stone-900 animate-ping" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-red-900 dark:text-red-200 leading-tight">
                {t('playground.two_pass_stt.state_listening', 'Đang thu âm...')}
              </span>
              <span className="text-[10px] text-red-700/80 dark:text-red-300/80 flex items-center gap-1 leading-tight">
                <Clock className="w-2.5 h-2.5" />
                <span>800ms VAD</span>
              </span>
            </div>

            {/* Audio Equalizer Bars (compact 10 bars) */}
            <div
              className="flex items-center gap-0.5 h-5 px-1.5 py-0.5 bg-white/70 dark:bg-black/30 rounded-lg border border-red-100 dark:border-red-900/40"
              title={smartCleanup ? 'Đang lọc từ đệm, sửa ngập ngừng' : 'Giữ nguyên âm thô'}
            >
              {EQUALIZER_MULTIPLIERS.slice(0, 10).map((mult, idx) => {
                const barHeight = Math.max(3, Math.min(18, Math.round(mult * volume * 20 + 2)));
                return (
                  <div
                    key={idx}
                    className="w-0.5 bg-red-500 rounded-full transition-all duration-75"
                    style={{ height: `${barHeight}px` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Middle: Inline Smart Cleanup Toggle */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/60 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 text-xs">
            <button
              type="button"
              role="switch"
              aria-checked={smartCleanup}
              onClick={() => onToggleSmartCleanup(!smartCleanup)}
              className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                smartCleanup ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
              }`}
              aria-label="Toggle AI Smart Cleanup"
              title={smartCleanup ? 'Đang bật AI lọc từ đệm & câu vấp' : 'Đang tắt AI lọc từ (luyện phát âm)'}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  smartCleanup ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-[11px] font-medium text-stone-700 dark:text-stone-300 whitespace-nowrap select-none">
              {smartCleanup ? 'AI Cleanup' : 'Raw Audio'}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            {onStopListening && (
              <button
                type="button"
                onClick={onStopListening}
                className="flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors focus:ring-2 focus:ring-red-400 focus:outline-none cursor-pointer"
                aria-label={t('playground.two_pass_stt.stop_recording', 'Dừng thu âm')}
                title="Dừng và gửi xử lý (hoặc đợi 800ms im lặng)"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>{t('playground.two_pass_stt.stop_recording', 'Dừng')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onCancelListening}
              className="text-xs px-2 py-1 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors focus:ring-1 focus:ring-red-400 focus:outline-none cursor-pointer"
              aria-label={t('playground.two_pass_stt.cancel', 'Hủy')}
            >
              {t('playground.two_pass_stt.cancel', 'Hủy')}
            </button>
          </div>
        </div>
      )}

      {/* 2. STATE: AI Refining / Loading - Compact */}
      {state === 'refining' && (
        <div
          className="flex items-center justify-between gap-2 px-3 py-1.5 bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-xl shadow-xs"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white shrink-0 shadow-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-200 truncate">
                {t('playground.two_pass_stt.state_refining', 'AI Two-Pass Refinement đang xử lý...')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-indigo-700 dark:text-indigo-300 font-medium shrink-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            <span className="hidden sm:inline">{t('playground.two_pass_stt.optimizing', 'Tối ưu ngữ cảnh văn hóa')}</span>
          </div>
        </div>
      )}

      {/* 3. STATE: Empty / No speech detected - Compact */}
      {state === 'empty' && (
        <div
          className="flex items-center justify-between gap-2 px-3 py-1.5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl shadow-xs"
          role="status"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-white shrink-0">
              <MicOff className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-amber-900 dark:text-amber-200 truncate">
              {t('playground.two_pass_stt.state_empty_title', 'Chưa nhận diện được giọng nói')} (quá ngắn hoặc âm lượng nhỏ)
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors focus:ring-1 focus:ring-amber-400 focus:outline-none"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('playground.two_pass_stt.retry', 'Nói lại')}</span>
              </button>
            )}
            {onDismissResult && (
              <button
                type="button"
                onClick={onDismissResult}
                className="p-1 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg transition-colors focus:outline-none"
                aria-label={t('playground.two_pass_stt.close', 'Đóng')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. STATE: Error - Compact */}
      {state === 'error' && (
        <div
          className="flex items-center justify-between gap-2 px-3 py-1.5 bg-red-50/90 dark:bg-red-950/40 border border-red-300 dark:border-red-900/60 rounded-xl shadow-xs"
          role="alert"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white shrink-0">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-red-900 dark:text-red-200 truncate">
              {errorMessage || t('playground.two_pass_stt.state_error_title', 'Lỗi xử lý giọng nói')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors focus:ring-1 focus:ring-red-400 focus:outline-none"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('playground.two_pass_stt.retry', 'Thử lại')}</span>
              </button>
            )}
            {onDismissResult && (
              <button
                type="button"
                onClick={onDismissResult}
                className="p-1 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors focus:outline-none"
                aria-label={t('playground.two_pass_stt.close', 'Đóng')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. STATE: Result Display with Learning Comparison Card */}
      {resultData && state !== 'listening' && state !== 'refining' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-3 shadow-md space-y-2.5">
          {/* Card Header & Performance Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                <Wand2 className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                {t('playground.two_pass_stt.learning_card_title', 'Phân tích Giọng nói 2-Pass AI')}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium"
                title={t('playground.two_pass_stt.confidence_title', 'Độ tin cậy nhận diện')}
              >
                <ShieldCheck className="w-3 h-3" />
                {Math.round(resultData.confidence * 100)}%
              </span>

              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono text-[11px]"
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
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5 rounded-md transition-colors"
                  aria-label={t('playground.two_pass_stt.close', 'Đóng')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Comparison Panels: Raw vs Cleaned */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {/* Raw Speech Box */}
            <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex flex-col justify-between">
              <div>
                <span className="block text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5">
                  {t('playground.two_pass_stt.raw_label', 'Lời nói gốc (Pass 1 STT):')}
                </span>
                <p className="text-stone-700 dark:text-stone-300 italic">
                  &ldquo;{renderAnnotatedRawText(resultData)}&rdquo;
                </p>
              </div>
              <p className="text-[10px] text-stone-400 mt-1.5">
                {t(
                  'playground.two_pass_stt.raw_hint',
                  'Các từ đệm, ngập ngừng được phát hiện và gạch ngang'
                )}
              </p>
            </div>

            {/* Cleaned Speech Box */}
            <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="block text-[10px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    {t('playground.two_pass_stt.cleaned_label', 'Bản tinh chỉnh AI (Pass 2):')}
                  </span>
                  <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-stone-900 dark:text-stone-100 font-medium leading-relaxed">
                  &ldquo;{resultData.cleanedText}&rdquo;
                </p>
              </div>

              {resultData.corrections && resultData.corrections.length > 0 && (
                <div className="mt-1.5 pt-1.5 border-t border-amber-200/60 dark:border-amber-900/40 flex flex-wrap gap-1">
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
          <div className="flex flex-wrap items-center justify-end gap-1.5 pt-0.5">
            {onApplyPrompt && (
              <button
                type="button"
                onClick={() => onApplyPrompt(resultData.cleanedText)}
                className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg text-xs font-semibold transition-colors focus:ring-1 focus:ring-amber-500 focus:outline-none cursor-pointer"
              >
                <Check className="w-3 h-3" />
                {t('playground.two_pass_stt.apply_button', 'Áp dụng vào câu hỏi')}
              </button>
            )}

            {onDirectSend && (
              <button
                type="button"
                onClick={() => onDirectSend(resultData.cleanedText)}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors focus:ring-1 focus:ring-amber-500 focus:outline-none cursor-pointer"
              >
                <Send className="w-3 h-3" />
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
