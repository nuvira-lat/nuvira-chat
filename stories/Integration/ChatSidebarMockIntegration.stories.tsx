import { ChatSidebar } from "@/components/ConsolidatedChatActions";
import type { ChatIntegrationAdapter } from "@/integration/types";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import {
  mockContactNotes,
  mockContactWithFunnel,
  mockCustomFunnel,
  mockCustomStage,
  mockWorkspace
} from "../fixtures";

const mockIntegration: ChatIntegrationAdapter = {
  saveContact: async () => {},
  onGenerateSummary: async () => "Mock summary from integration adapter.",
  onStatusUpdate: async () => {},
  loadStages: async () => [mockCustomStage],
  onFunnelUpdate: async () => {},
  onStageUpdate: async () => {},
  loadContactStatusHistory: async () => [],
  onIntegrationError: (err, ctx) => {
    console.warn("[ChatSidebar mock integration]", ctx, err);
  }
};

const meta: Meta<typeof ChatSidebar> = {
  title: "Chat/Integration/ChatSidebar mock adapter",
  component: ChatSidebar,
  decorators: [
    (Story) => (
      <Stack sx={{ p: 2, bgcolor: "grey.50", maxWidth: 420, minHeight: 400 }}>
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component:
          "ChatSidebar with a fully mocked ChatIntegrationAdapter (no real network). Use as a template for host apps."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatSidebar>;

export const MockAdapter: Story = {
  args: {
    contact: mockContactWithFunnel,
    workspace: mockWorkspace,
    funnels: [mockCustomFunnel],
    notes: mockContactNotes,
    integration: mockIntegration
  }
};
