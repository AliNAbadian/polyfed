import { UserManager } from 'oidc-client';

/**
 * Silent renew iframe target. Uses empty settings — oidc-client reads state
 * from storage and completes the silent callback.
 */
new UserManager({}).signinSilentCallback().catch((error) => {
  console.error('[auth] silent renew failed', error);
});
