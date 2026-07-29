'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthProvider';
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

  if (!isOpen) return null;

  const handleLogout = async () => {
    onClose();
    await logout();
  };

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
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginBtn} onClick={onClose}>
                Log in
              </Link>
              <Link href="/signup" className={styles.signupBtn} onClick={onClose}>
                Sign Up
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
