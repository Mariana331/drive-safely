'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldIcon } from '@/components/icons';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import Button from '@/components/ui/Button/Button';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import ThemeToggle from '@/components/theme/ThemeToggle';
import {
  loadProfilePrefs,
  resolveDisplayName,
  type ProfilePrefs,
} from '@/lib/profile/profilePrefs';
import MobileMenu, { HamburgerButton } from './MobileMenu';
import styles from './Header.module.css';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [prefs, setPrefs] = useState<ProfilePrefs | null>(null);
  const { user, loading, logout } = useAuth();
  const dict = useDictionary();

  useEffect(() => {
    const refresh = () => setPrefs(loadProfilePrefs());
    refresh();
    window.addEventListener('drivesafely:profile-updated', refresh);
    return () =>
      window.removeEventListener('drivesafely:profile-updated', refresh);
  }, [user?._id]);

  const displayName = user ? resolveDisplayName(user.fullName, prefs) : '';
  const avatarSrc = prefs?.avatarDataUrl || user?.avatarUrl || '';

  const navLinks = [
    { label: dict.nav.home, href: '#home' },
    { label: dict.nav.aiAnalysis, href: '#features' },
    { label: dict.nav.trafficRules, href: '#features' },
    { label: dict.nav.news, href: '#news' },
    { label: dict.nav.tests, href: '#features' },
    { label: dict.nav.about, href: '#how-it-works' },
  ];

  return (
    <header className={styles.header}>
      <div className={`container_beforeAuth ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <ShieldIcon size={28} />
          <span className={styles.logoText}>
            <span className={styles.logoDrive}>Drive</span>
            <span className={styles.logoSafely}>Safely</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label={dict.nav.main}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.href + link.label}>
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle variant="compact" />
          <LanguageSwitcher variant="header" />
          {loading ? (
            <div className={styles.authSkeleton} aria-hidden="true" />
          ) : user ? (
            <div className={styles.userMenu}>
              <Link href="/profile" className={styles.userLink}>
                <span className={styles.avatar}>
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt=""
                      fill
                      className={styles.avatarImage}
                      sizes="36px"
                      unoptimized={avatarSrc.startsWith('data:')}
                    />
                  ) : (
                    getInitials(displayName || user.fullName)
                  )}
                </span>
                <span className={styles.userName}>{displayName}</span>
              </Link>
              <button
                type="button"
                className={styles.logoutBtn}
                onClick={() => logout()}
              >
                {dict.common.logout}
              </button>
            </div>
          ) : (
            <>
              <Button variant="ghost" href="/login">
                {dict.common.login}
              </Button>
              <Button variant="primary" href="/signup">
                {dict.common.signup}
              </Button>
            </>
          )}
        </div>

        <HamburgerButton
          isOpen={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className={styles.menuBtn}
        />
      </div>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
