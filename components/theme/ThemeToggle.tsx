'use client';

import { useDictionary } from '@/lib/i18n/LocaleProvider';
import { useTheme } from '@/lib/theme/ThemeProvider';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  variant?: 'sidebar' | 'header' | 'compact';
}

export default function ThemeToggle({ variant = 'sidebar' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const dict = useDictionary();
  const isDark = theme === 'dark';
  const label = isDark ? dict.sidebar.lightMode : dict.sidebar.darkMode;

  if (variant === 'sidebar') {
    return (
      <div className={styles.sidebarRow}>
        <span>
          {isDark ? '☀️' : '🌙'} {label}
        </span>
        <button
          type="button"
          className={`${styles.toggle} ${isDark ? styles.toggleOn : ''}`}
          onClick={toggleTheme}
          aria-label={label}
          aria-pressed={isDark}
        >
          <span className={styles.knob} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={
        variant === 'header' ? styles.headerBtn : styles.compactBtn
      }
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {isDark ? '☀️' : '🌙'}
      {variant === 'header' ? <span>{isDark ? 'Light' : 'Dark'}</span> : null}
    </button>
  );
}
