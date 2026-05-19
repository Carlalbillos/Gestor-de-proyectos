/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },

  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      clientPort: 5173,
    },
    proxy: {
      "/api": {
        target: "http://host.docker.internal:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/480project"),
      },
    },
  },
} as any);