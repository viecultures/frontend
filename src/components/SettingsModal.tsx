import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  RotateCcw,
  Check,
  Palette,
  Sparkles,
  Gem,
  Clock,
} from 'lucide-react';
import {
  useSettings,
  BACKGROUND_PRESETS,
  ACCENT_COLOR_PRESETS,
  getAutoTimeOfDayBackgroundId,
} from '@/context/SettingsContext';

export const SettingsModal: React.FC = () => {
  const {
    settings,
    isSettingsOpen,
    closeSettings,
    setAccentColor,
    setBackgroundMode,
    setBackground,
    currentTimePeriod,
    resetSettings,
  } = useSettings();

  const [showSaveToast, setShowSaveToast] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  if (!isSettingsOpen) return null;

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccentColor(e.target.value);
    triggerToast();
  };

  const triggerToast = () => {
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  };

  // Find presets for Background section
  const morningPreset = BACKGROUND_PRESETS.find((b) => b.id === 'lofi-morning') || BACKGROUND_PRESETS[0];
  const afternoonPreset = BACKGROUND_PRESETS.find((b) => b.id === 'lofi-afternoon') || BACKGROUND_PRESETS[1];
  const nightPreset = BACKGROUND_PRESETS.find((b) => b.id === 'lofi-night') || BACKGROUND_PRESETS[2];

  // Presets for Lofi & Heritage collection
  const lofiCollection = BACKGROUND_PRESETS.filter(
    (b) => !['lofi-morning', 'lofi-afternoon', 'lofi-night', 'minimal-none'].includes(b.id)
  );

  const isAutoActive = settings.backgroundMode === 'auto';
  const autoActiveId = getAutoTimeOfDayBackgroundId();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
          onClick={closeSettings}
          aria-hidden="true"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#18191c] text-white rounded-3xl shadow-2xl border border-white/10 p-5 sm:p-6 overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col font-sans"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
            <div>
              <h2
                id="settings-modal-title"
                className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2 font-serif italic"
              >
                <span>Cài đặt Trang chủ</span>
              </h2>
              <p className="text-[11px] text-white/50 font-normal font-sans not-italic mt-0.5">
                Tùy chỉnh màu chủ đề & hình nền không gian học
              </p>
            </div>

            <button
              type="button"
              onClick={closeSettings}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer focus-ring"
              aria-label="Đóng cài đặt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Unified Scrollable Form Content */}
          <div className="overflow-y-auto pr-1 py-4 space-y-6 custom-scrollbar">

            {/* 1. Color Theme */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-white/90 tracking-wide">
                Color Theme
              </h3>
              <div className="flex items-center flex-wrap gap-2.5 pt-0.5">
                {ACCENT_COLOR_PRESETS.map((color) => {
                  const isSelected =
                    settings.accentColor.toLowerCase() === color.hex.toLowerCase();

                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        setAccentColor(color.hex);
                        triggerToast();
                      }}
                      title={color.name}
                      className={`w-10 h-10 rounded-2xl transition-all cursor-pointer relative flex items-center justify-center border-2 p-1 ${
                        isSelected
                          ? 'border-white scale-105 shadow-lg shadow-black/40 ring-2 ring-white/30'
                          : 'border-white/10 hover:border-white/40 hover:scale-105 opacity-90 hover:opacity-100 bg-[#25282c]'
                      }`}
                    >
                      <div
                        className="w-full h-full rounded-xl flex items-center justify-center shadow-inner overflow-hidden"
                        style={{
                          background: color.secondary
                            ? `linear-gradient(135deg, ${color.secondary} 0%, ${color.hex} 100%)`
                            : color.hex,
                        }}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}

                {/* Custom Color Trigger Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => colorInputRef.current?.click()}
                    style={{ backgroundColor: settings.accentColor }}
                    className="px-3.5 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
                    title="Chọn màu tuỳ chỉnh"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Tuỳ chỉnh</span>
                  </button>
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={settings.accentColor}
                    onChange={handleCustomColorChange}
                    className="sr-only"
                    aria-label="Chọn màu tùy chỉnh"
                  />
                </div>
              </div>
            </div>

            {/* 2. Background (Auto, None, Morning, Afternoon, Night) */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-white/90 tracking-wide">
                Background
              </h3>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Auto Card */}
                <button
                  type="button"
                  onClick={() => {
                    setBackgroundMode('auto');
                    triggerToast();
                  }}
                  className={`aspect-[16/10] rounded-2xl transition-all cursor-pointer relative flex flex-col items-center justify-center p-2 border overflow-hidden ${
                    isAutoActive
                      ? 'border-white bg-[#282d30] shadow-xl ring-2 ring-white/30'
                      : 'border-white/10 bg-[#202326] hover:bg-[#282b2f] hover:border-white/30'
                  }`}
                >
                  <span className="text-sm font-bold text-white tracking-wide">Auto</span>
                  <span className="text-[10px] text-white/50 mt-0.5 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-antique-gold" />
                    <span>Sáng • Chiều • Tối</span>
                  </span>

                  {isAutoActive && (
                    <div
                      style={{ backgroundColor: settings.accentColor }}
                      className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center shadow"
                    >
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  )}
                </button>

                {/* None Card */}
                <button
                  type="button"
                  onClick={() => {
                    setBackground('minimal-none');
                    triggerToast();
                  }}
                  className={`aspect-[16/10] rounded-2xl transition-all cursor-pointer relative flex flex-col items-center justify-center p-2 border overflow-hidden ${
                    !isAutoActive && settings.backgroundId === 'minimal-none'
                      ? 'border-white bg-[#282d30] shadow-xl ring-2 ring-white/30'
                      : 'border-white/10 bg-[#202326] hover:bg-[#282b2f] hover:border-white/30'
                  }`}
                >
                  <span className="text-sm font-bold text-white tracking-wide">None</span>
                  <span className="text-[10px] text-white/50 mt-0.5 font-medium">Tối giản</span>

                  {!isAutoActive && settings.backgroundId === 'minimal-none' && (
                    <div
                      style={{ backgroundColor: settings.accentColor }}
                      className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center shadow"
                    >
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  )}
                </button>

                {/* Morning Card (Non nước Tràng An) */}
                <button
                  type="button"
                  onClick={() => {
                    setBackground('lofi-morning');
                    triggerToast();
                  }}
                  title="Sáng: Non nước Tràng An"
                  className={`aspect-[16/10] rounded-2xl transition-all cursor-pointer relative overflow-hidden group border ${
                    (!isAutoActive && settings.backgroundId === 'lofi-morning') || (isAutoActive && autoActiveId === 'lofi-morning')
                      ? 'border-white shadow-xl ring-2 ring-white/30'
                      : 'border-white/10 hover:border-white/30 opacity-90 hover:opacity-100'
                  }`}
                >
                  <img
                    src={morningPreset.thumbnailUrl || morningPreset.url}
                    alt="Non nước Tràng An"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-xs font-bold text-white drop-shadow-md">Tràng An</span>
                    <span className="text-[9px] text-amber-300 font-medium">(Sáng)</span>
                  </div>

                  {((!isAutoActive && settings.backgroundId === 'lofi-morning') || (isAutoActive && autoActiveId === 'lofi-morning')) && (
                    <div
                      style={{ backgroundColor: settings.accentColor }}
                      className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center shadow"
                    >
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  )}
                </button>

                {/* Afternoon Card (Đại nội Huế) */}
                <button
                  type="button"
                  onClick={() => {
                    setBackground('lofi-afternoon');
                    triggerToast();
                  }}
                  title="Trưa: Đại nội Huế"
                  className={`aspect-[16/10] rounded-2xl transition-all cursor-pointer relative overflow-hidden group border ${
                    (!isAutoActive && settings.backgroundId === 'lofi-afternoon') || (isAutoActive && autoActiveId === 'lofi-afternoon')
                      ? 'border-white shadow-xl ring-2 ring-white/30'
                      : 'border-white/10 hover:border-white/30 opacity-90 hover:opacity-100'
                  }`}
                >
                  <img
                    src={afternoonPreset.thumbnailUrl || afternoonPreset.url}
                    alt="Đại nội Huế"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-xs font-bold text-white drop-shadow-md">Đại Nội Huế</span>
                    <span className="text-[9px] text-yellow-300 font-medium">(Trưa)</span>
                  </div>

                  {((!isAutoActive && settings.backgroundId === 'lofi-afternoon') || (isAutoActive && autoActiveId === 'lofi-afternoon')) && (
                    <div
                      style={{ backgroundColor: settings.accentColor }}
                      className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center shadow"
                    >
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  )}
                </button>

                {/* Night Card (Sài Gòn về đêm) */}
                <button
                  type="button"
                  onClick={() => {
                    setBackground('lofi-night');
                    triggerToast();
                  }}
                  title="Tối: Sài Gòn về đêm"
                  className={`aspect-[16/10] rounded-2xl transition-all cursor-pointer relative overflow-hidden group border ${
                    (!isAutoActive && settings.backgroundId === 'lofi-night') || (isAutoActive && autoActiveId === 'lofi-night')
                      ? 'border-white shadow-xl ring-2 ring-white/30'
                      : 'border-white/10 hover:border-white/30 opacity-90 hover:opacity-100'
                  }`}
                >
                  <img
                    src={nightPreset.thumbnailUrl || nightPreset.url}
                    alt="Sài Gòn về đêm"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-xs font-bold text-white drop-shadow-md">Sài Gòn</span>
                    <span className="text-[9px] text-indigo-300 font-medium">(Tối)</span>
                  </div>

                  {((!isAutoActive && settings.backgroundId === 'lofi-night') || (isAutoActive && autoActiveId === 'lofi-night')) && (
                    <div
                      style={{ backgroundColor: settings.accentColor }}
                      className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center shadow"
                    >
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* 3. Lofi & Collection */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-white/90 tracking-wide">
                Lofi
              </h3>

              <div className="grid grid-cols-3 gap-2.5">
                {lofiCollection.map((preset) => {
                  const isSelected = !isAutoActive && settings.backgroundId === preset.id;
                  const isGradient = preset.url.startsWith('linear-gradient');

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setBackground(preset.id);
                        triggerToast();
                      }}
                      className={`aspect-[16/10] rounded-2xl overflow-hidden group transition-all cursor-pointer relative border ${
                        isSelected
                          ? 'border-white scale-[1.02] shadow-xl ring-2 ring-white/30'
                          : 'border-white/10 hover:border-white/30 opacity-85 hover:opacity-100'
                      }`}
                      title={preset.name}
                    >
                      {/* Background image / gradient */}
                      {isGradient ? (
                        <div className="w-full h-full" style={{ background: preset.url }} />
                      ) : (
                        <img
                          src={preset.thumbnailUrl || preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      )}

                      {/* Dark overlay with Title & Diamond / Cost badge */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:from-black/70 flex flex-col justify-between p-2">
                        <div className="flex justify-end">
                          {isSelected && (
                            <div
                              style={{ backgroundColor: settings.accentColor }}
                              className="w-4 h-4 rounded-full flex items-center justify-center shadow"
                            >
                              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                            </div>
                          )}
                        </div>

                        <div className="text-center">
                          <span className="text-[11px] sm:text-xs font-bold text-white drop-shadow-md block truncate">
                            {preset.name}
                          </span>
                          {preset.cost && (
                            <div className="inline-flex items-center justify-center gap-1 text-[10px] font-extrabold text-sky-400 mt-0.5">
                              <Gem className="w-2.5 h-2.5 fill-current" />
                              <span>{preset.cost}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => {
                resetSettings();
                triggerToast();
              }}
              className="text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-white/5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mặc định</span>
            </button>

            <button
              type="button"
              onClick={closeSettings}
              style={{ backgroundColor: settings.accentColor }}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Xong
            </button>
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {showSaveToast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 text-[#181a1b] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 pointer-events-none z-20"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>Đã lưu cài đặt!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SettingsModal;
