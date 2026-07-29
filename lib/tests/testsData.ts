export type TestDifficulty = 'easy' | 'medium' | 'hard';
export type TestTab = 'all' | 'category' | 'mock' | 'my';
export type TestMode = 'quick' | 'category' | 'exam' | 'ai';

export interface TestCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  questionCount: number;
  difficulty: TestDifficulty;
  lastScore: number | null;
  unansweredCount: number;
  category: string;
}

export interface TestsStats {
  overallScore: number;
  testsCompleted: number;
  totalTests: number;
  correctAnswers: number;
  totalAnswers: number;
  averageScore: number;
  bestScore: number;
  dailyGoal: { current: number; target: number };
  streak: number;
  categoryPerformance: { name: string; percent: number }[];
}

export const TEST_TABS: { id: TestTab; label: string }[] = [
  { id: 'all', label: 'All Tests' },
  { id: 'category', label: 'By Category' },
  { id: 'mock', label: 'Mock Exams' },
  { id: 'my', label: 'My Tests' },
];

export const DIFFICULTY_OPTIONS = [
  { value: 'all', label: 'All Difficulty' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'signs', label: 'Road Signs' },
  { value: 'priority', label: 'Priority Rules' },
  { value: 'maneuvers', label: 'Maneuvers' },
  { value: 'lights', label: 'Traffic Lights' },
  { value: 'parking', label: 'Parking Rules' },
  { value: 'speed', label: 'Speed & Distance' },
];

export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'score', label: 'Score' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'name', label: 'Name' },
];

export const QUICK_ACTIONS = [
  {
    id: 'quick',
    icon: '🚦',
    title: 'Quick Test',
    description: '10 random questions to refresh your knowledge in minutes.',
    button: 'Start Quick Test',
    accent: 'blue',
  },
  {
    id: 'exam',
    icon: '🎓',
    title: 'Mock Exam',
    description: 'Full exam simulation with timer and pass threshold.',
    button: 'Start Mock Exam',
    accent: 'purple',
  },
  {
    id: 'ai',
    icon: '🤖',
    title: 'AI Challenge',
    description: 'Questions based on your weak areas from video analysis.',
    button: 'Start Now',
    accent: 'green',
  },
];

export const FALLBACK_TESTS: TestCategory[] = [
  {
    id: '1',
    slug: 'road-signs',
    name: 'Road Signs',
    icon: '🛑',
    questionCount: 20,
    difficulty: 'medium',
    lastScore: 85,
    unansweredCount: 3,
    category: 'signs',
  },
  {
    id: '2',
    slug: 'priority-rules',
    name: 'Priority Rules',
    icon: '⚖️',
    questionCount: 15,
    difficulty: 'easy',
    lastScore: 92,
    unansweredCount: 0,
    category: 'priority',
  },
  {
    id: '3',
    slug: 'maneuvers',
    name: 'Maneuvers',
    icon: '🔄',
    questionCount: 18,
    difficulty: 'hard',
    lastScore: 60,
    unansweredCount: 5,
    category: 'maneuvers',
  },
  {
    id: '4',
    slug: 'traffic-lights',
    name: 'Traffic Lights',
    icon: '🚥',
    questionCount: 12,
    difficulty: 'easy',
    lastScore: 78,
    unansweredCount: 2,
    category: 'lights',
  },
  {
    id: '5',
    slug: 'parking-rules',
    name: 'Parking Rules',
    icon: '🅿️',
    questionCount: 16,
    difficulty: 'medium',
    lastScore: 71,
    unansweredCount: 4,
    category: 'parking',
  },
  {
    id: '6',
    slug: 'speed-distance',
    name: 'Speed & Distance',
    icon: '🏎️',
    questionCount: 14,
    difficulty: 'hard',
    lastScore: 55,
    unansweredCount: 6,
    category: 'speed',
  },
];

export const FALLBACK_STATS: TestsStats = {
  overallScore: 72,
  testsCompleted: 24,
  totalTests: 40,
  correctAnswers: 432,
  totalAnswers: 600,
  averageScore: 72,
  bestScore: 96,
  dailyGoal: { current: 6, target: 10 },
  streak: 6,
  categoryPerformance: [
    { name: 'Road Signs', percent: 85 },
    { name: 'Priority Rules', percent: 92 },
    { name: 'Maneuvers', percent: 60 },
    { name: 'Traffic Lights', percent: 78 },
    { name: 'Parking Rules', percent: 71 },
    { name: 'Speed & Distance', percent: 55 },
  ],
};

export const DIFFICULTY_LABEL: Record<TestDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export function filterTests(
  tests: TestCategory[],
  {
    tab,
    category,
    difficulty,
    unansweredOnly,
    search,
    sort,
  }: {
    tab: TestTab;
    category: string;
    difficulty: string;
    unansweredOnly: boolean;
    search: string;
    sort: string;
  },
) {
  let result = [...tests];
  const query = search.trim().toLowerCase();

  if (tab === 'mock') {
    result = result.filter((t) => t.difficulty === 'hard' || t.questionCount >= 18);
  }

  if (tab === 'my') {
    result = result.filter((t) => t.lastScore !== null);
  }

  if (category !== 'all') {
    result = result.filter((t) => t.category === category);
  }

  if (difficulty !== 'all') {
    result = result.filter((t) => t.difficulty === difficulty);
  }

  if (unansweredOnly) {
    result = result.filter((t) => t.unansweredCount > 0);
  }

  if (query) {
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.slug.includes(query),
    );
  }

  const difficultyOrder = { easy: 0, medium: 1, hard: 2 };

  result.sort((a, b) => {
    switch (sort) {
      case 'score':
        return (b.lastScore ?? 0) - (a.lastScore ?? 0);
      case 'difficulty':
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return Number(b.id) - Number(a.id);
    }
  });

  return result;
}
