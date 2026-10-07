import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AppLanguage = 'vi' | 'en';

export interface BackgroundPreset {
  id: string;
  name: string;
  nameEn: string;
  url: string;
  category: 'lofi' | 'heritage' | 'minimal' | 'nature';
  thumbnailUrl?: string;
  cost?: number;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  // Core Time of Day Trio (Non nước Tràng An • Đại nội Huế • Sài Gòn về đêm)
  {
    id: 'lofi-morning',
    name: 'Non nước Tràng An',
    nameEn: 'Trang An Sunrise',
    url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80',
    category: 'heritage',
  },
  {
    id: 'lofi-afternoon',
    name: 'Đại nội Huế',
    nameEn: 'Hue Imperial Citadel',
    url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=2400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=400&q=80',
    category: 'heritage',
  },
  {
    id: 'lofi-night',
    name: 'Sài Gòn về đêm',
    nameEn: 'Saigon at Night',
    url: 'https://images.unsplash.com/photo-1536086845112-89de23aa4772?auto=format&fit=crop&w=2400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536086845112-89de23aa4772?auto=format&fit=crop&w=400&q=80',
    category: 'heritage',
  },
  {
    id: 'minimal-none',
    name: 'None',
    nameEn: 'None',
    url: 'linear-gradient(135deg, #122A22 0%, #163D37 50%, #0B1A17 100%)',
    thumbnailUrl: '',
    category: 'minimal',
  },

  // Lofi Themed Collection
  {
    id: 'lofi-cafe',
    name: 'Café',
    nameEn: 'Café',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
    category: 'lofi',
    cost: 5,
  },
  {
    id: 'lofi-chilling',
    name: 'Chilling',
    nameEn: 'Chilling',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=2400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80',
    category: 'lofi',
    cost: 5,
  },
  {
    id: 'lofi-gaming',
    name: 'Gaming',
    nameEn: 'Gaming',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    category: 'lofi',
    cost: 5,
  },
  {
    id: 'lofi-raining-boy',
    name: 'Raining Boy',
    nameEn: 'Raining Boy',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=2400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=400&q=80',
    category: 'lofi',
    cost: 10,
  },
  {
    id: 'lofi-reading-boy',
    name: 'Reading Boy',
    nameEn: 'Reading Boy',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=2400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
    category: 'lofi',
    cost: 10,
  },
  {
    id: 'lofi-summer-girl',
    name: 'Summer Girl',
    nameEn: 'Summer Girl',
    url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=2400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=400&q=80',
    category: 'lofi',
    cost: 10,
  },

  // Nature Collection
  {
    id: 'autumn-leaves',
    name: 'Lá Thu',
    nameEn: 'Autumn Leaves',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    category: 'nature',
  },
  {
    id: 'ocean-foam',
    name: 'Sóng Biển',
    nameEn: 'Ocean Wave Contrast',
    url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=2400&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80',
    category: 'nature',
  },
];

export type BackgroundMode = 'auto' | 'fixed';
export type TimeOfDayPeriod = 'morning' | 'afternoon' | 'night';

export function getAutoTimeOfDayBackgroundId(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'lofi-morning';
  if (hour >= 12 && hour < 18) return 'lofi-afternoon';
  return 'lofi-night';
}

export function getCurrentTimePeriod(): TimeOfDayPeriod {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'night';
}

export interface AppSettings {
  boardTitle: string;
  theme: ThemeMode;
  language: AppLanguage;
  accentColor: string;
  backgroundMode: BackgroundMode;
  backgroundId: string;
  customBackgroundUrl?: string;
}

interface SettingsContextType {
  settings: AppSettings;
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  isDark: boolean;
  language: AppLanguage;
  accentColor: string;
  boardTitle: string;
  activeBackground: BackgroundPreset;
  backgroundMode: BackgroundMode;
  currentTimePeriod: TimeOfDayPeriod;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (lang: AppLanguage) => void;
  setAccentColor: (colorHex: string) => void;
  setBoardTitle: (title: string) => void;
  setBackgroundMode: (mode: BackgroundMode) => void;
  setBackground: (bgId: string, customUrl?: string) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  boardTitle: 'Personal Tracker',
  theme: 'light',
  language: 'vi',
  accentColor: '#84CC16',
  backgroundMode: 'auto',
  backgroundId: 'lofi-morning',
  customBackgroundUrl: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('viecultures_app_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          theme: 'light',
        };
      }
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [currentTimePeriod, setCurrentTimePeriod] = useState<TimeOfDayPeriod>(() => getCurrentTimePeriod());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Update currentTimePeriod every minute
  useEffect(() => {
    const updatePeriod = () => {
      const nextPeriod = getCurrentTimePeriod();
      setCurrentTimePeriod((prev) => (prev !== nextPeriod ? nextPeriod : prev));
    };
    updatePeriod();
    const timer = setInterval(updatePeriod, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fixed light theme (theme trắng)
  const resolvedTheme: 'light' | 'dark' = 'light';
  const isDark = false;

  // Apply Light Theme & Accent Color to DOM
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.style.colorScheme = 'light';

    // Apply accent color as dynamic CSS variable
    root.style.setProperty('--app-accent', settings.accentColor);
    root.style.setProperty('--app-accent-rgb', hexToRgb(settings.accentColor));
  }, [settings.accentColor]);

  // Persist to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem('viecultures_app_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  }, [settings]);

  // Lookup active background
  const activeBgId =
    settings.backgroundMode === 'auto'
      ? getAutoTimeOfDayBackgroundId()
      : settings.backgroundId;

  const activeBackground =
    BACKGROUND_PRESETS.find((bg) => bg.id === activeBgId) ||
    BACKGROUND_PRESETS[0];

  // Context Actions
  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);
  const toggleSettings = () => setIsSettingsOpen((prev) => !prev);

  const setTheme = (theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const setLanguage = (language: AppLanguage) => {
    setSettings((prev) => ({ ...prev, language }));
  };

  const setAccentColor = (accentColor: string) => {
    setSettings((prev) => ({ ...prev, accentColor }));
  };

  const setBoardTitle = (boardTitle: string) => {
    setSettings((prev) => ({ ...prev, boardTitle }));
  };

  const setBackgroundMode = (backgroundMode: BackgroundMode) => {
    setSettings((prev) => ({ ...prev, backgroundMode }));
  };

  const setBackground = (backgroundId: string, customBackgroundUrl?: string) => {
    setSettings((prev) => ({
      ...prev,
      backgroundMode: 'fixed',
      backgroundId,
      customBackgroundUrl: customBackgroundUrl ?? prev.customBackgroundUrl,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        theme: settings.theme,
        resolvedTheme,
        isDark,
        language: settings.language,
        accentColor: settings.accentColor,
        boardTitle: settings.boardTitle,
        activeBackground,
        backgroundMode: settings.backgroundMode || 'auto',
        currentTimePeriod,
        isSettingsOpen,
        openSettings,
        closeSettings,
        toggleSettings,
        setTheme,
        setLanguage,
        setAccentColor,
        setBoardTitle,
        setBackgroundMode,
        setBackground,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Helper: Hex to RGB string for CSS rgba
function hexToRgb(hex: string): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '225, 29, 72'; // fallback rose-600
}
