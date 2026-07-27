'use client';

import { useAuth } from '@/lib/auth/AuthProvider';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.loading}>
        <DashboardHeader title="My Profile" subtitle="Loading your profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loading}>
        <DashboardHeader title="My Profile" subtitle="Please log in to view your profile." />
      </div>
    );
  }

  const initials = user.fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <DashboardHeader
        title="My Profile"
        subtitle="Track your progress and driving safety stats."
      />

      <div className={styles.page}>
        <section className={styles.heroCard}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <h2 className={styles.name}>{user.fullName}</h2>
            <p className={styles.email}>{user.email}</p>
            <p className={styles.meta}>
              {user.location || user.country} · {user.level}
            </p>
          </div>
          <div className={styles.score}>
            <span className={styles.scoreValue}>{user.safetyScore}</span>
            <span className={styles.scoreLabel}>Safety Score</span>
          </div>
        </section>

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <strong>{user.stats.videosAnalyzed}</strong>
            <span>Analyses</span>
          </div>
          <div className={styles.statCard}>
            <strong>{user.stats.testsCompleted}</strong>
            <span>Tests Passed</span>
          </div>
          <div className={styles.statCard}>
            <strong>{user.stats.rulesLearned}</strong>
            <span>Rules Studied</span>
          </div>
          <div className={styles.statCard}>
            <strong>{user.streak.current}</strong>
            <span>Day Streak</span>
          </div>
        </section>

        <section className={styles.bioCard}>
          <h3>About</h3>
          <p>{user.bio}</p>
        </section>
      </div>
    </>
  );
}
