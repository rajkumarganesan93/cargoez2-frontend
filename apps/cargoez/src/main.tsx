import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, ToastProvider } from "@rajkumarganesan93/uicontrols";
import { configureClient, RealtimeProvider } from "@rajkumarganesan93/uifunctions";
import App from "./App";
import "./index.css";

configureClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme="light">
        <ToastProvider>
          <RealtimeProvider
            getToken={() => undefined}
            defaultServiceUrl={import.meta.env.VITE_API_BASE_URL}
          >
            <App />
          </RealtimeProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
