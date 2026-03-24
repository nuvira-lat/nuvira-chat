import { ContactStatusHistoryButton } from "@/components/ChatContactStatus/ContactStatusHistoryButton";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { mockContact, mockContactStatusHistoryItem } from "../fixtures";

const meta: Meta<typeof ContactStatusHistoryButton> = {
  title: "Chat/Primitives/Sidebar Components/ChatContactStatus/ContactStatusHistoryButton",
  component: ContactStatusHistoryButton,
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
        component: "Button to open contact status history dialog."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ContactStatusHistoryButton>;

export const IconVariant: Story = {
  args: {
    contact: mockContact,
    variant: "icon",
    loadHistory: async () => [mockContactStatusHistoryItem]
  }
};

export const ButtonVariant: Story = {
  args: {
    contact: mockContact,
    variant: "button",
    loadHistory: async () => [mockContactStatusHistoryItem]
  }
};
