import { ChatWindowHeader } from "@/components/ChatWindowHeader";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { mockContact, mockContactWithFunnel } from "./fixtures";

const meta: Meta<typeof ChatWindowHeader> = {
  title: "Chat/Primitives/Input & Header/ChatWindowHeader",
  component: ChatWindowHeader,
  decorators: [
    (Story) => (
      <Stack sx={{ p: 0, bgcolor: "grey.50", minWidth: "400px" }}>
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component: "Header for the chat window with contact info and agent toggle."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatWindowHeader>;

export const Default: Story = {
  args: {
    agentActive: false,
    contact: mockContact,
    activateAgent: fn(),
    showAlert: false,
    loading: false
  }
};

export const AgentActive: Story = {
  args: {
    agentActive: true,
    contact: mockContact,
    activateAgent: fn(),
    showAlert: false,
    loading: false
  }
};

export const WithAlert: Story = {
  args: {
    agentActive: false,
    contact: mockContact,
    activateAgent: fn(),
    showAlert: true,
    loading: false
  }
};

export const Loading: Story = {
  args: {
    agentActive: false,
    contact: mockContact,
    activateAgent: fn(),
    showAlert: false,
    loading: true
  }
};

export const WithCustomFunnel: Story = {
  args: {
    agentActive: false,
    contact: mockContactWithFunnel,
    activateAgent: fn(),
    showAlert: false,
    loading: false
  }
};

export const AgentToggleHidden: Story = {
  args: {
    agentActive: false,
    contact: mockContact,
    activateAgent: fn(),
    showAlert: false,
    loading: false,
    showAgentToggle: false
  }
};
