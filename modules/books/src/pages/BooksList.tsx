import { useState } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { formatDate } from "@rajkumarganesan93/uifunctions";

interface BookEntry {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  currency: string;
  status: "Paid" | "Pending" | "Overdue";
  date: string;
}

const sampleEntries: BookEntry[] = [
  { id: "1", invoiceNumber: "INV-2026-001", customerName: "Acme Logistics", amount: 12500.5, currency: "USD", status: "Paid", date: "2026-01-15T10:00:00Z" },
  { id: "2", invoiceNumber: "INV-2026-002", customerName: "Global Freight Co", amount: 8750.0, currency: "EUR", status: "Pending", date: "2026-02-10T14:30:00Z" },
  { id: "3", invoiceNumber: "INV-2026-003", customerName: "Swift Cargo Ltd", amount: 23400.75, currency: "USD", status: "Overdue", date: "2026-02-05T09:15:00Z" },
  { id: "4", invoiceNumber: "INV-2026-004", customerName: "Ocean Transport Inc", amount: 5600.0, currency: "GBP", status: "Paid", date: "2026-02-20T11:00:00Z" },
  { id: "5", invoiceNumber: "INV-2026-005", customerName: "Air Express Corp", amount: 18900.25, currency: "USD", status: "Pending", date: "2026-02-25T16:45:00Z" },
];

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function StatusBadge({ status }: { status: BookEntry["status"] }) {
  const color = status === "Paid" ? "success" : status === "Pending" ? "warning" : "error";
  return (
    <Button
      label={status}
      variant="text"
      color={color}
      size="small"
      disabled
    />
  );
}

export default function BooksList() {
  const [search, setSearch] = useState("");

  const filtered = sampleEntries.filter(
    (e) =>
      e.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Cargo Booking Ledger</h1>
        <Button label="New Entry" variant="contained" color="primary" />
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
                    <Button label="View" variant="text" color="primary" size="small" />
                    <Button label="Edit" variant="outlined" color="info" size="small" />
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
