import { createContext, useContext } from "react";

export interface ResolvedPermission {
  key: string;
  conditions?: Record<string, any>;
}

export interface UserContextData {
  tenantUid: string | null;
  branchUid: string | null;
  userType: 'sys_admin' | 'app_customer' | 'branch_customer' | null;
  permissions: ResolvedPermission[];
}

export interface PermissionScreen {
  code: string;
  name: string;
  operations: string[];
}

export interface PermissionModule {
  code: string;
  name: string;
  icon: string | null;
  screens: PermissionScreen[];
}

export interface PermissionData {
  roles: string[];
  modules: PermissionModule[];
}

export interface PermissionContextValue {
  permissions: PermissionData | null;
  userContext: UserContextData | null;
  loading: boolean;
  /** Check if user can perform operation on module: can('create', 'freight') */
  can: (operation: string, module: string, screen?: string) => boolean;
  /** Check if user can perform any of the given operations */
  canAny: (operations: string[], module: string, screen?: string) => boolean;
  /** Check if user has a specific permission key like 'freight.create' */
  hasPermission: (permissionKey: string) => boolean;
  /** Reload permissions from backend */
  refresh: () => Promise<void>;
}

const defaultValue: PermissionContextValue = {
  permissions: null,
  userContext: null,
  loading: true,
  can: () => false,
  canAny: () => false,
  hasPermission: () => false,
  refresh: async () => {},
};

export const PermissionContext = createContext<PermissionContextValue>(defaultValue);

export function usePermissions(): PermissionContextValue {
  return useContext(PermissionContext);
}
