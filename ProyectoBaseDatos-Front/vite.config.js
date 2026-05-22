import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true, // <-- Esto obliga a Vite a revisar el disco duro constantemente en busca de cambios
    },
  },
});
