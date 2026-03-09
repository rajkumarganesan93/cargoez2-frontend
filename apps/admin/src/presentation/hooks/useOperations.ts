import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import { useAuth } from "@rajkumarganesan93/auth";
import type { Operation, CreateOperationInput, PaginationMeta, PaginatedResult } from "../../domain";
import type { ApiError } from "@rajkumarganesan93/uifunctions";
import { operationUseCases } from "../../di/container";

const INITIAL_META: PaginationMeta = { total: 0, page: 1, limit: 50, totalPages: 0 };

export function useOperationList() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ ...INITIAL_META });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { token } = useAuth();
  const hasFetchedRef = useRef(false);

  const fetchOperations = useCallback(async () => {
    setLoading(true);
    try {
      const result: PaginatedResult<Operation> = await operationUseCases.listOperations({ page: 1, limit: 50 });
      setOperations(result.items);
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
      fetchOperations();
    }
  }, [token, fetchOperations]);

  return { operations, meta, loading, refetch: fetchOperations };
}

export function useOperationMutation() {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const createOperation = async (data: CreateOperationInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await operationUseCases.createOperation(data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, createOperation };
}
