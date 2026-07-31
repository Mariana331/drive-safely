'use client';

import Link from 'next/link';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import styles from './DashboardFooter.module.css';

export default function DashboardFooter() {
  const dict = useDictionary();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.copy}>
        {dict.footer.copyright.replace('{year}', String(year))}
      </p>
      <nav className={styles.links} aria-label={dict.footer.legal}>
        <Link href="/privacy">{dict.footer.privacy}</Link>
        <Link href="/terms">{dict.footer.terms}</Link>
        <Link href="/help">{dict.footer.help}</Link>
      </nav>
    </footer>
  );
}
