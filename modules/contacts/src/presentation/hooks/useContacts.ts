import { useState, useEffect, useCallback } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import type { ApiError } from "@rajkumarganesan93/uifunctions";
import type { Contact, CreateContactInput, UpdateContactInput } from "../../domain";
import { contactUseCases } from "../../di/container";

export function useContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contactUseCases.listContacts();
      setContacts(data);
    } catch (err) {
      showToast("error", "Failed to load contacts");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return { contacts, loading, refetch: fetchContacts };
}

export function useContactDetail(uid: string | undefined) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    contactUseCases
      .getContact(uid)
      .then((data) => setContact(data))
      .catch(() => setContact(null))
      .finally(() => setLoading(false));
  }, [uid]);

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
      showToast("error", (err as ApiError).message || "Failed to create contact");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateContact = async (uid: string, data: UpdateContactInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await contactUseCases.updateContact(uid, data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message || "Failed to update contact");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteContact = async (uid: string): Promise<boolean> => {
    try {
      const result = await contactUseCases.deleteContact(uid);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message || "Failed to delete contact");
      return false;
    }
  };

  return { saving, createContact, updateContact, deleteContact };
}
