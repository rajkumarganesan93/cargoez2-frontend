import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";

let client: AxiosInstance = axios.create({
  baseURL: "", // default empty
  timeout: 10000,
});

/**
 * Configure the axios client for your app.
 * Consumers of the library should call this once at startup.
 */
export const configureClient = (options: AxiosRequestConfig) => {
  client = axios.create(options);
};

/**
 * Grouped API helpers
 */
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    client.get<T>(url, config),

  post: async <T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    client.post<T>(url, data, config),

  put: async <T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    client.put<T>(url, data, config),

  del: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    client.delete<T>(url, config),
};