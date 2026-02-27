import { useState, useEffect } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { api, formatDate } from "@rajkumarganesan93/uifunctions";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
}

const sampleContacts: Contact[] = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+1-555-0101", company: "Acme Corp", createdAt: "2026-01-15T10:00:00Z" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+1-555-0102", company: "Global Freight", createdAt: "2026-02-01T14:30:00Z" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", phone: "+1-555-0103", company: "Swift Logistics", createdAt: "2026-02-20T09:15:00Z" },
];

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get<{ data: Contact[] }>("/api/contacts")
      .then((res) => setContacts(res.data.data))
      .catch(() => setContacts(sampleContacts))
      .finally(() => setLoading(false));
  }, []);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Contacts</h1>
        <Button label="Add Contact" variant="contained" color="primary" />
      </div>
      <div className="mb-4">
        <TextField
          id="contact-search"
          placeholder="Search contacts by name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="medium"
        />
      </div>
      {loading ? (
        <p className="text-text-secondary">Loading contacts...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-grey-300">
          <table className="w-full text-left">
            <thead className="bg-grey-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Email</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Phone</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Company</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Created</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => (
                <tr key={contact.id} className="border-t border-grey-300 hover:bg-action-hover">
                  <td className="px-4 py-3 text-sm text-text-primary">{contact.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{contact.email}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{contact.phone}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{contact.company}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{formatDate(contact.createdAt, "dd/MM/yyyy")}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button label="View" variant="text" color="primary" size="small" />
                      <Button label="Edit" variant="outlined" color="info" size="small" />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-secondary">
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
