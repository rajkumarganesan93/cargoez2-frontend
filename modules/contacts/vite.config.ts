import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "contacts",
      filename: "remoteEntry.js",
      exposes: {
        "./ContactsList": "./src/presentation/pages/ContactsList",
        "./ContactDetail": "./src/presentation/pages/ContactDetail",
        "./ContactForm": "./src/presentation/pages/ContactForm",
        "./nav": "./src/nav",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^7.0.0" },
        "@rajkumarganesan93/uicontrols": { singleton: true, requiredVersion: "*" },
        "@rajkumarganesan93/uifunctions": { singleton: true, requiredVersion: "*" },
      },
    }),
  ],
  server: {
    port: 5174,
    cors: true,
  },
  preview: {
    port: 5174,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
