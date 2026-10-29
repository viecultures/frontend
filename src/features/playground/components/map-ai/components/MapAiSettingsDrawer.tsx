import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  X,
  Volume2,
  Volume1,
  Cpu,
  Bot,
  Check,
  Key,
  RotateCcw
} from 'lucide-react';
import { AVAILABLE_VOICES, AVAILABLE_MODELS, PERSONA_OPTIONS } from '../constants';
import type { VoiceOption, MapAiSettingsState } from '../types';

interface MapAiSettingsDrawerProps {
  isOpen: boolean;
  settings: MapAiSettingsState;
  onClose: () => void;
  onUpdateSettings: (updater: (prev: MapAiSettingsState) => MapAiSettingsState) => void;
  onResetDefaults: () => void;
  onPreviewVoice: (voice: VoiceOption) => void;
  onApplySettings: () => void;
}

export const MapAiSettingsDrawer: React.FC<MapAiSettingsDrawerProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
  onResetDefaults,
  onPreviewVoice,
  onApplySettings,
}) => {
  const { t } = useTranslation('playground');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer container */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white dark:bg-[#14231F] text-[#1E2925] dark:text-[#E8EFEA] h-full shadow-2xl z-50 flex flex-col border-r border-heritage-green/20 dark:border-white/10 animate-in slide-in-from-left duration-300 select-text">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-heritage-green text-warm-ivory shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-antique-gold/20 text-antique-gold flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base leading-tight text-warm-ivory">
                {t('playground.settings_drawer.header_title')}
              </h2>
              <p className="text-[11px] text-antique-gold">
                {t('playground.settings_drawer.header_desc')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title={t('playground.settings_drawer.close_title')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-6 text-sm">
          {/* 1. Voice Selection Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="font-semibold text-xs text-heritage-green dark:text-antique-gold flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" />
                <span>{t('playground.settings_drawer.voice_section_title')}</span>
              </label>
              <span className="text-[11px] text-gray-500">{t('playground.settings_drawer.voices_available', { count: AVAILABLE_VOICES.length })}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_VOICES.map((v) => {
                const isSelected = settings.selectedVoice === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() =>
                      onUpdateSettings((prev) => ({ ...prev, selectedVoice: v.id }))
                    }
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${isSelected
                      ? 'bg-heritage-green/10 dark:bg-antique-gold/15 border-heritage-green dark:border-antique-gold shadow-sm ring-1 ring-heritage-green dark:ring-antique-gold'
                      : 'bg-gray-50/80 dark:bg-[#1E2E2A]/60 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-heritage-green dark:text-warm-ivory">
                        {v.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-gray-600 dark:text-gray-300">
                        {v.gender}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-tight mb-2">
                      {v.description}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateSettings((prev) => ({ ...prev, selectedVoice: v.id }));
                        onPreviewVoice(v);
                      }}
                      className="w-full py-1 rounded-lg bg-white dark:bg-[#14231F] border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 text-[11px] font-medium text-heritage-green dark:text-antique-gold flex items-center justify-center gap-1 transition-all"
                    >
                      <Volume1 className="w-3.5 h-3.5" />
                      <span>{t('playground.settings_drawer.listen_preview')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Speed & Pitch Sliders */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1E2E2A]/60 border border-gray-200 dark:border-white/10 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span>{t('playground.settings_drawer.speed_label', { rate: settings.speechRate.toFixed(2) })}</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={settings.speechRate}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    speechRate: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-heritage-green dark:accent-antique-gold cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span>{t('playground.settings_drawer.pitch_label', { pitch: settings.speechPitch.toFixed(2) })}</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={settings.speechPitch}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    speechPitch: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-heritage-green dark:accent-antique-gold cursor-pointer"
              />
            </div>
          </div>

          {/* 3. Model Selection */}
          <div>
            <label className="font-semibold text-xs text-heritage-green dark:text-antique-gold flex items-center gap-1.5 mb-2">
              <Cpu className="w-4 h-4" />
              <span>{t('playground.settings_drawer.model_section_title')}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() =>
                    onUpdateSettings((prev) => ({ ...prev, selectedModel: m.id }))
                  }
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${settings.selectedModel === m.id
                    ? 'bg-heritage-green/10 dark:bg-antique-gold/15 border-heritage-green dark:border-antique-gold ring-1 ring-heritage-green dark:ring-antique-gold'
                    : 'bg-gray-50/80 dark:bg-[#1E2E2A]/60 border-gray-200 dark:border-white/10'
                    }`}
                >
                  <div className="font-bold text-xs text-heritage-green dark:text-warm-ivory">{m.name}</div>
                  <p className="text-[10.5px] text-gray-500 dark:text-gray-400 mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Persona Preset */}
          <div>
            <label className="font-semibold text-xs text-heritage-green dark:text-antique-gold flex items-center gap-1.5 mb-2">
              <Bot className="w-4 h-4" />
              <span>{t('playground.settings_drawer.persona_section_title')}</span>
            </label>
            <div className="space-y-1.5">
              {PERSONA_OPTIONS.map((p) => (
                <div
                  key={p.id}
                  onClick={() =>
                    onUpdateSettings((prev) => ({ ...prev, selectedPersona: p.id }))
                  }
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${settings.selectedPersona === p.id
                    ? 'bg-heritage-green/10 dark:bg-antique-gold/15 border-heritage-green dark:border-antique-gold'
                    : 'bg-gray-50/80 dark:bg-[#1E2E2A]/60 border-gray-200 dark:border-white/10'
                    }`}
                >
                  <div>
                    <div className="font-bold text-xs">{p.title}</div>
                    <p className="text-[11px] text-gray-500">{p.desc}</p>
                  </div>
                  {settings.selectedPersona === p.id && (
                    <Check className="w-4 h-4 text-heritage-green dark:text-antique-gold" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5. Custom API Key override (Optional) */}
          <div>
            <label className="font-semibold text-xs text-heritage-green dark:text-antique-gold flex items-center gap-1.5 mb-1.5">
              <Key className="w-4 h-4" />
              <span>{t('playground.settings_drawer.api_key_title')}</span>
            </label>
            <input
              type="password"
              value={settings.customApiKey}
              onChange={(e) =>
                onUpdateSettings((prev) => ({ ...prev, customApiKey: e.target.value }))
              }
              placeholder={t('playground.settings_drawer.api_key_placeholder')}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#1E2E2A] border border-gray-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-heritage-green dark:focus:ring-antique-gold"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              {t('playground.settings_drawer.api_key_hint')}
            </p>
          </div>

          {/* 6. Auto-sync Map switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1E2E2A]/60 border border-gray-200 dark:border-white/10">
            <div>
              <div className="font-bold text-xs">{t('playground.settings_drawer.auto_sync_map_title')}</div>
              <p className="text-[11px] text-gray-500">{t('playground.settings_drawer.auto_sync_map_desc')}</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSyncMap}
              onChange={(e) =>
                onUpdateSettings((prev) => ({ ...prev, autoSyncMap: e.target.checked }))
              }
              className="w-4 h-4 accent-heritage-green dark:accent-antique-gold cursor-pointer"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#101C19] flex items-center justify-between shrink-0">
          <button
            onClick={onResetDefaults}
            className="px-3 py-2 rounded-xl text-xs text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('playground.settings_drawer.reset_defaults')}</span>
          </button>

          <button
            onClick={onApplySettings}
            className="px-4 py-2 rounded-xl bg-heritage-green hover:bg-[#15342F] text-antique-gold text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{t('playground.settings_drawer.apply_settings')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapAiSettingsDrawer;
