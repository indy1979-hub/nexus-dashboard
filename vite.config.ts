import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Eine einzige Datei für Home Assistant: dist/nexus-dashboard.js
export default defineConfig({
  plugins: [react()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: "src/card.tsx",
      formats: ["es"],
      fileName: () => "nexus-dashboard.js",
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
    minify: true,
    chunkSizeWarningLimit: 2000,
  },
});
