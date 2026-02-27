import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@rajkumarganesan93/uicontrols";
import { configureClient } from "@rajkumarganesan93/uifunctions";
import App from "./App";
import "./index.css";

configureClient({
  baseURL: "http://localhost:4000",
  timeout: 10000,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme="light">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
