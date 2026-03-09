import { useState, useCallback } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import type { Screen, CreateScreenInput, UpdateScreenInput } from "../../domain";
import type { ApiError } from "@rajkumarganesan93/uifunctions";
import { screenUseCases } from "../../di/container";

export function useScreenList() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchScreens = useCallback(async (moduleId: string) => {
    if (!moduleId) { setScreens([]); return; }
    setLoading(true);
    try {
      const result = await screenUseCases.listScreensByModule(moduleId);
      setScreens(result);
    } catch (err) {
      showToast("error", (err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return { screens, loading, fetchScreens };
}

export function useScreenMutation() {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const createScreen = async (data: CreateScreenInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await screenUseCases.createScreen(data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateScreen = async (id: string, data: UpdateScreenInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await screenUseCases.updateScreen(id, data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteScreen = async (id: string): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await screenUseCases.deleteScreen(id);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, createScreen, updateScreen, deleteScreen };
}
