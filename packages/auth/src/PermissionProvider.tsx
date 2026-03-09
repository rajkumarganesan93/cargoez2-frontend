import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  PermissionContext,
  type PermissionContextValue,
  type PermissionData,
} from "./PermissionContext";

interface PermissionProviderProps {
  /** Async function that fetches the user's permissions from the backend */
  fetcher: () => Promise<PermissionData>;
  children: React.ReactNode;
}

export function PermissionProvider({ fetcher, children }: PermissionProviderProps) {
  const { token } = useAuth();
  const [permissions, setPermissions] = useState<PermissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const hasFetchedRef = useRef(false);

  const lookupRef = useRef<Set<string>>(new Set());

  const buildLookup = useCallback((data: PermissionData) => {
    const set = new Set<string>();
    for (const mod of data.modules) {
      for (const scr of mod.screens) {
        for (const op of scr.operations) {
          set.add(`${mod.code}.${scr.code}.${op}`);
        }
      }
    }
    lookupRef.current = set;
  }, []);

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcherRef.current();
      setPermissions(data);
      buildLookup(data);
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
      setPermissions(null);
      lookupRef.current = new Set();
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

  const can = useCallback(
    (operation: string, module: string, screen: string): boolean => {
      return lookupRef.current.has(`${module}.${screen}.${operation}`);
    },
    [],
  );

  const canAny = useCallback(
    (operations: string[], module: string, screen: string): boolean => {
      return operations.some((op) => lookupRef.current.has(`${module}.${screen}.${op}`));
    },
    [],
  );

  const value: PermissionContextValue = useMemo(
    () => ({ permissions, loading, can, canAny, refresh: fetchPermissions }),
    [permissions, loading, can, canAny, fetchPermissions],
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}
