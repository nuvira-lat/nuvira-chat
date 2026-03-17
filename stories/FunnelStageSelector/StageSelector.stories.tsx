import { StageSelector } from "@/components/FunnelStageSelector/StageSelector";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { fn } from "@storybook/test";
import { mockContact, mockCustomFunnel, mockCustomStage } from "../fixtures";
import { createFetchMock } from "../mockFetch";

const meta: Meta<typeof StageSelector> = {
  title: "Components/Chat/FunnelStageSelector/StageSelector",
  component: StageSelector,
  decorators: [
    (Story) => {
      const restore = createFetchMock({
        "contact/custom-stage": { success: true }
      });
      useEffect(() => () => restore(), []);
      return (
        <Stack sx={{ p: 3, bgcolor: "grey.50", maxWidth: "300px" }}>
          <Story />
        </Stack>
      );
    }
  ],
  parameters: {
    docs: {
      description: {
        component: "Stage dropdown selector within a funnel."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof StageSelector>;

export const Empty: Story = {
  args: {
    contact: mockContact,
    disabled: false,
    selectedFunnel: mockCustomFunnel,
    selectedStage: undefined,
    stages: [],
    updating: false,
    setUpdating: fn(),
    setSelectedStage: fn()
  }
};

export const WithStages: Story = {
  args: {
    contact: mockContact,
    disabled: false,
    selectedFunnel: mockCustomFunnel,
    selectedStage: mockCustomStage,
    stages: [
      mockCustomStage,
      { ...mockCustomStage, id: "stage-2", name: "Proposal", order: 3 },
      { ...mockCustomStage, id: "stage-3", name: "Won", order: 4 }
    ],
    updating: false,
    setUpdating: fn(),
    setSelectedStage: fn()
  }
};
