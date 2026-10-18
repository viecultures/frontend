import React, { useState } from 'react';
import { BookMarked, Search, Volume2, ArrowRight, Sparkles, Filter, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { VOCAB_DATABASE, type VocabItem } from '@/data/readerData';
import { getAllSavedVocabularies } from '@/services/learning/learningStorage';

export const SavedVocabQuickView: React.FC = () => {
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
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E4B43] dark:text-[#FBF7EE]">
            Sổ Tay Từ Vựng Ngữ Cảnh
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Các từ vựng học thuật trích xuất từ câu chuyện văn hóa kèm ngữ cảnh nguyên bản.
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            {isActualSaved ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <BookmarkCheck className="w-3 h-3" />
                <span>{userSavedWords.length} từ đã lưu từ các bài đọc của bạn</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3 h-3" />
                <span>Từ vựng mẫu gợi ý (Hãy bấm ghim từ khi đọc bài để đưa vào sổ tay)</span>
              </span>
            )}
          </div>
        </div>


        <Link
          to={paths.flashcardStudy({ saved: true })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E4B43] hover:bg-[#163731] text-[#FBF7EE] text-xs font-bold transition-all shadow-md cursor-pointer focus-ring"
        >
          <BookMarked className="w-4 h-4 text-[#D9B76A]" />
          <span>Vào phòng ôn tập Flashcard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm từ vựng hoặc nghĩa tiếng Việt..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F6EEDC] dark:bg-[#122A22] border border-[#D9B76A]/40 text-xs sm:text-sm text-[#1E4B43] dark:text-[#FBF7EE] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D9B76A]"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F6EEDC] dark:bg-[#122A22] border border-[#D9B76A]/40">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#1E4B43] text-[#FBF7EE]'
                : 'text-stone-600 dark:text-stone-300'
            }`}
          >
            Tất cả ({vocabList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('word')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'word'
                ? 'bg-[#1E4B43] text-[#FBF7EE]'
                : 'text-stone-600 dark:text-stone-300'
            }`}
          >
            Từ đơn
          </button>
          <button
            type="button"
            onClick={() => setFilterType('phrase')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'phrase'
                ? 'bg-[#1E4B43] text-[#FBF7EE]'
                : 'text-stone-600 dark:text-stone-300'
            }`}
          >
            Cụm từ (Collocations)
          </button>
        </div>
      </div>

      {/* Vocabulary Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-[#FBF7EE] dark:bg-[#122A22] border border-[#D9B76A]/40 p-4 sm:p-5 shadow-xs hover:border-[#D9B76A] hover:shadow-sm transition-all space-y-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-base sm:text-lg text-[#1E4B43] dark:text-[#FBF7EE]">
                    {item.word}
                  </h4>
                  <button
                    type="button"
                    onClick={() => playWordAudio(item.word)}
                    className="p-1 rounded-full hover:bg-stone-200 dark:hover:bg-white/10 text-stone-500 hover:text-[#1E4B43] dark:hover:text-[#D9B76A] transition-colors cursor-pointer"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mono mt-0.5">
                  <span>{item.ipa}</span>
                  <span>•</span>
                  <span className="italic">{item.pos}</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1E4B43]/10 dark:bg-[#D9B76A]/15 text-[#1E4B43] dark:text-[#D9B76A] border border-[#D9B76A]/30">
                Level 2
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
              {item.viMeaning}
            </p>

            <div className="p-2.5 rounded-xl bg-[#F6EEDC] dark:bg-[#1A3D34] text-xs text-stone-600 dark:text-stone-300 font-sans italic border-l-2 border-[#D9B76A]">
              "{item.contextSentence}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
