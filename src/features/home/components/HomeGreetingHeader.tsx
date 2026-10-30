import { useTranslation } from 'react-i18next';
import { Sparkles, Target } from 'lucide-react';

interface HomeGreetingHeaderProps {
  userName?: string;
  hasHistory: boolean;
  streakDays: number;
  completedGoals: number;
  totalGoals?: number;
}

export function HomeGreetingHeader({
  userName = 'Learner',
  hasHistory,
  streakDays,
  completedGoals,
  totalGoals = 2,
}: HomeGreetingHeaderProps) {
  const { t } = useTranslation('home');
  const greetingWord = hasHistory
    ? t('greeting.welcome_back', { name: userName, defaultValue: `Good to see you, ${userName}.` })
    : t('greeting.welcome', { name: userName, defaultValue: `Good to see you, ${userName}.` });

  const streakText = streakDays > 0
    ? t('greeting.streak_days', { count: streakDays, defaultValue: `${streakDays}-day streak` })
    : t('greeting.streak_first_day', 'Your first day');

  const goalText = t('greeting.today_goals', {
    done: completedGoals,
    total: totalGoals,
    defaultValue: `Today · ${completedGoals}/${totalGoals} goals`,
  });

  return (
    <div className="home-greeting-row">
      <div className="home-greeting-copy">
        <span className="home-eyebrow">
          {t('greeting.eyebrow', 'READY WHEN YOU ARE')}
        </span>
        <h1 className="home-greeting-title">{greetingWord}</h1>
        <p className="home-greeting-tagline">
          {t('greeting.tagline', 'Engrave words, Preserve cultures.')}
        </p>
      </div>

      <div className="home-status-chips">
        <span className="home-status-chip home-status-streak" title={streakText}>
          <Sparkles size={14} className="home-chip-icon" aria-hidden="true" />
          <span>{streakText}</span>
        </span>
        <span className="home-status-chip home-status-goal" title={goalText}>
          <Target size={14} className="home-chip-icon" aria-hidden="true" />
          <span>{goalText}</span>
        </span>
      </div>
    </div>
  );
}

// Backward-compatibility export
export const HomeGreetingControls = HomeGreetingHeader;
