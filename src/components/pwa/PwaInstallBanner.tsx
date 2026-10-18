import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Share, 
  PlusSquare, 
  X, 
  Sparkles, 
  Smartphone, 
  CheckCircle2, 
  Zap, 
  BookOpen, 
  ExternalLink,
  Star
} from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

export const PwaInstallBanner: React.FC = () => {
  const {
    isMobile,
    isIOS,
    isStandalone,
    canInstall,
    isInstalled,
    showPrompt,
    promptInstall,
    dismissPrompt,
  } = usePWAInstall();

  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  // If not mobile, already installed, or prompt is hidden, don't show
  if (!isMobile || isStandalone || isInstalled || !showPrompt) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (canInstall) {
      setIsInstalling(true);
      try {
        await promptInstall();
      } finally {
        setIsInstalling(false);
      }
    } else {
      setShowIOSGuide(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end p-3 sm:p-4">
        {/* Backdrop for focused mobile modal effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissPrompt}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto"
        />

        {/* Bottom Card Banner */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-lg mx-auto bg-[#FBF7EE] dark:bg-[#112320] text-[#163D37] dark:text-[#E8F3EE] rounded-3xl p-5 shadow-2xl border border-[#DCA842]/30 dark:border-[#DCA842]/20 pointer-events-auto overflow-hidden"
        >
          {/* Top Decorative Glow */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#163D37] via-[#DCA842] to-[#163D37]" />

          {/* Close Button */}
          <button
            onClick={dismissPrompt}
            aria-label="Dismiss install suggestion"
            className="absolute top-3.5 right-3.5 p-2 rounded-full text-[#3F5550] dark:text-[#9db6af] hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
          >
            <X size={20} />
          </button>

          {/* Header with App Icon */}
          <div className="flex items-center gap-3.5 pr-8">
            <div className="relative">
              <img
                src="/favicon/android-chrome-192x192.png"
                alt="VieCultures App Icon"
                className="w-14 h-14 rounded-2xl shadow-md border-2 border-[#DCA842]/60 object-cover bg-[#163D37]"
                onError={(e) => {
                  // Fallback if image fails
                  (e.currentTarget as HTMLImageElement).src = '/favicon/favicon-32x32.png';
                }}
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DCA842] shadow-xs">
                <Star size={10} className="fill-[#163D37] text-[#163D37]" />
              </span>
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#163D37]/10 dark:bg-[#DCA842]/15 text-[#163D37] dark:text-[#DCA842] text-[11px] font-semibold tracking-wide uppercase">
                <Sparkles size={12} className="text-[#DCA842]" />
                Mobile web app
              </div>
              <h3 className="text-base font-bold font-serif text-[#163D37] dark:text-[#FBF7EE] leading-snug mt-0.5">
                Add VieCultures to your home screen
              </h3>
              <p className="text-xs text-[#3F5550] dark:text-[#a5bcb7]">
                Read, listen and practise wherever you are.
              </p>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="mt-3.5 grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-white/70 dark:bg-black/20 border border-[#163D37]/10 dark:border-white/5">
            <div className="flex flex-col items-center text-center">
              <Zap size={16} className="text-[#DCA842] mb-1" />
              <span className="text-[11px] font-medium leading-tight">One-tap access</span>
            </div>
            <div className="flex flex-col items-center text-center border-x border-[#163D37]/10 dark:border-white/10 px-1">
              <BookOpen size={16} className="text-[#2D7A6E] dark:text-[#42a899] mb-1" />
              <span className="text-[11px] font-medium leading-tight">Full screen</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Smartphone size={16} className="text-[#DCA842] mb-1" />
              <span className="text-[11px] font-medium leading-tight">Browser based</span>
            </div>
          </div>

          {/* iOS / Manual Guide Dropdown */}
          {showIOSGuide ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3.5 p-3.5 rounded-2xl bg-[#163D37]/5 dark:bg-[#163D37]/30 border border-[#163D37]/15 dark:border-[#DCA842]/20 text-xs space-y-2"
            >
              <div className="font-semibold text-sm text-[#163D37] dark:text-[#DCA842] flex items-center gap-1.5">
                <Smartphone size={16} />
                Add to your home screen {isIOS ? '(iOS Safari)' : ''}:
              </div>
              <ol className="space-y-2 text-[#3F5550] dark:text-[#d3e5e0]">
                {isIOS ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#163D37] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                      <span>
                        Tap <span className="font-semibold text-[#007AFF] inline-flex items-center gap-1"><Share size={13} /> Share</span> in the Safari toolbar.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#163D37] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                      <span>
                        Scroll down and select <span className="font-semibold text-[#163D37] dark:text-[#DCA842] inline-flex items-center gap-1"><PlusSquare size={13} /> Add to Home Screen</span>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#163D37] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                      <span>
                        Tap <strong className="text-[#163D37] dark:text-[#FBF7EE]">Add</strong> in the top-right corner to finish.
                      </span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#163D37] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                      <span>
                        Open the browser menu <span className="font-semibold">(⋮ or ☰)</span> in the browser toolbar.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#163D37] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                      <span>
                        Choose <strong className="text-[#163D37] dark:text-[#DCA842]">"Install app"</strong> or <strong className="text-[#163D37] dark:text-[#DCA842]">"Add to Home Screen"</strong>.
                      </span>
                    </li>
                  </>
                )}
              </ol>
            </motion.div>
          ) : null}

          {/* Action Buttons */}
          <div className="mt-4 flex items-center gap-2.5">
            <button
              onClick={dismissPrompt}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#3F5550]/20 dark:border-white/10 text-xs font-semibold text-[#3F5550] dark:text-[#a0b8b2] hover:bg-black/5 dark:hover:bg-white/5 active:scale-98 transition-all"
            >
              Maybe later
            </button>

            {showIOSGuide ? (
              <button
                onClick={dismissPrompt}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#163D37] hover:bg-[#1c4c45] text-white dark:bg-[#DCA842] dark:text-[#0F2924] dark:hover:bg-[#e4b55a] font-semibold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                Got it
              </button>
            ) : (
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="flex-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#163D37] to-[#25574f] hover:from-[#1b4841] hover:to-[#2c635a] text-white dark:from-[#DCA842] dark:to-[#e4b55a] dark:text-[#0F2924] font-bold text-xs shadow-md shadow-[#163D37]/20 active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <Download size={15} className={isInstalling ? 'animate-bounce' : ''} />
                {isIOS ? 'Installation guide' : canInstall ? 'Install app' : 'Add to Home Screen'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
