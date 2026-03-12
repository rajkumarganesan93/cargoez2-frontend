import { useState, useEffect, useCallback } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import type { ApiError } from "@rajkumarganesan93/uifunctions";
import type { SystemSettings } from "../../domain";
import { settingsUseCases } from "../../di/container";

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
