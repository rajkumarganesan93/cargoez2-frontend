import { useState, useEffect, useCallback } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import type { ApiError } from "@rajkumarganesan93/uifunctions";
import type { User, CreateUserInput, SystemSettings } from "../../domain";
import { userUseCases, settingsUseCases } from "../../di/container";

const sampleUsers: User[] = [
  { id: "1", username: "admin", email: "admin@cargoez.com", role: "admin", status: "Active" },
  { id: "2", username: "testuser", email: "testuser@cargoez.com", role: "user", status: "Active" },
  { id: "3", username: "manager", email: "manager@cargoez.com", role: "manager", status: "Active" },
];

export function useUserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userUseCases.listUsers();
      setUsers(data);
    } catch {
      setUsers(sampleUsers);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, refetch: fetchUsers };
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

  const disableUser = async (id: string): Promise<boolean> => {
    try {
      const result = await userUseCases.disableUser(id);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    }
  };

  return { saving, createUser, disableUser };
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
