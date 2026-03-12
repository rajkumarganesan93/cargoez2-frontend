import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@rajkumarganesan93/uicontrols";
import { formatDate } from "@rajkumarganesan93/uifunctions";
import { useContactDetail, useContactMutation } from "../hooks/useContacts";

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contact, loading } = useContactDetail(id);
  const { deleteContact } = useContactMutation();

  const handleDelete = async () => {
    if (!id) return;
    const success = await deleteContact(id);
    if (success) navigate("/contacts");
  };

  if (loading) return <p className="p-6 text-text-secondary">Loading...</p>;
  if (!contact) return <p className="p-6 text-error">Contact not found.</p>;

  const displayName = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || contact.companyName || "—";

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{displayName}</h1>
        <div className="flex gap-2">
          <Button label="Edit" variant="outlined" color="primary" onClick={() => navigate(`/contacts/${id}/edit`)} />
          <Button label="Delete" variant="outlined" color="error" onClick={handleDelete} />
        </div>
      </div>
      <div className="bg-bg-paper rounded-lg p-6 space-y-4 border border-grey-300">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Type</span>
            <p className="text-text-primary capitalize">{contact.contactType}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Company</span>
            <p className="text-text-primary">{contact.companyName ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">First Name</span>
            <p className="text-text-primary">{contact.firstName ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Last Name</span>
            <p className="text-text-primary">{contact.lastName ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Email</span>
            <p className="text-text-primary">{contact.email ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Phone</span>
            <p className="text-text-primary">{contact.phone ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">City</span>
            <p className="text-text-primary">{contact.city ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Country</span>
            <p className="text-text-primary">{contact.country ?? "—"}</p>
          </div>
        </div>
        {contact.notes && (
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Notes</span>
            <p className="text-text-primary">{contact.notes}</p>
          </div>
        )}
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Created</span>
          <p className="text-text-primary">{formatDate(contact.createdAt, "dd MMM yyyy, HH:mm")}</p>
        </div>
      </div>
    </div>
  );
}
