'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter/DashboardFooter';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import { useUserProgress } from '@/lib/progress/useUserProgress';
import { useFavorites } from '@/lib/favorites/useFavorites';
import {
  DRIVER_LEVELS,
  getDriverLevel,
  getDriverLevelIndex,
} from '@/lib/profile/driverLevels';
import {
  loadProfilePrefs,
  resolveDisplayName,
  type ProfilePrefs,
} from '@/lib/profile/profilePrefs';
import styles from './ProfilePage.module.css';

export default function ProfilePageClient() {
  const { user, loading } = useAuth();
  const dict = useDictionary();
  const t = dict.profile;
  const { progress, ready } = useUserProgress();
  const { items: favorites } = useFavorites();
  const [prefs, setPrefs] = useState<ProfilePrefs | null>(null);

  useEffect(() => {
    setPrefs(loadProfilePrefs());
  }, [user?._id]);

  if (loading || !ready) {
    return (
      <div className={styles.loading}>
        <DashboardHeader title={t.title} subtitle={t.loading} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loading}>
        <DashboardHeader title={t.title} subtitle={t.loginRequired} />
      </div>
    );
  }

  const displayName = resolveDisplayName(user.fullName, prefs);
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const level = getDriverLevel(progress.safetyScore);
  const levelIndex = getDriverLevelIndex(progress.safetyScore);

  const stats = [
    {
      icon: '🎥',
      label: t.statVideos,
      value: String(progress.videosAnalyzed),
      href: '/ai-analysis',
    },
    {
      icon: '📝',
      label: t.statTests,
      value: String(progress.testsCompleted),
      href: '/tests',
    },
    {
      icon: '🏆',
      label: t.statBestScore,
      value:
        progress.testsCompleted > 0 ? `${progress.bestScore}%` : '—',
      href: '/tests',
    },
    {
      icon: '🔖',
      label: t.statSavedRules,
      value: String(progress.rulesStudied),
      href: '/saved-rules',
    },
    {
      icon: '❤️',
      label: t.statFavourites,
      value: String(favorites.length),
      href: '/favorites',
    },
  ];

  const learning = [
    {
      icon: '🔖',
      label: t.learningSavedRules,
      href: '/saved-rules',
      meta: t.learningSavedRulesMeta.replace(
        '{count}',
        String(progress.rulesStudied),
      ),
    },
    {
      icon: '❤️',
      label: t.learningFavourites,
      href: '/favorites',
      meta: t.learningFavouritesMeta.replace(
        '{count}',
        String(favorites.length),
      ),
    },
    {
      icon: '📝',
      label: t.learningTests,
      href: '/tests',
      meta: t.learningTestsMeta.replace(
        '{count}',
        String(progress.testsCompleted),
      ),
    },
    {
      icon: '🎥',
      label: t.learningVideos,
      href: '/ai-analysis',
      meta: t.learningVideosMeta.replace(
        '{count}',
        String(progress.videosAnalyzed),
      ),
    },
  ];

  return (
    <>
      <DashboardHeader title={`👤 ${t.title}`} subtitle={t.subtitle} />

      <div className={styles.page}>
        <section className={styles.driverCard}>
          <div className={styles.driverTop}>
            <div className={styles.avatarWrap}>
              {prefs?.avatarDataUrl ? (
                <Image
                  src={prefs.avatarDataUrl}
                  alt=""
                  fill
                  className={styles.avatarImage}
                  unoptimized
                />
              ) : user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt=""
                  fill
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatar}>{initials}</div>
              )}
            </div>

            <div className={styles.driverInfo}>
              <h2 className={styles.name}>{displayName}</h2>
              <p className={styles.email}>{user.email}</p>
              <Link href="/profile/edit" className={styles.editBtn}>
                {t.editProfile}
              </Link>
            </div>
          </div>

          <div className={styles.driverMeta}>
            <p className={styles.levelLine}>
              {t.levelLabel}: <strong>{level.label}</strong>
            </p>
            <p className={styles.scoreLine}>
              <span aria-hidden="true">🛡️</span>{' '}
              {t.safetyScore}: <strong>{progress.safetyScore}/100</strong>
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.statsTitle}</h2>
          <ul className={styles.statsList}>
            {stats.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={styles.statRow}>
                  <span className={styles.statIcon} aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className={styles.statLabel}>{item.label}</span>
                  <strong className={styles.statValue}>{item.value}</strong>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🏆 {t.progressTitle}</h2>
          <p className={styles.sectionHint}>{t.progressHint}</p>
          <ol className={styles.progressTrack}>
            {DRIVER_LEVELS.map((item, index) => {
              const isCurrent = index === levelIndex;
              const isDone = index < levelIndex;
              return (
                <li
                  key={item.id}
                  className={`${styles.progressItem} ${
                    isCurrent ? styles.progressCurrent : ''
                  } ${isDone ? styles.progressDone : ''}`}
                >
                  <span className={styles.progressLabel}>
                    {item.label}
                    {isCurrent ? (
                      <span className={styles.currentTag}>
                        {' '}
                        ← {t.currentLevel}
                      </span>
                    ) : null}
                  </span>
                  {index < DRIVER_LEVELS.length - 1 ? (
                    <span className={styles.progressArrow} aria-hidden="true">
                      ↓
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📚 {t.learningTitle}</h2>
          <p className={styles.sectionHint}>{t.learningHint}</p>
          <div className={styles.learningGrid}>
            {learning.map((item) => (
              <Link key={item.href} href={item.href} className={styles.learnCard}>
                <span className={styles.learnIcon} aria-hidden="true">
                  {item.icon}
                </span>
                <span className={styles.learnLabel}>{item.label}</span>
                <span className={styles.learnMeta}>{item.meta}</span>
              </Link>
            ))}
          </div>
        </section>

        <DashboardFooter />
      </div>
    </>
  );
}
