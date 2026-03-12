const BASE = "/admin-service";

export function crudEndpoints(resource: string) {
  return {
    LIST: `${BASE}/${resource}`,
    DETAIL: (uid: string) => `${BASE}/${resource}/${uid}`,
    CREATE: `${BASE}/${resource}`,
    UPDATE: (uid: string) => `${BASE}/${resource}/${uid}`,
    DELETE: (uid: string) => `${BASE}/${resource}/${uid}`,
  };
}

export const TENANT_ENDPOINTS = crudEndpoints("tenants");
export const BRANCH_ENDPOINTS = crudEndpoints("branches");
export const APP_CUSTOMER_ENDPOINTS = crudEndpoints("app-customers");
export const BRANCH_CUSTOMER_ENDPOINTS = crudEndpoints("branch-customers");
export const SYS_ADMIN_ENDPOINTS = crudEndpoints("sys-admins");
export const METADATA_ENDPOINTS = {
  ...crudEndpoints("metadata"),
  DETAILS: (metaUid: string) => `${BASE}/metadata/${metaUid}/details`,
  CREATE_DETAIL: `${BASE}/metadata/details`,
  UPDATE_DETAIL: (uid: string) => `${BASE}/metadata/details/${uid}`,
  DELETE_DETAIL: (uid: string) => `${BASE}/metadata/details/${uid}`,
};
export const MODULE_ENDPOINTS = crudEndpoints("master-catalog/modules");
export const OPERATION_ENDPOINTS = crudEndpoints("master-catalog/operations");
export const PRODUCT_ENDPOINTS = crudEndpoints("products");
export const SUBSCRIPTION_ENDPOINTS = crudEndpoints("subscriptions");

export const ADMIN_ROLE_ENDPOINTS = crudEndpoints("admin-access-control/roles");

export const ADMIN_PERMISSION_ENDPOINTS = {
  LIST: `${BASE}/admin-access-control/permissions`,
  DETAIL: (uid: string) => `${BASE}/admin-access-control/permissions/${uid}`,
  CREATE: `${BASE}/admin-access-control/permissions`,
  UPDATE: (uid: string) => `${BASE}/admin-access-control/permissions/${uid}`,
  DELETE: (uid: string) => `${BASE}/admin-access-control/permissions/${uid}`,
};

export const ADMIN_ROLE_PERMISSION_ENDPOINTS = {
  BY_ROLE: (roleUid: string) => `${BASE}/admin-access-control/role-permissions/${roleUid}`,
  ASSIGN: `${BASE}/admin-access-control/role-permissions`,
  REVOKE: (uid: string) => `${BASE}/admin-access-control/role-permissions/${uid}`,
};

export const SYS_ADMIN_ROLE_ENDPOINTS = {
  BY_SYS_ADMIN: (sysAdminUid: string) => `${BASE}/admin-access-control/sys-admin-roles/${sysAdminUid}`,
  ASSIGN: `${BASE}/admin-access-control/sys-admin-roles`,
  REVOKE: (uid: string) => `${BASE}/admin-access-control/sys-admin-roles/${uid}`,
};

export const SETTINGS_ENDPOINTS = {
  GET: "/admin/settings",
  UPDATE: "/admin/settings",
} as const;
