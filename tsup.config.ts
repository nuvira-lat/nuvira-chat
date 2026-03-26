import { defineConfig } from "tsup";

const external = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "@mui/material",
  "@mui/material/styles",
  "@mui/icons-material",
  "@emotion/react",
  "@emotion/styled",
  "lodash",
  /^lodash\//,
  "date-fns"
] as const;

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    splitting: false,
    sourcemap: true,
    external: [...external],
    banner: {
      js: '"use client";'
    }
  },
  {
    entry: { server: "src/server.ts" },
    format: ["cjs", "esm"],
    dts: true,
    clean: false,
    splitting: false,
    sourcemap: true,
    external: [...external]
  }
]);
