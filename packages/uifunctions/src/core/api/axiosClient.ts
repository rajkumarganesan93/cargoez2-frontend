import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import type { ApiError } from "./types";

let client: AxiosInstance = axios.create({
  baseURL: "",
  timeout: 10000,
});

function attachInterceptors(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiError>) => {
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
}

attachInterceptors(client);

/**
 * Configure the axios client for your app.
 * Consumers of the library should call this once at startup.
 */
export const configureClient = (options: AxiosRequestConfig) => {
  client = axios.create(options);
  attachInterceptors(client);
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
