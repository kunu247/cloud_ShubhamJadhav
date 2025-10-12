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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const daisyThemes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "halloween",
  "forest",
  "luxury",
  "dracula",
  "business",
  "night"
];

export default defineConfig({
  plugins: [
    react()
    /*
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", {}]]
      }
    })
    */
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
          theme: { extend: {} },
          plugins: [daisyui],
          daisyui: {
            themes: daisyThemes,
            darkTheme: "night",
            base: true,
            styled: true,
            utils: true,
            logs: false
          }
        }),
        autoprefixer()
      ]
    },
    devSourcemap: true
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    open: false, // Let VS Code handle opening
    strictPort: true, // Don't try different ports
    cors: true,
    proxy: {
      "/api/v1": {
        target: "http://localhost:8065",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/v1/, "/api/v1")
      }
    },
    hmr: {
      overlay: true,
      clientPort: 5173
    }
  },
  build: {
    sourcemap: true,
    outDir: "dist",
    emptyOutDir: true,
    target: "esnext",
    minify: false, // Better for debugging
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  define: {
    "process.env.DEBUG": JSON.stringify(process.env.DEBUG),
    "process.env.NODE_ENV": JSON.stringify("development")
  },
  esbuild: {
    sourcemap: true,
    legalComments: "none"
  }
});
