import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
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
    port: 5175,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
