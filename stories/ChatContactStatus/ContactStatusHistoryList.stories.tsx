import { ContactStatusHistoryList } from "@/components/ChatContactStatus/ContactStatusHistoryList";
import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { createFetchMock } from "../mockFetch";
import { mockContactStatusHistoryItem } from "../fixtures";

const meta: Meta<typeof ContactStatusHistoryList> = {
  title: "Components/Chat/ChatContactStatus/ContactStatusHistoryList",
  component: ContactStatusHistoryList,
  decorators: [
    (Story) => {
      const restore = createFetchMock({
        "status/history": { statusHistory: [mockContactStatusHistoryItem] }
      });
      useEffect(() => () => restore(), []);
      return (
        <Stack sx={{ p: 3, bgcolor: "grey.50", maxWidth: "500px" }}>
          <Story />
        </Stack>
      );
    }
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
    contactId: "contact-nonexistent"
  },
  decorators: [
    (Story) => {
      const restore = createFetchMock({
        "status/history": { statusHistory: [] }
      });
      useEffect(() => () => restore(), []);
      return (
        <Stack sx={{ p: 3, bgcolor: "grey.50", maxWidth: "500px" }}>
          <Story />
        </Stack>
      );
    }
  ]
};

export const WithHistory: Story = {
  args: {
    contactId: "contact-1"
  }
};
