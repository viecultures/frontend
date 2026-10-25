import React from 'react';

interface CompanionFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const CompanionFloatingButton: React.FC<CompanionFloatingButtonProps> = ({
  onClick,
  isOpen,
}) => {
  if (isOpen) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Cultural AI Companion"
      className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-amber-800 text-amber-50 font-serif font-bold text-sm rounded-full shadow-lg hover:bg-amber-900 hover:shadow-xl transition-all border border-amber-600 flex items-center gap-2"
    >
      <span>AI Companion</span>
    </button>
  );
};
