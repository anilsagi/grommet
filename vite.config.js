import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

function myPlugin() {
  return {
    name: "my-plugin",

    configureServer() {
      console.log("My Vite plugin is running!");
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    myPlugin(),
    visualizer({
      filename: "./dist/stats.html",
      open: true,
    }),
  ],

  resolve: {
    alias: {
      "@": "/src",
    },
  },

  server: {
    // https: true,
    port: 3000,
    open: true,
  },
});