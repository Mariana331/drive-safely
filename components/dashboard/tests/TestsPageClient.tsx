'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CATEGORY_OPTIONS,
  DIFFICULTY_LABEL,
  DIFFICULTY_OPTIONS,
  QUICK_ACTIONS,
  SORT_OPTIONS,
  TEST_TABS,
  filterTests,
  type TestCategory,
  type TestDifficulty,
  type TestTab,
} from '@/lib/tests/testsData';
import { createTestSession, type SessionMode } from '@/lib/tests/testSession';
import { useUserProgress } from '@/lib/progress/useUserProgress';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter/DashboardFooter';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import TestsSidebar from './TestsSidebar';
import styles from './TestsPage.module.css';

function ScoreRing({ score }: { score: number | null }) {
  if (score === null) {
    return <span className={styles.noScore}>—</span>;
  }

  return (
    <div
      className={styles.scoreRing}
      style={{ '--score': score } as React.CSSProperties}
    >
      <span>{score}%</span>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: TestDifficulty }) {
  return (
    <span className={`${styles.badge} ${styles[difficulty]}`}>
      {DIFFICULTY_LABEL[difficulty]}
    </span>
  );
}

function TestRow({
  test,
  onStart,
}: {
  test: TestCategory;
  onStart: () => void;
}) {
  return (
    <article className={styles.row}>
      <div className={styles.rowMain}>
        <span className={styles.rowIcon}>{test.icon}</span>
        <div>
          <h3 className={styles.rowTitle}>{test.name}</h3>
          <p className={styles.rowMeta}>{test.questionCount} questions</p>
        </div>
      </div>
      <DifficultyBadge difficulty={test.difficulty} />
      <ScoreRing score={test.lastScore} />
      <button type="button" className={styles.startBtn} onClick={onStart}>
        Start Test
      </button>
    </article>
  );
}

export default function TestsPageClient() {
  const dict = useDictionary();
  const router = useRouter();
  const { progress } = useUserProgress();
  const [tab, setTab] = useState<TestTab>('all');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [unansweredOnly, setUnansweredOnly] = useState(false);
  const [sort, setSort] = useState('latest');
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      filterTests(progress.categories, {
        tab,
        category,
        difficulty,
        unansweredOnly,
        search,
        sort,
      }),
    [progress.categories, tab, category, difficulty, unansweredOnly, search, sort],
  );

  const startSession = (mode: SessionMode, categorySlug?: string) => {
    const session = createTestSession({
      mode,
      category: categorySlug,
    });
    router.push(`/tests/take/${session.id}`);
  };

  return (
    <>
      <DashboardHeader
        title={dict.dashboard.testsTitle}
        subtitle={dict.dashboard.testsSubtitle}
      />

      <div className={styles.page}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon} aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tests..."
              className={styles.searchInput}
              aria-label="Search tests"
            />
          </div>

          <div className={styles.tabs}>
            {TEST_TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.tab} ${tab === item.id ? styles.tabActive : ''}`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            {QUICK_ACTIONS.map((action) => (
              <article
                key={action.id}
                className={`${styles.actionCard} ${styles[action.accent]}`}
              >
                <span className={styles.actionIcon}>{action.icon}</span>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => startSession(action.id as SessionMode)}
                >
                  {action.button}
                </button>
              </article>
            ))}
          </div>

          <div className={styles.filters}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.select}
              aria-label="Filter by category"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={styles.select}
              aria-label="Filter by difficulty"
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={unansweredOnly}
                onChange={(e) => setUnansweredOnly(e.target.checked)}
              />
              Unanswered only
            </label>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={styles.select}
              aria-label="Sort tests"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort by: {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.main}>
            <div className={styles.listHeader}>
              <span>Test</span>
              <span>Difficulty</span>
              <span>Last Score</span>
              <span>Action</span>
            </div>

            {filtered.length > 0 ? (
              <div className={styles.list}>
                {filtered.map((test) => (
                  <TestRow
                    key={test.id}
                    test={test}
                    onStart={() => startSession('category', test.category)}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <p>No tests match your filters.</p>
              </div>
            )}

            <div className={styles.bottomCards}>
              <article className={styles.bottomCard}>
                <h3>Review Your Mistakes</h3>
                <p>Go through harder questions and learn from explanations.</p>
                <button
                  type="button"
                  className={styles.bottomBtn}
                  onClick={() => startSession('review')}
                >
                  Review Mistakes
                </button>
              </article>
              <article className={styles.bottomCard}>
                <h3>Challenge Yourself</h3>
                <p>Take a harder mixed test and push your limits today.</p>
                <button
                  type="button"
                  className={styles.bottomBtn}
                  onClick={() => startSession('challenge')}
                >
                  Start Challenge
                </button>
              </article>
            </div>

            <DashboardFooter />
          </div>

          <TestsSidebar stats={progress.testsStats} />
        </div>
      </div>
    </>
  );
}
