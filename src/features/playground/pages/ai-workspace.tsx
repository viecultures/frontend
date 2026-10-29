import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ArrowLeft, Bot, FlaskConical } from 'lucide-react';
import { PATHS } from '@/routes/paths';
import { VietnamMapAiScreen } from '../components/map-ai/VietnamMapAiScreen';
import { LiveAPIProvider } from '../components/map-ai/contexts/LiveAPIContext';
import { useSettings } from '../components/map-ai/lib/state';
import { useReaderHandoff } from '../lib/reader-handoff';

export default function AiWorkspacePage() {
  const theme = useSettings(state => state.theme);
  const context = useReaderHandoff(state => state.context);
  return (
    <main className={`ai-workspace-page${theme === 'dark' ? ' dark' : ''}`} data-theme={theme}>
      <header className="ai-workspace-page-header">
        <Link to={context?.readerUrl || PATHS.home} className="ai-workspace-back"><ArrowLeft size={18} /><span>{context ? 'Reader' : 'Study room'}</span></Link>
        <div className="ai-workspace-page-title"><Bot size={21} /><h1>AI workspace</h1><span>Speaking practice</span></div>
        <Link to={PATHS.playground} className="ai-workspace-lab"><FlaskConical size={17} /><span>Playground</span></Link>
      </header>
      <div className="ai-workspace-page-content">
        <LiveAPIProvider activeView="chat"><VietnamMapAiScreen /></LiveAPIProvider>
      </div>
    </main>
  );
}
