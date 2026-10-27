import React, { useEffect, useState } from 'react';
import { Award, BookOpen, Check, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from '@/components/ui/modal';
import { paths } from '@/routes/paths';
import { ProfileSealIcon } from './ProfileSealIcon';
import type { CulturalSeal } from '../types';

interface SealDetailModalProps {
  seal: CulturalSeal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SealDetailModal: React.FC<SealDetailModalProps> = ({ seal, isOpen, onClose }) => {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  useEffect(() => { setCopyState('idle'); }, [seal, isOpen]);
  if (!seal) return null;

  const handleCopy = async () => {
    const text = `Heritage stamp: ${seal.titleEn}\n${seal.titleVi}\n${seal.province} | ${seal.sealCode}\nCollected: ${seal.stampedAt || 'Today'}\n"${seal.quoteEn}"\n\nLearn through Vietnamese culture at https://viecultures.com`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };
  const regionLabel = { north: 'Northern heritage', central: 'Central heritage', south: 'Southern heritage' }[seal.region];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={seal.titleEn} className="profile-dialog border-antique-gold bg-warm-ivory dark:bg-heritage-forest sm:p-8">
      <p className="-mt-4 mb-5 text-sm text-stone-500">{seal.titleVi}</p>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
        <span className="inline-flex items-center gap-2 rounded-full border border-antique-gold/40 bg-antique-gold/10 px-3 py-1 text-heritage-green dark:text-antique-gold"><Award className="size-4" aria-hidden="true" />{regionLabel}</span>
        <span>{seal.sealCode}</span>
      </div>
      <div className="my-6 flex justify-center">
        <div className="relative size-48 rounded-full border-4 border-dashed border-[#9E2A2B]/80 bg-[#9E2A2B]/5 p-5 flex flex-col items-center justify-center text-center text-[#9E2A2B] dark:text-[#E07A5F] shadow-inner">
          <ProfileSealIcon postId={seal.postId} className="size-10 mb-2" />
          <span className="text-sm font-medium">Heritage stamp</span>
          <span className="text-xs mt-1">{seal.province}</span>
          <span className="text-xs mt-2 border-t border-current/30 pt-2">{seal.stampedAt ? `Collected: ${seal.stampedAt}` : 'Locked'}</span>
          <div className="absolute inset-1.5 rounded-full border border-[#9E2A2B]/30 pointer-events-none" />
        </div>
      </div>
      <div className="my-5 p-4 rounded-2xl bg-rice-paper dark:bg-[#1A3D34] border border-antique-gold/40 text-sm space-y-2">
        <h3 className="flex items-center gap-2 text-heritage-green dark:text-antique-gold"><BookOpen className="size-4" aria-hidden="true" />Culture &amp; context</h3>
        <p className="text-ink italic">“{seal.quoteEn}”</p>
        <p className="text-stone-500">{seal.quoteVi}</p>
      </div>
      <dl className="grid grid-cols-2 gap-3 py-4 border-y border-antique-gold/30 text-center text-sm">
        <div><dt className="text-xs text-stone-500">Words in context</dt><dd className="mt-1 text-heritage-green dark:text-antique-gold">{seal.learnedWordsCount} words</dd></div>
        <div><dt className="text-xs text-stone-500">Reading time</dt><dd className="mt-1 text-heritage-green dark:text-antique-gold">~{seal.readingMinutes} min</dd></div>
      </dl>
      <div className="mt-6 flex flex-col gap-3">
        <Link to={paths.reader({ postId: seal.postId })} onClick={onClose} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-heritage-green hover:bg-[#163731] text-warm-ivory shadow-md"><BookOpen className="size-4" aria-hidden="true" />{seal.isUnlocked ? 'Read this story again' : 'Explore this story'}</Link>
        <div className="flex flex-wrap gap-3">
          {seal.isUnlocked && <button type="button" onClick={handleCopy} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-line bg-surface-raised text-ink hover:bg-surface-muted">{copyState === 'copied' ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}{copyState === 'copied' ? 'Copied' : 'Copy stamp'}</button>}
          <Link to={paths.flashcardStudy({ deck: seal.postId })} onClick={onClose} className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl border border-antique-gold text-heritage-green dark:text-warm-ivory hover:bg-antique-gold/10">Review flashcards</Link>
        </div>
      </div>
      {copyState === 'copied' && <p role="status" className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">Stamp details copied to your clipboard.</p>}
      {copyState === 'error' && <p role="status" className="mt-3 text-sm text-rose-700 dark:text-rose-300">Could not copy. Please try again.</p>}
    </Modal>
  );
};
