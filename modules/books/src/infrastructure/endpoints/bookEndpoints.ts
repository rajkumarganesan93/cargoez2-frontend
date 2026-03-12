export const BOOK_ENDPOINTS = {
  LIST: "/books-service/invoices",
  DETAIL: (uid: string) => `/books-service/invoices/${uid}`,
  CREATE: "/books-service/invoices",
  UPDATE: (uid: string) => `/books-service/invoices/${uid}`,
  DELETE: (uid: string) => `/books-service/invoices/${uid}`,
} as const;
