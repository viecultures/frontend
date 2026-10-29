import { X } from "lucide-react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useTranslation } from "react-i18next";

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  customDeckName: string;
  onChangeDeckName: (name: string) => void;
  onCreateDeck: () => void;
}

export function CreateDeckModal({
  isOpen,
  onClose,
  customDeckName,
  onChangeDeckName,
  onCreateDeck,
}: CreateDeckModalProps) {
  const { t } = useTranslation('flashcards');

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="dictionary-dialog fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <DialogPanel className="dictionary-dialog-panel w-full max-w-md bg-surface rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <DialogTitle className="font-serif text-lg font-bold text-ink">
            {t('create_deck_modal.title', 'Create a vocabulary deck')}
          </DialogTitle>
          <button
            onClick={onClose}
            aria-label={t('create_deck_modal.close_aria', 'Close create deck')}
            className="p-2.5 rounded-full hover:bg-surface-muted text-ink cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <label htmlFor="custom-deck-name" className="text-xs font-bold text-ink-soft">
            {t('create_deck_modal.name_label', 'Deck name')}
          </label>
          <input
            id="custom-deck-name"
            autoFocus
            type="text"
            value={customDeckName}
            onChange={(e) => onChangeDeckName(e.target.value)}
            placeholder={t('create_deck_modal.name_placeholder', 'e.g. IELTS vocabulary, food and culture…')}
            className="w-full px-4 py-3 rounded-xl bg-surface-muted border border-line text-sm text-ink focus:outline-none focus:ring-2 focus:ring-antique-gold"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl text-xs font-bold text-ink-soft hover:bg-surface-muted cursor-pointer"
          >
            {t('create_deck_modal.btn_cancel', 'Cancel')}
          </button>
          <button
            onClick={onCreateDeck}
            disabled={!customDeckName.trim()}
            className="px-5 py-3 rounded-xl bg-heritage-green text-white text-xs font-bold hover:bg-heritage-dark cursor-pointer disabled:opacity-40"
          >
            {t('create_deck_modal.btn_create', 'Create deck')}
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
