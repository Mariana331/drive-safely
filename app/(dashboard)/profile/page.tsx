'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useDictionary, useLocale } from '@/lib/i18n/LocaleProvider';
import { useUserProgress } from '@/lib/progress/useUserProgress';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import styles from './profile.module.css';

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const dict = useDictionary();
  const { locale } = useLocale();
  const { progress, ready } = useUserProgress();
  const { profileTitle, profileSubtitle } = dict.dashboard;

  if (loading || !ready) {
    return (
      <div className={styles.loading}>
        <DashboardHeader title={profileTitle} subtitle="Loading your profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loading}>
        <DashboardHeader
          title={profileTitle}
          subtitle="Please log in to view your profile."
        />
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
      <DashboardHeader title={profileTitle} subtitle={profileSubtitle} />

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
            <span className={styles.scoreValue}>{progress.safetyScore}</span>
            <span className={styles.scoreLabel}>Safety Score</span>
          </div>
        </section>

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <strong>{progress.videosAnalyzed}</strong>
            <span>Analyses</span>
          </div>
          <div className={styles.statCard}>
            <strong>{progress.testsPassed}</strong>
            <span>Tests Passed</span>
            <small className={styles.statHint}>
              {progress.testsCompleted} completed
            </small>
          </div>
          <div className={styles.statCard}>
            <strong>{progress.rulesStudied}</strong>
            <span>Rules Studied</span>
          </div>
          <div className={styles.statCard}>
            <strong>{progress.streak}</strong>
            <span>Day Streak</span>
          </div>
        </section>

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <strong>
              {progress.testsCompleted > 0 ? `${progress.averageScore}%` : '—'}
            </strong>
            <span>Average Test Score</span>
          </div>
          <div className={styles.statCard}>
            <strong>
              {progress.testsCompleted > 0 ? `${progress.bestScore}%` : '—'}
            </strong>
            <span>Best Score</span>
          </div>
          <div className={styles.statCard}>
            <strong>
              {progress.totalAnswers > 0
                ? `${progress.correctAnswers}/${progress.totalAnswers}`
                : '—'}
            </strong>
            <span>Correct Answers</span>
          </div>
          <div className={styles.statCard}>
            <strong>
              {progress.totalAnswers > 0
                ? `${Math.round((progress.correctAnswers / progress.totalAnswers) * 100)}%`
                : '—'}
            </strong>
            <span>Accuracy</span>
          </div>
        </section>

        <section className={styles.resultsCard}>
          <div className={styles.resultsHeader}>
            <h3>Recent Test Results</h3>
            <Link href="/tests" className={styles.resultsLink}>
              Practice Tests →
            </Link>
          </div>

          {progress.recentTests.length === 0 ? (
            <p className={styles.emptyResults}>
              No tests completed yet. Take a practice test to see your exact
              scores here.
            </p>
          ) : (
            <ul className={styles.resultsList}>
              {progress.recentTests.map((test) => (
                <li key={test.id} className={styles.resultRow}>
                  <div>
                    <p className={styles.resultTitle}>{test.title}</p>
                    <p className={styles.resultMeta}>
                      {formatDate(test.completedAt, locale)} ·{' '}
                      {test.correctCount}/{test.totalQuestions} correct
                    </p>
                  </div>
                  <div className={styles.resultRight}>
                    <span
                      className={`${styles.resultScore} ${
                        test.passed ? styles.passed : styles.failed
                      }`}
                    >
                      {test.score}%
                    </span>
                    <Link
                      href={`/tests/results/${test.id}`}
                      className={styles.resultLink}
                    >
                      Details
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {user.bio ? (
          <section className={styles.bioCard}>
            <h3>About</h3>
            <p>{user.bio}</p>
          </section>
        ) : null}
      </div>
    </>
  );
}
