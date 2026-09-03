import type { ReactNode } from 'react';
import { useAuthGate } from '../hooks/use-auth-gate';

export type AuthGateProps = {
  children: ReactNode;
  /** Optional custom loading UI */
  loadingFallback?: ReactNode;
  /** Optional custom error UI — receives error + retry */
  errorFallback?: (error: Error, retry: () => void) => ReactNode;
};

/**
 * Global auth wall for the shell. Remotes inherit the session via
 * `localStorage` + `globalThis.__MFE_AUTH__` (initAuth in shell bootstrap).
 */
export function AuthGate({
  children,
  loadingFallback,
  errorFallback,
}: AuthGateProps) {
  const { status, error, retry } = useAuthGate();

  if (status === 'loading' || status === 'redirecting') {
    return (
      <>
        {loadingFallback ?? (
          <div
            style={{
              minHeight: '100vh',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'IRANSansX, sans-serif',
            }}
          >
            {status === 'redirecting'
              ? 'در حال انتقال به صفحه ورود…'
              : 'در حال بررسی نشست…'}
          </div>
        )}
      </>
    );
  }

  if (status === 'error' && error) {
    return (
      <>
        {errorFallback?.(error, retry) ?? (
          <div
            style={{
              minHeight: '100vh',
              display: 'grid',
              placeItems: 'center',
              gap: 12,
              fontFamily: 'IRANSansX, sans-serif',
              padding: 24,
              textAlign: 'center',
            }}
          >
            <strong>خطا در احراز هویت</strong>
            <p style={{ margin: 0, color: '#5b6472' }}>{error.message}</p>
            <button type="button" onClick={retry}>
              تلاش مجدد
            </button>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
