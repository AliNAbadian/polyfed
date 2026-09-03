declare module 'oidc-client' {
  export interface UserProfile {
    sub?: string;
    name?: string;
    email?: string;
    [key: string]: unknown;
  }

  export class User {
    id_token?: string;
    access_token: string;
    refresh_token?: string;
    expired: boolean;
    expires_at?: number;
    scope?: string;
    profile: UserProfile;
  }

  export class UserManager {
    constructor(settings: Record<string, unknown>);
    getUser(): Promise<User | null>;
    signinRedirect(args?: Record<string, unknown>): Promise<void>;
    signinRedirectCallback(url?: string): Promise<User>;
    signinSilentCallback(url?: string): Promise<User | undefined>;
    signoutRedirect(args?: Record<string, unknown>): Promise<void>;
    events: {
      addUserLoaded(cb: (user: User) => void): void;
      removeUserLoaded(cb: (user: User) => void): void;
      addUserUnloaded(cb: () => void): void;
      removeUserUnloaded(cb: () => void): void;
      addAccessTokenExpired(cb: () => void): void;
    };
  }

  export class WebStorageStateStore {
    constructor(settings?: { store?: Storage; prefix?: string });
  }
}
