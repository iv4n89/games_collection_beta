import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { TEST_DATABASE_URL } from "./test/db-url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globalSetup: ["./test/global-setup.ts"],
    // Los tests de integración comparten una única DB; ejecutar los archivos en
    // serie evita que se pisen entre ellos.
    fileParallelism: false,
    env: {
      DATABASE_URL: TEST_DATABASE_URL,
    },
  },
});
