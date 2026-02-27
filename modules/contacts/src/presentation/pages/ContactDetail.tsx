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

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{contact.name}</h1>
        <div className="flex gap-2">
          <Button
            label="Edit"
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/contacts/${id}/edit`)}
          />
          <Button label="Delete" variant="outlined" color="error" onClick={handleDelete} />
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
