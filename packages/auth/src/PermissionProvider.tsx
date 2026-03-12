import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  PermissionContext,
  type PermissionContextValue,
  type UserContextData,
} from "./PermissionContext";

interface PermissionProviderProps {
  fetcher: () => Promise<UserContextData>;
  children: React.ReactNode;
}

export function PermissionProvider({ fetcher, children }: PermissionProviderProps) {
  const { token } = useAuth();
  const [userContext, setUserContext] = useState<UserContextData | null>(null);
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const hasFetchedRef = useRef(false);

  const lookupRef = useRef<Set<string>>(new Set());
  const isSysAdminRef = useRef(false);

  const buildLookup = useCallback((data: UserContextData) => {
    const set = new Set<string>();
    isSysAdminRef.current = false;
    for (const perm of data.permissions) {
      if (perm.key === '*') {
        isSysAdminRef.current = true;
      }
      set.add(perm.key);
    }
    lookupRef.current = set;
  }, []);

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcherRef.current();
      setUserContext(data);
      buildLookup(data);
    } catch (err) {
      console.error("Failed to fetch user context:", err);
      setUserContext(null);
      lookupRef.current = new Set();
      isSysAdminRef.current = false;
    } finally {
      setLoading(false);
    }
  }, [buildLookup]);

  useEffect(() => {
    if (token && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchPermissions();
    }
  }, [token, fetchPermissions]);

  const hasPermission = useCallback((permissionKey: string): boolean => {
    if (isSysAdminRef.current) return true;
    return lookupRef.current.has(permissionKey);
  }, []);

  const can = useCallback(
    (operation: string, module: string, _screen?: string): boolean => {
      if (isSysAdminRef.current) return true;
      return lookupRef.current.has(`${module}.${operation}`);
    },
    [],
  );

  const canAny = useCallback(
    (operations: string[], module: string, _screen?: string): boolean => {
      if (isSysAdminRef.current) return true;
      return operations.some((op) => lookupRef.current.has(`${module}.${op}`));
    },
    [],
  );

  const value: PermissionContextValue = useMemo(
    () => ({
      permissions: null,
      userContext,
      loading,
      can,
      canAny,
      hasPermission,
      refresh: fetchPermissions,
    }),
    [userContext, loading, can, canAny, hasPermission, fetchPermissions],
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}
