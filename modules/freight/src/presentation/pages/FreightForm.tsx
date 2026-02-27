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
    origin: "",
    destination: "",
    weight: "",
    carrier: "",
    estimatedDelivery: "",
  });

  useEffect(() => {
    if (shipment && isEdit) {
      setFormData({
        origin: shipment.origin,
        destination: shipment.destination,
        weight: shipment.weight,
        carrier: shipment.carrier,
        estimatedDelivery: shipment.estimatedDelivery,
      });
    }
  }, [shipment, isEdit]);

  const handleChange = (field: keyof CreateShipmentInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
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
          id="freight-origin"
          label="Origin"
          placeholder="Enter origin city/address"
          value={formData.origin}
          onChange={handleChange("origin")}
          fullWidth
          validations={[rules.required("Origin")]}
        />
        <TextField
          id="freight-destination"
          label="Destination"
          placeholder="Enter destination city/address"
          value={formData.destination}
          onChange={handleChange("destination")}
          fullWidth
          validations={[rules.required("Destination")]}
        />
        <TextField
          id="freight-weight"
          label="Weight"
          placeholder="e.g. 250 kg"
          value={formData.weight}
          onChange={handleChange("weight")}
          fullWidth
          validations={[rules.required("Weight")]}
        />
        <TextField
          id="freight-carrier"
          label="Carrier"
          placeholder="Enter carrier name"
          value={formData.carrier}
          onChange={handleChange("carrier")}
          fullWidth
          validations={[rules.required("Carrier")]}
        />
        <TextField
          id="freight-estimatedDelivery"
          label="Estimated Delivery"
          type="text"
          placeholder="YYYY-MM-DD"
          value={formData.estimatedDelivery}
          onChange={handleChange("estimatedDelivery")}
          fullWidth
          validations={[rules.required("Estimated delivery")]}
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
