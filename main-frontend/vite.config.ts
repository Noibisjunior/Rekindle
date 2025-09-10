import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // allow LAN + ngrok
    port: 3000,
    allowedHosts: true,
    proxy: {
      "/v1": {
        target: "http://localhost:4000", // your backend API
        changeOrigin: true,
      },
    },
  },
});
