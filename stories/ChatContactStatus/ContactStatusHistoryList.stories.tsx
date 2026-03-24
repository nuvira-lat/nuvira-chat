import { ContactStatusHistoryList } from "@/components/ChatContactStatus/ContactStatusHistoryList";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { mockContactStatusHistoryItem } from "../fixtures";

const meta: Meta<typeof ContactStatusHistoryList> = {
  title: "Chat/Primitives/Sidebar Components/ChatContactStatus/ContactStatusHistoryList",
  component: ContactStatusHistoryList,
  decorators: [
    (Story) => (
      <Stack sx={{ p: 3, bgcolor: "grey.50", maxWidth: "500px" }}>
        <Story />
      </Stack>
    )
  ],
  parameters: {
    docs: {
      description: {
        component: "List of contact status change history."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ContactStatusHistoryList>;

export const Empty: Story = {
  args: {
    contactId: "contact-nonexistent",
    loadHistory: async () => []
  }
};

export const WithHistory: Story = {
  args: {
    contactId: "contact-1",
    loadHistory: async () => [mockContactStatusHistoryItem]
  }
};
