import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookMarked, Search, Volume2, ArrowRight, BookmarkCheck } from 'lucide-react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { paths } from '@/routes/paths';
import { VOCAB_DATABASE, type VocabItem } from '@/data/readerData';
import { getAllSavedVocabularies } from '@/services/learning/learningStorage';

export const SavedVocabQuickView: React.FC = () => {
  const { t } = useTranslation('profile');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'word' | 'phrase'>('all');

  // Read actual saved vocabulary from learningStorage
  const userSavedWords = getAllSavedVocabularies();
  const isActualSaved = userSavedWords.length > 0;
  const vocabList: VocabItem[] = isActualSaved
    ? userSavedWords
    : Object.values(VOCAB_DATABASE).slice(0, 10);

  const filtered = vocabList.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.viMeaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === 'all'
        ? true
        : filterType === 'phrase'
        ? item.pos.includes('phrase')
        : !item.pos.includes('phrase');
    return matchesSearch && matchesType;
  });


  const playWordAudio = (word: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      // speech synthesis unavailable
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-heritage-green dark:text-warm-ivory">
            {t('profile.vocab.title')}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {t('profile.vocab.desc')}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            {isActualSaved ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <BookmarkCheck aria-hidden="true" className="w-3 h-3" />
                <span>{t('profile.vocab.saved_count', { count: userSavedWords.length })}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                <BookMarked aria-hidden="true" className="w-3 h-3" />
                <span>{t('profile.vocab.sample_notice')}</span>
              </span>
            )}
          </div>
        </div>


        <Link
          to={paths.flashcardStudy({ saved: true })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-heritage-green hover:bg-[#163731] text-warm-ivory text-xs font-bold transition-all shadow-md cursor-pointer focus-ring"
        >
          <BookMarked aria-hidden="true" className="w-4 h-4 text-antique-gold" />
          <span>{t('profile.vocab.review_flashcards')}</span>
          <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search aria-hidden="true" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            aria-label={t('profile.vocab_view.search_aria')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('profile.vocab.search_placeholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-rice-paper dark:bg-heritage-forest border border-antique-gold/40 text-xs sm:text-sm text-heritage-green dark:text-warm-ivory placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-antique-gold"
          />
        </div>

        <div className="profile-filter-bar flex items-center gap-1.5 p-1 rounded-2xl bg-rice-paper dark:bg-heritage-forest border border-antique-gold/40">
          <button
            type="button"
            aria-pressed={filterType === 'all'}
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-heritage-green text-warm-ivory'
                : 'text-stone-600 dark:text-stone-300'
            }`}
          >
            {t('profile.vocab.filter_all', { count: vocabList.length })}
          </button>
          <button
            type="button"
            aria-pressed={filterType === 'word'}
            onClick={() => setFilterType('word')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'word'
                ? 'bg-heritage-green text-warm-ivory'
                : 'text-stone-600 dark:text-stone-300'
            }`}
          >
            {t('profile.vocab.filter_words')}
          </button>
          <button
            type="button"
            aria-pressed={filterType === 'phrase'}
            onClick={() => setFilterType('phrase')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'phrase'
                ? 'bg-heritage-green text-warm-ivory'
                : 'text-stone-600 dark:text-stone-300'
            }`}
          >
            {t('profile.vocab.filter_phrases')}
          </button>
        </div>
      </div>

      {filtered.length === 0 && (
        <p role="status" className="rounded-2xl border border-antique-gold/40 p-6 text-sm text-ink-faint">
          {t('profile.vocab_view.no_match')}
        </p>
      )}

      {/* Vocabulary Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-warm-ivory dark:bg-heritage-forest border border-antique-gold/40 p-4 sm:p-5 shadow-xs hover:border-antique-gold hover:shadow-sm transition-all space-y-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-base sm:text-lg text-heritage-green dark:text-warm-ivory">
                    {item.word}
                  </h4>
                  <button
                    type="button"
                    onClick={() => playWordAudio(item.word)}
                    className="p-1 rounded-full hover:bg-stone-200 dark:hover:bg-white/10 text-stone-500 hover:text-heritage-green dark:hover:text-antique-gold transition-colors cursor-pointer"
                    title={t('profile.vocab_view.listen_title')}
                    aria-label={t('profile.vocab_view.listen_aria', { word: item.word })}
                  >
                    <Volume2 aria-hidden="true" className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mono mt-0.5">
                  <span>{item.ipa}</span>
                  <span>•</span>
                  <span className="italic">{item.pos}</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-heritage-green/10 dark:bg-antique-gold/15 text-heritage-green dark:text-antique-gold border border-antique-gold/30">
                {t('profile.vocab_view.level_label')}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
              {item.viMeaning}
            </p>

            <div className="p-2.5 rounded-xl bg-rice-paper dark:bg-[#1A3D34] text-xs text-stone-600 dark:text-stone-300 font-sans italic border-l-2 border-antique-gold">
              "{item.contextSentence}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
