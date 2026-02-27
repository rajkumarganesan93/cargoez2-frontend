import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { formatDate } from "@rajkumarganesan93/uifunctions";
import { useFreightList } from "../hooks/useFreight";
import type { Shipment } from "../../domain";

const statusColors: Record<Shipment["status"], "warning" | "info" | "success" | "error"> = {
  Pending: "warning",
  "In Transit": "info",
  Delivered: "success",
  Cancelled: "error",
};

export default function FreightList() {
  const { shipments } = useFreightList();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = shipments.filter(
    (s) =>
      s.origin.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.toLowerCase().includes(search.toLowerCase()) ||
      s.carrier.toLowerCase().includes(search.toLowerCase()) ||
      s.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Freight Shipments</h1>
        <Button
          label="Add Shipment"
          variant="contained"
          color="primary"
          onClick={() => navigate("/freight/new")}
        />
      </div>
      <div className="mb-4">
        <TextField
          id="freight-search"
          placeholder="Search by origin, destination, carrier, or status..."
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
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Origin</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Destination</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Weight</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Carrier</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Est. Delivery</th>
              <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((shipment) => (
              <tr key={shipment.id} className="border-t border-grey-300 hover:bg-action-hover">
                <td className="px-4 py-3 text-sm text-text-primary">{shipment.origin}</td>
                <td className="px-4 py-3 text-sm text-text-primary">{shipment.destination}</td>
                <td className="px-4 py-3">
                  <Button
                    label={shipment.status}
                    variant="text"
                    color={statusColors[shipment.status]}
                    size="small"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">{shipment.weight}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{shipment.carrier}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {formatDate(shipment.estimatedDelivery, "dd/MM/yyyy")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      label="View"
                      variant="text"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/freight/${shipment.id}`)}
                    />
                    <Button
                      label="Edit"
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={() => navigate(`/freight/${shipment.id}/edit`)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-text-secondary">
                  No shipments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
