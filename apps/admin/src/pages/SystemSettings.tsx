import { useState } from "react";
import { Button, TextField } from "@rajkumarganesan93/uicontrols";

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    apiUrl: "http://localhost:4000",
    keycloakUrl: "http://localhost:8080",
    realm: "cargoez",
    clientId: "cargoez-web",
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-text-primary mb-6">System Settings</h1>
      <div className="bg-bg-paper rounded-lg p-6 border border-grey-300 space-y-2">
        <TextField id="api-url" label="API Gateway URL" value={settings.apiUrl} onChange={handleChange("apiUrl")} fullWidth />
        <TextField id="kc-url" label="Keycloak URL" value={settings.keycloakUrl} onChange={handleChange("keycloakUrl")} fullWidth />
        <TextField id="realm" label="Realm" value={settings.realm} onChange={handleChange("realm")} fullWidth />
        <TextField id="client-id" label="Client ID" value={settings.clientId} onChange={handleChange("clientId")} fullWidth readOnly />
        <div className="pt-4">
          <Button label="Save Settings" variant="contained" color="primary" />
        </div>
      </div>
    </div>
  );
}
