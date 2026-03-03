export const USER_ENDPOINTS = {
  LIST: "/users",
  DETAIL: (id: string) => `/users/${id}`,
  CREATE: "/users",
  UPDATE: (id: string) => `/users/${id}`,
  DELETE: (id: string) => `/users/${id}`,
} as const;

export const SETTINGS_ENDPOINTS = {
  GET: "/admin/settings",
  UPDATE: "/admin/settings",
} as const;
