'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { RegisterPayload, User } from '@/lib/api/api';
import * as authApi from '@/lib/api/clientApi';
import { setProgressUserId } from '@/lib/progress/progressUser';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await authApi.getMe();
      setProgressUserId(data.user._id);
      setUser(data.user);
    } catch {
      setProgressUserId(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  useEffect(() => {
    setProgressUserId(user?._id ?? null);
  }, [user?._id]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    setProgressUserId(data.user._id);
    setUser(data.user);
    // Hard navigation so middleware sees the fresh auth cookie.
    window.location.assign('/profile');
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const data = await authApi.register(payload);
    setProgressUserId(data.user._id);
    setUser(data.user);
    // Hard navigation so middleware sees the fresh auth cookie.
    window.location.assign('/profile');
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setProgressUserId(null);
    setUser(null);
    window.location.assign('/login');
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
