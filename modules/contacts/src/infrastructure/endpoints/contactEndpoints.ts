export const CONTACT_ENDPOINTS = {
  LIST: "/contacts-service/contacts",
  DETAIL: (uid: string) => `/contacts-service/contacts/${uid}`,
  CREATE: "/contacts-service/contacts",
  UPDATE: (uid: string) => `/contacts-service/contacts/${uid}`,
  DELETE: (uid: string) => `/contacts-service/contacts/${uid}`,
} as const;
