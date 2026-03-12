import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { formatDate } from "@rajkumarganesan93/uifunctions";
import { useContactList } from "../hooks/useContacts";

function displayName(c: { firstName?: string; lastName?: string; companyName?: string }): string {
  const personal = [c.firstName, c.lastName].filter(Boolean).join(" ");
  return personal || c.companyName || "—";
}

export default function ContactsList() {
  const { contacts, loading } = useContactList();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = contacts.filter((c) => {
    const term = search.toLowerCase();
    return (
      displayName(c).toLowerCase().includes(term) ||
      (c.email ?? "").toLowerCase().includes(term) ||
      (c.companyName ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Contacts</h1>
        <Button
          label="Add Contact"
          variant="contained"
          color="primary"
          onClick={() => navigate("/contacts/new")}
        />
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
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Type</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Company</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Email</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Phone</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">City</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => (
                <tr key={contact.uid} className="border-t border-grey-300 hover:bg-action-hover">
                  <td className="px-4 py-3 text-sm text-text-secondary capitalize">{contact.contactType}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">{displayName(contact)}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{contact.companyName ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{contact.email ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{contact.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{contact.city ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        label="View"
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/contacts/${contact.uid}`)}
                      />
                      <Button
                        label="Edit"
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => navigate(`/contacts/${contact.uid}/edit`)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-text-secondary">
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
