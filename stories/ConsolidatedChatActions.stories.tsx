import { ConsolidatedChatActions } from "@/components/ConsolidatedChatActions";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import {
  mockContact,
  mockContactNotes,
  mockWorkspace,
  mockCustomFunnel,
  mockCustomStage
} from "./fixtures";
import { createFetchMock } from "./mockFetch";

const meta: Meta<typeof ConsolidatedChatActions> = {
  title: "Components/Chat/ConsolidatedChatActions",
  component: ConsolidatedChatActions,
  decorators: [
    (Story) => {
      const restore = createFetchMock({
        "custom-funnels": { stages: [mockCustomStage] },
        "contact/custom-funnel": { success: true },
        "contact/custom-stage": { success: true },
        "status/history": { statusHistory: [] },
        "contact-summary": { description: "AI summary" }
      });
      useEffect(() => () => restore(), []); // eslint-disable-line react-hooks/exhaustive-deps
      return (
        <Stack sx={{ p: 0, bgcolor: "grey.100", minWidth: "300px", height: "600px" }}>
          <Story />
        </Stack>
      );
    }
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Sidebar with contact status, info editor, funnel/stage selector, AI summary, and notes."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ConsolidatedChatActions>;

export const Default: Story = {
  args: {
    contact: mockContact,
    notes: mockContactNotes,
    workspace: mockWorkspace,
    funnels: [mockCustomFunnel]
  }
};
