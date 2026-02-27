import { useState } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { api } from "@rajkumarganesan93/uifunctions";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.post("/api/contacts", formData);
      alert("Contact saved!");
    } catch {
      alert("Failed to save (API not connected). Sample form submitted.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold text-text-primary mb-6">New Contact</h1>
      <div className="space-y-2">
        <TextField
          id="contact-name"
          label="Name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={handleChange("name")}
          fullWidth
          validations={[{ type: "required", message: "Name is required" }]}
        />
        <TextField
          id="contact-email"
          label="Email"
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleChange("email")}
          fullWidth
          validations={[
            { type: "required", message: "Email is required" },
            { type: "pattern", value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
          ]}
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
            label={saving ? "Saving..." : "Save Contact"}
            variant="contained"
            color="primary"
            disabled={saving}
            onClick={handleSubmit}
          />
          <Button label="Cancel" variant="outlined" color="secondary" />
        </div>
      </div>
    </div>
  );
}
