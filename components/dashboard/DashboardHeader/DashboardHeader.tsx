'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import {
  loadProfilePrefs,
  resolveDisplayName,
  type ProfilePrefs,
} from '@/lib/profile/profilePrefs';
import {
  buildNotifications,
  formatNotificationTime,
  loadReadNotificationIds,
  markAllNotificationsRead,
  markNotificationRead,
  notificationIcon,
  type AppNotification,
} from '@/lib/notifications/notificationsStore';
import styles from './DashboardHeader.module.css';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export default function DashboardHeader({
  title,
  subtitle,
}: DashboardHeaderProps) {
  const { user, loading, logout } = useAuth();
  const dict = useDictionary();
  const [prefs, setPrefs] = useState<ProfilePrefs | null>(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setPrefs(null);
      setNotifications([]);
      setReadIds([]);
      return;
    }
    const refresh = () => {
      setPrefs(loadProfilePrefs());
      setNotifications(buildNotifications());
      setReadIds(loadReadNotificationIds());
    };
    refresh();
    window.addEventListener('drivesafely:profile-updated', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('drivesafely:profile-updated', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [user?._id]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(`.${styles.bellWrap}`)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const displayName = user
    ? resolveDisplayName(user.fullName, prefs)
    : '';
  const initials =
    displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';
  const avatarSrc = user
    ? prefs?.avatarDataUrl || user.avatarUrl || ''
    : '';

  const unread = notifications.filter((item) => !readIds.includes(item.id));
  const unreadCount = unread.length;

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleMarkAll = () => {
    const next = markAllNotificationsRead(notifications.map((n) => n.id));
    setReadIds(next);
  };

  const handleOpenItem = (item: AppNotification) => {
    const next = markNotificationRead(item.id);
    setReadIds(next);
    setOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.titles}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.actions}>
        {loading ? (
          <div className={styles.authSkeleton} aria-hidden="true" />
        ) : user ? (
          <>
            <div className={styles.bellWrap}>
              <button
                type="button"
                className={styles.bell}
                aria-label={dict.common.notifications}
                aria-expanded={open}
                aria-haspopup="true"
                onClick={handleOpen}
              >
                🔔
                {unreadCount > 0 ? (
                  <span className={styles.badge}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                ) : null}
              </button>

              {open ? (
                <div className={styles.dropdown} role="menu">
                  <div className={styles.dropdownHeader}>
                    <strong>{dict.common.notifications}</strong>
                    {unreadCount > 0 ? (
                      <button
                        type="button"
                        className={styles.markAll}
                        onClick={handleMarkAll}
                      >
                        {dict.common.markAllRead}
                      </button>
                    ) : null}
                  </div>

                  {notifications.length === 0 ? (
                    <p className={styles.empty}>{dict.common.noNotifications}</p>
                  ) : (
                    <ul className={styles.list}>
                      {notifications.map((item) => {
                        const isUnread = !readIds.includes(item.id);
                        return (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              className={`${styles.item} ${
                                isUnread ? styles.itemUnread : ''
                              }`}
                              onClick={() => handleOpenItem(item)}
                            >
                              <span className={styles.itemIcon} aria-hidden="true">
                                {notificationIcon(item.kind)}
                              </span>
                              <span className={styles.itemBody}>
                                <span className={styles.itemTitle}>{item.title}</span>
                                <span className={styles.itemText}>{item.body}</span>
                                <span className={styles.itemTime}>
                                  {formatNotificationTime(item.createdAt)}
                                </span>
                              </span>
                              {isUnread ? <span className={styles.dot} /> : null}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ) : null}
            </div>

            <div className={styles.userMenu}>
              <Link href="/profile" className={styles.userLink}>
                <div className={styles.avatar}>
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
                    initials
                  )}
                </div>
                <span className={styles.name}>{displayName}</span>
              </Link>
              <button
                type="button"
                className={styles.logout}
                onClick={() => logout()}
              >
                {dict.common.logout}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.guestAuth}>
            <Link href="/login" className={styles.loginLink}>
              {dict.common.login}
            </Link>
            <Link href="/signup" className={styles.signupLink}>
              {dict.common.signup}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
