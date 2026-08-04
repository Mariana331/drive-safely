import { listAnalysisSessions } from '@/lib/analysis/analysisSession';
import { loadFavorites } from '@/lib/favorites/favoritesStore';
import { readUserJson, writeUserJson } from '@/lib/progress/progressUser';
import { loadSavedRuleIds } from '@/lib/traffic-rules/trafficRulesData';
import { listCompletedTestSessions } from '@/lib/tests/testSession';

export type NotificationKind =
  | 'test'
  | 'analysis'
  | 'rules'
  | 'news'
  | 'assistant'
  | 'favorite'
  | 'system';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href: string;
  createdAt: string;
}

const READ_KEY = 'drivesafely_notifications_read';

export function loadReadNotificationIds(): string[] {
  return readUserJson<string[]>(READ_KEY, []);
}

export function markNotificationRead(id: string) {
  const current = loadReadNotificationIds();
  if (current.includes(id)) return current;
  const next = [...current, id].slice(-100);
  writeUserJson(READ_KEY, next);
  return next;
}

export function markAllNotificationsRead(ids: string[]) {
  const current = new Set(loadReadNotificationIds());
  for (const id of ids) current.add(id);
  const next = [...current].slice(-100);
  writeUserJson(READ_KEY, next);
  return next;
}

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

/** Build concrete notifications from the user's recent DriveSafely activity. */
export function buildNotifications(): AppNotification[] {
  const items: AppNotification[] = [];

  const tests = listCompletedTestSessions()
    .filter((s) => s.completedAt)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
    .slice(0, 3);

  for (const test of tests) {
    items.push({
      id: `test:${test.id}`,
      kind: 'test',
      title: 'Practice test completed',
      body: `${test.title} — score ${test.score ?? 0}%`,
      href: `/tests/results/${test.id}`,
      createdAt: test.completedAt!,
    });
  }

  const analyses = listAnalysisSessions()
    .filter((s) => s.status === 'analyzed')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  for (const analysis of analyses) {
    const issues = analysis.result?.violations.length ?? 0;
    items.push({
      id: `analysis:${analysis.id}`,
      kind: 'analysis',
      title: 'Video analysis ready',
      body:
        issues > 0
          ? `${analysis.title}: ${issues} issue(s) flagged`
          : `${analysis.title}: analysis finished`,
      href: `/ai-analysis/results/${analysis.id}`,
      createdAt: analysis.createdAt,
    });
  }

  const savedRules = loadSavedRuleIds();
  if (savedRules.length > 0) {
    items.push({
      id: `rules:saved:${savedRules.length}`,
      kind: 'rules',
      title: 'Saved rules reminder',
      body: `You have ${savedRules.length} bookmarked traffic rule(s) to revise.`,
      href: '/saved-rules',
      createdAt: hoursAgo(6),
    });
  }

  const favorites = loadFavorites();
  if (favorites.length > 0) {
    const latest = favorites[0];
    items.push({
      id: `favorite:${latest.id}`,
      kind: 'favorite',
      title: 'Favourites updated',
      body: `Saved: ${latest.title}`,
      href: '/favorites',
      createdAt: latest.savedAt,
    });
  }

  items.push(
    {
      id: 'system:news-laws',
      kind: 'news',
      title: 'Traffic laws update',
      body: 'Check official Traffic Laws news for recent changes.',
      href: '/news',
      createdAt: hoursAgo(20),
    },
    {
      id: 'system:assistant-tip',
      kind: 'assistant',
      title: 'Ask AI about priority',
      body: 'Not sure who has right of way? Open AI Assistant with a quick prompt.',
      href: '/assistant',
      createdAt: hoursAgo(30),
    },
  );

  return items
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);
}

export function notificationIcon(kind: NotificationKind) {
  switch (kind) {
    case 'test':
      return '📝';
    case 'analysis':
      return '🎥';
    case 'rules':
      return '🔖';
    case 'news':
      return '📰';
    case 'assistant':
      return '💬';
    case 'favorite':
      return '❤️';
    default:
      return '🔔';
  }
}

export function formatNotificationTime(iso: string) {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
