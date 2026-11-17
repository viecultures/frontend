import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Square, Volume2, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';
import type { usePracticeRecorder } from '../../hooks/usePracticeRecorder';
import type { PracticeSegment } from '../../lib/readerPractice';
import { PracticeRecording } from './PracticeRecording';
import type { ShadowingEvaluation } from '../../services/readerSessionStorage';

interface PracticeShadowingProps {
  segment: PracticeSegment;
  recorder: ReturnType<typeof usePracticeRecorder>;
  onListen: () => void;
  onStopSample: () => void;
  total: number;
  evaluation?: ShadowingEvaluation;
  previousRecordingLost?: boolean;
  onEvaluate: (value: ShadowingEvaluation) => void;
}

export function PracticeShadowing({
  segment,
  recorder,
  onListen,
  onStopSample,
  total,
  evaluation,
  previousRecordingLost,
  onEvaluate,
}: PracticeShadowingProps) {
  const { t } = useTranslation('reader');
  const take = recorder.takes[segment.id];
  const recorded = Object.keys(recorder.takes).length;

  return (
    <section className="rp-activity" aria-label={t('shadowing_tab.activity_aria', 'Shadowing activity')}>
      <div className="rp-shadowing-header">
        <h2>{t('shadowing_tab.title', 'Repeat this passage')}</h2>
        <p>{t('shadowing_tab.description', 'Listen, then record yourself reading the passage.')}</p>
      </div>

      <div className="rp-shadowing-progress-box">
        <progress
          aria-label={t('shadowing_tab.progress_aria', 'Passages recorded')}
          value={recorded}
          max={total}
        />
        <small>
          {t('shadowing_tab.recorded_progress', {
            completed: recorded,
            total,
            defaultValue: `${recorded} of ${total} passages recorded`,
          })}
        </small>
      </div>

      {/* Target Passage Quote */}
      <blockquote className="rp-shadowing-target">
        &ldquo;{segment.text}&rdquo;
      </blockquote>

      {/* Speaking Loop: Step 1 (Model Audio) & Step 2 (Record Audio) */}
      <div className="rp-shadowing-loop space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Step 1: Model Audio Playback */}
          <button
            type="button"
            disabled={recorder.busy}
            onClick={onListen}
            className="rp-step-btn"
            title={t('shadowing_tab.listen_sample', 'Nghe giọng đọc mẫu')}
          >
            <Volume2 size={16} />
            <span>A · {t('shadowing_tab.listen_sample', 'Listen to sample')}</span>
          </button>

          {/* Step 2: Record / Stop Control */}
          {recorder.phase === 'recording' ? (
            <button
              type="button"
              className="rp-primary rp-recording-active"
              onClick={recorder.stop}
            >
              <Square size={16} />
              <span>
                {t('shadowing_tab.stop_recording', {
                  seconds: recorder.elapsed.toFixed(1),
                  defaultValue: `Stop recording · ${recorder.elapsed.toFixed(1)}s`,
                })}
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="rp-primary"
              disabled={recorder.busy}
              onClick={() => {
                onStopSample();
                recorder.start(segment.id);
              }}
            >
              <Mic size={16} />
              <span>
                {take
                  ? t('shadowing_tab.record_again', 'Record again')
                  : t('shadowing_tab.record_voice', 'Record my voice')}
              </span>
            </button>
          )}
        </div>

        {recorder.busy && recorder.phase !== 'recording' && (
          <p role="status" className="text-xs text-stone-500 italic">
            {recorder.phase === 'requesting'
              ? t('shadowing_tab.opening_mic', 'Opening microphone…')
              : recorder.phase === 'arming'
              ? t('shadowing_tab.preparing_rec', 'Preparing recording…')
              : t('shadowing_tab.finishing_rec', 'Finishing recording…')}
          </p>
        )}

        {recorder.busy && (
          <button type="button" className="rp-text-button text-xs" onClick={recorder.cancel}>
            {t('shadowing_tab.cancel_rec', 'Cancel recording')}
          </button>
        )}

        {recorder.error && <p role="alert" className="rp-error">{recorder.error}</p>}

        {/* Step 3: Your Take Playback & Management */}
        {take && !recorder.busy && (
          <div className="rp-take-wrapper mt-3 pt-3 border-t border-antique-gold/20">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
              B · {t('shadowing_tab.your_recording', 'Your recording')}
            </span>
            <PracticeRecording
              take={take}
              onPlay={onStopSample}
              onDelete={() => recorder.remove(segment.id)}
            />
          </div>
        )}
      </div>

      {previousRecordingLost && (
        <div className="rp-notice-box flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <p>
            {t(
              'shadowing_tab.previous_lost',
              'Bản thu âm trước đã kết thúc cùng lần mở trang (lưu tạm trong bộ nhớ). Bạn có thể nghe mẫu hoặc thu âm lại.'
            )}
          </p>
        </div>
      )}

      {/* Step 4: Self-Evaluation (No automated grading) */}
      {take && !recorder.busy && (
        <div className="rp-self-assessment" role="group" aria-label="Tự đánh giá bản thu">
          <p className="text-xs font-medium mb-1">
            {t(
              'shadowing_tab.eval_prompt',
              'Nghe lại bản thu ở trên, rồi so sánh với giọng đọc mẫu:'
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={evaluation === 'needs_work'}
              onClick={() => onEvaluate('needs_work')}
              className={`rp-eval-btn ${evaluation === 'needs_work' ? 'is-selected-needs-work' : ''}`}
            >
              <RotateCcw size={14} />
              <span>{t('shadowing_tab.eval_needs_work', 'Cần luyện thêm')}</span>
            </button>

            <button
              type="button"
              aria-pressed={evaluation === 'satisfied'}
              onClick={() => onEvaluate('satisfied')}
              className={`rp-eval-btn ${evaluation === 'satisfied' ? 'is-selected-satisfied' : ''}`}
            >
              <CheckCircle2 size={14} />
              <span>{t('shadowing_tab.eval_satisfied', 'Hài lòng · Đoạn tiếp theo')}</span>
            </button>
          </div>
        </div>
      )}

      <p className="rp-session-note">
        {t('shadowing_tab.session_note', 'Các bản thu âm chỉ lưu tạm thời trong bộ nhớ của phiên đọc này và sẽ mất khi tải lại trang.')}
      </p>
    </section>
  );
}
export default PracticeShadowing;
