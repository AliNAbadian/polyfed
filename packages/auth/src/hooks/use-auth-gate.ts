import { useEffect, useState } from 'react';
import { getUser, isAuthInitialized, login } from '../services/oidc';

export type AuthGateState = {
  status: 'loading' | 'authenticated' | 'redirecting' | 'error' | 'passthrough';
  error: Error | null;
  retry: () => void;
};

const PASSTHROUGH_PREFIXES = ['/auth/callback'];

function isPassthroughPath(pathname: string): boolean {
  return PASSTHROUGH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Shell auth gate logic — redirects to IdP when no valid session.
 * `/auth/callback` is passthrough so the code exchange can finish.
 * If auth was not initialized (`disabled`), gate is open.
 */
export function useAuthGate(): AuthGateState {
  const [status, setStatus] = useState<AuthGateState['status']>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!isAuthInitialized()) {
        if (alive) setStatus('passthrough');
        return;
      }

      if (isPassthroughPath(window.location.pathname)) {
        if (alive) setStatus('passthrough');
        return;
      }

      setStatus('loading');
      setError(null);
      try {
        const user = await getUser();
        if (!alive) return;
        if (user && !user.expired) {
          setStatus('authenticated');
          return;
        }
        setStatus('redirecting');
        await login();
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setStatus('error');
      }
    })();

    return () => {
      alive = false;
    };
  }, [nonce]);

  return {
    status,
    error,
    retry: () => setNonce((n) => n + 1),
  };
}
