import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, CssBaseline, Stack } from "@mui/material";
import { useEffect } from "react";
import { createChatTheme } from "@/theme";
import { ChatInput } from "@/components/ChatInput";
import { ChatWindowHeader } from "@/components/ChatWindowHeader";
import { ChatAgentSwitch } from "@/components/Agent/ChatAgentSwitch";
import { TextMessage } from "@/components/MessageTypes/TextMessage";
import { ChatMessagesContainer } from "@/components/ChatMessagesContainer";
import { fn } from "@storybook/test";
import {
  mockContact,
  mockContactMessage,
  mockContactNotes,
  mockWorkspace,
  mockCustomFunnel
} from "../fixtures";
import { ConsolidatedChatActions } from "@/components/ConsolidatedChatActions";
import { createFetchMock } from "../mockFetch";

const meta: Meta = {
  title: "Chat/Theming/Theme Showcase",
  parameters: {
    docs: {
      description: {
        component:
          "Demonstrates how to customize the chat components using createChatTheme and the sx prop."
      }
    }
  }
};

export default meta;

type Story = StoryObj;

/** Default theme with createChatTheme() – teal primary, light background */
export const DefaultTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={createChatTheme()}>
        <CssBaseline />
        <Stack gap={2} sx={{ p: 2, bgcolor: "grey.50", minWidth: "400px" }}>
          <Story />
        </Stack>
      </ThemeProvider>
    )
  ],
  render: () => (
    <>
      <ChatWindowHeader agentActive={false} contact={mockContact} activateAgent={fn()} />
      <ChatInput message="" agentActive={false} onMessageChange={fn()} onSubmit={fn()} />
      <ChatMessagesContainer
        agentActive={false}
        messages={[
          { ...mockContactMessage, id: "1", message: "Hello!", inbound: true },
          {
            ...mockContactMessage,
            id: "2",
            messageId: "msg-2",
            message: "Hi there!",
            inbound: false
          }
        ]}
        contact={mockContact}
      />
    </>
  )
};

/** Custom primary color – purple branding */
export const CustomPrimary: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={createChatTheme({ palette: { primary: { main: "#9c27b0" } } })}>
        <CssBaseline />
        <Stack gap={2} sx={{ p: 2, bgcolor: "grey.50", minWidth: "400px" }}>
          <Story />
        </Stack>
      </ThemeProvider>
    )
  ],
  render: () => (
    <>
      <ChatWindowHeader agentActive={false} contact={mockContact} activateAgent={fn()} />
      <ChatInput message="" agentActive={false} onMessageChange={fn()} onSubmit={fn()} />
      <ChatAgentSwitch checked={false} onChange={fn()} />
      <TextMessage message="Sample message with intent" intent="general_inquiry" />
    </>
  )
};

/** Dark mode theme */
export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={createChatTheme({ palette: { mode: "dark" } })}>
        <CssBaseline />
        <Stack gap={2} sx={{ p: 2, minWidth: "400px" }}>
          <Story />
        </Stack>
      </ThemeProvider>
    )
  ],
  render: () => (
    <>
      <ChatWindowHeader agentActive={true} contact={mockContact} activateAgent={fn()} />
      <ChatInput message="" agentActive={true} onMessageChange={fn()} onSubmit={fn()} />
      <TextMessage message="Dark mode message" intent="support" />
    </>
  )
};

/** Full branding – custom primary, success, typography */
export const CustomBranding: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider
        theme={createChatTheme({
          palette: {
            primary: { main: "#1565c0" },
            secondary: { main: "#eceff1" },
            success: { main: "#2e7d32" }
          },
          typography: {
            fontFamily: '"Georgia", serif',
            h6: { fontWeight: 700 }
          }
        })}
      >
        <CssBaseline />
        <Stack gap={2} sx={{ p: 2, bgcolor: "grey.50", minWidth: "400px" }}>
          <Story />
        </Stack>
      </ThemeProvider>
    )
  ],
  render: () => (
    <>
      <ChatWindowHeader agentActive={false} contact={mockContact} activateAgent={fn()} />
      <ChatInput
        message="Custom branded input"
        agentActive={false}
        onMessageChange={fn()}
        onSubmit={fn()}
      />
      <ChatAgentSwitch checked={true} onChange={fn()} />
      <TextMessage message="Message with custom intent colors" intent="pricing_inquiry" />
    </>
  )
};

/** Component overrides – MuiChip with rounded corners */
export const ComponentOverrides: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider
        theme={createChatTheme({
          components: {
            MuiChip: {
              styleOverrides: {
                root: { borderRadius: 16 }
              }
            }
          }
        })}
      >
        <CssBaseline />
        <Stack gap={2} sx={{ p: 2, bgcolor: "grey.50", minWidth: "400px" }}>
          <Story />
        </Stack>
      </ThemeProvider>
    )
  ],
  render: () => (
    <>
      <TextMessage message="Chip with rounded override" intent="general_inquiry" />
      <TextMessage message="Another intent" intent="complaint" />
    </>
  )
};

/** sx prop passthrough – custom margins, borders */
export const SxPassthrough: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={createChatTheme()}>
        <CssBaseline />
        <Stack gap={2} sx={{ p: 2, bgcolor: "grey.50", minWidth: "400px" }}>
          <Story />
        </Stack>
      </ThemeProvider>
    )
  ],
  render: () => (
    <>
      <ChatInput
        message=""
        agentActive={false}
        onMessageChange={fn()}
        onSubmit={fn()}
        sx={{ border: "2px dashed", borderColor: "primary.main", borderRadius: 2 }}
      />
      <ChatWindowHeader
        agentActive={false}
        contact={mockContact}
        activateAgent={fn()}
        sx={{ border: "1px solid", borderColor: "grey.300", borderRadius: 1 }}
      />
    </>
  )
};

/** Consolidated chat with all child fetches mocked */
export const ConsolidatedWithTheme: Story = {
  decorators: [
    (Story) => {
      const restore = createFetchMock({
        "custom-funnels": { stages: [] },
        "contact/custom-funnel": { success: true },
        "contact/custom-stage": { success: true },
        "status/history": { statusHistory: [] },
        "contact-summary": { description: "AI-generated summary" }
      });
      useEffect(() => () => restore(), []); // eslint-disable-line react-hooks/exhaustive-deps
      return (
        <ThemeProvider theme={createChatTheme({ palette: { primary: { main: "#d32f2f" } } })}>
          <CssBaseline />
          <Stack sx={{ p: 3, bgcolor: "grey.100", minWidth: "300px", height: "600px" }}>
            <Story />
          </Stack>
        </ThemeProvider>
      );
    }
  ],
  render: () => (
    <ConsolidatedChatActions
      contact={mockContact}
      notes={mockContactNotes}
      workspace={mockWorkspace}
      funnels={[mockCustomFunnel]}
    />
  )
};
