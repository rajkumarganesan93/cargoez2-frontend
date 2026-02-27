import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@rajkumarganesan93/uicontrols";
import { formatDate } from "@rajkumarganesan93/uifunctions";
import { useFreightDetail } from "../hooks/useFreight";

export default function FreightDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { shipment, loading } = useFreightDetail(id);

  if (loading) return <p className="p-6 text-text-secondary">Loading...</p>;
  if (!shipment) return <p className="p-6 text-error">Shipment not found.</p>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          {shipment.origin} → {shipment.destination}
        </h1>
        <div className="flex gap-2">
          <Button
            label="Edit"
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/freight/${id}/edit`)}
          />
          <Button label="Back" variant="text" color="secondary" onClick={() => navigate("/freight")} />
        </div>
      </div>
      <div className="bg-bg-paper rounded-lg p-6 space-y-4 border border-grey-300">
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Origin</span>
          <p className="text-text-primary">{shipment.origin}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Destination</span>
          <p className="text-text-primary">{shipment.destination}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Status</span>
          <p className="text-text-primary">{shipment.status}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Weight</span>
          <p className="text-text-primary">{shipment.weight}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Carrier</span>
          <p className="text-text-primary">{shipment.carrier}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">Estimated Delivery</span>
          <p className="text-text-primary">{formatDate(shipment.estimatedDelivery, "dd MMM yyyy, HH:mm")}</p>
        </div>
      </div>
    </div>
  );
}
