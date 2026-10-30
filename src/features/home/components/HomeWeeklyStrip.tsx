import { useState, useMemo } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { localDateKey, readStudyCalendar } from '../lib/learningCalendarStorage';
import { StudyCalendarDialog } from './StudyCalendarDialog';

interface HomeWeeklyStripProps {
  account: string;
}

export function HomeWeeklyStrip({ account }: HomeWeeklyStripProps) {
  const { t, i18n } = useTranslation('home');
  const isVi = i18n.language === 'vi';
  const locale = isVi ? 'vi-VN' : 'en-GB';

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [targetDate, setTargetDate] = useState(() => new Date());

  const calendarData = useMemo(() => readStudyCalendar(account), [account]);

  // Compute 7 days of the current week (Monday to Sunday) in the user's timezone
  const { weekDays, weekTotalMinutes, weekStoriesCount } = useMemo(() => {
    const now = new Date();
    const currentDayOfWeek = (now.getDay() + 6) % 7; // 0 = Mon, 6 = Sun

    // Monday of this week
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - currentDayOfWeek);

    let totalSeconds = 0;
    let storiesCount = 0;

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const key = localDateKey(d);
      const record = calendarData[key] || { reading: 0, vocabulary: 0 };
      const daySeconds = record.reading + record.vocabulary;

      totalSeconds += daySeconds;
      if (record.reading > 0) {
        storiesCount += 1;
      }

      const isToday = key === localDateKey(now);
      const isStudied = daySeconds > 0;
      // Compare without time component
      const isFuture = d.setHours(0, 0, 0, 0) > new Date(now).setHours(0, 0, 0, 0);

      return {
        date: d,
        key,
        dayNumber: d.getDate(),
        isToday,
        isStudied,
        isFuture,
      };
    });

    return {
      weekDays: days,
      weekTotalMinutes: Math.floor(totalSeconds / 60),
      weekStoriesCount: storiesCount,
    };
  }, [calendarData]);

  const weekdayLabels = isVi
    ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleOpenDay = (dayDate: Date) => {
    setTargetDate(dayDate);
    setIsCalendarOpen(true);
  };

  const summaryText = weekTotalMinutes > 0
    ? (weekStoriesCount === 1
        ? t('weekly_strip.summary_singular', { minutes: weekTotalMinutes, defaultValue: `${weekTotalMinutes} min · 1 story this week` })
        : t('weekly_strip.summary', { minutes: weekTotalMinutes, stories: weekStoriesCount, defaultValue: `${weekTotalMinutes} min · ${weekStoriesCount} stories this week` }))
    : t('weekly_strip.summary_empty', '0 min · Start your learning rhythm today');

  return (
    <>
      <section className="home-week-strip" aria-label={t('weekly_strip.eyebrow', 'YOUR PROGRESS')}>
        {/* Left summary */}
        <div className="home-week-summary">
          <span className="home-eyebrow">
            {t('weekly_strip.eyebrow', 'YOUR PROGRESS')}
          </span>
          <h2 className="home-week-title">
            {t('weekly_strip.title', 'A little, every day.')}
          </h2>
          <p className="home-week-totals">{summaryText}</p>
        </div>

        {/* Center 7-day strip */}
        <div className="home-compact-week">
          {weekDays.map((day, index) => {
            const label = weekdayLabels[index];
            const dateStr = day.date.toLocaleDateString(locale, {
              day: 'numeric',
              month: 'short',
            });

            return (
              <div
                key={day.key}
                className={`home-compact-day ${day.isStudied ? 'is-studied' : ''} ${day.isToday ? 'is-today' : ''}`}
              >
                <span className="home-compact-day-label">{label}</span>
                <button
                  type="button"
                  disabled={day.isFuture}
                  onClick={() => handleOpenDay(day.date)}
                  className="home-compact-day-btn"
                  aria-label={`${dateStr}, ${day.isStudied ? 'studied' : 'no activity'}`}
                  title={`${dateStr}: ${day.isStudied ? 'Studied' : 'No activity'}`}
                >
                  {day.isStudied ? (
                    <Check size={14} className="home-day-check-icon" aria-hidden="true" />
                  ) : (
                    <span>{day.dayNumber}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Right action button */}
        <button
          type="button"
          className="home-calendar-open-btn"
          onClick={() => {
            setTargetDate(new Date());
            setIsCalendarOpen(true);
          }}
        >
          <span>{t('weekly_strip.view_calendar', 'View calendar')}</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </button>
      </section>

      {/* Month Study Calendar Dialog */}
      <StudyCalendarDialog
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        account={account}
        initialDate={targetDate}
      />
    </>
  );
}
