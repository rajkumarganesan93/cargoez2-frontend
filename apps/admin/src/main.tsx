import { StrictMode, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, ToastProvider } from "@rajkumarganesan93/uicontrols";
import { configureClient, RealtimeProvider } from "@rajkumarganesan93/uifunctions";
import { AuthProvider, useAuth } from "@rajkumarganesan93/auth";
import App from "./App";
import "./index.css";

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

function handleToken(token: string) {
  configureClient({
    baseURL: import.meta.env.VITE_USER_SERVICE_URL,
    timeout: 10000,
    headers: { Authorization: `Bearer ${token}` },
  });
}

function AppWithRealtime() {
  const { token } = useAuth();
  const getToken = useCallback(() => token, [token]);

  return (
    <RealtimeProvider
      getToken={getToken}
      defaultServiceUrl={import.meta.env.VITE_USER_SERVICE_URL}
    >
      <App />
    </RealtimeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme="light">
        <ToastProvider>
          <AuthProvider config={keycloakConfig} onToken={handleToken}>
            <AppWithRealtime />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
