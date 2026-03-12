import { StrictMode, useCallback, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, ToastProvider } from "@rajkumarganesan93/uicontrols";
import {
  configureClient,
  setAuthToken,
  setTokenRefresher,
  RealtimeProvider,
  api,
} from "@rajkumarganesan93/uifunctions";
import { AuthProvider, useAuth, PermissionProvider } from "@rajkumarganesan93/auth";
import type { UserContextData } from "@rajkumarganesan93/auth";
import App from "./App";
import "./index.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "cargoez-web",
};

configureClient({ baseURL: API_BASE_URL, timeout: 10000 });

function handleToken(token: string) {
  setAuthToken(token);
}

function AppWithAuth() {
  const { token, getToken } = useAuth();
  const getTokenSync = useCallback(() => token, [token]);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  useEffect(() => {
    setTokenRefresher(async () => {
      const freshToken = await getToken();
      if (freshToken) {
        setAuthToken(freshToken);
      }
      return freshToken;
    });
  }, [getToken]);

  const contextFetcher = useCallback(async (): Promise<UserContextData> => {
    const res = await api.get<UserContextData>("/admin-service/me/context");
    return res.data;
  }, []);

  return (
    <PermissionProvider fetcher={contextFetcher}>
      <RealtimeProvider
        getToken={getTokenSync}
        defaultServiceUrl={API_BASE_URL}
      >
        <App />
      </RealtimeProvider>
    </PermissionProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme="light">
        <ToastProvider>
          <AuthProvider config={keycloakConfig} onToken={handleToken}>
            <AppWithAuth />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
