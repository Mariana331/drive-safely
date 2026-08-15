'use client';

import { useDictionary } from '@/lib/i18n/LocaleProvider';
import { THEMES, type Theme } from '@/lib/theme/config';
import { useTheme } from '@/lib/theme/ThemeProvider';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  variant?: 'sidebar' | 'header' | 'compact';
}

const SWATCH: Record<Theme, string> = {
  light: '#3b82f6',
  teal: '#2BB7A9',
  mauve: '#CFA6B8',
  dark: '#111827',
};

export default function ThemeToggle({ variant = 'sidebar' }: ThemeToggleProps) {
  const { theme, setTheme, cycleTheme } = useTheme();
  const dict = useDictionary();

  const labels: Record<Theme, string> = {
    light: dict.sidebar.themeLight,
    teal: dict.sidebar.themeTeal,
    mauve: dict.sidebar.themeMauve,
    dark: dict.sidebar.themeDark,
  };

  if (variant === 'sidebar') {
    return (
      <div className={styles.sidebarRow}>
        <span className={styles.sidebarLabel}>{dict.sidebar.themeLabel}</span>
        <div className={styles.swatches} role="group" aria-label={dict.sidebar.themeLabel}>
          {THEMES.map((item) => (
            <button
              key={item}
              type="button"
              className={`${styles.swatch} ${theme === item ? styles.swatchActive : ''}`}
              style={{ background: SWATCH[item] }}
              onClick={() => setTheme(item)}
              aria-label={labels[item]}
              aria-pressed={theme === item}
              title={labels[item]}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={variant === 'header' ? styles.headerBtn : styles.compactBtn}
      onClick={cycleTheme}
      aria-label={`${dict.sidebar.themeLabel}: ${labels[theme]}`}
      title={labels[theme]}
    >
      <span
        className={styles.swatchDot}
        style={{ background: SWATCH[theme] }}
        aria-hidden="true"
      />
      {variant === 'header' ? <span>{labels[theme]}</span> : null}
    </button>
  );
}
