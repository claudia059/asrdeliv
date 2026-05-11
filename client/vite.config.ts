import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const rawPort = process.env.PORT || 9000;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || "/";

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss()
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },

  root: path.resolve(import.meta.dirname),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false,

    // optional
    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
  manualChunks(id) {

    // node_modules splitting
    if (id.includes("node_modules")) {

      // maps ecosystem
      if (
        id.includes("leaflet") ||
        id.includes("react-leaflet")
      ) {
        return "maps";
      }

      // charts ecosystem
      if (
        id.includes("recharts") ||
        id.includes("chart.js")
      ) {
        return "charts";
      }

      // utilities
      if (
        id.includes("lodash") ||
        id.includes("axios") ||
        id.includes("date-fns")
      ) {
        return "utils";
      }

      // everything else
      return "vendor";
    }
  },
},

      onwarn(warning, warn) {
        if (warning.code === 'SOURCEMAP_ERROR') {
          return;
        }

        warn(warning);
      },
    },
  },

  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,

    fs: {
      strict: true,
    },
  },

  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});