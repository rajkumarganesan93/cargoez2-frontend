export const CONTACT_ENDPOINTS = {
  LIST: "/contacts",
  DETAIL: (id: string) => `/contacts/${id}`,
  CREATE: "/contacts",
  UPDATE: (id: string) => `/contacts/${id}`,
  DELETE: (id: string) => `/contacts/${id}`,
} as const;
