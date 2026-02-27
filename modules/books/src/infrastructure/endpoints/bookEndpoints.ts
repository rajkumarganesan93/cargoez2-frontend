export const BOOK_ENDPOINTS = {
  LIST: "/books",
  DETAIL: (id: string) => `/books/${id}`,
  CREATE: "/books",
  UPDATE: (id: string) => `/books/${id}`,
  DELETE: (id: string) => `/books/${id}`,
} as const;
