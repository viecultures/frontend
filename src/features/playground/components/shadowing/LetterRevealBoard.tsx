import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Eye,
  ArrowRight,
  Repeat,
  CheckCircle2,
} from 'lucide-react';
import {
  useLetterRevealDictation,
  type DictationState,
} from '../../hooks/useLetterRevealDictation';
import { LetterTileGrid } from './LetterTileGrid';
import { TurtleProgressBar } from './TurtleProgressBar';
import './dictation-reveal.css';

interface LetterRevealBoardProps {
  sentenceId: string;
  sentenceText: string;
  passageIndex: number;
  totalPassages: number;
  isPlaying?: boolean;
  isRepeating?: boolean;
  onPlaySample?: () => void;
  onRepeatToggle?: () => void;
  onRepeatSample?: () => void;
  onNextPassage?: () => void;
  onSpeedChange?: (speed: number) => void;
  currentSpeed?: number;
  initialState?: DictationState | null;
  onStateChange?: (state: DictationState) => void;
}

export const LetterRevealBoard: React.FC<LetterRevealBoardProps> = ({
  sentenceId,
  sentenceText,
  passageIndex,
  totalPassages,
  isPlaying = false,
  isRepeating = false,
  onPlaySample,
  onRepeatToggle,
  onRepeatSample,
  onNextPassage,
  onSpeedChange,
  currentSpeed = 1,
  initialState,
  onStateChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);
  const skipNextInputRef = useRef(false);
  const backspaceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Clear pending Backspace timer on unmount
  useEffect(() => {
    return () => {
      if (backspaceTimerRef.current) {
        clearTimeout(backspaceTimerRef.current);
      }
    };
  }, []);

  const {
    state,
    tokenized,
    isCompleted,
    openedTypeableCount,
    totalTypeableCount,
    progressPercent,
    accuracyPercent,
    handleType,
    handleBackspace,
    handleHintOne,
    handleRevealAll,
    handleReset,
  } = useLetterRevealDictation(sentenceId, sentenceText, initialState, onStateChange);

  // Trigger shake animation on error
  useEffect(() => {
    if (state.errorSequence > 0) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 320);
      return () => clearTimeout(timer);
    }
  }, [state.errorSequence]);

  // Focus input automatically when not completed
  const focusInput = useCallback(() => {
    if (!isCompleted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCompleted]);

  useEffect(() => {
    focusInput();
  }, [sentenceId, focusInput]);

  // Input event handling for desktop & mobile virtual keyboards with IME Telex support
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    // If an input arrives, cancel any pending Backspace because it was synthesized by UniKey/IME
    if (backspaceTimerRef.current) {
      clearTimeout(backspaceTimerRef.current);
      backspaceTimerRef.current = null;
    }

    const nativeEvent = e.nativeEvent as InputEvent;
    // Guard: Intermediate composition must never evaluate, increment errors, or advance cursor
    if (isComposingRef.current || nativeEvent?.isComposing) {
      return;
    }
    // Guard: Deduplicate compositionend and subsequent input event
    if (skipNextInputRef.current) {
      skipNextInputRef.current = false;
      e.currentTarget.value = '';
      return;
    }
    const value = e.currentTarget.value;
    if (value) {
      for (const char of value.normalize('NFC')) {
        handleType(char);
      }
      e.currentTarget.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Let IME handle keystrokes (including composition backspace) during composition
    if (isComposingRef.current || (e.nativeEvent as KeyboardEvent)?.isComposing) {
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      // Micro-debounce Backspace (35ms) to differentiate user Backspace from UniKey/IME synthetic Backspace.
      // UniKey sends Backspace immediately followed (<15ms) by the composite letter (e.g. Backspace + 'ô' for 'oo')
      if (backspaceTimerRef.current) {
        clearTimeout(backspaceTimerRef.current);
      }
      backspaceTimerRef.current = setTimeout(() => {
        handleBackspace();
        backspaceTimerRef.current = null;
      }, 35);
      return;
    }

    if (e.key === ' ' || e.code === 'Space') {
      // Space is a safe no-op
      e.preventDefault();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (isCompleted && onNextPassage) {
        onNextPassage();
      }
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    if (backspaceTimerRef.current) {
      clearTimeout(backspaceTimerRef.current);
      backspaceTimerRef.current = null;
    }
    isComposingRef.current = false;
    const text = e.data;
    if (text) {
      for (const char of text.normalize('NFC')) {
        handleType(char);
      }
      skipNextInputRef.current = true;
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const isLastPassage = passageIndex === totalPassages - 1;

  return (
    <div className="vc-dictation-board compact" role="region" aria-label="Bảng luyện chép chính tả">
      {/* Hidden Focusable Input for Mobile & Desktop */}
      {!isCompleted && (
        <input
          ref={inputRef}
          type="text"
          className="vc-dictation-hidden-input"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="off"
          inputMode="text"
          aria-label="Khu vực nhận phím gõ cho bài tập chép chính tả"
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onPaste={handlePaste}
        />
      )}

      {/* Compact Header: Title + Passage indicator */}
      <div className="vc-dictation-header compact">
        <div className="vc-dictation-title-group">
          <span className="vc-dictation-title-icon">
            <Headphones size={18} />
          </span>
          <h2 className="vc-dictation-title">Listen. Type. Reveal.</h2>
        </div>
        <span className="vc-dictation-passage-badge">
          Passage {passageIndex + 1} of {totalPassages}
        </span>
      </div>

      {/* Audio Toolbar sát vùng nhập */}
      <div className="vc-dictation-audio-bar">
        <button
          type="button"
          className={`vc-dictation-btn-play ${isPlaying ? 'playing' : ''}`}
          onClick={onPlaySample}
          aria-label={isPlaying ? 'Dừng phát đoạn đọc' : 'Play passage'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
          <span>{isPlaying ? 'Pause' : 'Play passage'}</span>
        </button>

        <div className="vc-dictation-speed-group" role="group" aria-label="Tốc độ phát">
          {[0.75, 1, 1.25].map((spd) => (
            <button
              key={spd}
              type="button"
              className={`vc-dictation-speed-btn ${currentSpeed === spd ? 'active' : ''}`}
              onClick={() => onSpeedChange && onSpeedChange(spd)}
            >
              {spd}x
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`vc-dictation-btn-repeat ${isRepeating ? 'active' : ''}`}
          onClick={onRepeatToggle || onRepeatSample}
          aria-label={`Lặp lại đoạn: ${isRepeating ? 'Đang bật' : 'Đang tắt'}`}
          title="Repeat toggle"
        >
          <Repeat size={13} />
          <span>Repeat</span>
        </button>
      </div>

      {/* Tier 1: Sentence Preview with revealed words and dashed blanks */}
      <div className="vc-dictation-sentence-preview" aria-live="polite">
        <div className="vc-dictation-preview-text">
          {tokenized.words.map((word, wIdx) => (
            <span key={word.wordIndex} className="vc-dictation-preview-word">
              {word.tokens.map((token) => {
                if (token.isSpace) return null;
                if (token.isPunctuation) {
                  return (
                    <span key={token.id} className="vc-dictation-preview-punct">
                      {token.rawChar}
                    </span>
                  );
                }
                const isOpened =
                  state.openedMap[token.tokenIndex] !== undefined ||
                  state.status === 'answer-revealed';
                if (isOpened) {
                  return (
                    <span key={token.id} className="vc-dictation-preview-char revealed">
                      {token.rawChar}
                    </span>
                  );
                }
                return (
                  <span key={token.id} className="vc-dictation-preview-dash" aria-hidden="true">
                    _
                  </span>
                );
              })}
              {wIdx < tokenized.words.length - 1 && ' '}
            </span>
          ))}
        </div>
        <p className="vc-dictation-preview-caption">
          Letters appear as you type correctly.
        </p>
      </div>

      {/* Main Interactive Zone: Letter Tile Grid */}
      <LetterTileGrid
        tokenized={tokenized}
        cursorIndex={state.cursorIndex}
        openedMap={state.openedMap}
        isShaking={isShaking}
        isAnswerRevealed={state.status === 'answer-revealed'}
        onZoneClick={focusInput}
      />

      {/* When completed or answer revealed: Display Full Natural Text for reading over */}
      {isCompleted && (
        <div className="vc-dictation-full-passage-card">
          <div className="vc-dictation-full-passage-header">
            <span className={`vc-dictation-status-pill ${state.status}`}>
              {state.status === 'completed-self'
                ? '✓ Completed'
                : state.status === 'completed-hinted'
                ? '★ Completed with hints'
                : '👁 Answer revealed'}
            </span>
            {accuracyPercent !== null && (
              <span className="vc-dictation-accuracy-pill">
                Accuracy: {accuracyPercent}%
              </span>
            )}
          </div>
          <blockquote className="vc-dictation-full-passage-text">
            "{sentenceText}"
          </blockquote>
        </div>
      )}

      {/* Slim Progress Track with Turtle Mascot */}
      <TurtleProgressBar
        openedCount={openedTypeableCount}
        totalCount={totalTypeableCount}
        progressPercent={progressPercent}
        status={state.status}
        accuracyPercent={accuracyPercent}
      />

      {/* Action Bar (Buttons within same viewport) */}
      <div className="vc-dictation-action-bar compact">
        <div className="vc-dictation-left-actions">
          <button
            type="button"
            className="vc-dictation-action-btn"
            onClick={handleHintOne}
            disabled={isCompleted}
            title="Mở thêm 1 ký tự tiếp theo"
          >
            <Lightbulb size={14} />
            <span>Hint 1 letter</span>
          </button>

          <button
            type="button"
            className="vc-dictation-action-btn"
            onClick={handleRevealAll}
            disabled={state.status === 'answer-revealed'}
            title="Mở toàn bộ câu để xem đáp án"
          >
            <Eye size={14} />
            <span>Reveal answer</span>
          </button>

          <button
            type="button"
            className="vc-dictation-action-btn"
            onClick={handleReset}
            title="Làm lại đoạn này từ đầu"
          >
            <RotateCcw size={14} />
            <span>Start over</span>
          </button>
        </div>

        {onNextPassage && (
          <button
            type="button"
            className={`vc-dictation-btn-next ${!isCompleted ? 'skip' : ''}`}
            onClick={onNextPassage}
          >
            <span>
              {isCompleted
                ? isLastPassage
                  ? 'Finish lesson'
                  : 'Next passage'
                : 'Next passage'}
            </span>
            {isCompleted && isLastPassage ? (
              <CheckCircle2 size={15} />
            ) : (
              <ArrowRight size={15} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
