export type AuthConfig = {
  authority: string;
  clientId: string;
  /** Default: `${origin}/auth/callback` */
  redirectUri?: string;
  /** Default: `${origin}/silent-renew.html` */
  silentRedirectUri?: string;
  /** Default: `${origin}/` */
  postLogoutRedirectUri?: string;
  /** Default: `openid profile email offline_access` */
  scope?: string;
  /** Default: `code` */
  responseType?: string;
  /** API base URL for the shared axios client */
  apiBaseUrl?: string;
};

export type AuthUserProfile = {
  sub?: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
};
