'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter/DashboardFooter';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useDictionary, useLocale } from '@/lib/i18n/LocaleProvider';
import { useUserProgress } from '@/lib/progress/useUserProgress';
import { useFavorites } from '@/lib/favorites/useFavorites';
import { DRIVER_LEVELS } from '@/lib/profile/driverLevels';
import {
  loadProfilePrefs,
  resolveDisplayName,
  type ProfilePrefs,
} from '@/lib/profile/profilePrefs';
import {
  ACHIEVEMENT_META,
  PROFILE_BANNER,
  activityIcon,
  buildWeekStreak,
  formatActivityTime,
  formatJoined,
  resolveProfileMetrics,
  safetyLabel,
  skillStatus,
  skillTone,
} from '@/lib/profile/profileDashboard';
import styles from './ProfilePage.module.css';

export default function ProfilePageClient() {
  const { user, loading, logout } = useAuth();
  const dict = useDictionary();
  const { locale } = useLocale();
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

  const metrics = resolveProfileMetrics(user, progress);
  const week = buildWeekStreak(metrics.streakCurrent);
  const xpProgress = Math.min(
    100,
    Math.round(
      ((metrics.xp - metrics.currentFloor) /
        Math.max(metrics.nextGoal - metrics.currentFloor, 1)) *
        100,
    ),
  );
  const location =
    prefs?.country || user.location || user.country || t.locationFallback;
  const bio = user.bio || t.bioFallback;
  const avatarSrc = prefs?.avatarDataUrl || user.avatarUrl || '';

  const quickStats = [
    {
      icon: '🎥',
      value: metrics.stats.videosAnalyzed,
      label: t.statVideosAnalyzed,
      delta: metrics.stats.videosMonthly,
      href: '/ai-analysis',
    },
    {
      icon: '📘',
      value: metrics.stats.rulesLearned,
      label: t.statRulesLearned,
      delta: metrics.stats.rulesMonthly,
      href: '/saved-rules',
    },
    {
      icon: '📝',
      value: metrics.stats.testsCompleted,
      label: t.statTestsCompleted,
      delta: metrics.stats.testsMonthly,
      href: '/tests',
    },
    {
      icon: '💬',
      value: Math.max(metrics.stats.aiQuestions, favorites.length),
      label: t.statAiQuestions,
      delta: metrics.stats.aiMonthly,
      href: '/assistant',
    },
    {
      icon: '🏆',
      value: metrics.stats.achievements,
      label: t.statAchievements,
      delta: metrics.stats.achievementsNew,
      href: '/favorites',
    },
  ];

  return (
    <>
      <DashboardHeader title={t.title} subtitle={t.dashboardSubtitle} />

      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroBanner}>
            <Image
              src={PROFILE_BANNER}
              alt=""
              fill
              className={styles.heroImage}
              sizes="(max-width: 1200px) 100vw, 1100px"
              priority
            />
            <div className={styles.heroOverlay} />
          </div>

          <div className={styles.heroBody}>
            <div className={styles.heroIdentity}>
              <div className={styles.avatarWrap}>
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt=""
                    fill
                    className={styles.avatarImage}
                    unoptimized={avatarSrc.startsWith('data:')}
                  />
                ) : (
                  <div className={styles.avatarFallback}>{initials}</div>
                )}
              </div>
              <div>
                <div className={styles.nameRow}>
                  <h2 className={styles.name}>{displayName}</h2>
                  <Link href="/profile/edit" className={styles.editBtn}>
                    {t.editProfile}
                  </Link>
                </div>
                <p className={styles.metaLine}>
                  📍 {location}
                  <span aria-hidden="true"> · </span>
                  {t.joined} {formatJoined(user.createdAt, locale)}
                </p>
                <p className={styles.bio}>“{bio}”</p>
              </div>
            </div>

            <div className={styles.scoreCard}>
              <div
                className={styles.scoreRing}
                style={
                  {
                    '--score': metrics.safetyScore,
                  } as React.CSSProperties
                }
              >
                <div className={styles.scoreInner}>
                  <strong>{metrics.safetyScore}</strong>
                  <span>/100</span>
                </div>
              </div>
              <div>
                <p className={styles.scoreTitle}>{t.safetyScore}</p>
                <p className={styles.scoreBadge}>
                  {safetyLabel(metrics.safetyScore)}
                </p>
                <p className={styles.scoreHint}>{t.safetyHint}</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.statsRow}>
          {quickStats.map((item) => (
            <Link key={item.label} href={item.href} className={styles.statCard}>
              <span className={styles.statIcon} aria-hidden="true">
                {item.icon}
              </span>
              <strong className={styles.statValue}>{item.value}</strong>
              <span className={styles.statLabel}>{item.label}</span>
              {item.delta > 0 ? (
                <span className={styles.statDelta}>
                  +{item.delta} {t.thisMonth}
                </span>
              ) : (
                <span className={styles.statDeltaMuted}>{t.keepGoing}</span>
              )}
            </Link>
          ))}
        </section>

        <div className={styles.mainGrid}>
          <div className={styles.mainCol}>
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>{t.skillsTitle}</h3>
              <ul className={styles.skills}>
                {metrics.skills.map((skill) => {
                  const tone = skillTone(skill.percent);
                  return (
                    <li key={skill.name} className={styles.skillRow}>
                      <div className={styles.skillTop}>
                        <span>{skill.name}</span>
                        <span className={styles[`tone_${tone}`]}>
                          {skill.percent}% · {skillStatus(skill.percent)}
                        </span>
                      </div>
                      <div className={styles.barTrack}>
                        <div
                          className={`${styles.barFill} ${styles[`fill_${tone}`]}`}
                          style={{ width: `${skill.percent}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
              {metrics.weakest ? (
                <div className={styles.focusBox}>
                  <strong>{t.focusArea}</strong>
                  <p>
                    {t.focusText.replace('{skill}', metrics.weakest.name)}{' '}
                    <Link href="/tests">{t.practiceNow}</Link>
                  </p>
                </div>
              ) : null}
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{t.achievementsTitle}</h3>
                <span className={styles.cardMeta}>
                  {metrics.unlocked}/{metrics.totalAchievements}
                </span>
              </div>
              <div className={styles.achievements}>
                {metrics.achievements.map((item) => {
                  const meta = ACHIEVEMENT_META[item.id] ?? {
                    icon: '🏅',
                    color: '#64748b',
                  };
                  return (
                    <div
                      key={item.id}
                      className={`${styles.badge} ${
                        item.unlocked ? '' : styles.badgeLocked
                      }`}
                      style={
                        item.unlocked
                          ? ({ '--badge': meta.color } as React.CSSProperties)
                          : undefined
                      }
                    >
                      <span className={styles.badgeIcon}>{meta.icon}</span>
                      <span className={styles.badgeTitle}>{item.title}</span>
                    </div>
                  );
                })}
              </div>
              <div className={styles.achieveTrack}>
                <div
                  className={styles.achieveFill}
                  style={{
                    width: `${Math.round(
                      (metrics.unlocked / metrics.totalAchievements) * 100,
                    )}%`,
                  }}
                />
              </div>
              <p className={styles.achieveHint}>
                {t.achievementsProgress
                  .replace('{unlocked}', String(metrics.unlocked))
                  .replace('{total}', String(metrics.totalAchievements))}
              </p>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{t.activityTitle}</h3>
                <Link href="/tests" className={styles.viewAll}>
                  {t.viewAll}
                </Link>
              </div>
              {metrics.activity.length === 0 ? (
                <p className={styles.empty}>{t.activityEmpty}</p>
              ) : (
                <ul className={styles.activityList}>
                  {metrics.activity.slice(0, 4).map((item, index) => (
                    <li key={`${item.text}-${index}`} className={styles.activityItem}>
                      <span className={styles.activityIcon}>
                        {activityIcon(item.type)}
                      </span>
                      <div>
                        <p className={styles.activityText}>{item.text}</p>
                        <p className={styles.activityTime}>
                          {formatActivityTime(item.createdAt, locale)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className={styles.sideCol}>
            <section className={styles.levelCard}>
              <p className={styles.levelEyebrow}>{t.driverLevel}</p>
              <h3 className={styles.levelName}>{metrics.level.label}</h3>
              <div className={styles.xpRow}>
                <span>
                  {metrics.xp} / {metrics.nextGoal} XP
                </span>
                <span>{xpProgress}%</span>
              </div>
              <div className={styles.xpTrack}>
                <div
                  className={styles.xpFill}
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <ol className={styles.levelTimeline}>
                {DRIVER_LEVELS.map((item, index) => (
                  <li
                    key={item.id}
                    className={`${styles.levelStep} ${
                      index === metrics.levelIndex ? styles.levelStepActive : ''
                    } ${index < metrics.levelIndex ? styles.levelStepDone : ''}`}
                  >
                    <span className={styles.levelDot} />
                    <span className={styles.levelStepLabel}>
                      {item.label.split(' ')[0]}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section className={styles.card}>
              <h3 className={styles.cardTitle}>{t.streakTitle}</h3>
              <div className={styles.streakHero}>
                <span className={styles.streakFlame} aria-hidden="true">
                  🔥
                </span>
                <div>
                  <strong>
                    {metrics.streakCurrent} {t.days}
                  </strong>
                  <p>
                    {t.bestStreak}: {Math.max(metrics.streakCurrent, 12)}{' '}
                    {t.days}
                  </p>
                </div>
              </div>
              <div className={styles.weekRow}>
                {week.map((day, index) => (
                  <div
                    key={`${day.label}-${index}`}
                    className={`${styles.weekDay} ${
                      day.active ? styles.weekActive : ''
                    } ${day.isToday ? styles.weekToday : ''}`}
                  >
                    <span>{day.label}</span>
                    <span>{day.active ? '✓' : '·'}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.card}>
              <h3 className={styles.cardTitle}>{t.accountTitle}</h3>
              <ul className={styles.accountList}>
                <li>
                  <Link href="/profile/edit">{t.navPersonal}</Link>
                </li>
                <li>
                  <Link href="/profile/edit#change-password">
                    {t.navPassword}
                  </Link>
                </li>
                <li>
                  <Link href="/saved-rules">{t.learningSavedRules}</Link>
                </li>
                <li>
                  <Link href="/favorites">{t.learningFavourites}</Link>
                </li>
                <li>
                  <button type="button" className={styles.logout} onClick={logout}>
                    {dict.common.logout}
                  </button>
                </li>
              </ul>
            </section>

            <section className={`${styles.card} ${styles.helpCard}`}>
              <div className={styles.helpIcon}>🎧</div>
              <h3 className={styles.cardTitle}>{t.helpTitle}</h3>
              <p className={styles.helpText}>{t.helpText}</p>
              <Link href="/assistant" className={styles.helpLink}>
                {t.helpCta}
              </Link>
            </section>
          </aside>
        </div>

        <DashboardFooter />
      </div>
    </>
  );
}
