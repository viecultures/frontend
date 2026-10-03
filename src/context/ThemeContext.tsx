import React from 'react';
import { useSettings, type ThemeMode } from './SettingsContext';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useTheme = (): ThemeContextType => {
  try {
    const { theme, resolvedTheme, isDark, setTheme } = useSettings();
    return {
      theme: resolvedTheme,
      themeMode: theme,
      isDark,
      toggleTheme: () => setTheme(isDark ? 'light' : 'dark'),
      setTheme: (newTheme: ThemeMode) => setTheme(newTheme),
    };
  } catch {
    return {
      theme: 'dark',
      themeMode: 'dark',
      isDark: true,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
};
