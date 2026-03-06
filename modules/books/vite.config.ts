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
      name: "books",
      filename: "remoteEntry.js",
      exposes: {
        "./BooksList": "./src/presentation/pages/BooksList",
        "./BookDetail": "./src/presentation/pages/BookDetail",
        "./BookForm": "./src/presentation/pages/BookForm",
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
    port: 5176,
    cors: true,
  },
  preview: {
    port: 5176,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
