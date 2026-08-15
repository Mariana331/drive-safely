'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { setProgressUserId } from '@/lib/progress/progressUser';
import {
  computeUserProgress,
  emptyUserProgress,
  type UserProgress,
} from '@/lib/progress/computeUserProgress';

/** Keeps progress storage scoped to the logged-in user and recomputes stats. */
export function useUserProgress() {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(emptyUserProgress);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setProgress(computeUserProgress());
  }, []);

  useEffect(() => {
    setProgressUserId(user?._id ?? null);
    refresh();
    setReady(true);

    const refreshNow = () => refresh();
    window.addEventListener('focus', refreshNow);
    window.addEventListener('drivesafely:progress-updated', refreshNow);
    document.addEventListener('visibilitychange', refreshNow);
    return () => {
      window.removeEventListener('focus', refreshNow);
      window.removeEventListener('drivesafely:progress-updated', refreshNow);
      document.removeEventListener('visibilitychange', refreshNow);
    };
  }, [user?._id, refresh]);

  return {
    progress,
    refresh,
    ready: ready && !authLoading,
    userId: user?._id ?? null,
  };
}

export function notifyProgressUpdated() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('drivesafely:progress-updated'));
}
