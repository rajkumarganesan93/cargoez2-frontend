import { createContext, useContext } from "react";

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
  loading: boolean;
  /** Check if user can perform a specific operation on a module.screen */
  can: (operation: string, module: string, screen: string) => boolean;
  /** Check if user can perform any of the given operations */
  canAny: (operations: string[], module: string, screen: string) => boolean;
  /** Reload permissions from backend */
  refresh: () => Promise<void>;
}

const defaultValue: PermissionContextValue = {
  permissions: null,
  loading: true,
  can: () => false,
  canAny: () => false,
  refresh: async () => {},
};

export const PermissionContext = createContext<PermissionContextValue>(defaultValue);

export function usePermissions(): PermissionContextValue {
  return useContext(PermissionContext);
}
