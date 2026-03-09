import { StrictMode, useCallback, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, ToastProvider } from "@rajkumarganesan93/uicontrols";
import {
  configureClient,
  setAuthToken,
  setTokenRefresher,
  RealtimeProvider,
} from "@rajkumarganesan93/uifunctions";
import { AuthProvider, useAuth, PermissionProvider } from "@rajkumarganesan93/auth";
import type { PermissionData } from "@rajkumarganesan93/auth";
import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";
import App from "./App";
import "./index.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:3001";

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

configureClient({ baseURL: API_BASE_URL, timeout: 10000 });

function handleToken(token: string) {
  setAuthToken(token);
}

function AppWithRealtime() {
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

  const permissionFetcher = useCallback(async (): Promise<PermissionData> => {
    const res = await api.get<ApiResponse<PermissionData>>("/auth-service/me/permissions");
    return res.data.data;
  }, []);

  return (
    <PermissionProvider fetcher={permissionFetcher}>
      <RealtimeProvider
        getToken={getTokenSync}
        defaultServiceUrl={USER_SERVICE_URL}
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
            <AppWithRealtime />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
