import { ChatContactStatus } from "@/components/ChatContactStatus/ChatContactStatus";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { mockContact } from "../fixtures";

const meta: Meta<typeof ChatContactStatus> = {
  title: "Chat/Primitives/Sidebar Components/ChatContactStatus/ChatContactStatus",
  component: ChatContactStatus,
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
        component: "Contact status display and editor with history."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatContactStatus>;

export const Default: Story = {
  args: {
    contact: mockContact
  }
};
