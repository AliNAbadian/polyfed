import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { handleLoginCallback } from '@react-mfe/auth';

/** OIDC redirect_uri target — completes code flow then returns home. */
export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await handleLoginCallback();
        if (alive) void navigate({ to: '/' });
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [navigate]);

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <strong>خطا در بازگشت از ورود</strong>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>در حال تکمیل ورود…</div>
  );
}
