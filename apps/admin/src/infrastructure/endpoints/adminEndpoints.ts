export const ADMIN_ENDPOINTS = {
  USERS: {
    LIST: "/admin/users",
    DETAIL: (id: string) => `/admin/users/${id}`,
    CREATE: "/admin/users",
    UPDATE: (id: string) => `/admin/users/${id}`,
    DISABLE: (id: string) => `/admin/users/${id}/disable`,
  },
  SETTINGS: {
    GET: "/admin/settings",
    UPDATE: "/admin/settings",
  },
} as const;
