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
    contactType: "company",
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    notes: "",
  });

  useEffect(() => {
    if (contact && isEdit) {
      setFormData({
        contactType: contact.contactType,
        companyName: contact.companyName ?? "",
        firstName: contact.firstName ?? "",
        lastName: contact.lastName ?? "",
        email: contact.email ?? "",
        phone: contact.phone ?? "",
        city: contact.city ?? "",
        country: contact.country ?? "",
        notes: contact.notes ?? "",
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
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Contact Type</label>
          <select
            className="w-full border border-grey-300 rounded-md px-3 py-2 text-sm bg-bg-default text-text-primary"
            value={formData.contactType}
            onChange={(e) => setFormData((prev) => ({ ...prev, contactType: e.target.value }))}
          >
            <option value="company">Company</option>
            <option value="individual">Individual</option>
            <option value="agent">Agent</option>
            <option value="carrier">Carrier</option>
          </select>
        </div>
        <TextField
          id="contact-company"
          label="Company Name"
          placeholder="Enter company name"
          value={formData.companyName ?? ""}
          onChange={handleChange("companyName")}
          fullWidth
        />
        <TextField
          id="contact-first-name"
          label="First Name"
          placeholder="Enter first name"
          value={formData.firstName ?? ""}
          onChange={handleChange("firstName")}
          fullWidth
        />
        <TextField
          id="contact-last-name"
          label="Last Name"
          placeholder="Enter last name"
          value={formData.lastName ?? ""}
          onChange={handleChange("lastName")}
          fullWidth
        />
        <TextField
          id="contact-email"
          label="Email"
          type="email"
          placeholder="Enter email address"
          value={formData.email ?? ""}
          onChange={handleChange("email")}
          fullWidth
          validations={[rules.email()]}
        />
        <TextField
          id="contact-phone"
          label="Phone"
          placeholder="Enter phone number"
          value={formData.phone ?? ""}
          onChange={handleChange("phone")}
          fullWidth
        />
        <TextField
          id="contact-city"
          label="City"
          placeholder="Enter city"
          value={formData.city ?? ""}
          onChange={handleChange("city")}
          fullWidth
        />
        <TextField
          id="contact-country"
          label="Country"
          placeholder="Enter country"
          value={formData.country ?? ""}
          onChange={handleChange("country")}
          fullWidth
        />
        <TextField
          id="contact-notes"
          label="Notes"
          placeholder="Optional notes"
          value={formData.notes ?? ""}
          onChange={handleChange("notes")}
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
