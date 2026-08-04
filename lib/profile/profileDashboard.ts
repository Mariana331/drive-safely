import type { User, UserAchievement, UserSkill } from '@/lib/api/api';
import type { UserProgress } from '@/lib/progress/computeUserProgress';
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

/** Merge API profile fields with local learning progress. */
export function resolveProfileMetrics(user: User, progress: UserProgress) {
  const level = getDriverLevel(progress.safetyScore || user.safetyScore || 50);
  const levelIndex = Math.max(
    0,
    ['beginner', 'careful', 'safe', 'expert', 'champion'].indexOf(level.id),
  );
  const xp = user.xp ?? progress.safetyScore * 15;
  const { currentFloor, nextGoal } = xpForLevel(levelIndex);

  const skills =
    user.skills && user.skills.length > 0
      ? user.skills
      : progress.testsStats.categoryPerformance.map((item) => ({
          name: item.name,
          percent: item.percent,
        }));

  const achievements =
    user.achievements && user.achievements.length > 0
      ? user.achievements
      : DEFAULT_ACHIEVEMENTS.map((item) => ({
          ...item,
          unlocked:
            (item.id === 'first-analysis' && progress.videosAnalyzed > 0) ||
            (item.id === 'rule-master' && progress.rulesStudied >= 5) ||
            (item.id === 'test-champion' && progress.bestScore >= 80) ||
            (item.id === 'safe-streak' && progress.streak >= 3) ||
            (item.id === 'careful-driver' && progress.safetyScore >= 40),
        }));

  const unlocked = achievements.filter((a) => a.unlocked).length;

  const stats = {
    videosAnalyzed: Math.max(
      user.stats?.videosAnalyzed ?? 0,
      progress.videosAnalyzed,
    ),
    videosMonthly: user.stats?.videosAnalyzedMonthly ?? 0,
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
    achievementsNew: user.stats?.achievementsNew ?? 0,
  };

  const safetyScore = Math.max(user.safetyScore || 0, progress.safetyScore);
  const streakCurrent = Math.max(
    user.streak?.current ?? 0,
    progress.streak,
  );

  const activity =
    user.activity && user.activity.length > 0
      ? user.activity
      : progress.recentTests.slice(0, 4).map((test) => ({
          type: 'test',
          text: `Completed ${test.title}`,
          createdAt: test.completedAt,
        }));

  const weakest = [...(skills.length ? skills : DEFAULT_SKILLS)].sort(
    (a, b) => a.percent - b.percent,
  )[0];

  return {
    level,
    levelIndex,
    xp,
    currentFloor,
    nextGoal,
    skills: skills.length ? skills : DEFAULT_SKILLS,
    achievements,
    unlocked,
    totalAchievements: Math.max(achievements.length, 30),
    stats,
    safetyScore,
    streakCurrent,
    activity,
    weakest,
  };
}
