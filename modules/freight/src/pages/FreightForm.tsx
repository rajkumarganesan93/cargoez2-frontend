import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { api } from "@rajkumarganesan93/uifunctions";

export default function FreightForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    weight: "",
    carrier: "",
    estimatedDelivery: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    api
      .get<{ data: typeof formData }>(`/api/freight/${id}`)
      .then((res) => setFormData(res.data.data))
      .catch(() =>
        setFormData({
          origin: "Los Angeles, CA",
          destination: "New York, NY",
          weight: "250 kg",
          carrier: "FedEx",
          estimatedDelivery: "2026-03-05",
        })
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/api/freight/${id}`, formData);
      } else {
        await api.post("/api/freight", formData);
      }
      alert("Shipment saved!");
      navigate("/freight");
    } catch {
      alert("Failed to save (API not connected). Sample form submitted.");
      setSaving(false);
    }
  };

  const handleCancel = () => navigate(isEdit ? `/freight/${id}` : "/freight");

  if (loading) return <p className="p-6 text-text-secondary">Loading...</p>;

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
          validations={[{ type: "required", message: "Origin is required" }]}
        />
        <TextField
          id="freight-destination"
          label="Destination"
          placeholder="Enter destination city/address"
          value={formData.destination}
          onChange={handleChange("destination")}
          fullWidth
          validations={[{ type: "required", message: "Destination is required" }]}
        />
        <TextField
          id="freight-weight"
          label="Weight"
          placeholder="e.g. 250 kg"
          value={formData.weight}
          onChange={handleChange("weight")}
          fullWidth
          validations={[{ type: "required", message: "Weight is required" }]}
        />
        <TextField
          id="freight-carrier"
          label="Carrier"
          placeholder="Enter carrier name"
          value={formData.carrier}
          onChange={handleChange("carrier")}
          fullWidth
          validations={[{ type: "required", message: "Carrier is required" }]}
        />
        <TextField
          id="freight-estimatedDelivery"
          label="Estimated Delivery"
          type="text"
          placeholder="YYYY-MM-DD"
          value={formData.estimatedDelivery}
          onChange={handleChange("estimatedDelivery")}
          fullWidth
          validations={[{ type: "required", message: "Estimated delivery is required" }]}
        />
        <div className="flex gap-3 pt-4">
          <Button
            label={saving ? "Saving..." : "Save"}
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
