import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
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
    port: 5174,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
