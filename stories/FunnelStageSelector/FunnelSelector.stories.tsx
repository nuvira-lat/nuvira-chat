import { FunnelSelector } from "@/components/FunnelStageSelector/FunnelSelector";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { fn } from "@storybook/test";
import { mockContact, mockCustomFunnel } from "../fixtures";
import { createFetchMock } from "../mockFetch";

const meta: Meta<typeof FunnelSelector> = {
  title: "Components/Chat/FunnelStageSelector/FunnelSelector",
  component: FunnelSelector,
  decorators: [
    (Story) => {
      const restore = createFetchMock({
        "contact/custom-funnel": { success: true }
      });
      useEffect(() => () => restore(), []); // eslint-disable-line react-hooks/exhaustive-deps
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
        component: "Funnel dropdown selector."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof FunnelSelector>;

export const Default: Story = {
  args: {
    activeFunnels: [mockCustomFunnel],
    contact: mockContact,
    disabled: false,
    selectedFunnel: mockCustomFunnel,
    setSelectedFunnel: fn(),
    setSelectedStage: fn(),
    setUpdating: fn(),
    updating: false
  }
};
