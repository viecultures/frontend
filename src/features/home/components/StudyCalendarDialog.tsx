import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { localDateKey, readStudyCalendar, type StudyCalendar } from '../lib/learningCalendarStorage';

interface StudyCalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  account: string;
  initialDate?: Date;
  calendarData?: StudyCalendar;
}

function intensity(seconds: number): 'none' | 'light' | 'medium' | 'deep' {
  if (seconds <= 0) return 'none';
  if (seconds < 10 * 60) return 'light';
  if (seconds < 30 * 60) return 'medium';
  return 'deep';
}

export function StudyCalendarDialog({
  isOpen,
  onClose,
  account,
  initialDate = new Date(),
  calendarData: propCalendarData,
}: StudyCalendarDialogProps) {
  const { t, i18n } = useTranslation('home');
  const isVi = i18n.language === 'vi';
  const locale = isVi ? 'vi-VN' : 'en-GB';

  const [currentMonth, setCurrentMonth] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [selectedKey, setSelectedKey] = useState(() => localDateKey(initialDate));
  const [calendarData, setCalendarData] = useState(() => propCalendarData || readStudyCalendar(account));

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCalendarData(propCalendarData || readStudyCalendar(account));
      setCurrentMonth(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
      setSelectedKey(localDateKey(initialDate));
      closeButtonRef.current?.focus();
    }
  }, [isOpen, account, initialDate, propCalendarData]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const today = new Date();
  const todayKey = localDateKey(today);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthName = currentMonth.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });

  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const canGoNext =
    year < today.getFullYear() ||
    (year === today.getFullYear() && month < today.getMonth());

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    if (!canGoNext) return;
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const weekdayLabels = isVi
    ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Detail calculation for selected day
  const selectedDayRecord = calendarData[selectedKey] || { reading: 0, vocabulary: 0 };
  const totalSeconds = selectedDayRecord.reading + selectedDayRecord.vocabulary;
  const totalMinutes = Math.floor(totalSeconds / 60);

  const selectedDateObj = new Date(`${selectedKey}T12:00:00`);
  const selectedDateLabel = selectedDateObj.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
  });

  let detailString = '';
  if (totalMinutes > 0) {
    const readingMin = Math.floor(selectedDayRecord.reading / 60);
    const vocabMin = Math.floor(selectedDayRecord.vocabulary / 60);
    const minStr = t('study_calendar.minutes_other', {
      count: totalMinutes,
      defaultValue: `${totalMinutes} min studied`,
    });
    const minUnit = isVi ? 'ph' : 'm';
    const parts: string[] = [];
    if (readingMin > 0) parts.push(`${t('study_calendar.reading', 'Reading')}: ${readingMin}${minUnit}`);
    if (vocabMin > 0) parts.push(`${t('study_calendar.vocabulary', 'Vocabulary')}: ${vocabMin}${minUnit}`);
    detailString = `${selectedDateLabel} · ${minStr}${parts.length ? ` (${parts.join(', ')})` : ''}`;
  } else {
    detailString = `${selectedDateLabel} · ${t('study_calendar.empty', 'No activity yet')}`;
  }

  return (
    <div
      className="home-dialog-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="home-dialog home-calendar-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="month-calendar-title"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="home-dialog-close"
          onClick={onClose}
          aria-label={t('common:close', 'Close')}
        >
          <X size={18} aria-hidden="true" />
        </button>

        <span className="home-eyebrow">
          {t('study_calendar.eyebrow', 'YOUR LEARNING JOURNEY')}
        </span>

        <div className="home-month-modal-head">
          <h2 id="month-calendar-title" className="home-month-modal-title">
            {monthName}
          </h2>
          <div className="home-month-modal-controls">
            <button
              type="button"
              className="home-month-control-btn"
              onClick={handlePrevMonth}
              aria-label={t('study_calendar.previous', 'Previous month')}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="home-month-control-btn"
              onClick={handleNextMonth}
              disabled={!canGoNext}
              aria-label={t('study_calendar.next', 'Next month')}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="home-month-modal-grid">
          {weekdayLabels.map((label, index) => (
            <small key={`header-${index}`} className="home-modal-weekday-header">
              {label}
            </small>
          ))}

          {Array.from({ length: firstWeekday }, (_, i) => (
            <span key={`blank-${i}`} aria-hidden="true" />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const dayNum = i + 1;
            const dayDate = new Date(year, month, dayNum);
            const key = localDateKey(dayDate);
            const isToday = key === todayKey;
            const isSelected = key === selectedKey;
            const isFuture = dayDate.getTime() > today.setHours(23, 59, 59, 999);

            const rec = calendarData[key] || { reading: 0, vocabulary: 0 };
            const secs = rec.reading + rec.vocabulary;
            const lvl = intensity(secs);

            return (
              <button
                key={key}
                type="button"
                disabled={isFuture}
                onClick={() => setSelectedKey(key)}
                className={`home-month-day-cell level-${lvl} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                aria-label={`${dayNum} ${monthName}, ${Math.floor(secs / 60)} minutes studied`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>

        <p className="home-calendar-day-detail-line" role="status">
          {detailString}
        </p>

        <p className="home-subtle-hint">
          {t('study_calendar.color_note', 'Darker green means more time spent learning.')}
        </p>
      </div>
    </div>
  );
}
