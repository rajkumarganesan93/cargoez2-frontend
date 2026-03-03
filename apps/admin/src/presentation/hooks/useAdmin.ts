import { useState, useEffect, useCallback } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import { useRealtimeSync, type ApiError, type DomainEvent } from "@rajkumarganesan93/uifunctions";
import type { User, CreateUserInput, UpdateUserInput, SystemSettings, PaginatedResult } from "../../domain";
import { userUseCases, settingsUseCases } from "../../di/container";

export function useUserList(initialPage = 1, initialLimit = 10) {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: initialPage, limit: initialLimit, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchUsers = useCallback(async (page?: number, limit?: number) => {
    setLoading(true);
    try {
      const result: PaginatedResult<User> = await userUseCases.listUsers(
        page ?? meta.page,
        limit ?? meta.limit,
      );
      setUsers(result.items);
      setMeta(result.meta);
    } catch (err) {
      showToast("error", (err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, showToast]);

  useEffect(() => {
    fetchUsers(initialPage, initialLimit);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goToPage = useCallback((page: number) => {
    fetchUsers(page, meta.limit);
  }, [fetchUsers, meta.limit]);

  const handleRealtimeEvent = useCallback((event: DomainEvent) => {
    const actionLabels: Record<string, string> = {
      created: "created",
      updated: "updated",
      deleted: "deleted",
    };
    showToast("info", `A user was ${actionLabels[event.action] ?? "modified"} by another user`);
    fetchUsers(meta.page, meta.limit);
  }, [showToast, fetchUsers, meta.page, meta.limit]);

  const { connected } = useRealtimeSync({
    entity: "users",
    serviceUrl: import.meta.env.VITE_USER_SERVICE_URL,
    onEvent: handleRealtimeEvent,
  });

  return { users, meta, loading, refetch: fetchUsers, goToPage, connected };
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
