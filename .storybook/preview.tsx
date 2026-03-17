import type { Preview } from "@storybook/react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";

/** Chat panel viewport – typical desktop sidebar/chat window size */
const chatViewport = {
  chat: {
    name: "Chat panel",
    styles: { width: "420px", height: "800px" },
    type: "desktop" as const
  }
};

const theme = createTheme({
  palette: {
    primary: { main: "#00A6A6" },
    secondary: { main: "#F5F5F5" }
  }
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    layout: "centered",
    viewport: {
      viewports: { ...chatViewport, ...MINIMAL_VIEWPORTS },
      defaultViewport: "chat"
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    )
  ]
};

export default preview;
