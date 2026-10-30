import { useTranslation } from 'react-i18next';
import { BACKGROUND_PRESETS, useSettings } from '@/context/SettingsContext';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, Upload, X } from 'lucide-react';
import { usePWAInstall } from '@/components/pwa';
import { useRef, useState, type ChangeEvent } from 'react';

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_SAVED_BYTES = 2 * 1024 * 1024;

async function prepareBackground(file: File): Promise<string> {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) throw new Error('Choose a JPG, PNG, or WebP image.');
  if (file.size > MAX_FILE_BYTES) throw new Error('Choose an image under 10 MB.');

  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('This browser could not prepare the image.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    if (!dataUrl.startsWith('data:image/jpeg;base64,') || dataUrl.length > MAX_SAVED_BYTES) {
      throw new Error('This image is too detailed to save. Try a smaller image.');
    }
    return dataUrl;
  } finally {
    bitmap.close();
  }
}

export function SettingsModal() {
  const { t, i18n } = useTranslation('common');
  const {
    settings,
    isSettingsOpen,
    closeSettings,
    setBackgroundMode,
    setBackground,
    clearCustomBackground,
    activeBackground,
    resetSettings,
  } = useSettings();
  const { isMobile, isStandalone, isInstalled, openPrompt } = usePWAInstall();
  const fileInput = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState('');
  const [isPreparing, setIsPreparing] = useState(false);

  const isVi = (i18n.language || '').startsWith('vi');

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setImageError('');
    setIsPreparing(true);
    try {
      const dataUrl = await prepareBackground(file);
      if (!setBackground('custom', dataUrl)) {
        throw new Error(
          t(
            'settings_modal.save_image_error',
            'Your browser could not save this image. Try a smaller image or free up browser storage.'
          )
        );
      }
    } catch (error) {
      setImageError(
        error instanceof Error && error.message
          ? error.message
          : t('settings_modal.open_image_error', 'This image could not be opened. Try another image.')
      );
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <Modal
      isOpen={isSettingsOpen}
      onClose={closeSettings}
      title={t('settings_modal.title', 'Study room settings')}
      className="max-w-2xl"
    >
      <div className="max-h-[65dvh] overflow-y-auto pr-1">
        <p className="mb-6 text-base text-ink-soft">
          {t(
            'settings_modal.description',
            'Choose the atmosphere for your study room. Your preferences are saved on this device.'
          )}
        </p>
        <label className="mb-6 flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface-muted p-4 text-base text-ink">
          <input
            type="checkbox"
            className="size-5 accent-action"
            checked={settings.backgroundMode === 'auto'}
            onChange={event => setBackgroundMode(event.target.checked ? 'auto' : 'fixed')}
          />
          {t('settings_modal.auto_time_label', 'Change the room with the time of day')}
        </label>
        <h3 className="mb-3 text-lg font-semibold text-ink">
          {t('settings_modal.background_section', 'Background')}
        </h3>

        <div
          className={`grid grid-cols-1 gap-4 rounded-2xl border p-4 ${
            activeBackground.id === 'custom' ? 'border-action ring-2 ring-action/30' : 'border-line'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-ink">
                {t('settings_modal.custom_background', 'Custom background')}
              </h4>
              <p className="text-sm text-ink-soft">
                {t(
                  'settings_modal.custom_background_desc',
                  'Choose an image from your device. It stays in this browser.'
                )}
              </p>
            </div>
            {activeBackground.id === 'custom' && <Check className="size-5 text-action" aria-label="Selected" />}
          </div>

          {settings.customBackgroundUrl && (
            <button
              type="button"
              aria-label="Use custom background"
              aria-pressed={activeBackground.id === 'custom'}
              onClick={() => {
                setImageError('');
                setBackground('custom', settings.customBackgroundUrl);
              }}
              className="focus-ring mt-3 block w-full overflow-hidden rounded-xl border border-line"
            >
              <img
                src={settings.customBackgroundUrl}
                alt="Your custom background preview"
                className="aspect-[16/9] w-full object-cover"
              />
            </button>
          )}

          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="sr-only"
            aria-label="Choose custom background image"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPreparing}
              onClick={() => fileInput.current?.click()}
            >
              <Upload size={16} aria-hidden="true" />
              {isPreparing
                ? t('settings_modal.preparing_image', 'Preparing image…')
                : settings.customBackgroundUrl
                ? t('settings_modal.change_image', 'Change image')
                : t('settings_modal.choose_image', 'Choose image')}
            </Button>
            {settings.customBackgroundUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearCustomBackground();
                  setImageError('');
                }}
              >
                <X size={16} aria-hidden="true" />
                {t('settings_modal.remove_custom_background', 'Remove custom background')}
              </Button>
            )}
          </div>
          {imageError && (
            <p role="alert" className="mt-3 text-sm text-danger">
              {imageError}
            </p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BACKGROUND_PRESETS.map(background => {
            const selected = activeBackground.id === background.id;
            const bgName = isVi ? (background.name || background.nameEn) : background.nameEn;
            return (
              <button
                key={background.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setBackground(background.id)}
                className={`focus-ring relative overflow-hidden rounded-2xl border bg-surface-muted text-left ${
                  selected ? 'border-action ring-2 ring-action/30' : 'border-line'
                }`}
              >
                <span
                  className="block aspect-[16/9] bg-surface"
                  style={
                    background.id === 'minimal-none'
                      ? { background: background.url }
                      : {
                          backgroundImage: `url(${background.thumbnailUrl || background.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                  }
                  aria-hidden="true"
                />
                <span className="flex min-h-12 items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-ink">
                  {bgName}
                  {selected && <Check className="size-4 shrink-0" aria-hidden="true" />}
                </span>
              </button>
            );
          })}
        </div>

        {isMobile && !isStandalone && !isInstalled && (
          <div className="mt-6 border-t border-line pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                closeSettings();
                openPrompt();
              }}
            >
              {t('settings_modal.add_home_screen', 'Add app to home screen')}
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <Button type="button" variant="ghost" size="sm" onClick={resetSettings}>
          <RotateCcw size={17} />
          {t('settings_modal.reset_room', 'Reset room')}
        </Button>
        <Button type="button" size="sm" onClick={closeSettings}>
          {t('settings_modal.done', 'Done')}
        </Button>
      </div>
    </Modal>
  );
}

export default SettingsModal;
