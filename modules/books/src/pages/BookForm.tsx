import { useState } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { api } from "@rajkumarganesan93/uifunctions";

export default function BookForm() {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    customerName: "",
    amount: "",
    currency: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.post("/api/books", {
        ...formData,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
      });
      alert("Entry saved!");
    } catch {
      alert("Failed to save (API not connected). Sample form submitted.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold text-text-primary mb-6">New Booking Entry</h1>
      <div className="space-y-2">
        <TextField
          id="book-invoice"
          label="Invoice Number"
          placeholder="e.g. INV-2026-001"
          value={formData.invoiceNumber}
          onChange={handleChange("invoiceNumber")}
          fullWidth
          validations={[{ type: "required", message: "Invoice number is required" }]}
        />
        <TextField
          id="book-customer"
          label="Customer Name"
          placeholder="Enter customer name"
          value={formData.customerName}
          onChange={handleChange("customerName")}
          fullWidth
          validations={[{ type: "required", message: "Customer name is required" }]}
        />
        <TextField
          id="book-amount"
          label="Amount"
          type="number"
          placeholder="e.g. 12500.50"
          value={formData.amount}
          onChange={handleChange("amount")}
          fullWidth
          validations={[{ type: "required", message: "Amount is required" }]}
        />
        <TextField
          id="book-currency"
          label="Currency"
          placeholder="e.g. USD, EUR, GBP"
          value={formData.currency}
          onChange={handleChange("currency")}
          fullWidth
          validations={[{ type: "required", message: "Currency is required" }]}
        />
        <TextField
          id="book-notes"
          label="Notes"
          placeholder="Optional notes"
          value={formData.notes}
          onChange={handleChange("notes")}
          fullWidth
        />
        <div className="flex gap-3 pt-4">
          <Button
            label={saving ? "Saving..." : "Save Entry"}
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
