import { ChatMessagesContainer } from "@/components/ChatMessagesContainer";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { mockContact, mockContactMessage } from "./fixtures";

const meta: Meta<typeof ChatMessagesContainer> = {
  title: "Components/Chat/ChatMessagesContainer",
  component: ChatMessagesContainer,
  decorators: [
    (Story) => (
      <Stack sx={{ p: 0, bgcolor: "grey.100", height: "400px", minWidth: "400px" }}>
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component: "Scrollable container for chat messages with optional AI cover overlay."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatMessagesContainer>;

export const Empty: Story = {
  args: {
    agentActive: false,
    messages: [],
    contact: mockContact
  }
};

export const WithMessages: Story = {
  args: {
    agentActive: false,
    messages: [
      { ...mockContactMessage, id: "1", message: "Hello!", inbound: true },
      {
        ...mockContactMessage,
        id: "2",
        messageId: "msg-2",
        message: "Hi there! How can I help?",
        inbound: false
      },
      {
        ...mockContactMessage,
        id: "3",
        messageId: "msg-3",
        message: "I'm interested in your services.",
        inbound: true
      }
    ],
    contact: mockContact
  }
};

export const WithAiCover: Story = {
  args: {
    agentActive: true,
    messages: [{ ...mockContactMessage, id: "1", message: "Hello!", inbound: true }],
    contact: mockContact
  }
};
