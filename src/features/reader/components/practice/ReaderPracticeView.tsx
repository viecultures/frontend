import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Trophy,
} from 'lucide-react';
import { ReaderArticleContent } from '../ReaderArticleContent';
import { InPlaceDictionaryPopup } from '../InPlaceDictionaryPopup';
import { useReaderDictionary } from '../../hooks/useReaderDictionary';
import { usePracticeAudio } from '../../hooks/usePracticeAudio';
import { usePracticeRecorder } from '../../hooks/usePracticeRecorder';
import { buildPracticeSegments, type DictationAnswer, type PracticeMode } from '../../lib/readerPractice';
import type { ReaderArticleData } from '../../services/readerApiService';
import { PracticeQuestions, type QuestionAnswer } from './PracticeQuestions';
import { PracticeShadowing } from './PracticeShadowing';
import { LetterRevealBoard } from '@/features/playground/components/shadowing/LetterRevealBoard';
import type { DictationState } from '@/features/playground/hooks/useLetterRevealDictation';
import {
  loadDictationSession,
  saveDictationSession,
  clearDictationSession,
} from '../../services/dictationSessionStorage';
import '@/features/playground/components/shadowing/dictation-reveal.css';
import './reader-practice.css';

interface ReaderPracticeViewProps {
  articleData: ReaderArticleData;
  fontSize: number;
  vocabBtnClass: string;
  themeMode: 'paper' | 'dark';
  mode: PracticeMode;
  onChangeMode: (mode: PracticeMode) => void;
  onBackToReading: () => void;
  fullAudioUrl?: string;
}

export function ReaderPracticeView({
  articleData,
  fontSize,
  vocabBtnClass,
  themeMode,
  mode,
  onChangeMode,
  onBackToReading,
  fullAudioUrl,
}: ReaderPracticeViewProps) {
  const { t } = useTranslation('reader');
  const modes: { id: PracticeMode; label: string }[] = useMemo(() => [
    { id: 'questions', label: t('practice_view.modes.questions', 'Questions') },
    { id: 'dictation', label: t('practice_view.modes.dictation', 'Dictation') },
    { id: 'shadowing', label: t('practice_view.modes.shadowing', 'Shadowing') },
  ], [t]);

  const segments = useMemo(() => buildPracticeSegments(articleData), [articleData]);
  const articleLevel = articleData.level || 'Level 2';

  // Load saved session or initialize
  const savedSession = useMemo(
    () => loadDictationSession(articleData.id, articleLevel),
    [articleData.id, articleLevel]
  );

  const [segmentIndex, setSegmentIndex] = useState(() => {
    if (savedSession && savedSession.lastPassageIndex < segments.length) {
      return savedSession.lastPassageIndex;
    }
    return 0;
  });

  const [passageRecords, setPassageRecords] = useState<Record<number, DictationState>>(() => {
    return savedSession?.records || {};
  });

  const [showSummary, setShowSummary] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});

  const sample = usePracticeAudio(articleData.shadowingAudioUrl, mode !== 'questions');
  const recorder = usePracticeRecorder(mode === 'shadowing');
  const { popupState, closeDictionary, handleTextSelection, handleVocabClick } = useReaderDictionary(articleData.vocabMap);

  const segment = segments[segmentIndex];
  const tabs = useRef<HTMLDivElement>(null);
  const fullPlayer = useRef<HTMLAudioElement>(null);

  // Stop audio on mode/segment change
  useEffect(() => {
    sample.stop();
  }, [mode, segmentIndex, sample.stop]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [mode]);

  useEffect(() => {
    const player = fullPlayer.current;
    return () => {
      player?.pause();
    };
  }, [mode]);

  // Persist session to localStorage
  const handlePassageStateChange = useCallback(
    (newState: DictationState) => {
      setPassageRecords((prev) => {
        const next = { ...prev, [segmentIndex]: newState };
        saveDictationSession({
          articleId: articleData.id,
          level: articleLevel,
          lastPassageIndex: segmentIndex,
          records: next,
          speed: sample.speed,
          repeat: sample.repeat,
        });
        return next;
      });
    },
    [articleData.id, articleLevel, segmentIndex, sample.speed, sample.repeat]
  );

  const listenToSegment = useCallback(() => {
    document.querySelectorAll<HTMLAudioElement>('.rp-recording audio').forEach((p) => p.pause());
    if (segment) sample.play(segment);
  }, [segment, sample]);

  const handleNextSegment = useCallback(() => {
    if (segmentIndex < segments.length - 1) {
      setSegmentIndex((idx) => idx + 1);
    } else {
      // Reached the end -> show final summary
      setShowSummary(true);
    }
  }, [segmentIndex, segments.length]);

  function handleTabKey(event: React.KeyboardEvent<HTMLDivElement>) {
    const index = modes.findIndex((item) => item.id === mode);
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % modes.length
        : event.key === 'ArrowLeft'
        ? (index + modes.length - 1) % modes.length
        : event.key === 'Home'
        ? 0
        : event.key === 'End'
        ? modes.length - 1
        : -1;
    if (next < 0) return;
    event.preventDefault();
    onChangeMode(modes[next].id);
    tabs.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  // Calculate statistics across all passages
  const stats = useMemo(() => {
    let selfCompleted = 0;
    let hintedCompleted = 0;
    let revealed = 0;
    let inProgress = 0;

    segments.forEach((_, idx) => {
      const rec = passageRecords[idx];
      if (!rec || rec.status === 'not-started') {
        // incomplete
      } else if (rec.status === 'completed-self') {
        selfCompleted++;
      } else if (rec.status === 'completed-hinted') {
        hintedCompleted++;
      } else if (rec.status === 'answer-revealed') {
        revealed++;
      } else if (rec.status === 'in-progress') {
        inProgress++;
      }
    });

    const totalFinished = selfCompleted + hintedCompleted + revealed;
    return {
      selfCompleted,
      hintedCompleted,
      revealed,
      inProgress,
      totalFinished,
      unstarted: segments.length - totalFinished - inProgress,
    };
  }, [segments, passageRecords]);

  const sessionProgress =
    segments.length > 0 ? Math.round((stats.totalFinished / segments.length) * 100) : 0;

  // Jump to first uncompleted passage
  const handleReviewIncomplete = () => {
    setShowSummary(false);
    const firstIncomplete = segments.findIndex((_, idx) => {
      const rec = passageRecords[idx];
      return !rec || (rec.status !== 'completed-self' && rec.status !== 'completed-hinted');
    });
    if (firstIncomplete !== -1) {
      setSegmentIndex(firstIncomplete);
    } else {
      setSegmentIndex(0);
    }
  };

  const handleRestartWholeArticle = () => {
    clearDictationSession(articleData.id, articleLevel);
    setPassageRecords({});
    setSegmentIndex(0);
    setShowSummary(false);
  };

  return (
    <div className="rp-workspace" data-practice-theme={themeMode}>
      {/* 1. Gộp Header Gọn: Back to reading · Tên bài · Level */}
      <div className="rp-compact-header-row">
        <button
          type="button"
          onClick={onBackToReading}
          className="rp-back-link"
          aria-label="Quay lại đọc bài"
        >
          <ArrowLeft size={16} />
          <span>Quay lại bài đọc</span>
        </button>

        <span className="rp-header-sep">·</span>

        <h1 className="rp-compact-story-title">{articleData.titleEn}</h1>

        <span className="rp-compact-level-pill">{articleLevel}</span>
      </div>

      {/* 2. Ba Tab Chức Năng Nằm Ngang */}
      <div className="rp-mode-tabs-container">
        <div
          ref={tabs}
          className="rp-mode-tabs"
          role="tablist"
          aria-label={t('practice_view.tabs_aria', 'Practice modes')}
          onKeyDown={handleTabKey}
        >
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`practice-tab-${item.id}`}
              aria-controls={`practice-panel-${mode}`}
              aria-selected={mode === item.id}
              tabIndex={mode === item.id ? 0 : -1}
              className="rp-mode-tab"
              onClick={() => {
                setShowSummary(false);
                onChangeMode(item.id);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MODE: DICTATION */}
      {mode === 'dictation' ? (
        showSummary ? (
          /* Màn hình tổng kết hoàn thành bài */
          <div className="vc-dictation-summary-card" role="region" aria-label="Tổng kết bài học">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <Trophy size={36} color="var(--color-antique-gold)" />
            </div>
            <h2 className="vc-dictation-summary-title">Tổng Kết Bài Luyện Chép Chính Tả</h2>
            <p style={{ fontSize: 14, color: 'var(--color-ink-soft)', margin: 0 }}>
              {articleData.titleEn} · {articleLevel}
            </p>

            <div className="vc-dictation-summary-stats">
              <div className="vc-dictation-stat-box">
                <span className="vc-dictation-stat-num">
                  {stats.totalFinished} / {segments.length}
                </span>
                <span className="vc-dictation-stat-label">Đoạn đã làm</span>
              </div>
              <div className="vc-dictation-stat-box">
                <span className="vc-dictation-stat-num" style={{ color: 'var(--color-heritage-green)' }}>
                  {stats.selfCompleted}
                </span>
                <span className="vc-dictation-stat-label">Tự hoàn thành</span>
              </div>
              <div className="vc-dictation-stat-box">
                <span className="vc-dictation-stat-num" style={{ color: 'var(--color-antique-gold)' }}>
                  {stats.hintedCompleted}
                </span>
                <span className="vc-dictation-stat-label">Có trợ giúp</span>
              </div>
              <div className="vc-dictation-stat-box">
                <span className="vc-dictation-stat-num" style={{ color: '#9C382A' }}>
                  {stats.revealed}
                </span>
                <span className="vc-dictation-stat-label">Xem đáp án</span>
              </div>
            </div>

            <div className="vc-dictation-summary-actions">
              <button
                type="button"
                className="vc-dictation-btn-next"
                onClick={handleReviewIncomplete}
              >
                <Sparkles size={14} />
                <span>Luyện các đoạn cần cải thiện</span>
              </button>
              <button
                type="button"
                className="vc-dictation-action-btn"
                onClick={handleRestartWholeArticle}
              >
                <RotateCcw size={14} />
                <span>Làm lại từ đầu bài</span>
              </button>
              <button
                type="button"
                className="vc-dictation-action-btn"
                onClick={onBackToReading}
              >
                <span>Quay về bài đọc</span>
              </button>
            </div>
          </div>
        ) : (
          /* Bố cục 2 cột chính */
          <div
            className="vc-dictation-workspace"
            role="tabpanel"
            id="practice-panel-dictation"
            aria-labelledby="practice-tab-dictation"
          >
            <div className="vc-dictation-columns">
              {/* Cột Trái: Bảng Luyện Gọn Gàng (Audio + Grid + Progress + Actions trong cùng 1 viewport) */}
              {segment ? (
                <LetterRevealBoard
                  key={segment.id}
                  sentenceId={segment.id}
                  sentenceText={segment.text}
                  passageIndex={segmentIndex}
                  totalPassages={segments.length}
                  isPlaying={sample.playing}
                  isRepeating={sample.repeat}
                  onPlaySample={() => (sample.playing ? sample.stop() : listenToSegment())}
                  onRepeatToggle={() => sample.setRepeat(!sample.repeat)}
                  onNextPassage={handleNextSegment}
                  onSpeedChange={(spd) => sample.setSpeed(spd)}
                  currentSpeed={sample.speed}
                  initialState={passageRecords[segmentIndex] || null}
                  onStateChange={handlePassageStateChange}
                />
              ) : (
                <section className="rp-activity">
                  <BookOpen size={28} />
                  <h2>{t('practice_view.transcript_needed_title', 'A transcript is needed')}</h2>
                  <p>
                    {t(
                      'practice_view.transcript_needed_desc',
                      'Choose another article to practise dictation or shadowing.'
                    )}
                  </p>
                  <button type="button" onClick={onBackToReading}>
                    {t('practice_view.back_to_reading', 'Back to reading')}
                  </button>
                </section>
              )}

              {/* Cột Phải: Sidebar Tiến Độ & Danh Sách Passages (Chỉ 1 badge trạng thái rõ ràng) */}
              <aside className="vc-dictation-sidebar">
                {/* Session Card */}
                <div className="vc-dictation-side-card">
                  <div className="vc-dictation-side-heading">
                    <span>Your session</span>
                    <span className="vc-dictation-session-count">
                      {stats.totalFinished} / {segments.length} completed
                    </span>
                  </div>
                  <div className="vc-dictation-track-rail">
                    <div
                      className="vc-dictation-track-fill"
                      style={{ width: `${sessionProgress}%` }}
                    />
                  </div>
                </div>

                {/* Passages Card */}
                <div className="vc-dictation-side-card">
                  <div className="vc-dictation-side-heading">
                    <span>Passages</span>
                    {stats.totalFinished === segments.length && (
                      <button
                        type="button"
                        onClick={() => setShowSummary(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-heritage-green)',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0,
                          minHeight: 'auto',
                        }}
                      >
                        View results
                      </button>
                    )}
                  </div>
                  <div className="vc-dictation-passages-list">
                    {segments.map((item, idx) => {
                      const rec = passageRecords[idx];
                      const isCurrent = idx === segmentIndex;

                      let statusBadgeClass = 'not-started';
                      let statusText = 'Not started';

                      if (isCurrent) {
                        statusBadgeClass = 'now-practicing';
                        statusText = 'Now practicing';
                      } else if (rec) {
                        if (rec.status === 'completed-self' || rec.status === 'completed-hinted') {
                          statusBadgeClass = 'completed';
                          statusText = 'Completed';
                        } else if (rec.status === 'answer-revealed') {
                          statusBadgeClass = 'answer-revealed';
                          statusText = 'Answer revealed';
                        } else if (rec.status === 'in-progress') {
                          statusBadgeClass = 'in-progress';
                          statusText = 'In progress';
                        }
                      }

                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`vc-dictation-passage-item ${isCurrent ? 'active' : ''}`}
                          onClick={() => {
                            setSegmentIndex(idx);
                            setShowSummary(false);
                          }}
                          aria-current={isCurrent ? 'step' : undefined}
                        >
                          <span className="vc-dictation-passage-num">
                            {String(idx + 1).padStart(2, '0')}
                          </span>

                          <span className={`vc-dictation-passage-badge-status ${statusBadgeClass}`}>
                            {statusBadgeClass === 'completed' && <Check size={12} className="vc-check-icon" />}
                            <span>{statusText}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mascot Encouragement Card */}
                <div className="vc-dictation-mascot-card" aria-hidden="true">
                  <div className="vc-dictation-mascot-img-wrap">
                    <img
                      src="/brand/viecultures-mascot-logo.png"
                      alt=""
                      className="vc-dictation-mascot-avatar"
                    />
                    <div className="vc-dictation-mascot-sparkle">
                      <Sparkles size={14} color="var(--color-antique-gold)" />
                    </div>
                  </div>
                  <div className="vc-dictation-mascot-speech">
                    <p className="vc-dictation-mascot-speech-title">Listen again.</p>
                    <p className="vc-dictation-mascot-speech-sub">You've got this.</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )
      ) : (
        /* MODE: QUESTIONS & SHADOWING */
        <div
          className="rp-grid"
          role="tabpanel"
          id={`practice-panel-${mode}`}
          aria-labelledby={`practice-tab-${mode}`}
        >
          <div className="rp-source">
            {mode === 'questions' ? (
              <ReaderArticleContent
                language="en"
                themeMode={themeMode}
                fontSize={fontSize}
                articleData={articleData}
                vocabClassName={vocabBtnClass}
                onVocabClick={handleVocabClick}
                onMouseUp={handleTextSelection}
                onDoubleClick={handleTextSelection}
              />
            ) : (
              <section
                className="reader-language-sheet rp-transcript"
                data-reader-theme={themeMode}
                aria-label={t('practice_view.shadowing_transcript_aria', 'Shadowing transcript')}
              >
                <h2 className="reader-article-title">{articleData.titleEn}</h2>
                {segment ? (
                  <>
                    <div className="rp-between rp-passage-heading">
                      <span>
                        {t('practice_view.passage_progress', {
                          current: segmentIndex + 1,
                          total: segments.length,
                          defaultValue: `Passage ${segmentIndex + 1} of ${segments.length}`,
                        })}
                      </span>
                      <span>
                        {articleData.shadowingAudioUrl && segment.audioRange
                          ? t('practice_view.article_recording', 'Article recording')
                          : t('practice_view.browser_voice', 'Browser voice')}
                      </span>
                    </div>
                    <div className="rp-sample-controls">
                      <button
                        type="button"
                        className="rp-primary"
                        disabled={recorder.busy}
                        onClick={() => (sample.playing ? sample.stop() : listenToSegment())}
                      >
                        {sample.playing ? <Pause size={17} /> : <Play size={17} />}
                        {sample.playing
                          ? t('practice_view.stop_sample', 'Stop sample')
                          : t('practice_view.play_sample', 'Play sample')}
                      </button>
                      <label>
                        {t('practice_view.speed_label', 'Speed')}
                        <select
                          aria-label={t('practice_view.speed_aria', 'Sample speed')}
                          value={sample.speed}
                          disabled={recorder.busy}
                          onChange={(event) => {
                            sample.stop();
                            sample.setSpeed(Number(event.target.value));
                          }}
                        >
                          <option value={0.75}>0.75×</option>
                          <option value={1}>1×</option>
                          <option value={1.25}>1.25×</option>
                        </select>
                      </label>
                      <button
                        type="button"
                        aria-pressed={sample.repeat}
                        disabled={recorder.busy}
                        onClick={() => sample.setRepeat(!sample.repeat)}
                      >
                        {t('practice_view.repeat_btn', {
                          status: sample.repeat ? 'on' : 'off',
                          defaultValue: `Repeat ${sample.repeat ? 'on' : 'off'}`,
                        })}
                      </button>
                    </div>
                    {sample.error && <p role="alert" className="rp-error">{sample.error}</p>}
                    <div className="rp-segments" aria-label={t('practice_view.passages_aria', 'Article passages')}>
                      {segments.map((item, index) => (
                        <button
                          key={item.id}
                          type="button"
                          className="rp-segment"
                          style={{ fontSize }}
                          disabled={recorder.busy}
                          aria-current={segmentIndex === index ? 'step' : undefined}
                          onClick={() => setSegmentIndex(index)}
                        >
                          <span>{index + 1}</span>
                          <span>{item.text}</span>
                          {recorder.takes[item.id] && (
                            <span className="rp-take-mark">
                              {t('practice_view.recorded_badge', 'Recorded')}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>{t('practice_view.no_transcript', 'No English transcript is available for this article yet.')}</p>
                )}
              </section>
            )}
          </div>
          <div className="rp-sidebar">
            {fullAudioUrl && (
              <div className="rp-article-audio">
                <label htmlFor="practice-article-audio">
                  {t('practice_view.listen_article_label', 'Listen to the article')}
                </label>
                <audio
                  ref={fullPlayer}
                  id="practice-article-audio"
                  aria-label={t('practice_view.article_recording_aria', 'Article recording')}
                  controls
                  src={fullAudioUrl}
                  preload="metadata"
                />
              </div>
            )}
            {mode === 'questions' ? (
              <PracticeQuestions
                questions={articleData.questions || []}
                index={questionIndex}
                onChangeIndex={setQuestionIndex}
                answers={answers}
                onAnswer={(id, value) => setAnswers((previous) => ({ ...previous, [id]: value }))}
                onTryDictation={() => onChangeMode('dictation')}
              />
            ) : segment ? (
              <>
                <PracticeShadowing
                  segment={segment}
                  recorder={recorder}
                  onListen={listenToSegment}
                  onStopSample={sample.stop}
                  total={segments.length}
                />
                <div className="rp-navigation rp-passage-navigation">
                  <button
                    type="button"
                    disabled={recorder.busy || segmentIndex === 0}
                    onClick={() => setSegmentIndex((index) => index - 1)}
                  >
                    <ChevronLeft size={15} /> {t('practice_view.previous_passage', 'Previous passage')}
                  </button>
                  <button
                    type="button"
                    disabled={recorder.busy || segmentIndex >= segments.length - 1}
                    onClick={() => setSegmentIndex((index) => index + 1)}
                  >
                    {t('practice_view.next_passage', 'Next passage')} <ChevronRight size={15} />
                  </button>
                </div>
              </>
            ) : (
              <section className="rp-activity">
                <BookOpen size={28} />
                <h2>{t('practice_view.transcript_needed_title', 'A transcript is needed')}</h2>
                <p>
                  {t(
                    'practice_view.transcript_needed_desc',
                    'Choose another article to practise dictation or shadowing.'
                  )}
                </p>
                <button type="button" onClick={onBackToReading}>
                  {t('practice_view.back_to_reading', 'Back to reading')}
                </button>
              </section>
            )}
          </div>
        </div>
      )}

      <InPlaceDictionaryPopup
        isOpen={popupState.isOpen}
        vocab={popupState.vocab}
        position={popupState.position}
        onClose={closeDictionary}
        themeMode={themeMode}
      />
    </div>
  );
}
