import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup/popup.html"),
        background: resolve(__dirname, "src/background.js"),
        content: resolve(__dirname, "src/content.js")
      },
      output: {
        entryFileNames: "[name].js"
      }
    },
    outDir: "dist",
    emptyOutDir: true
  }
});
