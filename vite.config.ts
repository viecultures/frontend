import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = env.VITE_PORT || env.PORT ? parseInt(env.VITE_PORT || env.PORT, 10) : undefined;

  return {
    base: "./",
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      ...(port ? { port } : {}),
    },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@google/genai")) {
                return "vendor-genai";
              }
              if (id.includes("lucide-react")) {
                return "vendor-icons";
              }
              if (id.includes("react-markdown") || id.includes("remark-gfm") || id.includes("micromark") || id.includes("unist")) {
                return "vendor-markdown";
              }
              if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
                return "vendor-react";
              }
            }
          },
        },
      },
    },
  };
});
