'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldIcon } from '@/components/icons';
import DriveyMascot from '@/components/illustrations/DriveyMascot';
import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Dashboard', href: '/profile', icon: '🏠' },
  { label: 'Upload Video', href: '/ai-analysis', icon: '🎥' },
  { label: 'AI Analysis', href: '/ai-analysis', icon: '🤖' },
  { label: 'Traffic Rules', href: '/traffic-rules', icon: '📋' },
  { label: 'Practice Tests', href: '/tests', icon: '✅' },
  { label: 'AI Assistant', href: '/assistant', icon: '💬' },
  { label: 'News & Updates', href: '/news', icon: '📰' },
  { label: 'Saved Rules', href: '/saved-rules', icon: '🔖' },
  { label: 'Favorites', href: '/favorites', icon: '⭐' },
  { label: 'My Profile', href: '/profile', icon: '👤' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={styles.hamburger}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
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
            <span className={styles.brandTagline}>Drive smarter. Stay safer.</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
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

        <div className={styles.proCard}>
          <DriveyMascot size="sm" />
          <div>
            <strong>Upgrade to Pro</strong>
            <p>Unlock advanced AI analysis</p>
          </div>
        </div>

        <div className={styles.darkMode}>
          <span>🌙 Dark Mode</span>
          <button className={styles.toggle} disabled aria-label="Dark mode coming soon" />
        </div>
      </aside>
    </>
  );
}
