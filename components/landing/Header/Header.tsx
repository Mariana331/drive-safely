'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldIcon } from '@/components/icons';
import { useAuth } from '@/lib/auth/AuthProvider';
import Button from '@/components/ui/Button/Button';
import MobileMenu, { HamburgerButton } from './MobileMenu';
import styles from './Header.module.css';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'AI Analysis', href: '#features' },
  { label: 'Traffic Rules', href: '#features' },
  { label: 'News', href: '#news' },
  { label: 'Tests', href: '#features' },
  { label: 'About', href: '#how-it-works' },
];

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
  const { user, loading, logout } = useAuth();

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

        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {loading ? (
            <div className={styles.authSkeleton} aria-hidden="true" />
          ) : user ? (
            <div className={styles.userMenu}>
              <Link href="/profile" className={styles.userLink}>
                <span className={styles.avatar}>{getInitials(user.fullName)}</span>
                <span className={styles.userName}>{user.fullName}</span>
              </Link>
              <button
                type="button"
                className={styles.logoutBtn}
                onClick={() => logout()}
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Button variant="ghost" href="/login">
                Log in
              </Button>
              <Button variant="primary" href="/signup">
                Sign Up
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
