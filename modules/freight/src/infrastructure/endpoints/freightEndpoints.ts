export const FREIGHT_ENDPOINTS = {
  LIST: "/freight-service/shipments",
  DETAIL: (uid: string) => `/freight-service/shipments/${uid}`,
  CREATE: "/freight-service/shipments",
  UPDATE: (uid: string) => `/freight-service/shipments/${uid}`,
  DELETE: (uid: string) => `/freight-service/shipments/${uid}`,
} as const;
