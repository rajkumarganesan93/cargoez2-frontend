export const USER_ENDPOINTS = {
  LIST: "/user-service/users",
  ME: "/user-service/users/me",
  DETAIL: (id: string) => `/user-service/users/${id}`,
  CREATE: "/user-service/users",
  UPDATE: (id: string) => `/user-service/users/${id}`,
  DELETE: (id: string) => `/user-service/users/${id}`,
} as const;

export const SETTINGS_ENDPOINTS = {
  GET: "/admin/settings",
  UPDATE: "/admin/settings",
} as const;
