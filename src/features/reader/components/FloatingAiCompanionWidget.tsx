import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Crown, LayoutGrid, Maximize2, Send, X } from 'lucide-react';
import { getStoredUser, getIsProUser } from '@/utils/auth-storage';
import { PATHS, paths } from '@/routes/paths';
import type { VocabItem } from '@/data/readerData';
import { ReaderCompanionTools } from './ReaderCompanionTools';
import { ReaderCompanionMessages, type CompanionMessage } from './ReaderCompanionMessages';
import './reader-companion.css';
import { useReaderHandoff } from '@/features/playground/lib/reader-handoff';

interface FloatingAiCompanionWidgetProps {
  articleTitle?: string;
  articleId?: string;
  articleSummary?: string;
  level?: string;
  vocabulary?: VocabItem[];
  onOpenVocabulary?: () => void;
  themeMode?: 'paper' | 'dark';
  defaultOpen?: boolean;
}

export function FloatingAiCompanionWidget({
  articleTitle = 'Your reading story', articleId, articleSummary, level,
  vocabulary = [], onOpenVocabulary, themeMode = 'paper', defaultOpen = false,
}: FloatingAiCompanionWidgetProps) {
  const navigate = useNavigate();
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [user, setUser] = useState(getStoredUser);
  const [isPro, setIsPro] = useState(getIsProUser);
  const [messages, setMessages] = useState<CompanionMessage[]>([]);
  const [showTools, setShowTools] = useState(true);
  const [input, setInput] = useState('');
  const launcherRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateAccess() { setUser(getStoredUser()); setIsPro(getIsProUser()); }
    window.addEventListener('auth:change', updateAccess);
    window.addEventListener('subscription:change', updateAccess);
    return () => {
      window.removeEventListener('auth:change', updateAccess);
      window.removeEventListener('subscription:change', updateAccess);
    };
  }, []);

  useEffect(() => { if (isOpen) headingRef.current?.focus(); }, [isOpen]);
  useEffect(() => {
    if (!showTools && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, showTools, isOpen]);

  function closePanel() { setIsOpen(false); launcherRef.current?.focus(); }
  function draftPrompt(text: string) { setInput(text); inputRef.current?.focus(); }
  function expandToWorkspace() {
    if (articleId) useReaderHandoff.getState().enterFromReader({
      articleId, title: articleTitle, level: level || 'Level 2', summary: articleSummary,
      vocabulary, readerUrl: window.location.pathname + window.location.search,
    }, input);
    navigate(paths.aiWorkspace({ story: articleId, level }));
  }
  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    if (!user) { navigate(paths.login({ redirect: window.location.pathname + window.location.search })); return; }
    if (!isPro) { navigate(PATHS.pricing); return; }

    // Preserve the existing guided preview without presenting canned text as live AI.
    const summaryPrompt = `Help me understand “${articleTitle}”.`;
    const opinionPrompt = `Help me express my opinion about “${articleTitle}” in English.`;
    const reply = text === summaryPrompt
      ? articleSummary
        ? `From the story’s introduction:\n${articleSummary}\n\nTry this: read the opening paragraph, then describe its main idea in one sentence.`
        : `Start with the opening paragraph of “${articleTitle}”. Identify who or what it describes, then write a one-sentence summary. Use “Word in context” in Learning tools for unfamiliar words.`
      : text === opinionPrompt
        ? 'Try this speaking frame: “One detail that stood out to me was ___. I think it matters because ___. It reminds me of ___.” Fill the gaps with details from the story.'
        : 'Live AI replies are not connected in this preview yet. You can use Learning tools to look up a word from the story, open its vocabulary, or practise with a prepared prompt.';
    setMessages(previous => [...previous, { sender: 'user', text }, { sender: 'ai', text: reply }]);
    setInput('');
    setShowTools(false);
    inputRef.current?.focus();
  }

  return (
    <aside className="reader-companion" data-theme={themeMode} aria-label="Reader AI companion">
      {isOpen && (
        <section id={panelId} className="reader-companion-panel" aria-labelledby={`${panelId}-title`}
          onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); closePanel(); } }}>
          <header className="reader-companion-header">
            <span className="reader-companion-avatar"><Bot size={20} /></span>
            <div className="reader-companion-heading">
              <h2 id={`${panelId}-title`} tabIndex={-1} ref={headingRef}>AI Cultural Companion</h2>
              <p>Read, explore, remember</p>
            </div>
            {isPro && <span className="reader-companion-pro"><Crown size={12} /> Pro</span>}
            <button className="reader-companion-icon" type="button" aria-label="Continue in AI workspace" title="Continue in AI workspace" onClick={expandToWorkspace}><Maximize2 size={17} /></button>
            <button className="reader-companion-icon" type="button" aria-label="Close AI companion" onClick={closePanel}><X size={18} /></button>
          </header>
          <div className="reader-companion-context"><span>Reading with you</span><p title={articleTitle}>{articleTitle}</p></div>
          <div className="reader-companion-toolbar">
            <span>{showTools ? 'Make this story your next step' : 'Your conversation'}</span>
            {messages.length > 0 && <button type="button" aria-expanded={showTools} onClick={() => setShowTools(value => !value)}>
              <LayoutGrid size={15} />{showTools ? 'Back to chat' : 'Learning tools'}
            </button>}
          </div>
          <div className="reader-companion-body" ref={scrollRef}>
            {showTools ? <ReaderCompanionTools key={`${articleId}-${level}`} articleTitle={articleTitle} vocabulary={vocabulary}
              onDraftPrompt={draftPrompt} onOpenVocabulary={onOpenVocabulary ? () => { closePanel(); onOpenVocabulary(); } : undefined} />
              : <ReaderCompanionMessages messages={messages} />}
          </div>
          <footer className="reader-companion-footer">
            {input && (!user || !isPro) && <p className="reader-companion-draft">Prepared prompt: {input}</p>}
            {!user ? <div className="reader-companion-gate"><p>Sign in to use the chat preview.</p><button type="button" className="reader-companion-primary"
              onClick={() => navigate(paths.login({ redirect: window.location.pathname + window.location.search }))}>Sign in to chat</button></div>
              : !isPro ? <div className="reader-companion-gate"><p><Crown size={15} /> Chat preview is available to Pro members.</p><button type="button"
                className="reader-companion-primary" onClick={() => navigate(PATHS.pricing)}>Explore Pro</button></div>
              : <form onSubmit={event => { event.preventDefault(); sendMessage(); }} className="reader-companion-composer">
                <label className="sr-only" htmlFor={`${panelId}-input`}>Message the companion</label>
                <textarea id={`${panelId}-input`} ref={inputRef} rows={2} maxLength={2000} value={input}
                  onChange={event => setInput(event.target.value)} placeholder="Ask about this story…"
                  onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); sendMessage(); } }} />
                <button type="submit" className="reader-companion-primary" disabled={!input.trim()} aria-label="Send message"><Send size={18} /></button>
              </form>}
            <p className="reader-companion-preview">Guided preview · Live AI chat is not connected yet.</p>
          </footer>
        </section>
      )}
      <button ref={launcherRef} type="button" className="reader-companion-launcher" aria-controls={panelId} aria-expanded={isOpen}
        onClick={() => isOpen ? closePanel() : setIsOpen(true)}><Bot size={20} /><span>{isOpen ? 'Minimize companion' : 'AI Companion'}</span></button>
    </aside>
  );
}

export default FloatingAiCompanionWidget;
