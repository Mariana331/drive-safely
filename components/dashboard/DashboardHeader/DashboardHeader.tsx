'use client';

import { useAuth } from '@/lib/auth/AuthProvider';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import styles from './DashboardHeader.module.css';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export default function DashboardHeader({
  title,
  subtitle,
}: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const dict = useDictionary();
  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '?';

  return (
    <header className={styles.header}>
      <div className={styles.titles}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.actions}>
        <button className={styles.bell} aria-label={dict.common.notifications}>
          🔔
          <span className={styles.badge}>3</span>
        </button>
        <div className={styles.userMenu}>
          <div className={styles.avatar}>{initials}</div>
          <span className={styles.name}>{user?.fullName ?? dict.common.user}</span>
          <button className={styles.logout} onClick={() => logout()}>
            {dict.common.logout}
          </button>
        </div>
      </div>
    </header>
  );
}
