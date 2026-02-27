/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      // Entry point must be your root index.ts
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "uicontrols",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"], // ensure both ES and CJS builds
    },
    rollupOptions: {
      // Externalize peer dependencies so they aren’t bundled
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  test: {
    globals: true,          // enables describe/it/expect without imports
    environment: 'jsdom',   // simulates browser DOM
    setupFiles: './src/setupTests.ts', // global test setup
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});