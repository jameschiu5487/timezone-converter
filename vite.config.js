import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/timezone-converter/",
  plugins: [react()],
});
