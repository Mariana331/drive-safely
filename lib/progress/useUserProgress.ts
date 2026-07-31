'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    setProgressUserId(user?._id ?? null);
    setProgress(computeUserProgress());
    setReady(true);

    const onFocus = () => setProgress(computeUserProgress());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [user?._id]);

  const refresh = () => setProgress(computeUserProgress());

  return {
    progress,
    refresh,
    ready: ready && !authLoading,
    userId: user?._id ?? null,
  };
}
