import { useState, useEffect, useCallback } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import type { ApiError } from "@rajkumarganesan93/uifunctions";
import type { BookEntry, CreateBookEntryInput, UpdateBookEntryInput } from "../../domain";
import { bookUseCases } from "../../di/container";

const sampleEntries: BookEntry[] = [
  { id: "1", invoiceNumber: "INV-2026-001", customerName: "Acme Logistics", amount: 12500.50, currency: "USD", status: "Paid", date: "2026-01-15T10:00:00Z", notes: "Full container shipment" },
  { id: "2", invoiceNumber: "INV-2026-002", customerName: "Global Freight Co", amount: 8750.00, currency: "EUR", status: "Pending", date: "2026-02-10T14:30:00Z", notes: "LCL booking" },
  { id: "3", invoiceNumber: "INV-2026-003", customerName: "Swift Cargo Ltd", amount: 23400.75, currency: "USD", status: "Overdue", date: "2026-02-05T09:15:00Z", notes: "Air freight" },
  { id: "4", invoiceNumber: "INV-2026-004", customerName: "Ocean Transport Inc", amount: 5600.00, currency: "GBP", status: "Paid", date: "2026-02-20T11:00:00Z" },
  { id: "5", invoiceNumber: "INV-2026-005", customerName: "Air Express Corp", amount: 18900.25, currency: "USD", status: "Pending", date: "2026-02-25T16:45:00Z" },
];

export function useBooksList() {
  const [entries, setEntries] = useState<BookEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookUseCases.listEntries();
      setEntries(data);
    } catch {
      setEntries(sampleEntries);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { entries, loading, refetch: fetchEntries };
}

export function useBookDetail(id: string | undefined) {
  const [entry, setEntry] = useState<BookEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    bookUseCases
      .getEntry(id)
      .then((data) => setEntry(data))
      .catch(() =>
        setEntry(sampleEntries.find((e) => e.id === id) ?? sampleEntries[0])
      )
      .finally(() => setLoading(false));
  }, [id]);

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
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateEntry = async (id: string, data: UpdateBookEntryInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await bookUseCases.updateEntry(id, data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, createEntry, updateEntry };
}
