import { Button, TextField } from "@rajkumarganesan93/uicontrols";
import { rules } from "@rajkumarganesan93/uifunctions";
import { useSystemSettings } from "../hooks/useAdmin";

export default function SystemSettings() {
  const { settings, setSettings, saving, updateSettings } = useSystemSettings();

  const handleChange = (field: keyof typeof settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => updateSettings(settings);

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-text-primary mb-6">System Settings</h1>
      <div className="bg-bg-paper rounded-lg p-6 border border-grey-300 space-y-2">
        <TextField
          id="api-url"
          label="API Gateway URL"
          value={settings.apiUrl}
          onChange={handleChange("apiUrl")}
          fullWidth
          validations={[rules.required("API Gateway URL")]}
        />
        <TextField
          id="kc-url"
          label="Keycloak URL"
          value={settings.keycloakUrl}
          onChange={handleChange("keycloakUrl")}
          fullWidth
          validations={[rules.required("Keycloak URL")]}
        />
        <TextField
          id="realm"
          label="Realm"
          value={settings.realm}
          onChange={handleChange("realm")}
          fullWidth
          validations={[rules.required("Realm")]}
        />
        <TextField
          id="client-id"
          label="Client ID"
          value={settings.clientId}
          onChange={handleChange("clientId")}
          fullWidth
          readOnly
        />
        <div className="pt-4">
          <Button
            label={saving ? "Saving..." : "Save Settings"}
            variant="contained"
            color="primary"
            disabled={saving}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
