import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import { api } from "@rajkumarganesan93/uifunctions";
import { useAuth } from "@rajkumarganesan93/auth";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  messageCode: string;
  message: string;
  data?: T;
}

interface BackendPaginated<T> {
  data: T[];
  pagination: PaginationMeta;
}

interface CrudEndpoints {
  LIST: string;
  DETAIL: (uid: string) => string;
  CREATE: string;
  UPDATE: (uid: string) => string;
  DELETE: (uid: string) => string;
}

interface UseCrudListOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export function useCrudList<T extends { uid: string }>(
  endpoints: CrudEndpoints,
  options: UseCrudListOptions = {},
) {
  const { initialPage = 1, initialLimit = 10, autoFetch = true } = options;
  const [items, setItems] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const { token } = useAuth();
  const hasFetchedRef = useRef(false);
  const metaRef = useRef(meta);
  metaRef.current = meta;

  const fetchItems = useCallback(
    async (page?: number, limit?: number, searchTerm?: string) => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          page: page ?? metaRef.current.page,
          limit: limit ?? metaRef.current.limit,
          sortBy: "createdAt",
          sortOrder: "desc",
        };
        if (searchTerm !== undefined ? searchTerm : search) {
          params.search = searchTerm !== undefined ? searchTerm : search;
        }
        const res = await api.get<ApiResponse<BackendPaginated<T>>>(
          endpoints.LIST,
          { params },
        );
        const body = res.data.data!;
        setItems(body.data);
        setMeta(body.pagination);
      } catch (err: any) {
        showToast("error", err?.response?.data?.message || err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    },
    [endpoints.LIST, search, showToast],
  );

  useEffect(() => {
    if (token && autoFetch && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchItems(initialPage, initialLimit);
    }
  }, [token, autoFetch, fetchItems, initialPage, initialLimit]);

  const goToPage = useCallback(
    (page: number) => fetchItems(page),
    [fetchItems],
  );

  const handleSearch = useCallback(
    (term: string) => {
      setSearch(term);
      fetchItems(1, metaRef.current.limit, term);
    },
    [fetchItems],
  );

  return { items, meta, loading, search, refetch: fetchItems, goToPage, handleSearch };
}

export function useCrudMutations<T>(endpoints: CrudEndpoints) {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const createItem = async (data: Record<string, any>): Promise<boolean> => {
    setSaving(true);
    try {
      const res = await api.post<ApiResponse<T>>(endpoints.CREATE, data);
      showToast("success", res.data.message || "Created successfully");
      return true;
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Create failed");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (uid: string, data: Record<string, any>): Promise<boolean> => {
    setSaving(true);
    try {
      const res = await api.put<ApiResponse<T>>(endpoints.UPDATE(uid), data);
      showToast("success", res.data.message || "Updated successfully");
      return true;
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Update failed");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (uid: string): Promise<boolean> => {
    setSaving(true);
    try {
      const res = await api.del<ApiResponse<void>>(endpoints.DELETE(uid));
      showToast("success", res.data.message || "Deleted successfully");
      return true;
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Delete failed");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, createItem, updateItem, deleteItem };
}
