import type { User, UserAchievement, UserActivity, UserSkill } from '@/lib/api/api';
import type { UserProgress } from '@/lib/progress/computeUserProgress';
import { listAnalysisSessions } from '@/lib/analysis/analysisSession';
import { getDriverLevel } from '@/lib/profile/driverLevels';

export const PROFILE_BANNER = '/images/profile/profile.png';

export const ACHIEVEMENT_META: Record<
  string,
  { icon: string; color: string }
> = {
  'first-analysis': { icon: '🎥', color: '#3b82f6' },
  'rule-master': { icon: '📋', color: '#22c55e' },
  'test-champion': { icon: '✅', color: '#f59e0b' },
  'safe-streak': { icon: '🔥', color: '#ef4444' },
  'road-expert': { icon: '🛡️', color: '#8b5cf6' },
  'ai-explorer': { icon: '🤖', color: '#06b6d4' },
  'careful-driver': { icon: '🚗', color: '#14b8a6' },
};

export const DEFAULT_SKILLS: UserSkill[] = [
  { name: 'Traffic Signs', percent: 0 },
  { name: 'Parking', percent: 0 },
  { name: 'Pedestrians', percent: 0 },
  { name: 'Overtaking', percent: 0 },
  { name: 'Speed Control', percent: 0 },
];

export const DEFAULT_ACHIEVEMENTS: UserAchievement[] = [
  { id: 'first-analysis', title: 'First Analysis', unlocked: false },
  { id: 'rule-master', title: 'Rule Master', unlocked: false },
  { id: 'test-champion', title: 'Test Champion', unlocked: false },
  { id: 'safe-streak', title: 'Safe Streak', unlocked: false },
  { id: 'careful-driver', title: 'Careful Driver', unlocked: false },
  { id: 'road-expert', title: 'Road Expert', unlocked: false },
];

const SKILL_NAME_ALIASES: Record<string, string> = {
  signs: 'Traffic Signs',
  'Road Signs': 'Traffic Signs',
  'Traffic Signs': 'Traffic Signs',
  parking: 'Parking',
  Parking: 'Parking',
  'Parking Rules': 'Parking',
  pedestrians: 'Pedestrians',
  Pedestrians: 'Pedestrians',
  priority: 'Overtaking',
  'Priority Rules': 'Overtaking',
  Overtaking: 'Overtaking',
  maneuvers: 'Overtaking',
  Maneuvers: 'Overtaking',
  speed: 'Speed Control',
  'Speed & Distance': 'Speed Control',
  'Speed Control': 'Speed Control',
  lights: 'Traffic Signs',
  'Traffic Lights': 'Traffic Signs',
};

export function skillTone(percent: number): 'good' | 'warn' | 'bad' {
  if (percent >= 85) return 'good';
  if (percent >= 70) return 'warn';
  return 'bad';
}

export function skillStatus(percent: number): string {
  if (percent >= 95) return 'Excellent';
  if (percent >= 85) return 'Strong';
  if (percent >= 70) return 'Good';
  if (percent >= 50) return 'Needs Work';
  return 'Start here';
}

export function safetyLabel(score: number): string {
  if (score >= 90) return 'Excellent Driver';
  if (score >= 75) return 'Strong Driver';
  if (score >= 60) return 'Safe Driver';
  if (score >= 40) return 'Careful Driver';
  return 'Beginner';
}

export function xpForLevel(levelIndex: number) {
  const thresholds = [0, 400, 1000, 2000, 3500];
  return {
    currentFloor: thresholds[levelIndex] ?? 0,
    nextGoal: thresholds[levelIndex + 1] ?? thresholds[thresholds.length - 1],
  };
}

export function buildWeekStreak(current: number) {
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay(); // 0 Sun
  const mondayBased = today === 0 ? 6 : today - 1;
  return labels.map((label, index) => {
    const daysAgo = (mondayBased - index + 7) % 7;
    const active = current > 0 && daysAgo < current;
    const isToday = index === mondayBased;
    return { label, active, isToday };
  });
}

export function formatJoined(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function formatActivityTime(iso: string, locale: string) {
  const date = new Date(iso);
  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const startYesterday = new Date(startToday);
  startYesterday.setDate(startYesterday.getDate() - 1);

  const time = date.toLocaleTimeString(locale === 'uk' ? 'uk-UA' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (date >= startToday) return `Today, ${time}`;
  if (date >= startYesterday) return `Yesterday, ${time}`;
  return date.toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function activityIcon(type: string) {
  switch (type) {
    case 'video':
      return '🎥';
    case 'test':
      return '📝';
    case 'rules':
      return '📋';
    case 'achievement':
      return '🏆';
    case 'assistant':
      return '💬';
    default:
      return '✨';
  }
}

function unlockFromProgress(
  id: string,
  progress: UserProgress,
  videosAnalyzed: number,
): boolean {
  switch (id) {
    case 'first-analysis':
      return videosAnalyzed > 0;
    case 'rule-master':
      return progress.rulesStudied >= 5;
    case 'test-champion':
      return progress.bestScore >= 80 || progress.testsPassed >= 1;
    case 'safe-streak':
      return progress.streak >= 3;
    case 'careful-driver':
      return progress.safetyScore >= 40;
    case 'road-expert':
      return progress.safetyScore >= 80;
    case 'ai-explorer':
      return videosAnalyzed >= 3;
    default:
      return false;
  }
}

function mergeSkills(user: User, progress: UserProgress): UserSkill[] {
  const byName = new Map<string, number>();

  for (const skill of DEFAULT_SKILLS) {
    byName.set(skill.name, 0);
  }

  for (const skill of user.skills ?? []) {
    const name = SKILL_NAME_ALIASES[skill.name] ?? skill.name;
    byName.set(name, Math.max(byName.get(name) ?? 0, skill.percent));
  }

  for (const item of progress.testsStats.categoryPerformance) {
    const name = SKILL_NAME_ALIASES[item.name] ?? item.name;
    byName.set(name, Math.max(byName.get(name) ?? 0, item.percent));
  }

  return DEFAULT_SKILLS.map((skill) => ({
    name: skill.name,
    percent: byName.get(skill.name) ?? 0,
  }));
}

function mergeAchievements(
  user: User,
  progress: UserProgress,
  videosAnalyzed: number,
): UserAchievement[] {
  const base =
    user.achievements && user.achievements.length > 0
      ? user.achievements
      : DEFAULT_ACHIEVEMENTS;

  const seen = new Set(base.map((item) => item.id));
  const merged = base.map((item) => ({
    ...item,
    unlocked:
      item.unlocked ||
      unlockFromProgress(item.id, progress, videosAnalyzed),
  }));

  for (const fallback of DEFAULT_ACHIEVEMENTS) {
    if (seen.has(fallback.id)) continue;
    merged.push({
      ...fallback,
      unlocked: unlockFromProgress(fallback.id, progress, videosAnalyzed),
    });
  }

  return merged;
}

function buildLocalActivity(progress: UserProgress): UserActivity[] {
  const items: UserActivity[] = [];

  for (const analysis of listAnalysisSessions().filter(
    (s) => s.status === 'analyzed',
  )) {
    items.push({
      type: 'video',
      text: `Analyzed a video: ${analysis.title}`,
      createdAt: analysis.createdAt,
    });
  }

  for (const test of progress.recentTests) {
    items.push({
      type: 'test',
      text: `Completed ${test.title} (${test.score}%)`,
      createdAt: test.completedAt,
    });
  }

  if (progress.rulesStudied > 0) {
    items.push({
      type: 'rules',
      text: `Saved ${progress.rulesStudied} traffic rule(s)`,
      createdAt: new Date().toISOString(),
    });
  }

  return items;
}

function mergeActivity(
  user: User,
  progress: UserProgress,
): UserActivity[] {
  const local = buildLocalActivity(progress);
  const remote = (user.activity ?? []).map((item) => ({
    ...item,
    createdAt:
      typeof item.createdAt === 'string'
        ? item.createdAt
        : new Date(item.createdAt).toISOString(),
  }));

  const combined = [...local, ...remote].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  // Dedupe similar texts on the same day
  const seen = new Set<string>();
  const unique: UserActivity[] = [];
  for (const item of combined) {
    const key = `${item.type}:${item.text}:${item.createdAt.slice(0, 10)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  return unique.slice(0, 8);
}

/** Merge API profile fields with local learning progress. */
export function resolveProfileMetrics(user: User, progress: UserProgress) {
  const videosAnalyzed = Math.max(
    user.stats?.videosAnalyzed ?? 0,
    progress.videosAnalyzed,
  );

  const level = getDriverLevel(
    Math.max(progress.safetyScore, user.safetyScore || 0) || 50,
  );
  const levelIndex = Math.max(
    0,
    ['beginner', 'careful', 'safe', 'expert', 'champion'].indexOf(level.id),
  );
  const xp = Math.max(user.xp ?? 0, progress.safetyScore * 15 + videosAnalyzed * 40);
  const { currentFloor, nextGoal } = xpForLevel(levelIndex);

  const skills = mergeSkills(user, progress);
  const achievements = mergeAchievements(user, progress, videosAnalyzed);
  const unlocked = achievements.filter((a) => a.unlocked).length;
  const activity = mergeActivity(user, progress);

  const stats = {
    videosAnalyzed,
    videosMonthly: Math.max(
      user.stats?.videosAnalyzedMonthly ?? 0,
      Math.min(videosAnalyzed, 5),
    ),
    rulesLearned: Math.max(
      user.stats?.rulesLearned ?? 0,
      progress.rulesStudied,
    ),
    rulesMonthly: user.stats?.rulesLearnedMonthly ?? 0,
    testsCompleted: Math.max(
      user.stats?.testsCompleted ?? 0,
      progress.testsCompleted,
    ),
    testsMonthly: user.stats?.testsCompletedMonthly ?? 0,
    aiQuestions: user.stats?.aiQuestions ?? 0,
    aiMonthly: user.stats?.aiQuestionsMonthly ?? 0,
    achievements: Math.max(user.stats?.achievementsCount ?? 0, unlocked),
    achievementsNew: Math.max(user.stats?.achievementsNew ?? 0, unlocked > 0 ? 1 : 0),
  };

  const safetyScore = Math.max(user.safetyScore || 0, progress.safetyScore);
  const streakCurrent = Math.max(user.streak?.current ?? 0, progress.streak);

  const weakest = [...skills].sort((a, b) => a.percent - b.percent)[0];

  return {
    level,
    levelIndex,
    xp,
    currentFloor,
    nextGoal,
    skills,
    achievements,
    unlocked,
    totalAchievements: Math.max(achievements.length, 6),
    stats,
    safetyScore,
    streakCurrent,
    activity,
    weakest,
  };
}
