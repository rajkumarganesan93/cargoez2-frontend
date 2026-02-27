import { useState, useEffect } from "react";
import { Button } from "@rajkumarganesan93/uicontrols";
import { api, formatDate } from "@rajkumarganesan93/uifunctions";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
}

export default function ContactDetail() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Contact }>("/api/contacts/1")
      .then((res) => setContact(res.data.data))
      .catch(() =>
        setContact({
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1-555-0101",
          company: "Acme Corp",
          createdAt: "2026-01-15T10:00:00Z",
        })
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-text-secondary">Loading...</p>;
  if (!contact) return <p className="p-6 text-error">Contact not found.</p>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{contact.name}</h1>
        <div className="flex gap-2">
          <Button label="Edit" variant="outlined" color="primary" />
          <Button label="Delete" variant="outlined" color="error" />
        </div>
      </div>
      <div className="bg-bg-paper rounded-lg p-6 space-y-4 border border-grey-300">
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Email</span>
          <p className="text-text-primary">{contact.email}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Phone</span>
          <p className="text-text-primary">{contact.phone}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Company</span>
          <p className="text-text-primary">{contact.company}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Created</span>
          <p className="text-text-primary">{formatDate(contact.createdAt, "dd MMM yyyy, HH:mm")}</p>
        </div>
      </div>
    </div>
  );
}
