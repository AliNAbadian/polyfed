import { UserManager, WebStorageStateStore, type User } from 'oidc-client';
import type { AuthConfig } from '../model/auth-config';

type AuthBridge = {
  userManager: UserManager;
  config: AuthConfig;
};

declare global {
  // Shared across shell + remotes (separate bundles) via one browser global.
  // eslint-disable-next-line no-var
  var __MFE_AUTH__: AuthBridge | undefined;
}

function resolveConfig(config: AuthConfig): Required<
  Pick<
    AuthConfig,
    | 'authority'
    | 'clientId'
    | 'redirectUri'
    | 'silentRedirectUri'
    | 'postLogoutRedirectUri'
    | 'scope'
    | 'responseType'
  >
> &
  AuthConfig {
  const origin = window.location.origin;
  return {
    ...config,
    authority: config.authority,
    clientId: config.clientId,
    redirectUri: config.redirectUri ?? `${origin}/auth/callback`,
    silentRedirectUri: config.silentRedirectUri ?? `${origin}/silent-renew.html`,
    postLogoutRedirectUri: config.postLogoutRedirectUri ?? `${origin}/`,
    scope: config.scope ?? 'openid profile email offline_access',
    responseType: config.responseType ?? 'code',
  };
}

/** Call once from the shell bootstrap before rendering AuthGate. */
export function initAuth(config: AuthConfig): UserManager | null {
  if (config.authority === 'disabled' || config.clientId === 'disabled') {
    globalThis.__MFE_AUTH__ = undefined;
    return null;
  }

  if (!config.authority || !config.clientId) {
    throw new Error(
      '[auth] Missing authority/clientId. Set VITE_OIDC_AUTHORITY and VITE_OIDC_CLIENT_ID (or "disabled" to skip).',
    );
  }

  const resolved = resolveConfig(config);
  const userManager = new UserManager({
    authority: resolved.authority,
    client_id: resolved.clientId,
    redirect_uri: resolved.redirectUri,
    silent_redirect_uri: resolved.silentRedirectUri,
    post_logout_redirect_uri: resolved.postLogoutRedirectUri,
    response_type: resolved.responseType,
    scope: resolved.scope,
    automaticSilentRenew: true,
    monitorSession: true,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  });

  globalThis.__MFE_AUTH__ = { userManager, config: resolved };
  return userManager;
}

export function getAuthConfig(): AuthConfig {
  const bridge = globalThis.__MFE_AUTH__;
  if (!bridge) {
    throw new Error('[auth] initAuth() was not called (shell must init first).');
  }
  return bridge.config;
}

export function getUserManager(): UserManager {
  const bridge = globalThis.__MFE_AUTH__;
  if (!bridge?.userManager) {
    throw new Error('[auth] initAuth() was not called (shell must init first).');
  }
  return bridge.userManager;
}

export function isAuthInitialized(): boolean {
  return Boolean(globalThis.__MFE_AUTH__?.userManager);
}

export async function getAccessToken(): Promise<string | null> {
  const user = await getUserManager().getUser();
  if (!user || user.expired) return null;
  return user.access_token ?? null;
}

export async function getUser(): Promise<User | null> {
  return getUserManager().getUser();
}

export async function login(): Promise<void> {
  await getUserManager().signinRedirect();
}

export async function handleLoginCallback(): Promise<User> {
  return getUserManager().signinRedirectCallback();
}

export async function logout(): Promise<void> {
  await getUserManager().signoutRedirect();
}

export async function handleSilentRenew(): Promise<void> {
  await getUserManager().signinSilentCallback();
}
