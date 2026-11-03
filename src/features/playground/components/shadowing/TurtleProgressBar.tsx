import React, { useRef, useState, useEffect } from 'react';
import { Flag } from 'lucide-react';
import type { DictationStatus } from '../../hooks/useLetterRevealDictation';
import turtleMascot32 from '@/assets/cursor/turtle_cursor_32.png';

interface TurtleProgressBarProps {
  openedCount: number;
  totalCount: number;
  progressPercent: number;
  status: DictationStatus;
  accuracyPercent?: number | null;
}

// 32x32 image with 4px left transparent padding, visual turtle width is 24px
const TURTLE_VISUAL_WIDTH = 24;
const TURTLE_PADDING_LEFT = 4;
const FLAG_WIDTH = 18;

export const TurtleProgressBar: React.FC<TurtleProgressBarProps> = ({
  openedCount,
  totalCount,
  progressPercent,
  status,
  accuracyPercent,
}) => {
  const trackWrapRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    const el = trackWrapRef.current;
    if (!el) return;
    const updateWidth = () => {
      setTrackWidth(el.clientWidth);
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const progressRatio = totalCount > 0 ? Math.min(1, Math.max(0, openedCount / totalCount)) : 0;
  const railWidth = Math.max(0, trackWidth - FLAG_WIDTH);
  const maxTravel = Math.max(0, railWidth - TURTLE_VISUAL_WIDTH);
  const visualTurtleX = progressRatio * maxTravel;
  const turtleImageLeft = visualTurtleX - TURTLE_PADDING_LEFT;

  const getSubText = () => {
    if (status === 'completed-self') {
      return accuracyPercent !== null && accuracyPercent !== undefined
        ? `Tự hoàn thành · Độ chính xác ${accuracyPercent}%`
        : 'Tự hoàn thành · Xuất sắc!';
    }
    if (status === 'completed-hinted') {
      return accuracyPercent !== null && accuracyPercent !== undefined
        ? `Hoàn thành có trợ giúp · Độ chính xác ${accuracyPercent}%`
        : 'Hoàn thành có trợ giúp';
    }
    if (status === 'answer-revealed') {
      return `Đã xem đáp án · Tiến độ tự làm: ${openedCount} / ${totalCount}`;
    }
    if (status === 'in-progress') {
      return 'Keep going, one letter at a time.';
    }
    return 'Click here and start typing';
  };

  return (
    <div className="vc-dictation-progress-section" aria-label="Tiến độ hoàn thành câu">
      <div className="vc-dictation-stats-line">
        <span className="vc-dictation-stats-bold">
          {openedCount} / {totalCount} letters revealed ({progressPercent}%)
        </span>
        <span className="vc-dictation-stats-sub">{getSubText()}</span>
      </div>

      <div ref={trackWrapRef} className="vc-dictation-track-wrap">
        <div className="vc-dictation-track-rail" style={{ width: `${railWidth}px` }}>
          <div
            className="vc-dictation-track-fill"
            style={{ width: `${progressRatio * 100}%` }}
          />
        </div>

        {/* Mascot Turtle: 0% aligns with rail start (0px), 100% touches the flag at railWidth */}
        <img
          src={turtleMascot32}
          alt="Rùa VieCultures"
          className="vc-dictation-turtle-mascot"
          style={{
            left: `${turtleImageLeft}px`,
            width: '32px',
            height: '32px',
            transform: 'none',
          }}
        />

        {/* Goal Flag at the end of track */}
        <div className="vc-dictation-flag" title="Đích đến" style={{ width: `${FLAG_WIDTH}px` }}>
          <Flag size={16} fill={progressPercent >= 100 ? 'var(--color-antique-gold)' : 'none'} />
        </div>
      </div>
    </div>
  );
};
