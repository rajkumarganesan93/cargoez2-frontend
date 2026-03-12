import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

const REMOTE_BASE = process.env.VITE_REMOTE_BASE ?? "http://localhost";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "cargoez",
      remotes: {
        contacts: `${REMOTE_BASE}:5174/assets/remoteEntry.js`,
        freight: `${REMOTE_BASE}:5175/assets/remoteEntry.js`,
        books: `${REMOTE_BASE}:5176/assets/remoteEntry.js`,
        tenantAdmin: `${REMOTE_BASE}:5178/assets/remoteEntry.js`,
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^7.0.0" },
        "@rajkumarganesan93/uicontrols": { singleton: true, requiredVersion: "*" },
        "@rajkumarganesan93/uifunctions": { singleton: true, requiredVersion: "*" },
        "@rajkumarganesan93/auth": { singleton: true, requiredVersion: "*" },
      },
    }),
  ],
  server: {
    port: 5173,
    cors: true,
  },
  preview: {
    port: 5173,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
