import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: process.env.VITE_HOST || "0.0.0.0",
    // port: process.env.VITE_PORT ? Number(process.env.VITE_PORT) : 5173,
    port: 5173,
    open: true,
    proxy: {
      "/api/v1": {
        target: "http://localhost:8065",
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    sourcemap: true // 🧭 Enables line-by-line debugging for React
  }
});
