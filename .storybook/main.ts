import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  docs: {
    autodocs: "tag"
  },
  viteFinal: async (config) => {
    if (config.resolve) {
      const projectRoot = path.resolve(__dirname, "..");
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(projectRoot, "src"),
        "@src": path.resolve(projectRoot, "src")
      };
    }
    return config;
  }
};

export default config;
