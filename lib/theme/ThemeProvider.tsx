'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  THEME_COOKIE,
  THEME_STORAGE_KEY,
  getSystemTheme,
  nextTheme,
  normalizeTheme,
  themeColorScheme,
  type Theme,
} from './config';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  cycleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = themeColorScheme(theme);
}

function persistTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.cookie = `${THEME_COOKIE}=${theme};path=/;max-age=31536000;samesite=lax`;
}

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
}

export function ThemeProvider({
  children,
  initialTheme = 'light',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  useEffect(() => {
    const stored = normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
    const next = stored ?? getSystemTheme();
    setThemeState(next);
    applyTheme(next);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    persistTheme(next);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = nextTheme(prev);
      applyTheme(next);
      persistTheme(next);
      return next;
    });
  }, []);

  /** Keep toggle as cycle for backward-compatible callers. */
  const toggleTheme = cycleTheme;

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, cycleTheme }),
    [theme, setTheme, toggleTheme, cycleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
