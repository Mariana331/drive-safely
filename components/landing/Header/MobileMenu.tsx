'use client';

import Link from 'next/link';
import styles from './MobileMenu.module.css';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'AI Analysis', href: '#features' },
  { label: 'Traffic Rules', href: '#features' },
  { label: 'News', href: '#news' },
  { label: 'Tests', href: '#features' },
  { label: 'About', href: '#how-it-works' },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <nav className={styles.menu} aria-label="Mobile navigation">
        <ul className={styles.list}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className={styles.link} onClick={onClose}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <Link href="/login" className={styles.loginBtn} onClick={onClose}>
            Log in
          </Link>
          <Link href="/signup" className={styles.signupBtn} onClick={onClose}>
            Sign Up
          </Link>
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
  return (
    <button
      className={`${styles.hamburger} ${isOpen ? styles.open : ''} ${className}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <span />
      <span />
      <span />
    </button>
  );
}
