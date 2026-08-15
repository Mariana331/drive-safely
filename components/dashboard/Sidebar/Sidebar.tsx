'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShieldIcon } from '@/components/icons';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dict = useDictionary();
  const s = dict.sidebar;

  const navItems = [
    { label: s.dashboard, href: '/profile', icon: '🏠' },
    { label: s.aiAnalysis, href: '/ai-analysis', icon: '🎥' },
    { label: s.trafficRules, href: '/traffic-rules', icon: '📋' },
    { label: s.practiceTests, href: '/tests', icon: '✅' },
    { label: s.aiAssistant, href: '/assistant', icon: '💬' },
    { label: s.newsUpdates, href: '/news', icon: '📰' },
    { label: s.savedRules, href: '/saved-rules', icon: '🔖' },
    { label: s.favorites, href: '/favorites', icon: '⭐' },
    { label: s.myProfile, href: '/profile', icon: '👤' },
  ];

  return (
    <>
      <button
        className={styles.hamburger}
        onClick={() => setOpen(!open)}
        aria-label={s.toggleMenu}
      >
        ☰
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
          <ShieldIcon size={28} />
          <div>
            <span className={styles.brandName}>
              <span className={styles.brandDrive}>Drive</span>
              <span className={styles.brandSafely}>Safely</span>
            </span>
            <span className={styles.brandTagline}>{s.tagline}</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          <ul>
            {navItems.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href))
                      ? styles.active
                      : ''
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.langWrap}>
          <LanguageSwitcher variant="sidebar" />
        </div>

        <ThemeToggle variant="sidebar" />

        <div className={styles.driveBetter}>
          <p className={styles.driveBetterText}>{s.driveBetter}</p>
          <Image
            src="/images/smarter/minismarter.png"
            alt=""
            width={96}
            height={104}
            className={styles.driveBetterMascot}
          />
        </div>
      </aside>
    </>
  );
}
