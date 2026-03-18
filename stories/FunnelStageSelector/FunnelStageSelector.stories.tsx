import { FunnelStageSelector } from "@/components/FunnelStageSelector/FunnelStageSelector";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { mockContact, mockCustomFunnel, mockCustomStage } from "../fixtures";
import { createFetchMock } from "../mockFetch";

const meta: Meta<typeof FunnelStageSelector> = {
  title: "Chat/Primitives/Sidebar Components/FunnelStageSelector/FunnelStageSelector",
  component: FunnelStageSelector,
  decorators: [
    (Story) => {
      const restore = createFetchMock({
        "custom-funnels": { stages: [mockCustomStage] },
        "contact/custom-funnel": { success: true },
        "contact/custom-stage": { success: true }
      });
      useEffect(() => () => restore(), []); // eslint-disable-line react-hooks/exhaustive-deps
      return (
        <Stack sx={{ p: 3, bgcolor: "grey.50", maxWidth: "400px" }}>
          <Story />
        </Stack>
      );
    }
  ],
  parameters: {
    docs: {
      description: {
        component: "Funnel and stage selector for contacts."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof FunnelStageSelector>;

export const NoFunnels: Story = {
  args: {
    contact: mockContact,
    funnels: [],
    disabled: false
  }
};

export const WithFunnels: Story = {
  args: {
    contact: mockContact,
    funnels: [mockCustomFunnel],
    disabled: false
  }
};

export const Disabled: Story = {
  args: {
    contact: mockContact,
    funnels: [mockCustomFunnel],
    disabled: true
  }
};
