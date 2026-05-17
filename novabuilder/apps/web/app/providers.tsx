'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthResponse, AuthUser } from '../lib/auth';
import { refreshTokens, logout as apiLogout } from '../lib/auth';

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  signIn: (data: AuthResponse) => void;
  signOut: () => void;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'nova-auth-session';

function hydrateState(): AuthResponse | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
}

function isTokenExpiringSoon(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresAt = payload.exp * 1000;
    return Date.now() > expiresAt - 60_000;
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const refreshInFlight = useRef<Promise<string | null> | null>(null);

  useEffect(() => {
    const session = hydrateState();
    if (session) {
      setUser(session.user);
      setAccessToken(session.accessToken);
      setRefreshToken(session.refreshToken);
    }
  }, []);

  const persist = useCallback((data: AuthResponse) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  const signIn = useCallback((data: AuthResponse) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    persist(data);
  }, [persist]);

  const signOut = useCallback(async () => {
    if (refreshToken) {
      try { await apiLogout(refreshToken); } catch {}
    }
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push('/auth/login');
  }, [refreshToken, router]);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (accessToken && !isTokenExpiringSoon(accessToken)) {
      return accessToken;
    }

    if (!refreshToken) return null;

    if (refreshInFlight.current) return refreshInFlight.current;

    refreshInFlight.current = (async () => {
      try {
        const result = await refreshTokens(refreshToken);
        const session = hydrateState();
        const updatedSession: AuthResponse = {
          user: session?.user ?? user!,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        };
        setAccessToken(result.accessToken);
        setRefreshToken(result.refreshToken);
        persist(updatedSession);
        return result.accessToken;
      } catch {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem(STORAGE_KEY);
        return null;
      } finally {
        refreshInFlight.current = null;
      }
    })();

    return refreshInFlight.current;
  }, [accessToken, refreshToken, user, persist]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(user && accessToken),
      signIn,
      signOut,
      getAccessToken,
    }),
    [user, accessToken, refreshToken, signIn, signOut, getAccessToken]
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
