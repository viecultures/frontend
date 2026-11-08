import { useTranslation } from 'react-i18next';

interface HomeGreetingHeaderProps {
  userName?: string;
  hasHistory: boolean;
  streakDays?: number;
  completedGoals?: number;
  totalGoals?: number;
}

export function HomeGreetingHeader({
  userName = 'Learner',
  hasHistory,
}: HomeGreetingHeaderProps) {
  const { t } = useTranslation('home');
  const greetingSentence = hasHistory
    ? t('greeting.welcome_back', { name: userName, defaultValue: `Chào ${userName}, mừng bạn quay lại!` })
    : t('greeting.welcome', { name: userName, defaultValue: `Chào ${userName}, chúc một buổi học đầy cảm hứng.` });

  return (
    <header className="home-greeting-row">
      <div className="home-greeting-copy"><h1 className="home-greeting-title">{greetingSentence}</h1><p>{t('quick.greeting_subtitle')}</p></div>
    </header>
  );
}

// Backward-compatibility export
export const HomeGreetingControls = HomeGreetingHeader;
