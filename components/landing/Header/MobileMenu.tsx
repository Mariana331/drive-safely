'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, loading, logout } = useAuth();
  const dict = useDictionary();

  if (!isOpen) return null;

  const navLinks = [
    { label: dict.nav.home, href: '#home' },
    { label: dict.nav.aiAnalysis, href: '#features' },
    { label: dict.nav.trafficRules, href: '#features' },
    { label: dict.nav.news, href: '#news' },
    { label: dict.nav.tests, href: '#features' },
    { label: dict.nav.about, href: '#how-it-works' },
  ];

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <div className={styles.overlay}>
      <nav className={styles.menu} aria-label={dict.nav.main}>
        <div className={styles.langRow}>
          <LanguageSwitcher variant="header" />
        </div>
        <ul className={styles.list}>
          {navLinks.map((link) => (
            <li key={link.href + link.label}>
              <Link href={link.href} className={styles.link} onClick={onClose}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {loading ? null : user ? (
            <>
              <Link href="/profile" className={styles.userCard} onClick={onClose}>
                <span className={styles.avatar}>{getInitials(user.fullName)}</span>
                <span>
                  <strong className={styles.userName}>{user.fullName}</strong>
                  <span className={styles.userEmail}>{user.email}</span>
                </span>
              </Link>
              <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                {dict.common.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginBtn} onClick={onClose}>
                {dict.common.login}
              </Link>
              <Link href="/signup" className={styles.signupBtn} onClick={onClose}>
                {dict.common.signup}
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export function HamburgerButton({
  isOpen,
  onClick,
  className = '',
}: {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}) {
  const dict = useDictionary();
  return (
    <button
      className={`${styles.hamburger} ${isOpen ? styles.open : ''} ${className}`}
      onClick={onClick}
      aria-label={isOpen ? dict.common.showLess : dict.sidebar.toggleMenu}
      aria-expanded={isOpen}
    >
      <span />
      <span />
      <span />
    </button>
  );
}
