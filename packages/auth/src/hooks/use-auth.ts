import { useCallback, useEffect, useState } from 'react';
import type { User } from 'oidc-client';
import {
  getUser,
  login,
  logout,
  getUserManager,
} from '../services/oidc';

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await getUser();
    setUser(next && !next.expired ? next : null);
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const next = await getUser();
        if (alive) setUser(next && !next.expired ? next : null);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    const um = getUserManager();
    const onLoaded = (u: User) => setUser(u);
    const onUnloaded = () => setUser(null);

    um.events.addUserLoaded(onLoaded);
    um.events.addUserUnloaded(onUnloaded);
    um.events.addAccessTokenExpired(() => {
      void login();
    });

    return () => {
      alive = false;
      um.events.removeUserLoaded(onLoaded);
      um.events.removeUserUnloaded(onUnloaded);
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user && !user.expired),
    login,
    logout,
    refresh,
  };
}
