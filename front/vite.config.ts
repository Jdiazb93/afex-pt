import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: "@styles",
        replacement: path.resolve(__dirname, "./src/styles"),
      },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "./src/components"),
      },
      {
        find: "@context",
        replacement: path.resolve(__dirname, "./src/context"),
      },
      {
        find: "@api",
        replacement: path.resolve(__dirname, "./src/api"),
      },
      {
        find: "@interfaces",
        replacement: path.resolve(__dirname, "./src/interfaces"),
      },
      {
        find: "@hooks",
        replacement: path.resolve(__dirname, "./src/hooks"),
      },
      {
        find: "@assets",
        replacement: path.resolve(__dirname, "./src/assets"),
      },
      {
        find: "@data",
        replacement: path.resolve(__dirname, "./src/data"),
      },
    ],
  },
});
