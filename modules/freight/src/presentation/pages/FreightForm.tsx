import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { rules } from "@rajkumarganesan93/uifunctions";
import { useFreightDetail, useFreightMutation } from "../hooks/useFreight";
import type { CreateShipmentInput } from "../../domain";

export default function FreightForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { shipment, loading: loadingDetail } = useFreightDetail(isEdit ? id : undefined);
  const { saving, createShipment, updateShipment } = useFreightMutation();

  const [formData, setFormData] = useState<CreateShipmentInput>({
    shipmentNumber: "",
    origin: "",
    destination: "",
    mode: "air",
    status: "draft",
    shipperName: "",
    consigneeName: "",
    weight: undefined,
    weightUnit: "kg",
    pieces: undefined,
    etd: "",
    eta: "",
    remarks: "",
  });

  useEffect(() => {
    if (shipment && isEdit) {
      setFormData({
        shipmentNumber: shipment.shipmentNumber,
        origin: shipment.origin,
        destination: shipment.destination,
        mode: shipment.mode ?? "air",
        status: shipment.status ?? "draft",
        shipperName: shipment.shipperName ?? "",
        consigneeName: shipment.consigneeName ?? "",
        weight: shipment.weight ?? undefined,
        weightUnit: shipment.weightUnit ?? "kg",
        pieces: shipment.pieces ?? undefined,
        etd: shipment.etd ?? "",
        eta: shipment.eta ?? "",
        remarks: shipment.remarks ?? "",
      });
    }
  }, [shipment, isEdit]);

  const handleChange = (field: keyof CreateShipmentInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: field === "weight" || field === "pieces" ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async () => {
    const success = isEdit && id
      ? await updateShipment(id, formData)
      : await createShipment(formData);
    if (success) navigate("/freight");
  };

  const handleCancel = () => navigate(isEdit && id ? `/freight/${id}` : "/freight");

  if (isEdit && loadingDetail) return <p className="p-6 text-text-secondary">Loading...</p>;

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        {isEdit ? "Edit Shipment" : "New Shipment"}
      </h1>
      <div className="space-y-2">
        <TextField
          id="freight-number"
          label="Shipment Number"
          placeholder="e.g. SHP-2026-001"
          value={formData.shipmentNumber ?? ""}
          onChange={handleChange("shipmentNumber")}
          fullWidth
          validations={[rules.required("Shipment number")]}
          disabled={isEdit}
        />
        <TextField
          id="freight-origin"
          label="Origin"
          placeholder="Enter origin city/port"
          value={formData.origin}
          onChange={handleChange("origin")}
          fullWidth
          validations={[rules.required("Origin")]}
        />
        <TextField
          id="freight-destination"
          label="Destination"
          placeholder="Enter destination city/port"
          value={formData.destination}
          onChange={handleChange("destination")}
          fullWidth
          validations={[rules.required("Destination")]}
        />
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Mode</label>
          <select
            className="w-full border border-grey-300 rounded-md px-3 py-2 text-sm bg-bg-default text-text-primary"
            value={formData.mode ?? "air"}
            onChange={(e) => setFormData((prev) => ({ ...prev, mode: e.target.value }))}
          >
            <option value="air">Air</option>
            <option value="sea">Sea</option>
            <option value="road">Road</option>
            <option value="rail">Rail</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
          <select
            className="w-full border border-grey-300 rounded-md px-3 py-2 text-sm bg-bg-default text-text-primary"
            value={formData.status ?? "draft"}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <TextField
          id="freight-shipper"
          label="Shipper Name"
          placeholder="Enter shipper name"
          value={formData.shipperName ?? ""}
          onChange={handleChange("shipperName")}
          fullWidth
        />
        <TextField
          id="freight-consignee"
          label="Consignee Name"
          placeholder="Enter consignee name"
          value={formData.consigneeName ?? ""}
          onChange={handleChange("consigneeName")}
          fullWidth
        />
        <TextField
          id="freight-weight"
          label="Weight"
          type="number"
          placeholder="e.g. 250"
          value={formData.weight != null ? String(formData.weight) : ""}
          onChange={handleChange("weight")}
          fullWidth
        />
        <TextField
          id="freight-pieces"
          label="Pieces"
          type="number"
          placeholder="e.g. 10"
          value={formData.pieces != null ? String(formData.pieces) : ""}
          onChange={handleChange("pieces")}
          fullWidth
        />
        <TextField
          id="freight-etd"
          label="ETD (Estimated Time of Departure)"
          type="date"
          value={formData.etd ?? ""}
          onChange={handleChange("etd")}
          fullWidth
        />
        <TextField
          id="freight-eta"
          label="ETA (Estimated Time of Arrival)"
          type="date"
          value={formData.eta ?? ""}
          onChange={handleChange("eta")}
          fullWidth
        />
        <TextField
          id="freight-remarks"
          label="Remarks"
          placeholder="Optional remarks"
          value={formData.remarks ?? ""}
          onChange={handleChange("remarks")}
          fullWidth
        />
        <div className="flex gap-3 pt-4">
          <Button
            label={saving ? "Saving..." : isEdit ? "Update Shipment" : "Save Shipment"}
            variant="contained"
            color="primary"
            disabled={saving}
            onClick={handleSubmit}
          />
          <Button label="Cancel" variant="outlined" color="secondary" onClick={handleCancel} />
        </div>
      </div>
    </div>
  );
}
