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
import { AuthProvider, useAuth } from "@rajkumarganesan93/auth";
import App from "./App";
import "./index.css";

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:3001";

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

configureClient({ baseURL: USER_SERVICE_URL, timeout: 10000 });

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

  return (
    <RealtimeProvider
      getToken={getTokenSync}
      defaultServiceUrl={USER_SERVICE_URL}
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
