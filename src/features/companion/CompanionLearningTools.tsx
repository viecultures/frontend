import React, { useState, useId, useRef } from 'react';
import { Compass, Search, BookOpen, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import type { VocabItem } from '@/data/readerData';
import { lookupWordInstant } from '@/utils/dictionary-service';

interface CompanionLearningToolsProps {
  articleTitle?: string;
  vocabulary?: VocabItem[];
  onDraftPrompt: (text: string) => void;
  onOpenVocabulary?: () => void;
}

export const CompanionLearningTools: React.FC<CompanionLearningToolsProps> = ({
  articleTitle = 'this story',
  vocabulary = [],
  onDraftPrompt,
  onOpenVocabulary,
}) => {
  const [activeTab, setActiveTab] = useState<'path' | 'word'>('path');
  const [searchWord, setSearchWord] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupResult, setLookupResult] = useState<VocabItem | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const inputId = useId();
  const searchVersion = useRef(0);

  const handleLookup = async (wordToSearch: string) => {
    const clean = wordToSearch.trim();
    if (!clean || isLookingUp) return;

    setSearchWord(clean);
    setIsLookingUp(true);
    setLookupError(null);
    setLookupResult(null);
    const currentVersion = ++searchVersion.current;

    try {
      const localMatch = vocabulary.find(
        (v) => v.word.toLowerCase() === clean.toLowerCase()
      );
      if (localMatch) {
        if (currentVersion === searchVersion.current) {
          setLookupResult(localMatch);
        }
        return;
      }

      const res = await lookupWordInstant(clean);
      if (currentVersion === searchVersion.current) {
        setLookupResult(res);
      }
    } catch (err) {
      console.error('[CompanionLearningTools] Lookup failed:', err);
      if (currentVersion === searchVersion.current) {
        setLookupError('Could not look up this word. Please check your network and try again.');
      }
    } finally {
      if (currentVersion === searchVersion.current) {
        setIsLookingUp(false);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleLookup(searchWord);
  };

  return (
    <div className="vc-scroll flex-1 space-y-4 overflow-y-auto px-4 py-3.5 text-[#2f3a2a]">
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#eaf4e2] p-1 border border-[#c9d6b0]">
        <button
          type="button"
          onClick={() => setActiveTab('path')}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
            activeTab === 'path'
              ? 'bg-white text-[#2f4a2c] shadow-[0_2px_0_-1px_#c9d6b0]'
              : 'text-[#5d8a45] hover:text-[#2f4a2c]'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Reading Path</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('word')}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
            activeTab === 'word'
              ? 'bg-white text-[#2f4a2c] shadow-[0_2px_0_-1px_#c9d6b0]'
              : 'text-[#5d8a45] hover:text-[#2f4a2c]'
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Word in Context</span>
        </button>
      </div>

      {/* 1. Reading Path Tab */}
      {activeTab === 'path' && (
        <div className="space-y-3.5 rounded-2xl border border-[#c9d6b0] bg-white p-4 shadow-[0_3px_0_-1px_#dfe5cf]">
          <div>
            <h3 className="font-serif text-[15px] font-bold text-[#2f4a2c]">Your 3-Step Reading Path</h3>
            <p className="text-[11.5px] text-[#627750]">Follow these steps to boost reading retention.</p>
          </div>

          <ol className="space-y-2.5 text-xs text-[#3e5a3a]">
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf4e2] text-[11px] font-bold text-[#5d8a45]">
                1
              </span>
              <p className="leading-relaxed">Read the opening paragraph first to capture the main cultural theme.</p>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf4e2] text-[11px] font-bold text-[#5d8a45]">
                2
              </span>
              <p className="leading-relaxed">Listen to each sentence carefully, then repeat and shadow it aloud.</p>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf4e2] text-[11px] font-bold text-[#5d8a45]">
                3
              </span>
              <p className="leading-relaxed">Bookmark important phrases and review them after reading.</p>
            </li>
          </ol>

          {onOpenVocabulary && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenVocabulary}
                className="flex w-full items-center justify-between rounded-xl border border-[#c9d6b0] bg-[#f4f7ee] px-3 py-2 text-xs font-semibold text-[#3e5a3a] transition-all hover:bg-[#eaf4e2] hover:text-[#2f4a2c]"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#5d8a45]" />
                  Open Story Vocabulary Drawer
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-[#5d8a45]" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. Word in Context Tab */}
      {activeTab === 'word' && (
        <div className="space-y-3.5 rounded-2xl border border-[#c9d6b0] bg-white p-4 shadow-[0_3px_0_-1px_#dfe5cf]">
          <div>
            <h3 className="font-serif text-[15px] font-bold text-[#2f4a2c]">Word in Context</h3>
            <p className="text-[11.5px] text-[#627750]">Look up any vocabulary word from your reading.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-2">
            <label htmlFor={inputId} className="block text-xs font-medium text-[#4a6a44]">
              Which word would you like to explore?
            </label>
            <div className="flex items-center gap-1.5">
              <input
                id={inputId}
                type="text"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                placeholder="e.g. heritage, ancestral, tranquil"
                maxLength={80}
                className="flex-1 rounded-xl border border-[#c9d6b0] bg-[#fffaf0] px-3 py-2 text-xs text-[#2f3a2a] placeholder-[#a3ad90] focus:border-[#5d8a45] focus:outline-none focus:ring-1 focus:ring-[#5d8a45]"
              />
              <button
                type="submit"
                disabled={isLookingUp || !searchWord.trim()}
                aria-label="Look up word"
                className="flex h-8 items-center justify-center rounded-xl bg-[#5d8a45] px-3 text-xs font-bold text-white shadow-[0_2px_0_-1px_#3e5a3a] transition-all hover:bg-[#4f7a3a] disabled:opacity-50"
              >
                {isLookingUp ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
              </button>
            </div>
          </form>

          {/* Suggested vocabulary chips from article */}
          {vocabulary.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7a8a66]">
                From this story
              </p>
              <div className="flex flex-wrap gap-1.5">
                {vocabulary.slice(0, 5).map((v) => (
                  <button
                    key={v.id || v.word}
                    type="button"
                    disabled={isLookingUp}
                    onClick={() => void handleLookup(v.word)}
                    className="rounded-full border border-[#c9d6b0] bg-[#f4f7ee] px-2.5 py-1 text-[11px] font-medium text-[#3e5a3a] transition-colors hover:border-[#8a9a6f] hover:bg-white"
                  >
                    {v.word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lookup Results */}
          <div aria-live="polite" className="pt-1">
            {lookupError && (
              <p role="alert" className="rounded-xl border border-[#f0c9bc] bg-[#fdf0eb] p-2.5 text-xs text-[#8f3f2c]">
                {lookupError}
              </p>
            )}

            {lookupResult && (
              <div className="space-y-2 rounded-xl border border-[#c9d6b0] bg-[#fffaf0] p-3 text-xs">
                <div className="flex items-baseline justify-between border-b border-[#dfe5cf] pb-1.5">
                  <span className="font-serif text-sm font-bold text-[#2f4a2c]">{lookupResult.word}</span>
                  <span className="text-[11px] font-mono text-[#7a8a66]">
                    {lookupResult.ipa} {lookupResult.pos ? `* ${lookupResult.pos}` : ''}
                  </span>
                </div>

                {lookupResult.enDefinition && (
                  <p className="leading-relaxed text-[#3e5a3a]">{lookupResult.enDefinition}</p>
                )}

                <p className="font-medium text-[#5d8a45]" lang="vi">
                  {lookupResult.viMeaning}
                </p>

                {lookupResult.contextSentence && (
                  <blockquote className="border-l-2 border-[#8a9a6f] pl-2.5 italic text-[#627750]">
                    "{lookupResult.contextSentence}"
                  </blockquote>
                )}

                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onDraftPrompt(
                        `How can I naturally use the word "${lookupResult.word}" when discussing Vietnamese culture?`
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#5d8a45] hover:underline"
                  >
                    <Sparkles className="h-3 w-3" />
                    Ask companion about "{lookupResult.word}"
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grounded Conversation Starters */}
      <div className="space-y-2 rounded-2xl border border-[#c9d6b0] bg-white p-3.5 shadow-[0_3px_0_-1px_#dfe5cf]">
        <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7a8a66]">
          <Sparkles className="h-3.5 w-3.5 text-[#5d8a45]" />
          Conversation Starters
        </h4>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onDraftPrompt(`Help me understand "${articleTitle}".`)}
            className="flex w-full items-center justify-between rounded-xl border border-[#dfe5cf] bg-[#fdfaf5] px-3 py-2 text-left text-xs text-[#2f4a2c] transition-colors hover:border-[#8a9a6f] hover:bg-[#f4f7ee]"
          >
            <span>Understand the main theme</span>
            <ArrowRight className="h-3 w-3 text-[#5d8a45]" />
          </button>
          <button
            type="button"
            onClick={() =>
              onDraftPrompt(`Help me express my opinion about "${articleTitle}" in natural English.`)
            }
            className="flex w-full items-center justify-between rounded-xl border border-[#dfe5cf] bg-[#fdfaf5] px-3 py-2 text-left text-xs text-[#2f4a2c] transition-colors hover:border-[#8a9a6f] hover:bg-[#f4f7ee]"
          >
            <span>Express my opinion in English</span>
            <ArrowRight className="h-3 w-3 text-[#5d8a45]" />
          </button>
        </div>
      </div>
    </div>
  );
};
