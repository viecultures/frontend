import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogPanel } from '@headlessui/react';
import { X, ZoomIn } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  caption?: string;
  title?: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  caption,
  title,
}) => {
  const { t } = useTranslation('community');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="community-ui fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <DialogPanel className="relative max-w-4xl max-h-[92vh] flex flex-col items-center overflow-hidden rounded-2xl bg-[#1A2E28] border border-[#314F49]/50 shadow-2xl">
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer focus-ring"
          aria-label={t('community.lightbox.close_aria')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* High Res Image */}
        <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden bg-black/40">
          <img
            src={imageUrl}
            alt={caption || title || t('community.lightbox.default_alt')}
            className="w-full h-auto max-h-[75vh] object-contain select-none"
          />
        </div>

        {/* Caption & Title Footer */}
        {(caption || title) && (
          <div className="w-full p-4 bg-[#142621] text-white border-t border-[#314F49]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="min-w-0">
              {title && (
                <h4 className="font-serif text-sm font-bold text-[#E8D7AE] truncate">
                  {title}
                </h4>
              )}
              {caption && (
                <p className="text-xs text-[#FAF7F0]/80 mt-0.5 line-clamp-2">
                  {caption}
                </p>
              )}
            </div>
            <div className="text-[11px] font-medium text-[#E8D7AE] shrink-0 inline-flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{t('community.lightbox.archive_label')}</span>
            </div>
          </div>
        )}
      </DialogPanel>
    </Dialog>
  );
};

export default ImageLightboxModal;
