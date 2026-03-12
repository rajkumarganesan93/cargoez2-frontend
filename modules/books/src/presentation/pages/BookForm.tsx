import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { rules } from "@rajkumarganesan93/uifunctions";
import { useBookDetail, useBookMutation } from "../hooks/useBooks";
import type { CreateBookEntryInput } from "../../domain";

export default function BookForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { entry, loading: loadingDetail } = useBookDetail(isEdit ? id : undefined);
  const { saving, createEntry, updateEntry } = useBookMutation();

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    currency: "USD",
    subtotal: "",
    taxAmount: "",
    totalAmount: "",
    status: "draft",
    notes: "",
  });

  useEffect(() => {
    if (entry && isEdit) {
      setFormData({
        invoiceNumber: entry.invoiceNumber,
        invoiceDate: entry.invoiceDate?.split("T")[0] ?? "",
        dueDate: entry.dueDate?.split("T")[0] ?? "",
        currency: entry.currency,
        subtotal: String(entry.subtotal ?? 0),
        taxAmount: String(entry.taxAmount ?? 0),
        totalAmount: String(entry.totalAmount ?? 0),
        status: entry.status,
        notes: entry.notes ?? "",
      });
    }
  }, [entry, isEdit]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    const payload: CreateBookEntryInput = {
      invoiceNumber: formData.invoiceNumber,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate || undefined,
      currency: formData.currency,
      subtotal: parseFloat(formData.subtotal) || 0,
      taxAmount: parseFloat(formData.taxAmount) || 0,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      status: formData.status,
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
        {isEdit ? "Edit Invoice" : "New Invoice"}
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
          disabled={isEdit}
        />
        <TextField
          id="book-date"
          label="Invoice Date"
          type="date"
          value={formData.invoiceDate}
          onChange={handleChange("invoiceDate")}
          fullWidth
          validations={[rules.required("Invoice date")]}
        />
        <TextField
          id="book-due-date"
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={handleChange("dueDate")}
          fullWidth
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
          id="book-subtotal"
          label="Subtotal"
          type="number"
          placeholder="e.g. 10000.00"
          value={formData.subtotal}
          onChange={handleChange("subtotal")}
          fullWidth
          validations={[rules.required("Subtotal")]}
        />
        <TextField
          id="book-tax"
          label="Tax Amount"
          type="number"
          placeholder="e.g. 1800.00"
          value={formData.taxAmount}
          onChange={handleChange("taxAmount")}
          fullWidth
        />
        <TextField
          id="book-total"
          label="Total Amount"
          type="number"
          placeholder="e.g. 11800.00"
          value={formData.totalAmount}
          onChange={handleChange("totalAmount")}
          fullWidth
          validations={[rules.required("Total amount")]}
        />
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
          <select
            className="w-full border border-grey-300 rounded-md px-3 py-2 text-sm bg-bg-default text-text-primary"
            value={formData.status}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
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
            label={saving ? "Saving..." : isEdit ? "Update Invoice" : "Save Invoice"}
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
