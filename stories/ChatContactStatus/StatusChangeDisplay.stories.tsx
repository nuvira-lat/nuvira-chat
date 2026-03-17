import { StatusChangeDisplay } from "@/components/ChatContactStatus/StatusChangeDisplay";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import {
  mockStatusChangeItem,
  mockStageChangeItem,
  mockFunnelChangeItem
} from "../fixtures";

const meta: Meta<typeof StatusChangeDisplay> = {
  title: "Components/Chat/ChatContactStatus/StatusChangeDisplay",
  component: StatusChangeDisplay,
  decorators: [
    (Story) => (
      <Stack sx={{ p: 3, bgcolor: "grey.50", maxWidth: "400px" }}>
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component: "Displays a single status change event (status, stage, or funnel change)."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof StatusChangeDisplay>;

export const StatusChange: Story = {
  args: {
    item: mockStatusChangeItem
  }
};

export const StageChange: Story = {
  args: {
    item: mockStageChangeItem
  }
};

export const FunnelChange: Story = {
  args: {
    item: mockFunnelChangeItem
  }
};

export const NoChange: Story = {
  args: {
    item: {
      ...mockStatusChangeItem,
      previousStatus: "LEAD_CONTACTED",
      newStatus: "LEAD_CONTACTED",
      previousCustomStageId: undefined,
      customStageId: undefined,
      previousCustomFunnelId: undefined,
      customFunnelId: undefined
    }
  }
};
