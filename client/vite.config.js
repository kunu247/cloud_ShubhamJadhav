// File name: vite.config
// File name with extension: vite.config.js
// Full path: E:\cloud_ShubhamJadhav\client\vite.config.js
// Directory: E:\cloud_ShubhamJadhav\client

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import daisyui from "daisyui";

// 🧠 Fix: Define __dirname manually for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🪄 DaisyUI theme presets (for reference)
const daisyThemes = [
  "light", // default bright theme
  "dark", // system / dark mode
  "cupcake", // soft light pink
  "bumblebee", // yellow-orange tone
  "emerald", // green professional tone
  "corporate", // corporate gray-blue
  "synthwave", // retro neon vibe
  "halloween", // orange-black mix
  "forest", // green calm theme
  "luxury", // black-gold premium feel
  "dracula", // purple cyber theme
  "business", // modern gray-white
  "night" // deep dark professional
];

// ⚙️ Vite Configuration
export default defineConfig({
  plugins: [
    react() // React Fast Refresh + JSX Support
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src").replace(/\\/g, "/"),
      "@components": path
        .resolve(__dirname, "./src/components")
        .replace(/\\/g, "/"),
      "@pages": path.resolve(__dirname, "./src/pages").replace(/\\/g, "/"),
      "@shared": path.resolve(__dirname, "../shared").replace(/\\/g, "/")
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
          theme: {
            extend: {}
          },
          plugins: [daisyui],
          daisyui: {
            themes: daisyThemes,
            darkTheme: "night", // default dark mode theme
            base: true,
            styled: true,
            utils: true,
            logs: false
          }
        }),
        autoprefixer()
      ]
    }
  },
  server: {
    host: "0.0.0.0", // exposes network IP for mobile testing
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
    sourcemap: true,
    outDir: "dist",
    emptyOutDir: true,
    target: "esnext"
  }
});
