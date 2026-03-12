import { useState, useEffect, useCallback } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import type { ApiError } from "@rajkumarganesan93/uifunctions";
import type { BookEntry, CreateBookEntryInput, UpdateBookEntryInput } from "../../domain";
import { bookUseCases } from "../../di/container";

export function useBooksList() {
  const [entries, setEntries] = useState<BookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookUseCases.listEntries();
      setEntries(data);
    } catch (err) {
      showToast("error", "Failed to load invoices");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { entries, loading, refetch: fetchEntries };
}

export function useBookDetail(uid: string | undefined) {
  const [entry, setEntry] = useState<BookEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    bookUseCases
      .getEntry(uid)
      .then((data) => setEntry(data))
      .catch(() => setEntry(null))
      .finally(() => setLoading(false));
  }, [uid]);

  return { entry, loading };
}

export function useBookMutation() {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const createEntry = async (data: CreateBookEntryInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await bookUseCases.createEntry(data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message || "Failed to create invoice");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateEntry = async (uid: string, data: UpdateBookEntryInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await bookUseCases.updateEntry(uid, data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message || "Failed to update invoice");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, createEntry, updateEntry };
}
