import axios, {
  type AxiosInstance,
  type CreateAxiosDefaults,
} from 'axios';
import { getAccessToken, getAuthConfig, isAuthInitialized, login } from '../services/oidc';

export type CreateApiClientOptions = CreateAxiosDefaults & {
  /** If true (default), 401 → OIDC login redirect once. */
  redirectOnUnauthorized?: boolean;
};

/**
 * Shared Axios client for shell + remotes.
 * Attaches `Authorization: Bearer <access_token>` from the OIDC session.
 */
export function createApiClient(
  options: CreateApiClientOptions = {},
): AxiosInstance {
  const { redirectOnUnauthorized = true, ...axiosDefaults } = options;

  const baseURL =
    axiosDefaults.baseURL ??
    (isAuthInitialized() ? getAuthConfig().apiBaseUrl : undefined) ??
    (typeof import.meta !== 'undefined'
      ? (import.meta as ImportMeta & { env?: Record<string, string> }).env
          ?.VITE_API_BASE_URL
      : undefined);

  const client = axios.create({
    ...axiosDefaults,
    baseURL,
  });

  client.interceptors.request.use(async (config) => {
    if (!isAuthInitialized()) {
      return config;
    }
    const token = await getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  if (redirectOnUnauthorized) {
    client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 401 && isAuthInitialized()) {
          await login();
        }
        return Promise.reject(error);
      },
    );
  }

  return client;
}

/** Lazy singleton — first import creates the client. */
let sharedClient: AxiosInstance | null = null;

export function getApiClient(): AxiosInstance {
  if (!sharedClient) {
    sharedClient = createApiClient();
  }
  return sharedClient;
}
