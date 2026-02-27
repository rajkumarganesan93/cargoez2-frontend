import { useParams } from "react-router-dom";
import { Button } from "@rajkumarganesan93/uicontrols";
import { formatDate } from "@rajkumarganesan93/uifunctions";

interface BookEntry {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  notes?: string;
}

const sampleEntries: BookEntry[] = [
  { id: "1", invoiceNumber: "INV-2026-001", customerName: "Acme Logistics", amount: 12500.5, currency: "USD", status: "Paid", date: "2026-01-15T10:00:00Z", notes: "Full container shipment" },
  { id: "2", invoiceNumber: "INV-2026-002", customerName: "Global Freight Co", amount: 8750.0, currency: "EUR", status: "Pending", date: "2026-02-10T14:30:00Z", notes: "LCL booking" },
  { id: "3", invoiceNumber: "INV-2026-003", customerName: "Swift Cargo Ltd", amount: 23400.75, currency: "USD", status: "Overdue", date: "2026-02-05T09:15:00Z", notes: "Air freight" },
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

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const entry = sampleEntries.find((e) => e.id === id);

  if (!entry) {
    return (
      <div className="p-6">
        <p className="text-error">Entry not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{entry.invoiceNumber}</h1>
        <div className="flex gap-2">
          <Button label="Edit" variant="outlined" color="primary" />
        </div>
      </div>
      <div className="bg-bg-paper rounded-lg p-6 space-y-4 border border-grey-300">
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Invoice Number</span>
          <p className="text-text-primary font-medium">{entry.invoiceNumber}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Customer Name</span>
          <p className="text-text-primary">{entry.customerName}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Amount</span>
          <p className="text-text-primary font-medium">{formatAmount(entry.amount, entry.currency)}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Currency</span>
          <p className="text-text-primary">{entry.currency}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Status</span>
          <p className="text-text-primary">{entry.status}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Date</span>
          <p className="text-text-primary">{formatDate(entry.date, "dd MMM yyyy, HH:mm")}</p>
        </div>
        {entry.notes && (
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Notes</span>
            <p className="text-text-primary">{entry.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
