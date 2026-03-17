import type { Preview } from "@storybook/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";
import { createChatTheme } from "@/theme";

/** Chat panel viewport – typical desktop sidebar/chat window size */
const chatViewport = {
  chat: {
    name: "Chat panel",
    styles: { width: "420px", height: "800px" },
    type: "desktop" as const
  }
};

const theme = createChatTheme();

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
