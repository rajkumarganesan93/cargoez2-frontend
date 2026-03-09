import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import { useAuth } from "@rajkumarganesan93/auth";
import type { Permission, CreatePermissionInput, PaginationMeta, PaginatedResult } from "../../domain";
import type { ApiError } from "@rajkumarganesan93/uifunctions";
import { permissionUseCases } from "../../di/container";

const INITIAL_META: PaginationMeta = { total: 0, page: 1, limit: 100, totalPages: 0 };

export function usePermissionList() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ ...INITIAL_META });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const { token } = useAuth();
  const searchRef = useRef(search);
  searchRef.current = search;
  const hasFetchedRef = useRef(false);

  const fetchPermissions = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    try {
      const result: PaginatedResult<Permission> = await permissionUseCases.listPermissions({
        page: 1, limit: 100,
        search: (searchTerm ?? searchRef.current) || undefined,
      });
      setPermissions(result.items);
      setMeta(result.meta);
    } catch (err) {
      showToast("error", (err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (token && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchPermissions();
    }
  }, [token, fetchPermissions]);

  const handleSearch = useCallback((term: string) => { setSearch(term); fetchPermissions(term); }, [fetchPermissions]);

  return { permissions, meta, loading, search, refetch: fetchPermissions, handleSearch };
}

export function usePermissionMutation() {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const createPermission = async (data: CreatePermissionInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await permissionUseCases.createPermission(data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deletePermission = async (id: string): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await permissionUseCases.deletePermission(id);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, createPermission, deletePermission };
}
