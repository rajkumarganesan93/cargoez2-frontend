import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import { useRealtimeSync, type ApiError, type DomainEvent } from "@rajkumarganesan93/uifunctions";
import { useAuth } from "@rajkumarganesan93/auth";
import type { User, CreateUserInput, UpdateUserInput, SystemSettings, PaginatedResult, PaginationMeta } from "../../domain";
import { userUseCases, settingsUseCases } from "../../di/container";

const INITIAL_META: PaginationMeta = { total: 0, page: 1, limit: 10, totalPages: 0 };

export function useUserList(initialPage = 1, initialLimit = 10) {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ ...INITIAL_META, page: initialPage, limit: initialLimit });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const { token } = useAuth();

  const searchRef = useRef(search);
  searchRef.current = search;
  const metaRef = useRef(meta);
  metaRef.current = meta;
  const hasFetchedRef = useRef(false);

  const fetchUsers = useCallback(async (page?: number, limit?: number, searchTerm?: string) => {
    setLoading(true);
    try {
      const result: PaginatedResult<User> = await userUseCases.listUsers({
        page: page ?? metaRef.current.page,
        limit: limit ?? metaRef.current.limit,
        search: (searchTerm ?? searchRef.current) || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setUsers(result.items);
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
      fetchUsers(initialPage, initialLimit);
    }
  }, [token, fetchUsers, initialPage, initialLimit]);

  const goToPage = useCallback((page: number) => {
    fetchUsers(page, metaRef.current.limit);
  }, [fetchUsers]);

  const handleSearch = useCallback((term: string) => {
    setSearch(term);
    fetchUsers(1, metaRef.current.limit, term);
  }, [fetchUsers]);

  const handleRealtimeEvent = useCallback((event: DomainEvent) => {
    const actionLabels: Record<string, string> = {
      created: "created",
      updated: "updated",
      deleted: "deleted",
    };
    showToast("info", `A user was ${actionLabels[event.action] ?? "modified"} by another user`);
    fetchUsers();
  }, [showToast, fetchUsers]);

  const { connected } = useRealtimeSync({
    entity: "users",
    serviceUrl: import.meta.env.VITE_USER_SERVICE_URL,
    onEvent: handleRealtimeEvent,
  });

  return { users, meta, loading, search, refetch: fetchUsers, goToPage, handleSearch, connected };
}

export function useUserMutation() {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const createUser = async (data: CreateUserInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await userUseCases.createUser(data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateUser = async (id: string, data: UpdateUserInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await userUseCases.updateUser(id, data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await userUseCases.deleteUser(id);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, createUser, updateUser, deleteUser };
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    apiUrl: import.meta.env.VITE_API_BASE_URL ?? "",
    keycloakUrl: import.meta.env.VITE_KEYCLOAK_URL ?? "",
    realm: import.meta.env.VITE_KEYCLOAK_REALM ?? "",
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await settingsUseCases.getSettings();
      setSettings(data);
    } catch {
      // keep defaults from env vars
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (data: SystemSettings): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await settingsUseCases.updateSettings(data);
      showToast("success", result.message);
      setSettings(result.data);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { settings, setSettings, loading, saving, updateSettings };
}
