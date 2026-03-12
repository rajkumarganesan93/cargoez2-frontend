import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { formatDate } from "@rajkumarganesan93/uifunctions";
import { useFreightList } from "../hooks/useFreight";

const statusColors: Record<string, "warning" | "info" | "success" | "error" | "secondary"> = {
  draft: "secondary",
  pending: "warning",
  "in-transit": "info",
  delivered: "success",
  cancelled: "error",
};

export default function FreightList() {
  const { shipments, loading } = useFreightList();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = shipments.filter((s) => {
    const term = search.toLowerCase();
    return (
      s.origin.toLowerCase().includes(term) ||
      s.destination.toLowerCase().includes(term) ||
      s.shipmentNumber.toLowerCase().includes(term) ||
      s.status.toLowerCase().includes(term)
    );
  });

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
          placeholder="Search by shipment number, origin, destination, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="medium"
        />
      </div>
      {loading ? (
        <p className="text-text-secondary">Loading shipments...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-grey-300">
          <table className="w-full text-left">
            <thead className="bg-grey-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Shipment #</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Origin</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Destination</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Mode</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Weight</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">ETA</th>
                <th className="px-4 py-3 text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.uid} className="border-t border-grey-300 hover:bg-action-hover">
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">{s.shipmentNumber}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">{s.origin}</td>
                  <td className="px-4 py-3 text-sm text-text-primary">{s.destination}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary uppercase">{s.mode}</td>
                  <td className="px-4 py-3">
                    <Button
                      label={s.status}
                      variant="text"
                      color={statusColors[s.status.toLowerCase()] ?? "info"}
                      size="small"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {s.weight != null ? `${s.weight} ${s.weightUnit ?? "kg"}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {s.eta ? formatDate(s.eta, "dd/MM/yyyy") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button label="View" variant="text" color="primary" size="small" onClick={() => navigate(`/freight/${s.uid}`)} />
                      <Button label="Edit" variant="outlined" color="info" size="small" onClick={() => navigate(`/freight/${s.uid}/edit`)} />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-text-secondary">
                    No shipments found.
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
