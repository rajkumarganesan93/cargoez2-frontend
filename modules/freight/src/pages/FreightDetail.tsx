import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@rajkumarganesan93/uicontrols";
import { api, formatDate } from "@rajkumarganesan93/uifunctions";

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: string;
  weight: string;
  carrier: string;
  estimatedDelivery: string;
}

const sampleShipment: Shipment = {
  id: "1",
  origin: "Los Angeles, CA",
  destination: "New York, NY",
  status: "In Transit",
  weight: "250 kg",
  carrier: "FedEx",
  estimatedDelivery: "2026-03-05T10:00:00Z",
};

export default function FreightDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get<{ data: Shipment }>(`/api/freight/${id}`)
      .then((res) => setShipment(res.data.data))
      .catch(() => setShipment({ ...sampleShipment, id }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6 text-text-secondary">Loading...</p>;
  if (!shipment) return <p className="p-6 text-error">Shipment not found.</p>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          Shipment #{shipment.id}
        </h1>
        <div className="flex gap-2">
          <Button
            label="Edit"
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/freight/${shipment.id}/edit`)}
          />
          <Button label="Delete" variant="outlined" color="error" />
        </div>
      </div>
      <div className="bg-bg-paper rounded-lg p-6 space-y-4 border border-grey-300">
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">
            Origin
          </span>
          <p className="text-text-primary">{shipment.origin}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">
            Destination
          </span>
          <p className="text-text-primary">{shipment.destination}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">
            Status
          </span>
          <p className="text-text-primary">{shipment.status}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">
            Weight
          </span>
          <p className="text-text-primary">{shipment.weight}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">
            Carrier
          </span>
          <p className="text-text-primary">{shipment.carrier}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wide">
            Estimated Delivery
          </span>
          <p className="text-text-primary">
            {formatDate(shipment.estimatedDelivery, "dd MMM yyyy, HH:mm")}
          </p>
        </div>
      </div>
    </div>
  );
}
