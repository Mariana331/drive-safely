const USER_ID_KEY = 'drivesafely_progress_user';

let currentUserId: string | null = null;

export function setProgressUserId(userId: string | null) {
  currentUserId = userId;
  if (typeof window === 'undefined') return;
  if (userId) {
    localStorage.setItem(USER_ID_KEY, userId);
  } else {
    localStorage.removeItem(USER_ID_KEY);
  }
}

export function getProgressUserId(): string | null {
  if (currentUserId) return currentUserId;
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_ID_KEY);
}

/** Per-user localStorage key with one-time migration from legacy global key. */
export function userStorageKey(baseKey: string): string {
  const userId = getProgressUserId() ?? 'guest';
  return `${baseKey}:${userId}`;
}

export function readUserJson<T>(baseKey: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const scoped = userStorageKey(baseKey);
  try {
    let raw = localStorage.getItem(scoped);
    if (!raw) {
      // Migrate unscoped legacy key, then guest-scoped data for this user.
      const legacy =
        localStorage.getItem(baseKey) ??
        (getProgressUserId()
          ? localStorage.getItem(`${baseKey}:guest`)
          : null);
      if (legacy) {
        localStorage.setItem(scoped, legacy);
        raw = legacy;
      }
    }
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeUserJson(baseKey: string, value: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(userStorageKey(baseKey), JSON.stringify(value));
}
