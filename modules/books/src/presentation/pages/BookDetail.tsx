import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@rajkumarganesan93/uicontrols";
import { formatDate } from "@rajkumarganesan93/uifunctions";
import { useBookDetail } from "../hooks/useBooks";

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

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entry, loading } = useBookDetail(id);

  if (loading) return <p className="p-6 text-text-secondary">Loading...</p>;
  if (!entry) return <p className="p-6 text-error">Invoice not found.</p>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{entry.invoiceNumber}</h1>
        <div className="flex gap-2">
          <Button label="Edit" variant="outlined" color="primary" onClick={() => navigate(`/books/${id}/edit`)} />
          <Button label="Back" variant="text" color="secondary" onClick={() => navigate("/books")} />
        </div>
      </div>
      <div className="bg-bg-paper rounded-lg p-6 space-y-4 border border-grey-300">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Invoice Date</span>
            <p className="text-text-primary">{formatDate(entry.invoiceDate, "dd MMM yyyy")}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Due Date</span>
            <p className="text-text-primary">{entry.dueDate ? formatDate(entry.dueDate, "dd MMM yyyy") : "—"}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Subtotal</span>
            <p className="text-text-primary">{formatAmount(Number(entry.subtotal), entry.currency)}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Tax</span>
            <p className="text-text-primary">{formatAmount(Number(entry.taxAmount), entry.currency)}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Total Amount</span>
            <p className="text-text-primary font-bold">{formatAmount(Number(entry.totalAmount), entry.currency)}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Currency</span>
            <p className="text-text-primary">{entry.currency}</p>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wide">Status</span>
            <p className="text-text-primary capitalize">{entry.status}</p>
          </div>
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
