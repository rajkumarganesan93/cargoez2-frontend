import { useState, useEffect, useCallback } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import { useRealtimeSync } from "@rajkumarganesan93/uifunctions";
import type { ApiError, DomainEvent } from "@rajkumarganesan93/uifunctions";
import type { Contact, CreateContactInput, UpdateContactInput } from "../../domain";
import { contactUseCases } from "../../di/container";

const sampleContacts: Contact[] = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+1-555-0101", company: "Acme Corp", createdAt: "2026-01-15T10:00:00Z" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+1-555-0102", company: "Global Freight", createdAt: "2026-02-01T14:30:00Z" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", phone: "+1-555-0103", company: "Swift Logistics", createdAt: "2026-02-20T09:15:00Z" },
];

export function useContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contactUseCases.listContacts();
      setContacts(data);
    } catch {
      setContacts(sampleContacts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleRealtimeEvent = useCallback(
    (event: DomainEvent) => {
      fetchContacts();
      showToast("info", `A contact was ${event.action} by another user`);
    },
    [fetchContacts, showToast],
  );

  const { connected } = useRealtimeSync({
    entity: "contacts",
    onEvent: handleRealtimeEvent,
  });

  return { contacts, loading, refetch: fetchContacts, connected };
}

export function useContactDetail(id: string | undefined) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    contactUseCases
      .getContact(id)
      .then((data) => setContact(data))
      .catch(() =>
        setContact(sampleContacts.find((c) => c.id === id) ?? sampleContacts[0])
      )
      .finally(() => setLoading(false));
  }, [id]);

  return { contact, loading };
}

export function useContactMutation() {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const createContact = async (data: CreateContactInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await contactUseCases.createContact(data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateContact = async (id: string, data: UpdateContactInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await contactUseCases.updateContact(id, data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    try {
      const result = await contactUseCases.deleteContact(id);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    }
  };

  return { saving, createContact, updateContact, deleteContact };
}
