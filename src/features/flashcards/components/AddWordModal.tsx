import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Plus, X } from 'lucide-react';

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyStyle?: boolean;
  className?: string;
}

export function AddWordModal({ isOpen, onClose, studyStyle = false, className = '' }: AddWordModalProps) {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [context, setContext] = useState('');

  const handleSave = () => {
    if (!word.trim() || !meaning.trim()) {
      alert('Enter the English word and Vietnamese meaning.');
      return;
    }
    // Keep the existing quick-add behavior; persistence is outside this UI change.
    alert(`Added "${word}" (${meaning}) to your vocabulary library!`);
    setWord('');
    setMeaning('');
    setContext('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className={`${studyStyle ? 'vocab-study-shell vocab-study-dialog ' : ''}${className} fixed inset-0 z-50`}>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <DialogPanel className="vocab-add-word-panel dictionary-dialog-panel w-full max-w-md bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 border border-line animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rice-paper text-heritage-green flex items-center justify-center font-bold border border-antique-gold/40"><Plus className="w-4 h-4 text-heritage-green" /></div>
              <DialogTitle className="font-serif text-lg font-bold text-heritage-green">Add a personal word</DialogTitle>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-rice-paper text-text-secondary hover:text-heritage-green cursor-pointer focus-ring" aria-label="Close form"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-3 text-xs font-bold text-text-secondary">
            <div>
              <label htmlFor="personal-word" className="block mb-1 text-heritage-green">English word</label>
              <input id="personal-word" type="text" value={word} onChange={e => setWord(e.target.value)} placeholder="e.g. Heritage, Citadel, Baguette…" className="w-full px-4 py-2.5 rounded-2xl bg-rice-paper/60 border border-heritage-green/20 text-xs text-heritage-green font-bold focus:outline-none focus:border-heritage-green focus:ring-2 focus:ring-antique-gold/40" />
            </div>
            <div>
              <label htmlFor="personal-meaning" className="block mb-1 text-heritage-green">Vietnamese meaning</label>
              <input id="personal-meaning" type="text" value={meaning} onChange={e => setMeaning(e.target.value)} placeholder="e.g. Di sản văn hóa…" className="w-full px-4 py-2.5 rounded-2xl bg-rice-paper/60 border border-heritage-green/20 text-xs text-heritage-green font-bold focus:outline-none focus:border-heritage-green focus:ring-2 focus:ring-antique-gold/40" />
            </div>
            <div>
              <label htmlFor="personal-context" className="block mb-1 text-heritage-green">Example sentence</label>
              <textarea id="personal-context" value={context} onChange={e => setContext(e.target.value)} placeholder="e.g. The Hue Citadel is a UNESCO heritage site…" rows={2} className="w-full px-4 py-2.5 rounded-2xl bg-rice-paper/60 border border-heritage-green/20 text-xs text-heritage-green font-bold focus:outline-none focus:border-heritage-green focus:ring-2 focus:ring-antique-gold/40 resize-none" />
            </div>
          </div>
          <div className="pt-2 border-t border-line flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-heritage-green hover:bg-rice-paper cursor-pointer focus-ring">Cancel</button>
            <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory text-xs font-bold cursor-pointer shadow-xs border border-antique-gold/40 focus-ring">Save to library</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
