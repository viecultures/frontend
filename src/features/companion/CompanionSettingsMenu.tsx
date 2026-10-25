import React, { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { CompanionLanguage } from '@/types/companion';

interface CompanionSettingsMenuProps {
  language: CompanionLanguage;
  onLanguageChange: (lang: CompanionLanguage) => void;
  onClearHistory: () => Promise<void>;
  remainingTurns: number | null;
  onResetSize?: () => void;
  isLoggedIn?: boolean;
}

interface LanguageOption {
  value: CompanionLanguage;
  label: string;
  hint: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'en', label: 'English', hint: 'Replies in English' },
  { value: 'vi', label: 'Vietnamese', hint: 'Replies in Tiếng Việt' },
  { value: 'bilingual', label: 'Bilingual', hint: 'English with Vietnamese terms' },
];

export const CompanionSettingsMenu: React.FC<CompanionSettingsMenuProps> = ({
  language,
  onLanguageChange,
  onClearHistory,
  remainingTurns,
  onResetSize,
  isLoggedIn = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setIsConfirmingClear(false);
  }, [isOpen]);

  const handleConfirmClear = async () => {
    setIsClearing(true);
    try {
      await onClearHistory();
      setIsOpen(false);
    } catch (err) {
      console.error('[CompanionSettingsMenu] Clear history failed:', err);
    } finally {
      setIsClearing(false);
      setIsConfirmingClear(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Chat settings"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className={`flex h-8 w-8 items-center justify-center rounded-full text-[#3e5a3a] transition-colors hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a9a6f] ${
          isOpen ? 'bg-white/80' : 'bg-white/40'
        }`}
      >
        <MoreHorizontal className="h-4 w-4" strokeWidth={2.4} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="vc-menu-in absolute right-0 top-10 z-10 w-60 overflow-hidden rounded-2xl border-2 border-[#8a9a6f] bg-[#fffaf0] text-[#3e5a3a] shadow-[0_5px_0_-1px_#c9d6b0,0_16px_30px_-12px_rgba(70,90,60,0.5)]"
        >
          <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a8a66]">
            Reply language
          </p>
          <div className="px-2 pb-2">
            {LANGUAGE_OPTIONS.map((opt) => {
              const checked = opt.value === language;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={checked}
                  onClick={() => onLanguageChange(opt.value)}
                  className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors ${
                    checked ? 'bg-[#e4f2df]' : 'hover:bg-[#f3efe0]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      checked ? 'border-[#5d8a45]' : 'border-[#b7c2a2]'
                    }`}
                  >
                    {checked && <span className="h-2 w-2 rounded-full bg-[#5d8a45]" />}
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold">{opt.label}</span>
                    <span className="text-[11px] text-[#7a8a66]">{opt.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-dashed border-[#c9d6b0] px-2 py-2">
            {onResetSize && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onResetSize();
                  setIsOpen(false);
                }}
                className="w-full rounded-xl px-2 py-2 text-left text-sm font-medium hover:bg-[#f3efe0]"
              >
                Reset window size
              </button>
            )}

            {!isConfirmingClear ? (
              <button
                type="button"
                role="menuitem"
                onClick={() => setIsConfirmingClear(true)}
                className="w-full rounded-xl px-2 py-2 text-left text-sm font-medium text-[#b4533c] hover:bg-[#fbe9e3]"
              >
                Clear chat history
              </button>
            ) : (
              <div className="rounded-xl bg-[#fbe9e3] p-2.5">
                <p className="mb-2 text-xs leading-snug text-[#8f3f2c]">
                  Delete this whole conversation? This cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingClear(false)}
                    disabled={isClearing}
                    className="rounded-full px-3 py-1 text-xs font-semibold text-[#7a8a66] hover:bg-white/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmClear}
                    disabled={isClearing}
                    className="rounded-full bg-[#b4533c] px-3 py-1 text-xs font-semibold text-white hover:bg-[#9a4330] disabled:opacity-60"
                  >
                    {isClearing ? 'Clearing...' : 'Clear'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {!isLoggedIn ? (
            <div className="flex items-center justify-between bg-[#f3efe0] px-4 py-2 text-[11px] text-[#7a8a66]">
              <span>Daily questions</span>
              <span className="font-semibold text-[#8f3f2c]">Requires login</span>
            </div>
          ) : remainingTurns !== null ? (
            <div className="flex items-center justify-between bg-[#f3efe0] px-4 py-2 text-[11px] text-[#7a8a66]">
              <span>Daily questions</span>
              <span className="font-semibold text-[#3e5a3a]">
                {remainingTurns === -1 ? 'Unlimited (Pro)' : `${remainingTurns} / 5 left`}
              </span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
