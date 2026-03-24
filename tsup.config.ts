import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  external: [
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
  ]
});
