import { ChatAiCover } from "@/components/Agent/ChatAiCover";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ChatAiCover> = {
  title: "Components/Chat/ChatAiCover",
  component: ChatAiCover,
  decorators: [
    (Story) => (
      <Stack sx={{ p: 3, bgcolor: "grey.100", minHeight: "200px", position: "relative" }}>
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component: "Overlay shown when AI agent is active and talking with the contact."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatAiCover>;

export const Default: Story = {};
