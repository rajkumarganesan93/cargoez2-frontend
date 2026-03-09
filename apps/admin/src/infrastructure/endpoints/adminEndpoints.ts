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

export const ROLE_ENDPOINTS = {
  LIST: "/auth-service/roles",
  DETAIL: (id: string) => `/auth-service/roles/${id}`,
  CREATE: "/auth-service/roles",
  UPDATE: (id: string) => `/auth-service/roles/${id}`,
  DELETE: (id: string) => `/auth-service/roles/${id}`,
} as const;

export const MODULE_ENDPOINTS = {
  LIST: "/auth-service/modules",
  CREATE: "/auth-service/modules",
  UPDATE: (id: string) => `/auth-service/modules/${id}`,
  DELETE: (id: string) => `/auth-service/modules/${id}`,
} as const;

export const SCREEN_ENDPOINTS = {
  LIST: "/auth-service/screens",
  CREATE: "/auth-service/screens",
  UPDATE: (id: string) => `/auth-service/screens/${id}`,
  DELETE: (id: string) => `/auth-service/screens/${id}`,
} as const;

export const OPERATION_ENDPOINTS = {
  LIST: "/auth-service/operations",
  CREATE: "/auth-service/operations",
} as const;

export const PERMISSION_ENDPOINTS = {
  LIST: "/auth-service/permissions",
  CREATE: "/auth-service/permissions",
  DELETE: (id: string) => `/auth-service/permissions/${id}`,
} as const;

export const ROLE_PERMISSION_ENDPOINTS = {
  LIST: (roleId: string) => `/auth-service/roles/${roleId}/permissions`,
  ASSIGN: (roleId: string) => `/auth-service/roles/${roleId}/permissions`,
  REVOKE: (roleId: string, permId: string) => `/auth-service/roles/${roleId}/permissions/${permId}`,
  RESOLVE: "/auth-service/resolve-permissions",
  ME: "/auth-service/me/permissions",
} as const;
