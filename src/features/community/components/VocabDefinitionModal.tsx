import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { BookOpen, Bookmark, Check, Volume2, X } from 'lucide-react';
import type { HighlightVocabItem } from '../types';

interface VocabDefinitionModalProps {
  vocab: HighlightVocabItem | null;
  onClose: () => void;
  onSaveVocab?: (vocab: HighlightVocabItem) => void;
}

export const VocabDefinitionModal: React.FC<VocabDefinitionModalProps> = ({
  vocab,
  onClose,
  onSaveVocab,
}) => {
  const { t } = useTranslation('community');
  const [isSaved, setIsSaved] = useState<boolean>(vocab?.isSaved || false);

  if (!vocab) return null;

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    if (onSaveVocab) {
      onSaveVocab({ ...vocab, isSaved: !isSaved });
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(vocab.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Dialog
      open={!!vocab}
      onClose={onClose}
      className="community-ui fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A3B32]/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <DialogPanel className="relative w-full max-w-md bg-white rounded-2xl border border-[#E8E2D5] shadow-xl p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#E8E2D5]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1D5046]/10 text-[#1D5046] text-[11px] font-semibold">
              <BookOpen className="w-3 h-3 text-[#1D5046]" />
              <span>{t('community.vocab_modal.tag')}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <DialogTitle className="font-serif text-2xl font-bold text-[#1D5046]">
                {vocab.word}
              </DialogTitle>
              <button
                type="button"
                onClick={handleSpeak}
                className="p-1 rounded-full text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0] transition-colors cursor-pointer"
                aria-label={t('community.vocab_modal.listen_aria', { word: vocab.word })}
                title={t('community.vocab_modal.listen_title')}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            {vocab.ipa && (
              <span className="font-mono text-xs text-[#6E7B75]">{vocab.ipa}</span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0] transition-colors cursor-pointer focus-ring"
            aria-label={t('community.vocab_modal.close_aria')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Definition Details */}
        <div className="space-y-3 text-xs">
          {/* Meaning & Part of Speech */}
          <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5]/70 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E7B75]">
                {t('community.vocab_modal.meaning_label')}
              </span>
              {vocab.partOfSpeech && (
                <span className="px-2 py-0.5 rounded-md bg-white border border-[#E8E2D5] text-[11px] font-semibold text-[#1D5046]">
                  {vocab.partOfSpeech}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-[#1D5046]">
              {vocab.meaning}
            </p>
          </div>

          {/* Synonyms */}
          {vocab.synonyms && vocab.synonyms.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E7B75]">
                {t('community.vocab_modal.synonyms_label')}
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {vocab.synonyms.map((syn, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E2D5] text-xs font-medium text-[#314F49]"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Example Sentence */}
          {vocab.exampleSentence && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E7B75]">
                {t('community.vocab_modal.context_label')}
              </span>
              <p className="text-xs italic text-[#314F49] bg-white p-3 rounded-xl border border-[#E8E2D5] leading-relaxed">
                &ldquo;{vocab.exampleSentence}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleToggleSave}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer focus-ring ${
              isSaved
                ? 'bg-[#1D5046]/10 text-[#1D5046] border border-[#1D5046]/30'
                : 'bg-[#1D5046] text-white hover:bg-[#153D35] shadow-xs'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#1D5046]" />
                <span>{t('community.vocab_modal.marked_btn')}</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>{t('community.vocab_modal.mark_btn')}</span>
              </>
            )}
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default VocabDefinitionModal;
