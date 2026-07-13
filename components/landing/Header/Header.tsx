'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldIcon } from '@/components/icons';
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

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container_beforeAuth ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <ShieldIcon size={28} />
          <span>DriveSafely</span>
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
          <Button variant="ghost" href="/login">
            Log in
          </Button>
          <Button variant="primary" href="/signup">
            Sign Up
          </Button>
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
