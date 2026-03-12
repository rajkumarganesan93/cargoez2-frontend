import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { formatDate } from "@rajkumarganesan93/uifunctions";
import { useBooksList } from "../hooks/useBooks";

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

const statusColors: Record<string, "warning" | "info" | "success" | "error" | "secondary"> = {
  draft: "secondary",
  pending: "warning",
  sent: "info",
  paid: "success",
  overdue: "error",
  cancelled: "error",
};

export default function BooksList() {
  const { entries, loading } = useBooksList();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = entries.filter((e) => {
    const term = search.toLowerCase();
    return (
      e.invoiceNumber.toLowerCase().includes(term) ||
      e.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Invoices</h1>
        <Button
          label="New Invoice"
          variant="contained"
          color="primary"
          onClick={() => navigate("/books/new")}
        />
      </div>
      <div className="mb-4">
        <TextField
          id="books-search"
          placeholder="Search by invoice number or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="medium"
        />
      </div>
      {loading ? (
        <p className="text-text-secondary">Loading invoices...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-grey-300">
          <table className="w-full text-left">
            <thead className="bg-grey-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Invoice #</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Due Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Total</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.uid} className="border-t border-grey-300 hover:bg-action-hover">
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">{entry.invoiceNumber}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {formatDate(entry.invoiceDate, "dd/MM/yyyy")}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {entry.dueDate ? formatDate(entry.dueDate, "dd/MM/yyyy") : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">
                    {formatAmount(Number(entry.totalAmount), entry.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      label={entry.status}
                      variant="text"
                      color={statusColors[entry.status.toLowerCase()] ?? "info"}
                      size="small"
                      disabled
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button label="View" variant="text" color="primary" size="small" onClick={() => navigate(`/books/${entry.uid}`)} />
                      <Button label="Edit" variant="outlined" color="info" size="small" onClick={() => navigate(`/books/${entry.uid}/edit`)} />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-secondary">
                    No invoices found.
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
