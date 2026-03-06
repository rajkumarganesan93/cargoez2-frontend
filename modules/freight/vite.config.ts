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
      name: "freight",
      filename: "remoteEntry.js",
      exposes: {
        "./FreightList": "./src/presentation/pages/FreightList",
        "./FreightDetail": "./src/presentation/pages/FreightDetail",
        "./FreightForm": "./src/presentation/pages/FreightForm",
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
    port: 5175,
    cors: true,
  },
  preview: {
    port: 5175,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
