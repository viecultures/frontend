import { BACKGROUND_PRESETS, useSettings } from '@/context/SettingsContext';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw } from 'lucide-react';
import { usePWAInstall } from '@/components/pwa';

export function SettingsModal() {
  const { settings, isSettingsOpen, closeSettings, setBackgroundMode, setBackground, activeBackground, resetSettings } = useSettings();
  const { isMobile, isStandalone, isInstalled, openPrompt } = usePWAInstall();
  return (
    <Modal isOpen={isSettingsOpen} onClose={closeSettings} title="Study room settings" className="max-w-2xl">
      <div className="max-h-[65dvh] overflow-y-auto pr-1">
        <p className="mb-6 text-base text-ink-soft">Choose the atmosphere for your study room. Your preferences are saved on this device.</p>
        <label className="mb-6 flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface-muted p-4 text-base text-ink">
          <input type="checkbox" className="size-5 accent-action" checked={settings.backgroundMode === 'auto'} onChange={event => setBackgroundMode(event.target.checked ? 'auto' : 'fixed')} />
          Change the room with the time of day
        </label>
        <h3 className="mb-3 text-lg font-semibold text-ink">Background</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BACKGROUND_PRESETS.map(background => {
            const selected = activeBackground.id === background.id;
            return <button key={background.id} type="button" aria-pressed={selected} onClick={() => setBackground(background.id)} className={`focus-ring relative overflow-hidden rounded-2xl border bg-surface-muted text-left ${selected ? 'border-action ring-2 ring-action/30' : 'border-line'}`}>
              <span className="block aspect-[16/9] bg-action" style={background.url.startsWith('linear-gradient') ? { background: background.url } : { backgroundImage: `url(${background.thumbnailUrl || background.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} aria-hidden="true" />
              <span className="flex min-h-12 items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-ink">{background.nameEn}{selected && <Check className="size-4 shrink-0" aria-hidden="true" />}</span>
            </button>;
          })}
        </div>
        {isMobile && !isStandalone && !isInstalled && <div className="mt-6 border-t border-line pt-4"><Button type="button" variant="outline" size="sm" onClick={() => { closeSettings(); openPrompt(); }}>Add app to home screen</Button></div>}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <Button type="button" variant="ghost" size="sm" onClick={resetSettings}><RotateCcw size={17} />Reset room</Button>
        <Button type="button" size="sm" onClick={closeSettings}>Done</Button>
      </div>
    </Modal>
  );
}
