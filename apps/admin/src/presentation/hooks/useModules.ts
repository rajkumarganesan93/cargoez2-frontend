import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import { useAuth } from "@rajkumarganesan93/auth";
import type { AppModule, CreateModuleInput, UpdateModuleInput, PaginationMeta, PaginatedResult } from "../../domain";
import type { ApiError } from "@rajkumarganesan93/uifunctions";
import { moduleUseCases } from "../../di/container";

const INITIAL_META: PaginationMeta = { total: 0, page: 1, limit: 50, totalPages: 0 };

export function useModuleList() {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ ...INITIAL_META });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { token } = useAuth();
  const hasFetchedRef = useRef(false);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    try {
      const result: PaginatedResult<AppModule> = await moduleUseCases.listModules({
        page: 1, limit: 50, sortBy: "sortOrder", sortOrder: "asc",
      });
      setModules(result.items);
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
      fetchModules();
    }
  }, [token, fetchModules]);

  return { modules, meta, loading, refetch: fetchModules };
}

export function useModuleMutation() {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const createModule = async (data: CreateModuleInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await moduleUseCases.createModule(data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateModule = async (id: string, data: UpdateModuleInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await moduleUseCases.updateModule(id, data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteModule = async (id: string): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await moduleUseCases.deleteModule(id);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, createModule, updateModule, deleteModule };
}
