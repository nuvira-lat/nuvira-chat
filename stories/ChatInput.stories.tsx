import { ChatInput } from "@/components/ChatInput";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof ChatInput> = {
  title: "Components/Chat/ChatInput",
  component: ChatInput,
  decorators: [
    (Story) => (
      <Stack sx={{ p: 3, bgcolor: "grey.50", maxWidth: "500px" }}>
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component: "Input field for typing and sending chat messages with optional media attachment."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatInput>;

const defaultArgs = {
  onMessageChange: fn(),
  onSubmit: fn()
};

export const Default: Story = {
  args: {
    ...defaultArgs,
    message: null,
    agentActive: false,
    loading: false
  }
};

export const WithText: Story = {
  args: {
    ...defaultArgs,
    message: "Hello, I have a question about your services.",
    agentActive: false,
    loading: false
  }
};

export const AgentActiveDisabled: Story = {
  args: {
    ...defaultArgs,
    message: "Typing but agent is active...",
    agentActive: true,
    loading: false
  }
};

export const Loading: Story = {
  args: {
    ...defaultArgs,
    message: "Sending...",
    agentActive: false,
    loading: true
  }
};
