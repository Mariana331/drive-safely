import {
  getPassThreshold,
  listCompletedTestSessions,
  listTestSessions,
  type TestSession,
} from '@/lib/tests/testSession';
import { FALLBACK_TESTS, type TestCategory, type TestsStats } from '@/lib/tests/testsData';
import { listAnalysisSessions } from '@/lib/analysis/analysisSession';
import {
  TRAFFIC_RULES,
  loadSavedRuleIds,
  type LearningProgress,
} from '@/lib/traffic-rules/trafficRulesData';

export interface RecentTestResult {
  id: string;
  title: string;
  mode: TestSession['mode'];
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  completedAt: string;
  category?: string;
}

export interface UserProgress {
  safetyScore: number;
  videosAnalyzed: number;
  testsCompleted: number;
  testsPassed: number;
  rulesStudied: number;
  streak: number;
  averageScore: number;
  bestScore: number;
  correctAnswers: number;
  totalAnswers: number;
  recentTests: RecentTestResult[];
  testsStats: TestsStats;
  learningProgress: LearningProgress;
  categories: TestCategory[];
}

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function computeStreak(activityDates: string[]): number {
  if (activityDates.length === 0) return 0;

  const days = new Set(activityDates.map(dayKey));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayKey = dayKey(today.toISOString());
  const yesterdayKey = dayKey(yesterday.toISOString());

  let cursor = new Date(today);
  if (!days.has(todayKey)) {
    if (!days.has(yesterdayKey)) return 0;
    cursor = yesterday;
  }

  let streak = 0;
  while (days.has(dayKey(cursor.toISOString()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function toRecent(session: TestSession): RecentTestResult | null {
  if (!session.completedAt || session.score == null || session.correctCount == null) {
    return null;
  }
  const threshold = getPassThreshold(session.mode);
  return {
    id: session.id,
    title: session.title,
    mode: session.mode,
    score: session.score,
    correctCount: session.correctCount,
    totalQuestions: session.questions.length,
    passed: session.score >= threshold,
    completedAt: session.completedAt,
    category: session.category,
  };
}

function categoryPerformance(completed: TestSession[]) {
  const nameByKey = Object.fromEntries(
    FALLBACK_TESTS.map((t) => [t.category, t.name]),
  );
  const buckets = new Map<string, { correct: number; total: number }>();

  for (const session of completed) {
    for (const question of session.questions) {
      const key = question.category || session.category || 'general';
      const name = nameByKey[key] ?? key;
      const bucket = buckets.get(name) ?? { correct: 0, total: 0 };
      bucket.total += 1;
      if (session.answers[question.id] === question.correctIndex) {
        bucket.correct += 1;
      }
      buckets.set(name, bucket);
    }
  }

  if (buckets.size === 0) {
    return FALLBACK_TESTS.map((t) => ({ name: t.name, percent: 0 }));
  }

  return [...buckets.entries()]
    .map(([name, { correct, total }]) => ({
      name,
      percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    }))
    .sort((a, b) => b.percent - a.percent);
}

function enrichCategories(completed: TestSession[]): TestCategory[] {
  return FALLBACK_TESTS.map((test) => {
    const matching = completed
      .filter(
        (s) =>
          s.category === test.category ||
          s.category === test.slug ||
          s.title.toLowerCase().includes(test.name.toLowerCase()),
      )
      .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));

    const last = matching[0];
    return {
      ...test,
      lastScore: last?.score ?? null,
      unansweredCount: last ? 0 : test.questionCount,
    };
  });
}

function questionsAnsweredToday(sessions: TestSession[]): number {
  const today = dayKey(new Date().toISOString());
  let count = 0;
  for (const session of sessions) {
    if (!session.completedAt || dayKey(session.completedAt) !== today) continue;
    count += session.questions.length;
  }
  return count;
}

export function computeUserProgress(): UserProgress {
  const allSessions = listTestSessions();
  const completed = listCompletedTestSessions();
  const analyses = listAnalysisSessions().filter((s) => s.status === 'analyzed');
  const savedRules = loadSavedRuleIds();

  const recentTests = completed
    .map(toRecent)
    .filter((item): item is RecentTestResult => item !== null)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  const scores = recentTests.map((t) => t.score);
  const averageScore =
    scores.length === 0
      ? 0
      : Math.round(scores.reduce((sum, n) => sum + n, 0) / scores.length);
  const bestScore = scores.length === 0 ? 0 : Math.max(...scores);

  let correctAnswers = 0;
  let totalAnswers = 0;
  for (const session of completed) {
    totalAnswers += session.questions.length;
    correctAnswers += session.correctCount ?? 0;
  }

  const testsPassed = recentTests.filter((t) => t.passed).length;
  const testsCompleted = recentTests.length;
  const videosAnalyzed = analyses.length;
  const rulesStudied = savedRules.length;

  const activityDates = [
    ...completed.map((s) => s.completedAt!).filter(Boolean),
    ...analyses.map((s) => s.createdAt),
  ];
  const streak = computeStreak(activityDates);

  const passRate = testsCompleted === 0 ? 0 : testsPassed / testsCompleted;
  const rulesPercent = Math.min(
    100,
    Math.round((rulesStudied / Math.max(TRAFFIC_RULES.length, 1)) * 100),
  );
  const analysisBoost = Math.min(100, videosAnalyzed * 10);

  const safetyScore =
    testsCompleted === 0 && videosAnalyzed === 0 && rulesStudied === 0
      ? 50
      : Math.max(
          0,
          Math.min(
            100,
            Math.round(
              averageScore * 0.55 +
                passRate * 100 * 0.2 +
                analysisBoost * 0.15 +
                rulesPercent * 0.1,
            ),
          ),
        );

  const testsStats: TestsStats = {
    overallScore: averageScore,
    testsCompleted,
    totalTests: Math.max(testsCompleted, FALLBACK_TESTS.length),
    correctAnswers,
    totalAnswers,
    averageScore,
    bestScore,
    dailyGoal: {
      current: Math.min(10, questionsAnsweredToday(completed)),
      target: 10,
    },
    streak,
    categoryPerformance: categoryPerformance(completed),
  };

  const learningProgress: LearningProgress = {
    overallPercent:
      testsCompleted === 0 && rulesStudied === 0 && videosAnalyzed === 0
        ? 0
        : Math.min(
            100,
            Math.round(
              Math.min(100, (testsCompleted / 10) * 100) * 0.35 +
                rulesPercent * 0.35 +
                analysisBoost * 0.3,
            ),
          ),
    metrics: [
      {
        label: 'Watched videos',
        current: videosAnalyzed,
        total: Math.max(videosAnalyzed, 10),
      },
      {
        label: 'Read rules',
        current: rulesStudied,
        total: TRAFFIC_RULES.length,
      },
      {
        label: 'Practice tests',
        current: testsCompleted,
        total: Math.max(testsCompleted, 10),
      },
      {
        label: 'Saved rules',
        current: rulesStudied,
        total: TRAFFIC_RULES.length,
      },
    ],
  };

  return {
    safetyScore,
    videosAnalyzed,
    testsCompleted,
    testsPassed,
    rulesStudied,
    streak,
    averageScore,
    bestScore,
    correctAnswers,
    totalAnswers,
    recentTests: recentTests.slice(0, 8),
    testsStats,
    learningProgress,
    categories: enrichCategories(completed),
  };
}

export function emptyUserProgress(): UserProgress {
  return {
    safetyScore: 50,
    videosAnalyzed: 0,
    testsCompleted: 0,
    testsPassed: 0,
    rulesStudied: 0,
    streak: 0,
    averageScore: 0,
    bestScore: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    recentTests: [],
    testsStats: {
      overallScore: 0,
      testsCompleted: 0,
      totalTests: FALLBACK_TESTS.length,
      correctAnswers: 0,
      totalAnswers: 0,
      averageScore: 0,
      bestScore: 0,
      dailyGoal: { current: 0, target: 10 },
      streak: 0,
      categoryPerformance: FALLBACK_TESTS.map((t) => ({
        name: t.name,
        percent: 0,
      })),
    },
    learningProgress: {
      overallPercent: 0,
      metrics: [
        { label: 'Watched videos', current: 0, total: 10 },
        { label: 'Read rules', current: 0, total: TRAFFIC_RULES.length },
        { label: 'Practice tests', current: 0, total: 10 },
        { label: 'Saved rules', current: 0, total: TRAFFIC_RULES.length },
      ],
    },
    categories: FALLBACK_TESTS.map((t) => ({
      ...t,
      lastScore: null,
      unansweredCount: t.questionCount,
    })),
  };
}
