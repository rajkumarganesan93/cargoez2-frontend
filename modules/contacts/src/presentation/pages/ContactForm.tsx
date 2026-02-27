import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { rules } from "@rajkumarganesan93/uifunctions";
import type { CreateContactInput } from "../../domain";
import { useContactDetail, useContactMutation } from "../hooks/useContacts";

export default function ContactForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { contact, loading: loadingDetail } = useContactDetail(isEdit ? id : undefined);
  const { saving, createContact, updateContact } = useContactMutation();

  const [formData, setFormData] = useState<CreateContactInput>({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  useEffect(() => {
    if (contact && isEdit) {
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
      });
    }
  }, [contact, isEdit]);

  const handleChange = (field: keyof CreateContactInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    const success = isEdit && id
      ? await updateContact(id, formData)
      : await createContact(formData);
    if (success) navigate("/contacts");
  };

  const handleCancel = () => navigate(isEdit && id ? `/contacts/${id}` : "/contacts");

  if (isEdit && loadingDetail) return <p className="p-6 text-text-secondary">Loading...</p>;

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        {isEdit ? "Edit Contact" : "New Contact"}
      </h1>
      <div className="space-y-2">
        <TextField
          id="contact-name"
          label="Name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={handleChange("name")}
          fullWidth
          validations={[rules.required("Name"), rules.minLength(2, "Name")]}
        />
        <TextField
          id="contact-email"
          label="Email"
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleChange("email")}
          fullWidth
          validations={[rules.required("Email"), rules.email()]}
        />
        <TextField
          id="contact-phone"
          label="Phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange("phone")}
          fullWidth
        />
        <TextField
          id="contact-company"
          label="Company"
          placeholder="Enter company name"
          value={formData.company}
          onChange={handleChange("company")}
          fullWidth
        />
        <div className="flex gap-3 pt-4">
          <Button
            label={saving ? "Saving..." : isEdit ? "Update Contact" : "Save Contact"}
            variant="contained"
            color="primary"
            disabled={saving}
            onClick={handleSubmit}
          />
          <Button label="Cancel" variant="outlined" color="secondary" onClick={handleCancel} />
        </div>
      </div>
    </div>
  );
}
