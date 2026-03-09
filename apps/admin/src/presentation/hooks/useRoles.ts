import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import { useAuth } from "@rajkumarganesan93/auth";
import type { Role, CreateRoleInput, UpdateRoleInput, PaginationMeta, PaginatedResult } from "../../domain";
import type { ApiError } from "@rajkumarganesan93/uifunctions";
import { roleUseCases } from "../../di/container";

const INITIAL_META: PaginationMeta = { total: 0, page: 1, limit: 10, totalPages: 0 };

export function useRoleList(initialPage = 1, initialLimit = 10) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ ...INITIAL_META, page: initialPage, limit: initialLimit });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const { token } = useAuth();
  const metaRef = useRef(meta);
  metaRef.current = meta;
  const searchRef = useRef(search);
  searchRef.current = search;
  const hasFetchedRef = useRef(false);

  const fetchRoles = useCallback(async (page?: number, limit?: number, searchTerm?: string) => {
    setLoading(true);
    try {
      const result: PaginatedResult<Role> = await roleUseCases.listRoles({
        page: page ?? metaRef.current.page,
        limit: limit ?? metaRef.current.limit,
        search: (searchTerm ?? searchRef.current) || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setRoles(result.items);
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
      fetchRoles(initialPage, initialLimit);
    }
  }, [token, fetchRoles, initialPage, initialLimit]);

  const goToPage = useCallback((page: number) => fetchRoles(page, metaRef.current.limit), [fetchRoles]);
  const handleSearch = useCallback((term: string) => { setSearch(term); fetchRoles(1, metaRef.current.limit, term); }, [fetchRoles]);

  return { roles, meta, loading, search, refetch: fetchRoles, goToPage, handleSearch };
}

export function useRoleMutation() {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const createRole = async (data: CreateRoleInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await roleUseCases.createRole(data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateRole = async (id: string, data: UpdateRoleInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await roleUseCases.updateRole(id, data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (id: string): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await roleUseCases.deleteRole(id);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, createRole, updateRole, deleteRole };
}
