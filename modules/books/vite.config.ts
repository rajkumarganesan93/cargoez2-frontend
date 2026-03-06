import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
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
      shared: [
        "react",
        "react-dom",
        "react-router-dom",
        "@rajkumarganesan93/uicontrols",
        "@rajkumarganesan93/uifunctions",
      ],
    }),
  ],
  server: {
    port: 5176,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
