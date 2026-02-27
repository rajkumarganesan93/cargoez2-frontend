import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@rajkumarganesan93/uicontrols";
import { formatDate } from "@rajkumarganesan93/uifunctions";
import { useBookDetail } from "../hooks/useBooks";

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entry, loading } = useBookDetail(id);

  if (loading) return <p className="p-6 text-text-secondary">Loading...</p>;
  if (!entry) return <p className="p-6 text-error">Entry not found.</p>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{entry.invoiceNumber}</h1>
        <div className="flex gap-2">
          <Button
            label="Edit"
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/books/${id}/edit`)}
          />
          <Button label="Back" variant="text" color="secondary" onClick={() => navigate("/books")} />
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
