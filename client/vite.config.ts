/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@aire/authorization": path.resolve(
        __dirname,
        "../packages/authorization/src/index.ts",
      ),
      "@aire/api-contracts": path.resolve(
        __dirname,
        "../packages/api-contracts/src/index.ts",
      ),
      "@aire/shared-types": path.resolve(
        __dirname,
        "../packages/shared-types/src/index.ts",
      ),
      "@aire/validation": path.resolve(
        __dirname,
        "../packages/validation/src/index.ts",
      ),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
