'use client';

import { useLocale } from '@/lib/i18n/LocaleProvider';
import type { Locale } from '@/lib/i18n/config';
import styles from './LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
  variant?: 'header' | 'sidebar' | 'auth';
}

export default function LanguageSwitcher({
  variant = 'header',
}: LanguageSwitcherProps) {
  const { locale, setLocale, dict } = useLocale();

  const options: { id: Locale; label: string }[] = [
    { id: 'en', label: 'EN' },
    { id: 'uk', label: 'UA' },
  ];

  return (
    <div
      className={`${styles.switcher} ${styles[variant]}`}
      role="group"
      aria-label={dict.common.language}
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`${styles.btn} ${locale === opt.id ? styles.active : ''}`}
          onClick={() => setLocale(opt.id)}
          aria-pressed={locale === opt.id}
          title={opt.id === 'en' ? dict.common.english : dict.common.ukrainian}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
