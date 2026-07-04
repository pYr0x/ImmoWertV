import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [tailwindcss(), svelte()],
  resolve: {
    alias: {
      $lib: path.resolve(dirname, "./src/lib"),
    },
    // Im Test läuft Svelte im jsdom (Client-Build statt Server-Build)
    conditions: mode === "test" ? ["browser"] : undefined,
  },
}));
