import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS } from '@/routes/paths';
import { VietnamMapAiScreen } from '../components/map-ai/VietnamMapAiScreen';
import { LiveAPIProvider } from '../components/map-ai/contexts/LiveAPIContext';
import { useReaderHandoff } from '../lib/reader-handoff';
import { ForestSpirit } from '@/features/companion/ForestSpirit';

export default function AiWorkspacePage() {
  const { t } = useTranslation('playground');
  const context = useReaderHandoff(state => state.context);
  return (
    <main className="ai-workspace-page" data-theme="light">
      <header className="ai-workspace-page-header">
        <Link to={context?.readerUrl || PATHS.home} className="ai-workspace-back">
          <ArrowLeft size={18} />
          <span>{context ? t('playground.workspace.reader_link') : t('playground.workspace.study_room_link')}</span>
        </Link>
        <div className="ai-workspace-page-title">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#8a9a6f] bg-[#fffaf0] shadow-[0_2px_0_-1px_#c9d6b0]">
            <img
              src="/brand/viecultures-mascot-logo.png"
              alt=""
              aria-hidden="true"
              draggable={false}
              className="block h-full w-full object-cover select-none"
            />
          </span>
          <h2 className="truncate font-serif text-[16px] font-bold italic leading-tight text-[#2f4a2c]">
            {t('playground.companion.header.title')}
          </h2>
          <span>{t('playground.workspace.subtitle')}</span>
        </div>
        <Link to={PATHS.playground} className="ai-workspace-lab">
          <FlaskConical size={17} />
          <span>{t('playground.workspace.playground_link')}</span>
        </Link>
      </header>
      <div className="ai-workspace-page-content">
        <LiveAPIProvider activeView="chat"><VietnamMapAiScreen /></LiveAPIProvider>
      </div>
    </main>
  );
}
