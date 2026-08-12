import { pickQuestions, type TestQuestion } from './questions';
import { FALLBACK_TESTS, type TestMode } from './testsData';
import { readUserJson, writeUserJson } from '@/lib/progress/progressUser';

export type SessionMode = TestMode | 'challenge' | 'review';

export interface TestSession {
  id: string;
  mode: SessionMode;
  title: string;
  category?: string;
  createdAt: string;
  timeLimitSeconds: number | null;
  questions: TestQuestion[];
  answers: Record<string, number | null>;
  currentIndex: number;
  completedAt?: string;
  score?: number;
  correctCount?: number;
}

const STORAGE_KEY = 'drivesafely_test_sessions';

function readAll(): Record<string, TestSession> {
  return readUserJson<Record<string, TestSession>>(STORAGE_KEY, {});
}

function writeAll(sessions: Record<string, TestSession>) {
  writeUserJson(STORAGE_KEY, sessions);
}

function titleFor(mode: SessionMode, category?: string) {
  if (mode === 'category' && category) {
    const found = FALLBACK_TESTS.find(
      (t) => t.category === category || t.slug === category,
    );
    return found ? `${found.name} Test` : 'Category Test';
  }

  const titles: Record<SessionMode, string> = {
    quick: 'Quick Quiz',
    category: 'Category Test',
    exam: 'Mock Exam',
    ai: 'AI Challenge',
    challenge: 'Challenge Mode',
    review: 'Review Mistakes',
  };
  return titles[mode];
}

function timeLimitFor(mode: SessionMode) {
  if (mode === 'exam') return 20 * 60;
  if (mode === 'quick') return 3 * 60;
  return null;
}

function countFor(mode: SessionMode, category?: string) {
  if (mode === 'category' && category) {
    const found = FALLBACK_TESTS.find(
      (t) => t.category === category || t.slug === category,
    );
    if (found) return found.questionCount;
  }
  if (mode === 'exam') return 20;
  if (mode === 'quick') return 5;
  if (mode === 'review') return 8;
  return 10;
}

export function listTestSessions(): TestSession[] {
  return Object.values(readAll()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function listCompletedTestSessions(): TestSession[] {
  return listTestSessions().filter(
    (s) => s.completedAt && typeof s.score === 'number',
  );
}

export function createTestSession(options: {
  mode: SessionMode;
  category?: string;
}): TestSession {
  const questions = pickQuestions({
    mode: options.mode,
    category: options.category,
    count: countFor(options.mode, options.category),
  });

  const session: TestSession = {
    id: `ts_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    mode: options.mode,
    title: titleFor(options.mode, options.category),
    category: options.category,
    createdAt: new Date().toISOString(),
    timeLimitSeconds: timeLimitFor(options.mode),
    questions,
    answers: Object.fromEntries(questions.map((q) => [q.id, null])),
    currentIndex: 0,
  };

  const all = readAll();
  all[session.id] = session;
  writeAll(all);
  return session;
}

export function getTestSession(id: string): TestSession | null {
  return readAll()[id] ?? null;
}

export function saveTestSession(session: TestSession) {
  const all = readAll();
  all[session.id] = session;
  writeAll(all);
}

export function answerQuestion(
  sessionId: string,
  questionId: string,
  answerIndex: number,
): TestSession | null {
  const session = getTestSession(sessionId);
  if (!session || session.completedAt) return session;

  session.answers[questionId] = answerIndex;
  saveTestSession(session);
  return session;
}

export function submitTestSession(sessionId: string): TestSession | null {
  const session = getTestSession(sessionId);
  if (!session) return null;

  let correctCount = 0;
  for (const question of session.questions) {
    if (session.answers[question.id] === question.correctIndex) {
      correctCount += 1;
    }
  }

  const score = Math.round((correctCount / session.questions.length) * 100);
  session.correctCount = correctCount;
  session.score = score;
  session.completedAt = new Date().toISOString();
  saveTestSession(session);
  return session;
}

export function getPassThreshold(mode: SessionMode) {
  return mode === 'exam' ? 80 : 60;
}
