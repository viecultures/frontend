import { useTranslation } from 'react-i18next';

interface HomeGreetingControlsProps {
  userName?: string;
  hasHistory: boolean;
}

export function HomeGreetingControls({ userName = 'Learner', hasHistory }: HomeGreetingControlsProps) {
  const { t } = useTranslation('home');
  const greetingWord = hasHistory ? t('greeting.welcome_back', 'Welcome back') : t('greeting.welcome', 'Welcome');
  const displayName = userName ? userName.split(' ')[0] : t('greeting.default_user', 'Learner');

  return <div className="home-room-greeting">
    <div>
      <p className="home-room-eyebrow">{t('greeting.eyebrow', 'YOUR CULTURE STUDY ROOM')}</p>
      <h1>{greetingWord}, {displayName}.</h1>
      <p>{t('greeting.tagline', 'A little English. A little closer to Vietnam.')}</p>
    </div>
  </div>;
}
