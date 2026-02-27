export const FREIGHT_ENDPOINTS = {
  LIST: "/freight",
  DETAIL: (id: string) => `/freight/${id}`,
  CREATE: "/freight",
  UPDATE: (id: string) => `/freight/${id}`,
  DELETE: (id: string) => `/freight/${id}`,
} as const;
