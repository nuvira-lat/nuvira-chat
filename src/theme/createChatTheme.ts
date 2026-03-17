import { createTheme, type ThemeOptions } from "@mui/material/styles";

export interface ChatThemeOptions extends Omit<ThemeOptions, "palette"> {
  palette?: ThemeOptions["palette"] & {
    primary?: { main?: string };
    success?: { main?: string };
  };
}

/**
 * Creates a MUI theme configured for chat components.
 * Accepts partial overrides for palette, components, typography, etc.
 *
 * @example
 * // Default theme
 * const theme = createChatTheme();
 *
 * @example
 * // Custom primary color
 * const theme = createChatTheme({ palette: { primary: { main: "#9c27b0" } } });
 *
 * @example
 * // Dark mode
 * const theme = createChatTheme({ palette: { mode: "dark" } });
 */
export function createChatTheme(options: ChatThemeOptions = {}) {
  return createTheme({
    palette: {
      primary: { main: "#00A6A6" },
      secondary: { main: "#F5F5F5" },
      success: { main: "#65C466" },
      ...options.palette
    },
    ...options
  });
}
