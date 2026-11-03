import { useState, useCallback } from 'react';
import { Check } from 'lucide-react';
import type { ShadowingLesson } from '../../types/shadowing';
import { LetterRevealBoard } from './LetterRevealBoard';
import './dictation-reveal.css';

interface Props {
  lesson: ShadowingLesson;
  ready: boolean;
  onSample(start: number, end: number): void;
  onStop(): void;
}

export function ShadowingDictationPanel({ lesson, ready, onSample, onStop }: Props) {
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [completedPassages, setCompletedPassages] = useState<Set<number>>(new Set());

  const sentence = lesson.sentences[index] ?? lesson.sentences[0];

  const move = useCallback((next: number) => {
    onStop();
    setIndex(next);
  }, [onStop]);

  const handlePlaySample = useCallback(() => {
    if (!ready || !sentence) return;
    onSample(sentence.start, sentence.start + sentence.duration);
  }, [ready, sentence, onSample]);

  const handleNextPassage = useCallback(() => {
    // Mark current passage as completed in session
    setCompletedPassages((prev) => new Set(prev).add(index));

    if (index < lesson.sentences.length - 1) {
      move(index + 1);
    }
  }, [index, lesson.sentences.length, move]);

  const totalPassages = lesson.sentences.length;
  const sessionProgress = totalPassages > 0
    ? Math.round((completedPassages.size / totalPassages) * 100)
    : 0;

  return (
    <section className="vc-dictation-workspace" aria-label="Luyện tập chép chính tả Dictation">
      <div className="vc-dictation-columns">
        {/* Main Practice Board (Left) */}
        {sentence && (
          <LetterRevealBoard
            key={sentence.id}
            sentenceId={sentence.id}
            sentenceText={sentence.text}
            passageIndex={index}
            totalPassages={totalPassages}
            onPlaySample={handlePlaySample}
            onRepeatSample={handlePlaySample}
            onNextPassage={handleNextPassage}
            onSpeedChange={setSpeed}
            currentSpeed={speed}
          />
        )}

        {/* Sidebar Status & Passage Directory (Right) */}
        <aside className="vc-dictation-sidebar">
          {/* Session Overview Card */}
          <div className="vc-dictation-side-card">
            <div className="vc-dictation-side-heading">
              <span>Your session</span>
              <span>
                {completedPassages.size} / {totalPassages} completed
              </span>
            </div>
            <div className="vc-dictation-track-rail">
              <div
                className="vc-dictation-track-fill"
                style={{ width: `${sessionProgress}%` }}
              />
            </div>
          </div>

          {/* Passages List Card */}
          <div className="vc-dictation-side-card">
            <div className="vc-dictation-side-heading">
              <span>Passages</span>
            </div>
            <div className="vc-dictation-passages-list">
              {lesson.sentences.map((item, idx) => {
                const isDone = completedPassages.has(idx);
                const isCurrent = idx === index;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`vc-dictation-passage-item ${isCurrent ? 'active' : ''}`}
                    onClick={() => move(idx)}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    <div>
                      <span className="vc-dictation-passage-num">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>
                        {isDone ? 'Completed' : isCurrent ? 'Now practicing' : 'Not started'}
                      </span>
                    </div>

                    {isDone ? (
                      <span className="vc-dictation-passage-badge-status completed">
                        <Check size={12} />
                        <span>Completed</span>
                      </span>
                    ) : isCurrent ? (
                      <span className="vc-dictation-passage-badge-status active">
                        Now practicing
                      </span>
                    ) : (
                      <span className="vc-dictation-passage-badge-status pending">
                        Not started
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mascot Encouragement Card */}
          <div className="vc-dictation-mascot-card">
            <img
              src="/brand/viecultures-mascot-logo.png"
              alt="Rùa Nón Lá VieCultures"
              className="vc-dictation-mascot-img"
            />
            <div className="vc-dictation-mascot-bubble">
              <div>Listen again.</div>
              <div style={{ fontWeight: 400, opacity: 0.85 }}>You've got this.</div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
