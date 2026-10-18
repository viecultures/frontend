import { useState, useEffect, useCallback } from 'react';
import type { BeforeInstallPromptEvent } from '@/vite-env';

export interface PWAInstallState {
  isMobile: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  isInstalled: boolean;
  showPrompt: boolean;
  promptInstall: () => Promise<boolean>;
  dismissPrompt: () => void;
  openPrompt: () => void;
}

export function usePWAInstall(): PWAInstallState {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Detect if running in standalone mode (already installed as PWA)
    const checkStandalone = (): boolean => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      return isStandaloneMedia || isIOSStandalone;
    };

    const standaloneActive = checkStandalone();
    setIsStandalone(standaloneActive);

    // 2. Detect Mobile device
    const userAgent = window.navigator.userAgent || '';
    const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const mobileScreen = window.innerWidth <= 820;
    const isMobileDevice = mobileUA || mobileScreen;
    setIsMobile(isMobileDevice);

    // 3. Detect iOS
    const iosDevice = /iPhone|iPad|iPod/i.test(userAgent);
    setIsIOS(iosDevice);

    // If already installed/opened in standalone, do not prompt
    if (standaloneActive) {
      return;
    }

    // 4. Capture beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstallPrompt = (e: Event) => {
      const installEvent = e as BeforeInstallPromptEvent;
      installEvent.preventDefault();
      setDeferredPrompt(installEvent);

    };

    // 5. Handle appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      sessionStorage.setItem('viecultures_pwa_dismissed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    // Installation is available from room settings, without interrupting learning.
    const handleInstallRequest = () => setShowPrompt(true);
    window.addEventListener('viecultures:request-install', handleInstallRequest);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('viecultures:request-install', handleInstallRequest);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('[PWA] Error triggering install prompt:', error);
      return false;
    }
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    setShowPrompt(false);
    sessionStorage.setItem('viecultures_pwa_dismissed', 'true');
  }, []);

  const openPrompt = useCallback(() => {
    window.dispatchEvent(new Event('viecultures:request-install'));
  }, []);

  return {
    isMobile,
    isIOS,
    isStandalone,
    canInstall: !!deferredPrompt,
    isInstalled,
    showPrompt,
    promptInstall,
    dismissPrompt,
    openPrompt,
  };
}
