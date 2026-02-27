import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { formatDate } from "@rajkumarganesan93/uifunctions";
import { useBooksList } from "../hooks/useBooks";
import type { BookEntry } from "../../domain";

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function StatusBadge({ status }: { status: BookEntry["status"] }) {
  const color = status === "Paid" ? "success" : status === "Pending" ? "warning" : "error";
  return <Button label={status} variant="text" color={color} size="small" disabled />;
}

export default function BooksList() {
  const { entries } = useBooksList();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = entries.filter(
    (e) =>
      e.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Cargo Booking Ledger</h1>
        <Button
          label="New Entry"
          variant="contained"
          color="primary"
          onClick={() => navigate("/books/new")}
        />
      </div>
      <div className="mb-4">
        <TextField
          id="books-search"
          placeholder="Search by invoice number or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="medium"
        />
      </div>
      <div className="overflow-x-auto rounded-lg border border-grey-300">
        <table className="w-full text-left">
          <thead className="bg-grey-100">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Invoice</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Customer</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Amount</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Date</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={entry.id} className="border-t border-grey-300 hover:bg-action-hover">
                <td className="px-4 py-3 text-sm text-text-primary font-medium">{entry.invoiceNumber}</td>
                <td className="px-4 py-3 text-sm text-text-primary">{entry.customerName}</td>
                <td className="px-4 py-3 text-sm text-text-primary font-medium">
                  {formatAmount(entry.amount, entry.currency)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={entry.status} />
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {formatDate(entry.date, "dd/MM/yyyy")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      label="View"
                      variant="text"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/books/${entry.id}`)}
                    />
                    <Button
                      label="Edit"
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={() => navigate(`/books/${entry.id}/edit`)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-secondary">
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
