import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiError } from "./types";

let baseURL = "";
let timeout = 10000;
let currentAuthToken: string | undefined;
let tokenRefresher: (() => Promise<string | undefined>) | null = null;

const client: AxiosInstance = axios.create({ baseURL, timeout });

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (baseURL) {
    config.baseURL = baseURL;
  }
  if (currentAuthToken) {
    config.headers.set("Authorization", `Bearer ${currentAuthToken}`);
  }
  return config;
});

client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retried?: boolean };

    if (
      error.response?.status === 401 &&
      !originalRequest._retried &&
      tokenRefresher
    ) {
      originalRequest._retried = true;
      try {
        const freshToken = await tokenRefresher();
        if (freshToken) {
          currentAuthToken = freshToken;
          originalRequest.headers.set("Authorization", `Bearer ${freshToken}`);
          return client.request(originalRequest);
        }
      } catch {
        // refresh failed — fall through to error handling
      }
    }

    const backendMessage =
      error.response?.data?.message ?? error.message ?? "An unexpected error occurred";
    const apiError: ApiError = {
      success: false,
      messageCode: error.response?.data?.messageCode ?? "ERR_UNKNOWN",
      message: backendMessage,
      timestamp: error.response?.data?.timestamp ?? new Date().toISOString(),
    };
    return Promise.reject(apiError);
  }
);

export const configureClient = (options: { baseURL?: string; timeout?: number }) => {
  if (options.baseURL !== undefined) baseURL = options.baseURL;
  if (options.timeout !== undefined) timeout = options.timeout;
  client.defaults.baseURL = baseURL;
  client.defaults.timeout = timeout;
};

/**
 * Set the current auth token directly. Called whenever the token changes.
 * The request interceptor reads this before every request.
 */
export const setAuthToken = (token: string | undefined) => {
  currentAuthToken = token;
};

/**
 * Register an async function that obtains a fresh access token.
 * Used by the 401 retry interceptor to transparently refresh expired tokens.
 */
export const setTokenRefresher = (refresher: () => Promise<string | undefined>) => {
  tokenRefresher = refresher;
};

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    client.get<T>(url, config),

  post: async <T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    client.post<T>(url, data, config),

  put: async <T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    client.put<T>(url, data, config),

  patch: async <T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    client.patch<T>(url, data, config),

  del: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    client.delete<T>(url, config),
};
