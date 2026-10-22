import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Compass, Search, Sparkles } from 'lucide-react';
import type { VocabItem } from '@/data/readerData';

interface ReaderCompanionToolsProps {
  articleTitle: string;
  vocabulary: VocabItem[];
  onDraftPrompt: (text: string) => void;
  onOpenVocabulary?: () => void;
}

export function ReaderCompanionTools({ articleTitle, vocabulary, onDraftPrompt, onOpenVocabulary }: ReaderCompanionToolsProps) {
  const [activeTool, setActiveTool] = useState<'steps' | 'word' | null>(null);
  const [word, setWord] = useState('');
  const [result, setResult] = useState<VocabItem | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [error, setError] = useState('');
  const lookupVersion = useRef(0);
  const detailRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const fieldId = useId();
  useEffect(() => () => { lookupVersion.current += 1; }, []);
  useEffect(() => { if (activeTool) detailRef.current?.scrollIntoView({ block: 'nearest' }); }, [activeTool]);
  useEffect(() => { if (result) resultRef.current?.scrollIntoView({ block: 'nearest' }); }, [result]);

  async function lookupWord(value: string) {
    if (!value.trim() || isLookingUp) return;
    const request = ++lookupVersion.current;
    setWord(value); setIsLookingUp(true); setError(''); setResult(null);
    try {
      const localWord = vocabulary.find(item => item.word.toLowerCase() === value.trim().toLowerCase());
      const definition = localWord || await (await import('@/utils/dictionary-service')).lookupWordInstant(value);
      if (request === lookupVersion.current) setResult(definition);
    } catch {
      if (request === lookupVersion.current) setError('We could not look up this word. Please try again.');
    } finally {
      if (request === lookupVersion.current) setIsLookingUp(false);
    }
  }

  return (
    <div className="reader-companion-tools">
      <p className="reader-companion-intro">Explore this story, one step at a time.</p>
      <div className="reader-companion-actions">
        <button type="button" aria-expanded={activeTool === 'steps'} aria-controls={`${fieldId}-steps`} onClick={() => setActiveTool(activeTool === 'steps' ? null : 'steps')}>
          <span className="reader-companion-tool-icon"><Compass size={19} /></span><span>Start with this story<small>A simple reading path</small></span><ArrowRight size={16} />
        </button>
        <button type="button" aria-expanded={activeTool === 'word'} aria-controls={`${fieldId}-word`} onClick={() => setActiveTool(activeTool === 'word' ? null : 'word')}>
          <span className="reader-companion-tool-icon reader-companion-tool-icon--sage"><Search size={19} /></span><span>Word in context<small>Look up words as you read</small></span><ArrowRight size={16} />
        </button>
      </div>
      {activeTool === 'steps' && <div ref={detailRef} id={`${fieldId}-steps`} className="reader-companion-tool-detail">
        <h3>Your reading path</h3>
        <ol><li>Read the opening paragraph for the main idea.</li><li>Listen to a sentence, then say it aloud.</li><li>Save useful words and review them after reading.</li></ol>
        {onOpenVocabulary && <button type="button" className="reader-companion-text-button" onClick={onOpenVocabulary}><BookOpen size={16} /> Open this story’s vocabulary <ArrowRight size={15} /></button>}
      </div>}
      {activeTool === 'word' && <div ref={detailRef} id={`${fieldId}-word`} className="reader-companion-tool-detail">
        <form onSubmit={event => { event.preventDefault(); void lookupWord(word); }}>
          <label htmlFor={fieldId}>Which word would you like to explore?</label>
          <div className="reader-companion-lookup"><input id={fieldId} value={word} maxLength={100} onChange={event => setWord(event.target.value)} placeholder="Enter an English word" />
            <button type="submit" disabled={isLookingUp || !word.trim()} className="reader-companion-primary" aria-label="Look up word"><Search size={17} /></button></div>
        </form>
        {vocabulary.length > 0 && <div className="reader-companion-word-suggestions"><span>From this story</span>{vocabulary.slice(0, 3).map(item => <button type="button" key={item.id} disabled={isLookingUp} onClick={() => void lookupWord(item.word)}>{item.word}</button>)}</div>}
        <div aria-live="polite" aria-busy={isLookingUp}>
          {isLookingUp && <p role="status">Looking up your word…</p>}
          {error && <p role="alert">{error}</p>}
          {result && <article ref={resultRef} className="reader-companion-definition"><span>Dictionary result</span><h3>{result.word}</h3><p className="reader-companion-muted">{result.ipa} {result.pos}</p>
            {result.enDefinition && <p>{result.enDefinition}</p>}<p lang="vi">{result.viMeaning}</p>{result.contextSentence && <blockquote>{result.contextSentence}</blockquote>}</article>}
        </div>
      </div>}
      <div className="reader-companion-prompts"><h3><Sparkles size={15} /> Try a conversation starter</h3>
        <button type="button" onClick={() => onDraftPrompt(`Help me understand “${articleTitle}”.`)}>Understand the story <ArrowRight size={15} /></button>
        <button type="button" onClick={() => onDraftPrompt(`Help me express my opinion about “${articleTitle}” in English.`)}>Express my opinion in English <ArrowRight size={15} /></button>
      </div>
    </div>
  );
}
