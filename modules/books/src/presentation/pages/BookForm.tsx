import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { rules } from "@rajkumarganesan93/uifunctions";
import { useBookDetail, useBookMutation } from "../hooks/useBooks";

export default function BookForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { entry, loading: loadingDetail } = useBookDetail(isEdit ? id : undefined);
  const { saving, createEntry, updateEntry } = useBookMutation();

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    customerName: "",
    amount: "",
    currency: "",
    notes: "",
  });

  useEffect(() => {
    if (entry && isEdit) {
      setFormData({
        invoiceNumber: entry.invoiceNumber,
        customerName: entry.customerName,
        amount: String(entry.amount),
        currency: entry.currency,
        notes: entry.notes ?? "",
      });
    }
  }, [entry, isEdit]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    const payload = {
      invoiceNumber: formData.invoiceNumber,
      customerName: formData.customerName,
      amount: formData.amount ? parseFloat(formData.amount) : 0,
      currency: formData.currency,
      notes: formData.notes || undefined,
    };
    const success = isEdit && id
      ? await updateEntry(id, payload)
      : await createEntry(payload);
    if (success) navigate("/books");
  };

  const handleCancel = () => navigate(isEdit && id ? `/books/${id}` : "/books");

  if (isEdit && loadingDetail) return <p className="p-6 text-text-secondary">Loading...</p>;

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        {isEdit ? "Edit Booking Entry" : "New Booking Entry"}
      </h1>
      <div className="space-y-2">
        <TextField
          id="book-invoice"
          label="Invoice Number"
          placeholder="e.g. INV-2026-001"
          value={formData.invoiceNumber}
          onChange={handleChange("invoiceNumber")}
          fullWidth
          validations={[rules.required("Invoice number")]}
        />
        <TextField
          id="book-customer"
          label="Customer Name"
          placeholder="Enter customer name"
          value={formData.customerName}
          onChange={handleChange("customerName")}
          fullWidth
          validations={[rules.required("Customer name")]}
        />
        <TextField
          id="book-amount"
          label="Amount"
          type="number"
          placeholder="e.g. 12500.50"
          value={formData.amount}
          onChange={handleChange("amount")}
          fullWidth
          validations={[rules.required("Amount")]}
        />
        <TextField
          id="book-currency"
          label="Currency"
          placeholder="e.g. USD, EUR, GBP"
          value={formData.currency}
          onChange={handleChange("currency")}
          fullWidth
          validations={[rules.required("Currency"), rules.maxLength(3, "Currency")]}
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
            label={saving ? "Saving..." : isEdit ? "Update Entry" : "Save Entry"}
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
