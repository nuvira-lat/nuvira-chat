import { ChatAgentSwitch } from "@/components/Agent/ChatAgentSwitch";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof ChatAgentSwitch> = {
  title: "Components/Chat/ChatAgentSwitch",
  component: ChatAgentSwitch,
  decorators: [
    (Story) => (
      <Stack sx={{ p: 3, bgcolor: "grey.50" }}>
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component: "Toggle switch for activating/deactivating the sales agent."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatAgentSwitch>;

export const Off: Story = {
  args: {
    checked: false,
    onChange: fn()
  }
};

export const On: Story = {
  args: {
    checked: true,
    onChange: fn()
  }
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    onChange: fn()
  }
};
